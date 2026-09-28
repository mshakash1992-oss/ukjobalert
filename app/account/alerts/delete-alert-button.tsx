"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

type DeleteAlertButtonProps = {
  alertId: string;
};

export default function DeleteAlertButton({
  alertId,
}: DeleteAlertButtonProps) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleDelete() {
    if (loading) {
      return;
    }

    const confirmed = window.confirm(
      "Delete this job alert?"
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/job-alerts",
        {
          method: "DELETE",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            alertId,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Unable to delete this job alert."
        );
      }

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete this job alert."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end">
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        title="Delete job alert"
        aria-label="Delete job alert"
        className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-[7px] border border-[#e4e7ec] bg-white text-[#667085] transition hover:border-[#fda29b] hover:bg-[#fff5f4] hover:text-[#d92d20] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {error && (
        <p className="mt-2 max-w-[180px] text-right text-[10px] font-semibold leading-4 text-[#d92d20]">
          {error}
        </p>
      )}
    </div>
  );
}