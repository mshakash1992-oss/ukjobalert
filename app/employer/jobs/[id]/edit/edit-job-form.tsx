"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  AlertCircle,
  Banknote,
  BriefcaseBusiness,
  CheckCircle2,
  Globe2,
  LoaderCircle,
  Mail,
  MapPin,
  Save,
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

type Job = {
  id: string;
  title: string;
  category: string;
  jobType: string;
  location: string;
  salary: string;
  description: string;
  applyMethod: "email" | "url";
  applyEmail: string;
  applyUrl: string;
  status: string;
};

export default function EditJobForm({
  job,
}: {
  job: Job;
}) {
  const router = useRouter();

  const [title, setTitle] =
    useState(job.title);

  const [category, setCategory] =
    useState(job.category);

  const [jobType, setJobType] =
    useState(job.jobType);

  const [location, setLocation] =
    useState(job.location);

  const [salary, setSalary] =
    useState(job.salary);

  const [
    description,
    setDescription,
  ] = useState(job.description);

  const [
    applyMethod,
    setApplyMethod,
  ] = useState<
    "email" | "url"
  >(job.applyMethod);

  const [
    applyEmail,
    setApplyEmail,
  ] = useState(job.applyEmail);

  const [
    applyUrl,
    setApplyUrl,
  ] = useState(job.applyUrl);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  async function updateJob(
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
          "/api/employer/jobs/update",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              jobId: job.id,
              title,
              category,
              jobType,
              location,
              salary,
              description,
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
            "Unable to update job."
        );

        return;
      }

      setSuccess(
        "Job updated successfully."
      );

      router.refresh();
    } catch {
      setError(
        "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={updateJob}
      className="mt-6"
    >
      <div className="space-y-9">

        {/* ROLE INFORMATION */}

        <FormSection
          number="01"
          title="Role information"
          description="Update the main information candidates see for this vacancy."
        >
          <div className="grid gap-5 sm:grid-cols-2">

            <div className="sm:col-span-2">
              <FieldLabel>
                Job title
              </FieldLabel>

              <div className="flex min-h-[54px] items-center rounded-[9px] border border-[#d0d5dd] bg-white px-4 transition focus-within:border-[#175cd3] focus-within:ring-[3px] focus-within:ring-[#175cd3]/10">
                <BriefcaseBusiness className="h-[18px] w-[18px] shrink-0 text-[#98a2b3]" />

                <input
                  required
                  value={title}
                  onChange={(event) =>
                    setTitle(
                      event.target.value
                    )
                  }
                  className="w-full bg-transparent px-3 text-[14px] font-medium text-[#101828] outline-none"
                />
              </div>
            </div>

            <div>
              <FieldLabel>
                Sector
              </FieldLabel>

              <div className="flex min-h-[54px] items-center rounded-[9px] border border-[#d0d5dd] bg-white px-4 transition focus-within:border-[#175cd3] focus-within:ring-[3px] focus-within:ring-[#175cd3]/10">
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
                className="min-h-[54px] w-full rounded-[9px] border border-[#d0d5dd] bg-white px-4 text-[14px] font-medium text-[#344054] outline-none transition focus:border-[#175cd3] focus:ring-[3px] focus:ring-[#175cd3]/10"
              >
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

              <div className="flex min-h-[54px] items-center rounded-[9px] border border-[#d0d5dd] bg-white px-4 transition focus-within:border-[#175cd3] focus-within:ring-[3px] focus-within:ring-[#175cd3]/10">
                <MapPin className="h-[18px] w-[18px] shrink-0 text-[#98a2b3]" />

                <input
                  required
                  value={location}
                  onChange={(event) =>
                    setLocation(
                      event.target.value
                    )
                  }
                  className="w-full bg-transparent px-3 text-[14px] font-medium text-[#101828] outline-none"
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

              <div className="flex min-h-[54px] items-center rounded-[9px] border border-[#d0d5dd] bg-white px-4 transition focus-within:border-[#175cd3] focus-within:ring-[3px] focus-within:ring-[#175cd3]/10">
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
          description="Update the responsibilities, requirements and other vacancy details."
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
            className="w-full resize-y rounded-[10px] border border-[#d0d5dd] bg-white p-4 text-[14px] leading-7 text-[#344054] outline-none transition focus:border-[#175cd3] focus:ring-[3px] focus:ring-[#175cd3]/10"
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

        {/* APPLICATION */}

        <FormSection
          number="03"
          title="Applications"
          description="Choose where candidates should send their application."
        >
          <FieldLabel>
            Application method
          </FieldLabel>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                setApplyMethod("email")
              }
              className={`flex min-h-[64px] items-center gap-3 rounded-[10px] border px-4 text-left transition ${
                applyMethod === "email"
                  ? "border-[#175cd3] bg-[#f2f7ff] shadow-[0_0_0_3px_rgba(23,92,211,.08)]"
                  : "border-[#d0d5dd] bg-white hover:border-[#98a2b3]"
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] ${
                  applyMethod === "email"
                    ? "bg-[#175cd3] text-white"
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
                  Receive applications by email
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                setApplyMethod("url")
              }
              className={`flex min-h-[64px] items-center gap-3 rounded-[10px] border px-4 text-left transition ${
                applyMethod === "url"
                  ? "border-[#175cd3] bg-[#f2f7ff] shadow-[0_0_0_3px_rgba(23,92,211,.08)]"
                  : "border-[#d0d5dd] bg-white hover:border-[#98a2b3]"
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] ${
                  applyMethod === "url"
                    ? "bg-[#175cd3] text-white"
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
                  Send candidates to your website
                </p>
              </div>
            </button>
          </div>

          <div className="mt-5">
            {applyMethod === "email" ? (
              <>
                <FieldLabel>
                  Application email
                </FieldLabel>

                <div className="flex min-h-[54px] items-center rounded-[9px] border border-[#d0d5dd] bg-white px-4 transition focus-within:border-[#175cd3] focus-within:ring-[3px] focus-within:ring-[#175cd3]/10">
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

                <div className="flex min-h-[54px] items-center rounded-[9px] border border-[#d0d5dd] bg-white px-4 transition focus-within:border-[#175cd3] focus-within:ring-[3px] focus-within:ring-[#175cd3]/10">
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

      {/* ACTIONS */}

      <div className="mt-8 border-t border-[#eaecf0] pt-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-[13px] font-semibold text-[#101828]">
              Save your changes
            </p>

            <p className="mt-1 text-[11px] leading-5 text-[#667085]">
              Review the updated vacancy before saving.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/employer/jobs"
              className="flex min-h-[50px] items-center justify-center rounded-[8px] border border-[#d0d5dd] bg-white px-6 text-[13px] font-semibold text-[#344054] transition hover:bg-[#f9fafb]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="flex min-h-[50px] min-w-[170px] items-center justify-center gap-2.5 rounded-[8px] bg-[#e11d48] px-6 text-[14px] font-semibold transition hover:bg-[#be123c] disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                color: "#ffffff",
              }}
            >
              {loading ? (
                <LoaderCircle className="h-[18px] w-[18px] animate-spin" />
              ) : (
                <Save className="h-[17px] w-[17px]" />
              )}

              {loading
                ? "Saving..."
                : "Save changes"}
            </button>
          </div>
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
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
          style={{
            backgroundColor: "#07182d",
            color: "#ffffff",
          }}
        >
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

      <div className="sm:ml-12">
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
        noMargin ? "" : "mb-2"
      }`}
    >
      {children}
    </label>
  );
}