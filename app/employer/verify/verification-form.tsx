"use client";

import {
  useState,
} from "react";

import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Globe2,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
} from "lucide-react";


type CompanyInfo = {
  companyNumber: string;

  companyName: string;

  companyStatus: string;

  companyStatusDetail: string;

  companyType: string;

  dateOfCreation:
    | string
    | null;

  registeredOfficeAddress:
    | Record<string, string>
    | null;

  hasInsolvencyHistory:
    boolean;

  canFile:
    | boolean
    | null;
};


type ExistingVerification = {
  id?: string;

  company_number?: string;

  company_name?: string;

  company_status?: string;

  business_email?: string;

  phone?: string;

  website?:
    | string
    | null;

  verification_status?: string;

  auto_approved?: boolean;

  review_notes?:
    | string
    | null;
} | null;


type Props = {
  userId: string;

  existingVerification:
    ExistingVerification;
};


function formatAddress(
  address:
    | Record<string, string>
    | null
) {
  if (!address) {
    return "Address not available";
  }


  return [
    address.premises,
    address.address_line_1,
    address.address_line_2,
    address.locality,
    address.region,
    address.postal_code,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
}


export default function VerificationForm({
  existingVerification,
}: Props) {
  const [
    companyNumber,
    setCompanyNumber,
  ] = useState(
    existingVerification
      ?.company_number ??
      ""
  );


  const [
    businessEmail,
    setBusinessEmail,
  ] = useState(
    existingVerification
      ?.business_email ??
      ""
  );


  const [
    phone,
    setPhone,
  ] = useState(
    existingVerification
      ?.phone ??
      ""
  );


  const [
    website,
    setWebsite,
  ] = useState(
    existingVerification
      ?.website ??
      ""
  );


  const [
    company,
    setCompany,
  ] =
    useState<CompanyInfo | null>(
      null
    );


  const [
    checking,
    setChecking,
  ] =
    useState(false);


  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);


  const [
    error,
    setError,
  ] =
    useState("");


  const [
    message,
    setMessage,
  ] =
    useState("");


  const [
    status,
    setStatus,
  ] = useState<
    string | null
  >(
    existingVerification
      ?.verification_status ??
      null
  );


  async function checkCompany() {
    setError("");
    setMessage("");
    setCompany(null);


    const cleanNumber =
      companyNumber
        .trim()
        .replace(/\s+/g, "")
        .toUpperCase();


    if (!cleanNumber) {
      setError(
        "Enter your Companies House number."
      );

      return;
    }


    setChecking(true);


    try {
      const response =
        await fetch(
          "/api/company-check",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                companyNumber:
                  cleanNumber,
              }),
          }
        );


      const result =
        await response.json();


      if (!response.ok) {
        setError(
          result.error ??
            "Unable to check company."
        );

        return;
      }


      setCompany(
        result.company
      );


      setCompanyNumber(
        result.company
          .companyNumber
      );


      if (
        result.recommendation ===
        "auto"
      ) {
        setMessage(
          "Active company found. This company is eligible for automatic approval."
        );
      } else if (
        result.recommendation ===
        "reject"
      ) {
        setMessage(
          "Company found, but its current Companies House status is not eligible for automatic approval."
        );
      } else {
        setMessage(
          "Company found. This record will require manual review."
        );
      }
    } catch {
      setError(
        "Unable to connect to Companies House verification."
      );
    } finally {
      setChecking(false);
    }
  }


  async function submitVerification(
    event:
      React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();


    setError("");
    setMessage("");


    if (!company) {
      setError(
        "Check the company number first."
      );

      return;
    }


    if (
      !businessEmail.trim()
    ) {
      setError(
        "Enter your contact email."
      );

      return;
    }


    if (!phone.trim()) {
      setError(
        "Enter your business phone number."
      );

      return;
    }


    setSubmitting(true);


    try {
      const response =
        await fetch(
          "/api/employer-verification",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                companyNumber:
                  company
                    .companyNumber,

                businessEmail:
                  businessEmail
                    .trim(),

                phone:
                  phone.trim(),

                website:
                  website.trim(),
              }),
          }
        );


      const result =
        await response.json();


      if (!response.ok) {
        setError(
          result.error ??
            "Verification failed."
        );

        return;
      }


      setStatus(
        result.status
      );


      setMessage(
        result.message
      );


      window.scrollTo({
        top: 0,

        behavior:
          "smooth",
      });
    } catch {
      setError(
        "Unable to submit verification."
      );
    } finally {
      setSubmitting(false);
    }
  }


  if (
    status === "verified"
  ) {
    return (
      <div className="rounded-[8px] border border-emerald-200 bg-white p-8 shadow-sm">

        <div className="flex h-16 w-16 items-center justify-center rounded-[10px] bg-emerald-50 text-emerald-600">

          <CheckCircle2 className="h-8 w-8" />

        </div>


        <h2 className="mt-6 text-3xl font-black text-[#07182d]">

          Employer Verified

        </h2>


        <p className="mt-3 max-w-[650px] leading-7 text-slate-500">

          Your company is active on
          Companies House and your
          employer account has been
          approved automatically.

        </p>


        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">

          <ShieldCheck className="h-4 w-4" />

          Job Posting Unlocked

        </div>

      </div>
    );
  }


  if (
    status === "pending"
  ) {
    return (
      <div className="rounded-[8px] border border-amber-200 bg-white p-8 shadow-sm">

        <div className="flex h-16 w-16 items-center justify-center rounded-[10px] bg-amber-50 text-amber-600">

          <ShieldCheck className="h-8 w-8" />

        </div>


        <h2 className="mt-6 text-3xl font-black text-[#07182d]">

          Manual Review

        </h2>


        <p className="mt-3 max-w-[650px] leading-7 text-slate-500">

          We found your company,
          but the Companies House
          record requires a manual
          safety review before job
          posting is unlocked.

        </p>


        {existingVerification
          ?.review_notes && (

          <p className="mt-5 rounded-[8px] bg-amber-50 p-4 text-sm text-amber-800">

            {
              existingVerification
                .review_notes
            }

          </p>

        )}

      </div>
    );
  }


  if (
    status === "rejected"
  ) {
    return (
      <div className="rounded-[8px] border border-red-200 bg-white p-8 shadow-sm">

        <div className="flex h-16 w-16 items-center justify-center rounded-[10px] bg-red-50 text-red-600">

          <AlertCircle className="h-8 w-8" />

        </div>


        <h2 className="mt-6 text-3xl font-black text-[#07182d]">

          Company Not Eligible

        </h2>


        <p className="mt-3 max-w-[650px] leading-7 text-slate-500">

          This company&apos;s
          current Companies House
          status cannot be approved
          for job posting.

        </p>

      </div>
    );
  }


  return (
    <form
      onSubmit={
        submitVerification
      }
      className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(16,24,40,.06)] sm:p-9"
    >

      {/* COMPANY NUMBER */}

      <div>

        <label className="mb-2 block text-sm font-bold text-slate-700">

          Companies House Number

        </label>


        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">

          <div className="flex items-center rounded-[8px] border border-slate-200 px-4 focus-within:border-[#d71920]">

            <Building2 className="h-5 w-5 text-slate-400" />


            <input
              value={
                companyNumber
              }
              onChange={(
                event
              ) => {
                setCompanyNumber(
                  event.target.value
                );

                setCompany(null);

                setMessage("");

                setError("");
              }}
              placeholder="Example: 12345678"
              className="w-full bg-transparent px-3 py-4 text-sm uppercase outline-none"
            />

          </div>


          <button
            type="button"
            onClick={
              checkCompany
            }
            disabled={
              checking
            }
            className="flex items-center justify-center gap-2 rounded-[8px] bg-[#07182d] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#b91319] disabled:opacity-50"
          >

            {checking ? (
              <LoaderCircle className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="h-5 w-5" />
            )}


            {checking
              ? "Checking..."
              : "Check Company"}

          </button>

        </div>

      </div>


      {error && (

        <div className="mt-5 flex gap-3 rounded-[8px] border border-red-200 bg-red-50 p-4">

          <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />

          <p className="text-sm font-semibold text-red-700">

            {error}

          </p>

        </div>

      )}


      {message && (

        <div className="mt-5 flex gap-3 rounded-[8px] border border-blue-200 bg-blue-50 p-4">

          <ShieldCheck className="h-5 w-5 shrink-0 text-[#d71920]" />

          <p className="text-sm font-semibold leading-6 text-blue-800">

            {message}

          </p>

        </div>

      )}


      {company && (

        <div className="mt-7 overflow-hidden rounded-[10px] border border-blue-100">

          <div className="flex items-center justify-between bg-blue-50 p-5">

            <div>

              <p className="text-xs font-bold uppercase tracking-wider text-[#d71920]">

                Companies House Record

              </p>


              <h2 className="mt-1 text-xl font-black text-[#07182d]">

                {
                  company.companyName
                }

              </h2>

            </div>


            <ShieldCheck className="h-7 w-7 text-[#d71920]" />

          </div>


          <div className="grid gap-5 p-5 sm:grid-cols-2">

            <div>

              <p className="text-xs font-bold text-slate-400">

                COMPANY NUMBER

              </p>

              <p className="mt-1 font-bold">

                {
                  company.companyNumber
                }

              </p>

            </div>


            <div>

              <p className="text-xs font-bold text-slate-400">

                STATUS

              </p>

              <p className="mt-1 font-bold capitalize">

                {
                  company.companyStatus
                }

              </p>

            </div>


            <div>

              <p className="text-xs font-bold text-slate-400">

                COMPANY TYPE

              </p>

              <p className="mt-1 font-bold">

                {
                  company.companyType
                }

              </p>

            </div>


            <div>

              <p className="text-xs font-bold text-slate-400">

                INCORPORATED

              </p>

              <p className="mt-1 font-bold">

                {
                  company.dateOfCreation ||
                  "Not available"
                }

              </p>

            </div>


            <div className="sm:col-span-2">

              <p className="flex items-center gap-2 text-xs font-bold text-slate-400">

                <MapPin className="h-4 w-4" />

                REGISTERED OFFICE

              </p>


              <p className="mt-2 text-sm leading-6 text-slate-600">

                {formatAddress(
                  company.registeredOfficeAddress
                )}

              </p>

            </div>

          </div>

        </div>

      )}


      {/* CONTACT */}

      <div className="mt-8 border-t border-slate-200 pt-8">

        <h3 className="text-xl font-black text-[#07182d]">

          Business Contact Details

        </h3>


        <p className="mt-2 text-sm leading-6 text-slate-500">

          Gmail, Outlook, Hotmail,
          Yahoo and company-domain
          email addresses are all
          accepted.

        </p>


        <div className="mt-6 grid gap-5 sm:grid-cols-2">

          <div className="sm:col-span-2">

            <label className="mb-2 block text-sm font-bold text-slate-700">

              Contact Email

            </label>


            <div className="flex items-center rounded-[8px] border border-slate-200 px-4 focus-within:border-[#d71920]">

              <Mail className="h-5 w-5 text-slate-400" />

              <input
                required
                type="email"
                value={
                  businessEmail
                }
                onChange={(
                  event
                ) =>
                  setBusinessEmail(
                    event.target.value
                  )
                }
                placeholder="company@gmail.com"
                className="w-full bg-transparent px-3 py-4 text-sm outline-none"
              />

            </div>

          </div>


          <div>

            <label className="mb-2 block text-sm font-bold text-slate-700">

              Business Phone

            </label>


            <div className="flex items-center rounded-[8px] border border-slate-200 px-4 focus-within:border-[#d71920]">

              <Phone className="h-5 w-5 text-slate-400" />

              <input
                required
                type="tel"
                value={
                  phone
                }
                onChange={(
                  event
                ) =>
                  setPhone(
                    event.target.value
                  )
                }
                placeholder="+44 ..."
                className="w-full bg-transparent px-3 py-4 text-sm outline-none"
              />

            </div>

          </div>


          <div>

            <label className="mb-2 block text-sm font-bold text-slate-700">

              Website

            </label>


            <div className="flex items-center rounded-[8px] border border-slate-200 px-4 focus-within:border-[#d71920]">

              <Globe2 className="h-5 w-5 text-slate-400" />

              <input
                type="url"
                value={
                  website
                }
                onChange={(
                  event
                ) =>
                  setWebsite(
                    event.target.value
                  )
                }
                placeholder="https://company.co.uk"
                className="w-full bg-transparent px-3 py-4 text-sm outline-none"
              />

            </div>

          </div>

        </div>

      </div>


      <button
        type="submit"
        disabled={
          submitting ||
          !company
        }
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#d71920] py-4 font-bold text-white shadow-[0_8px_24px_rgba(16,24,40,.06)] transition hover:bg-[#b91319] disabled:cursor-not-allowed disabled:opacity-50"
      >

        {submitting && (

          <LoaderCircle className="h-5 w-5 animate-spin" />

        )}


        {submitting
          ? "Verifying..."
          : "Verify Employer"}

      </button>

    </form>
  );
}