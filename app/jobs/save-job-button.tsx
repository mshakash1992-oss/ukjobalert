"use client";

import { useState } from "react";
import { Bookmark, Check } from "lucide-react";
import { useRouter } from "next/navigation";

type SaveJobButtonProps = {
  jobId: string;
  userId: string | null;
  initiallySaved: boolean;
};

export default function SaveJobButton({
  jobId,
  userId,
  initiallySaved,
}: SaveJobButtonProps) {
  const router = useRouter();

  const [saved, setSaved] = useState(initiallySaved);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!userId) {
      router.push(
        `/login?next=${encodeURIComponent(window.location.pathname)}`
      );

      return;
    }

    if (loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/saved-jobs", {
        method: saved ? "DELETE" : "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          jobId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error || "Unable to update saved job."
        );
      }

      setSaved(!saved);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update saved job."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleSave}
        disabled={loading}
        className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[8px] border border-[#d0d5dd] bg-white px-5 text-[13px] font-semibold text-[#344054] transition hover:border-[#98a2b3] hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saved ? (
          <>
            <Check className="h-4 w-4 text-[#039855]" />
            {loading ? "Removing..." : "Saved"}
          </>
        ) : (
          <>
            <Bookmark className="h-4 w-4" />
            {loading ? "Saving..." : "Save job"}
          </>
        )}
      </button>

      {error && (
        <p className="mt-2 text-center text-[11px] font-medium text-[#d92d20]">
          {error}
        </p>
      )}
    </div>
  );
}