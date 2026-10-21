"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
  XCircle,
} from "lucide-react";

type Props = {
  id: string;
  companyName: string;
};

export default function AdminActions({
  id,
  companyName,
}: Props) {
  const router =
    useRouter();

  const [
    rejectionReason,
    setRejectionReason,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState<
    "approve" | "reject" | null
  >(null);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  async function updateVerification(
    action:
      | "approve"
      | "reject"
  ) {
    setError("");
    setSuccess("");

    if (
      action === "reject" &&
      !rejectionReason.trim()
    ) {
      setError(
        "Enter a rejection reason first."
      );

      return;
    }

    if (
      action === "approve"
    ) {
      const confirmed =
        window.confirm(
          `Approve ${companyName} as a verified employer?`
        );

      if (!confirmed) {
        return;
      }
    }

    if (
      action === "reject"
    ) {
      const confirmed =
        window.confirm(
          `Reject ${companyName}?`
        );

      if (!confirmed) {
        return;
      }
    }

    setLoading(action);

    try {
      const response =
        await fetch(
          "/api/admin/employer-verification",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                id,
                action,

                reason:
                  rejectionReason.trim(),
              }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        setError(
          result.error ||
            "Unable to update verification."
        );

        return;
      }

      setSuccess(
        result.message ||
          "Updated successfully."
      );

      setRejectionReason("");

      setTimeout(() => {
        router.refresh();
      }, 500);
    } catch {
      setError(
        "Unable to connect to the server."
      );
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mt-6 border-t border-slate-200 pt-6">
      <h4 className="font-black text-[#07182d]">
        Admin Decision
      </h4>

      <p className="mt-1 text-sm text-slate-500">
        Approve the employer or enter a
        reason before rejecting.
      </p>

      <textarea
        value={rejectionReason}
        onChange={(event) =>
          setRejectionReason(
            event.target.value
          )
        }
        rows={3}
        placeholder="Rejection reason..."
        className="mt-4 w-full resize-none rounded-[8px] border border-slate-200 bg-white p-4 text-sm outline-none transition focus:border-[#d71920]"
      />

      {error && (
        <div className="mt-4 flex gap-3 rounded-[8px] border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />

          <p className="text-sm font-semibold text-red-700">
            {error}
          </p>
        </div>
      )}

      {success && (
        <div className="mt-4 flex gap-3 rounded-[8px] border border-emerald-200 bg-emerald-50 p-4">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />

          <p className="text-sm font-semibold text-emerald-700">
            {success}
          </p>
        </div>
      )}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          disabled={
            loading !== null
          }
          onClick={() =>
            updateVerification(
              "approve"
            )
          }
          className="flex items-center justify-center gap-2 rounded-[8px] bg-emerald-600 px-5 py-3.5 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ===
          "approve" ? (
            <LoaderCircle className="h-5 w-5 animate-spin" />
          ) : (
            <CheckCircle2 className="h-5 w-5" />
          )}

          Approve Employer
        </button>

        <button
          type="button"
          disabled={
            loading !== null
          }
          onClick={() =>
            updateVerification(
              "reject"
            )
          }
          className="flex items-center justify-center gap-2 rounded-[8px] bg-red-600 px-5 py-3.5 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ===
          "reject" ? (
            <LoaderCircle className="h-5 w-5 animate-spin" />
          ) : (
            <XCircle className="h-5 w-5" />
          )}

          Reject Employer
        </button>
      </div>
    </div>
  );
}