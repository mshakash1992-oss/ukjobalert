import Image from "next/image";
import Link from "next/link";

import { redirect } from "next/navigation";

import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Globe2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { getAdminUser } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

import AdminActions from "./admin-actions";

type Verification = {
  id: string;

  user_id: string;

  company_number: string;

  company_name: string;

  company_status:
    | string
    | null;

  company_status_detail:
    | string
    | null;

  company_type:
    | string
    | null;

  registered_office_address:
    | Record<string, string>
    | null;

  business_email: string;

  phone: string;

  website:
    | string
    | null;

  verification_status: string;

  auto_approved: boolean;

  verification_method:
    | string
    | null;

  review_notes:
    | string
    | null;

  submitted_at: string;

  reviewed_at:
    | string
    | null;
};

function formatAddress(
  address:
    | Record<string, string>
    | null
) {
  if (!address) {
    return "Not available";
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

function formatDate(
  date:
    | string
    | null
) {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",

      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(
    new Date(date)
  );
}

export default async function AdminPage() {
  const adminUser =
    await getAdminUser();

  if (!adminUser) {
    redirect("/");
  }

  const admin =
    createAdminClient();

  const {
    data,
    error,
  } = await admin
    .from(
      "employer_verifications"
    )
    .select("*")
    .order(
      "submitted_at",
      {
        ascending: false,
      }
    );

  if (error) {
    console.error(error);
  }

  const verifications =
    (data ||
      []) as Verification[];

  const pending =
    verifications.filter(
      (item) =>
        item.verification_status ===
        "pending"
    );

  const verified =
    verifications.filter(
      (item) =>
        item.verification_status ===
        "verified"
    );

  const rejected =
    verifications.filter(
      (item) =>
        item.verification_status ===
        "rejected"
    );

  return (
    <main className="min-h-screen bg-[#f5f8fc]">
      {/* HEADER */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-[78px] max-w-[1350px] items-center justify-between gap-5 px-5 py-3">

          <Link href="/">
            <Image
              src="/ukjobalert-logo.png"
              alt="UK Job Alert"
              width={290}
              height={90}
              priority
              className="h-[58px] w-auto object-contain"
            />
          </Link>

          <div className="rounded-full bg-[#071b3d] px-4 py-2 text-sm font-bold text-white">
            Admin Dashboard
          </div>

        </div>
      </header>


      <section className="mx-auto max-w-[1350px] px-5 py-10">

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />

          Back to Homepage
        </Link>


        <div className="mt-7">

          <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
            UKJOBALERT ADMIN
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-[-1.5px] text-[#071b3d]">
            Employer Verification
          </h1>

          <p className="mt-3 text-slate-500">
            Signed in as{" "}

            <span className="font-bold text-[#071b3d]">
              {adminUser.email}
            </span>
          </p>

        </div>


        {/* STATS */}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">

          <StatCard
            icon={Clock3}
            number={pending.length}
            label="Pending Review"
            type="pending"
          />

          <StatCard
            icon={CheckCircle2}
            number={verified.length}
            label="Verified"
            type="verified"
          />

          <StatCard
            icon={XCircle}
            number={rejected.length}
            label="Rejected"
            type="rejected"
          />

        </div>


        {/* PENDING */}

        <section className="mt-10">

          <div className="mb-5 flex items-center gap-3">

            <ShieldCheck className="h-6 w-6 text-amber-600" />

            <h2 className="text-2xl font-black text-[#071b3d]">
              Pending Manual Review
            </h2>

          </div>


          {pending.length === 0 ? (

            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">

              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />

              <p className="mt-4 font-bold text-[#071b3d]">
                No pending employers
              </p>

            </div>

          ) : (

            <div className="grid gap-5">

              {pending.map(
                (item) => (

                  <div
                    key={item.id}
                    className="rounded-[26px] border border-amber-200 bg-white p-6 shadow-sm"
                  >

                    <div className="flex flex-col justify-between gap-5 lg:flex-row">

                      <div className="flex items-center gap-4">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                          <Building2 className="h-6 w-6" />

                        </div>


                        <div>

                          <h3 className="text-xl font-black text-[#071b3d]">
                            {item.company_name}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            Company No.{" "}
                            {item.company_number}
                          </p>

                        </div>

                      </div>


                      <span className="self-start rounded-full bg-amber-50 px-4 py-2 text-xs font-bold uppercase text-amber-700">
                        Pending
                      </span>

                    </div>


                    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                      <InfoItem
                        icon={ShieldCheck}
                        label="Companies House Status"
                        value={
                          item.company_status ||
                          "Unknown"
                        }
                      />

                      <InfoItem
                        icon={Building2}
                        label="Company Type"
                        value={
                          item.company_type ||
                          "Unknown"
                        }
                      />

                      <InfoItem
                        icon={Mail}
                        label="Contact Email"
                        value={
                          item.business_email ||
                          "Not provided"
                        }
                      />

                      <InfoItem
                        icon={Phone}
                        label="Phone"
                        value={
                          item.phone ||
                          "Not provided"
                        }
                      />

                      <InfoItem
                        icon={Globe2}
                        label="Website"
                        value={
                          item.website ||
                          "Not provided"
                        }
                      />

                      <InfoItem
                        icon={CalendarDays}
                        label="Submitted"
                        value={formatDate(
                          item.submitted_at
                        )}
                      />

                    </div>


                    <div className="mt-5 rounded-xl bg-slate-50 p-4">

                      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">

                        <MapPin className="h-4 w-4" />

                        Registered Office

                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-600">

                        {formatAddress(
                          item.registered_office_address
                        )}

                      </p>

                    </div>


                    {item.review_notes && (

                      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">

                        <p className="text-xs font-bold uppercase text-amber-700">
                          Current Review Note
                        </p>

                        <p className="mt-2 text-sm leading-6 text-amber-800">
                          {item.review_notes}
                        </p>

                      </div>

                    )}


                    <AdminActions
                      id={item.id}
                      companyName={
                        item.company_name
                      }
                    />

                  </div>

                )
              )}

            </div>

          )}

        </section>


        {/* VERIFIED */}

        <section className="mt-12">

          <div className="mb-5 flex items-center gap-3">

            <CheckCircle2 className="h-6 w-6 text-emerald-600" />

            <h2 className="text-2xl font-black text-[#071b3d]">
              Verified Employers
            </h2>

          </div>


          {verified.length === 0 ? (

            <div className="rounded-2xl border border-slate-200 bg-white p-7 text-slate-500">
              No verified employers yet.
            </div>

          ) : (

            <div className="grid gap-3">

              {verified.map(
                (item) => (

                  <div
                    key={item.id}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-emerald-100 bg-white p-5 sm:flex-row sm:items-center"
                  >

                    <div>

                      <div className="flex items-center gap-2">

                        <h3 className="font-black text-[#071b3d]">
                          {item.company_name}
                        </h3>

                        <ShieldCheck className="h-4 w-4 text-emerald-600" />

                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        {item.company_number}
                      </p>

                    </div>


                    <div className="text-sm">

                      <span className="rounded-full bg-emerald-50 px-3 py-1.5 font-bold text-emerald-700">
                        Verified
                      </span>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>


        {/* REJECTED */}

        <section className="mt-12">

          <div className="mb-5 flex items-center gap-3">

            <XCircle className="h-6 w-6 text-red-600" />

            <h2 className="text-2xl font-black text-[#071b3d]">
              Rejected Employers
            </h2>

          </div>


          {rejected.length === 0 ? (

            <div className="rounded-2xl border border-slate-200 bg-white p-7 text-slate-500">
              No rejected employers.
            </div>

          ) : (

            <div className="grid gap-3">

              {rejected.map(
                (item) => (

                  <div
                    key={item.id}
                    className="rounded-2xl border border-red-100 bg-white p-5"
                  >

                    <div className="flex flex-col justify-between gap-4 sm:flex-row">

                      <div>

                        <h3 className="font-black text-[#071b3d]">
                          {item.company_name}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {item.company_number}
                        </p>

                      </div>

                      <span className="self-start rounded-full bg-red-50 px-3 py-1.5 text-sm font-bold text-red-700">
                        Rejected
                      </span>

                    </div>


                    {item.review_notes && (

                      <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                        {item.review_notes}
                      </p>

                    )}

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </section>
    </main>
  );
}


function StatCard({
  icon: Icon,
  number,
  label,
  type,
}: {
  icon: typeof Clock3;

  number: number;

  label: string;

  type:
    | "pending"
    | "verified"
    | "rejected";
}) {
  const styles = {
    pending:
      "border-amber-200 bg-amber-50 text-amber-600",

    verified:
      "border-emerald-200 bg-emerald-50 text-emerald-600",

    rejected:
      "border-red-200 bg-red-50 text-red-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">

      <div className="flex items-center gap-4">

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl border ${styles[type]}`}
        >
          <Icon className="h-6 w-6" />
        </div>

        <div>

          <p className="text-2xl font-black text-[#071b3d]">
            {number}
          </p>

          <p className="text-sm text-slate-500">
            {label}
          </p>

        </div>

      </div>

    </div>
  );
}


function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;

  label: string;

  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

      <div className="flex items-center gap-2 text-slate-400">

        <Icon className="h-4 w-4" />

        <p className="text-xs font-bold uppercase">
          {label}
        </p>

      </div>

      <p className="mt-2 break-words text-sm font-bold text-[#071b3d]">
        {value}
      </p>

    </div>
  );
}