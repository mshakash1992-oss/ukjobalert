"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  AlertCircle,
  Banknote,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  Globe2,
  LoaderCircle,
  Mail,
  MapPin,
  Send,
  Tags,
} from "lucide-react";

const categories = [
  "Healthcare",
  "Construction",
  "Hospitality",
  "Driving",
  "Warehouse",
  "Retail",
  "IT & Tech",
  "Education",
  "Cleaning",
  "Office",
  "Other",
];

const jobTypes = [
  "Full Time",
  "Part Time",
  "Temporary",
  "Contract",
  "Apprenticeship",
  "Internship",
];

export default function PostJobForm() {
  const router = useRouter();

  const [title, setTitle] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [jobType, setJobType] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [salary, setSalary] =
    useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    expiryDays,
    setExpiryDays,
  ] = useState("30");

  const [
    applyMethod,
    setApplyMethod,
  ] = useState<
    "email" | "url"
  >("email");

  const [
    applyEmail,
    setApplyEmail,
  ] = useState("");

  const [
    applyUrl,
    setApplyUrl,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  async function submitJob(
    event:
      React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response =
        await fetch(
          "/api/jobs",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              title,
              category,
              jobType,
              location,
              salary,
              description,

              expiryDays:
                Number(expiryDays),

              applyMethod,
              applyEmail,
              applyUrl,
            }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        setError(
          result.error ||
            "Unable to publish job."
        );

        return;
      }

      setSuccess(
        "Job published successfully."
      );

      setTimeout(() => {
        router.push(
          `/jobs/${result.job.slug}`
        );
      }, 600);
    } catch {
      setError(
        "Unable to connect to server."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submitJob}
      className="mt-6"
    >
      <div className="space-y-9">

        {/* ROLE */}

        <FormSection
          number="01"
          title="Role basics"
          description="Start with the details candidates use to decide whether a role is relevant."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FieldLabel>
                Job title
              </FieldLabel>

              <div className="group flex min-h-[54px] items-center border border-[#cfd5dc] bg-white px-4 transition focus-within:border-[#d71920] focus-within:ring-[2px] focus-within:ring-[#d71920]/10">
                <BriefcaseBusiness className="h-[18px] w-[18px] shrink-0 text-[#98a2b3]" />

                <input
                  required
                  value={title}
                  onChange={(event) =>
                    setTitle(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Care Assistant"
                  className="w-full bg-transparent px-3 text-[14px] font-medium text-[#101828] outline-none placeholder:font-normal placeholder:text-[#98a2b3]"
                />
              </div>
            </div>

            <div>
              <FieldLabel>
                Sector
              </FieldLabel>

              <div className="flex min-h-[54px] items-center border border-[#cfd5dc] bg-white px-4 transition focus-within:border-[#d71920] focus-within:ring-[2px] focus-within:ring-[#d71920]/10">
                <Tags className="h-[18px] w-[18px] shrink-0 text-[#98a2b3]" />

                <select
                  required
                  value={category}
                  onChange={(event) =>
                    setCategory(
                      event.target.value
                    )
                  }
                  className="w-full bg-transparent px-3 text-[14px] font-medium text-[#344054] outline-none"
                >
                  <option value="">
                    Select sector
                  </option>

                  {categories.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            <div>
              <FieldLabel>
                Job type
              </FieldLabel>

              <select
                required
                value={jobType}
                onChange={(event) =>
                  setJobType(
                    event.target.value
                  )
                }
                className="min-h-[54px] w-full border border-[#cfd5dc] bg-white px-4 text-[14px] font-medium text-[#344054] outline-none transition focus:border-[#d71920] focus:ring-[2px] focus:ring-[#d71920]/10"
              >
                <option value="">
                  Select job type
                </option>

                {jobTypes.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <FieldLabel>
                Location
              </FieldLabel>

              <div className="flex min-h-[54px] items-center border border-[#cfd5dc] bg-white px-4 transition focus-within:border-[#d71920] focus-within:ring-[2px] focus-within:ring-[#d71920]/10">
                <MapPin className="h-[18px] w-[18px] shrink-0 text-[#98a2b3]" />

                <input
                  required
                  value={location}
                  onChange={(event) =>
                    setLocation(
                      event.target.value
                    )
                  }
                  placeholder="e.g. London"
                  className="w-full bg-transparent px-3 text-[14px] font-medium text-[#101828] outline-none placeholder:font-normal placeholder:text-[#98a2b3]"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <FieldLabel noMargin>
                  Salary
                </FieldLabel>

                <span className="text-[11px] text-[#98a2b3]">
                  Optional
                </span>
              </div>

              <div className="flex min-h-[54px] items-center border border-[#cfd5dc] bg-white px-4 transition focus-within:border-[#d71920] focus-within:ring-[2px] focus-within:ring-[#d71920]/10">
                <Banknote className="h-[18px] w-[18px] shrink-0 text-[#98a2b3]" />

                <input
                  value={salary}
                  onChange={(event) =>
                    setSalary(
                      event.target.value
                    )
                  }
                  placeholder="e.g. £12.50 per hour"
                  className="w-full bg-transparent px-3 text-[14px] font-medium text-[#101828] outline-none placeholder:font-normal placeholder:text-[#98a2b3]"
                />
              </div>
            </div>
          </div>
        </FormSection>

        {/* DESCRIPTION */}

        <FormSection
          number="02"
          title="Job description"
          description="Describe the work clearly, including responsibilities, requirements and useful context."
        >
          <FieldLabel>
            Description
          </FieldLabel>

          <textarea
            required
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            rows={11}
            placeholder="Describe the role, responsibilities, requirements and benefits..."
            className="w-full resize-y border border-[#cfd5dc] bg-white p-4 text-[14px] leading-7 text-[#344054] outline-none transition placeholder:text-[#98a2b3] focus:border-[#d71920] focus:ring-[2px] focus:ring-[#d71920]/10"
          />

          <div className="mt-2 flex items-center justify-between gap-4">
            <p className="text-[11px] text-[#98a2b3]">
              Minimum 50 characters.
            </p>

            <p className="text-[11px] text-[#98a2b3]">
              {description.length} characters
            </p>
          </div>
        </FormSection>

        {/* LISTING */}

        <FormSection
          number="03"
          title="Listing duration"
          description="Set how long the vacancy should remain visible to job seekers."
        >
          <FieldLabel>
            Job expiry
          </FieldLabel>

          <div className="flex min-h-[54px] items-center border border-[#cfd5dc] bg-white px-4 transition focus-within:border-[#d71920] focus-within:ring-[2px] focus-within:ring-[#d71920]/10">
            <CalendarClock className="h-[18px] w-[18px] shrink-0 text-[#98a2b3]" />

            <select
              value={expiryDays}
              onChange={(event) =>
                setExpiryDays(
                  event.target.value
                )
              }
              className="w-full bg-transparent px-3 text-[14px] font-medium text-[#344054] outline-none"
            >
              <option value="7">
                7 days
              </option>

              <option value="14">
                14 days
              </option>

              <option value="30">
                30 days
              </option>

              <option value="60">
                60 days
              </option>

              <option value="90">
                90 days
              </option>
            </select>
          </div>

          <p className="mt-2 text-[11px] leading-5 text-[#98a2b3]">
            The vacancy will stop appearing
            publicly after the selected
            period.
          </p>
        </FormSection>

        {/* APPLICATION */}

        <FormSection
          number="04"
          title="Applications"
          description="Choose the exact route candidates should use when they are ready to apply."
        >
          <FieldLabel>
            Application method
          </FieldLabel>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                setApplyMethod(
                  "email"
                )
              }
              className={`flex min-h-[64px] items-center gap-3 border px-4 text-left transition ${
                applyMethod ===
                "email"
                  ? "border-[#d71920] bg-[#fff6f6] shadow-[0_0_0_2px_rgba(215,25,32,.08)]"
                  : "border-[#d0d5dd] bg-white hover:border-[#98a2b3]"
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center  ${
                  applyMethod ===
                  "email"
                    ? "bg-[#d71920] text-white"
                    : "bg-[#f2f4f7] text-[#667085]"
                }`}
              >
                <Mail className="h-[17px] w-[17px]" />
              </div>

              <div>
                <p className="text-[13px] font-semibold text-[#101828]">
                  Email
                </p>

                <p className="mt-0.5 text-[11px] text-[#667085]">
                  Receive applications by
                  email
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                setApplyMethod(
                  "url"
                )
              }
              className={`flex min-h-[64px] items-center gap-3 border px-4 text-left transition ${
                applyMethod ===
                "url"
                  ? "border-[#d71920] bg-[#fff6f6] shadow-[0_0_0_2px_rgba(215,25,32,.08)]"
                  : "border-[#d0d5dd] bg-white hover:border-[#98a2b3]"
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center  ${
                  applyMethod ===
                  "url"
                    ? "bg-[#d71920] text-white"
                    : "bg-[#f2f4f7] text-[#667085]"
                }`}
              >
                <Globe2 className="h-[17px] w-[17px]" />
              </div>

              <div>
                <p className="text-[13px] font-semibold text-[#101828]">
                  Website
                </p>

                <p className="mt-0.5 text-[11px] text-[#667085]">
                  Send candidates to your
                  website
                </p>
              </div>
            </button>
          </div>

          <div className="mt-5">
            {applyMethod ===
            "email" ? (
              <>
                <FieldLabel>
                  Application email
                </FieldLabel>

                <div className="flex min-h-[54px] items-center border border-[#cfd5dc] bg-white px-4 transition focus-within:border-[#d71920] focus-within:ring-[2px] focus-within:ring-[#d71920]/10">
                  <Mail className="h-[18px] w-[18px] shrink-0 text-[#98a2b3]" />

                  <input
                    required
                    type="email"
                    value={applyEmail}
                    onChange={(event) =>
                      setApplyEmail(
                        event.target.value
                      )
                    }
                    placeholder="jobs@company.com"
                    className="w-full bg-transparent px-3 text-[14px] font-medium text-[#101828] outline-none placeholder:font-normal placeholder:text-[#98a2b3]"
                  />
                </div>
              </>
            ) : (
              <>
                <FieldLabel>
                  Application URL
                </FieldLabel>

                <div className="flex min-h-[54px] items-center border border-[#cfd5dc] bg-white px-4 transition focus-within:border-[#d71920] focus-within:ring-[2px] focus-within:ring-[#d71920]/10">
                  <Globe2 className="h-[18px] w-[18px] shrink-0 text-[#98a2b3]" />

                  <input
                    required
                    type="url"
                    value={applyUrl}
                    onChange={(event) =>
                      setApplyUrl(
                        event.target.value
                      )
                    }
                    placeholder="https://company.com/careers/job"
                    className="w-full bg-transparent px-3 text-[14px] font-medium text-[#101828] outline-none placeholder:font-normal placeholder:text-[#98a2b3]"
                  />
                </div>
              </>
            )}
          </div>
        </FormSection>
      </div>

      {/* STATUS */}

      {error && (
        <div className="mt-7 flex items-start gap-3 rounded-[10px] border border-[#fecdca] bg-[#fef3f2] p-4">
          <AlertCircle className="mt-[1px] h-[18px] w-[18px] shrink-0 text-[#d92d20]" />

          <p className="text-[13px] font-medium leading-5 text-[#b42318]">
            {error}
          </p>
        </div>
      )}

      {success && (
        <div className="mt-7 flex items-start gap-3 rounded-[10px] border border-[#abefc6] bg-[#ecfdf3] p-4">
          <CheckCircle2 className="mt-[1px] h-[18px] w-[18px] shrink-0 text-[#067647]" />

          <p className="text-[13px] font-medium leading-5 text-[#067647]">
            {success}
          </p>
        </div>
      )}

      {/* SUBMIT */}

      <div className="mt-8 border-t border-[#eaecf0] pt-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-[13px] font-semibold text-[#101828]">
              Final check before publishing
            </p>

            <p className="mt-1 text-[11px] leading-5 text-[#667085]">
              Confirm the role details and application route are accurate before the vacancy goes live.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex min-h-[50px] min-w-[180px] items-center justify-center gap-2.5  bg-[#d71920] px-6 text-[14px] font-semibold transition hover:bg-[#b9151b] disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              color: "#ffffff",
            }}
          >
            {loading ? (
              <LoaderCircle className="h-[18px] w-[18px] animate-spin" />
            ) : (
              <Send className="h-[17px] w-[17px]" />
            )}

            {loading
              ? "Publishing..."
              : "Publish job"}
          </button>
        </div>
      </div>
    </form>
  );
}

function FormSection({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-5 flex items-start gap-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#07182d] text-[11px] font-bold text-white">
          {number}
        </div>

        <div>
          <h3 className="text-[17px] font-semibold tracking-[-0.25px] text-[#101828]">
            {title}
          </h3>

          <p className="mt-1 text-[12px] leading-5 text-[#667085]">
            {description}
          </p>
        </div>
      </div>

      <div className="ml-0 sm:ml-12">
        {children}
      </div>
    </section>
  );
}

function FieldLabel({
  children,
  noMargin = false,
}: {
  children: React.ReactNode;
  noMargin?: boolean;
}) {
  return (
    <label
      className={`block text-[12px] font-semibold text-[#344054] ${
        noMargin
          ? ""
          : "mb-2"
      }`}
    >
      {children}
    </label>
  );
}