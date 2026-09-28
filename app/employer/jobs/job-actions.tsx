"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  LoaderCircle,
  PlayCircle,
  Trash2,
  XCircle,
} from "lucide-react";

type Props = {
  jobId: string;
  title: string;
  status: string;
};

export default function JobActions({
  jobId,
  title,
  status,
}: Props) {
  const router =
    useRouter();

  const [
    loading,
    setLoading,
  ] = useState<
    string | null
  >(null);

  const [
    error,
    setError,
  ] = useState("");

  async function runAction(
    action:
      | "close"
      | "reopen"
      | "delete"
  ) {
    setError("");

    if (
      action === "delete"
    ) {
      const confirmed =
        window.confirm(
          `Delete "${title}" permanently?`
        );

      if (!confirmed) {
        return;
      }
    }

    if (
      action === "close"
    ) {
      const confirmed =
        window.confirm(
          `Close "${title}"?`
        );

      if (!confirmed) {
        return;
      }
    }

    setLoading(action);

    try {
      const response =
        await fetch(
          "/api/employer/jobs",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                jobId,
                action,
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

      router.refresh();
    } catch {
      setError(
        "Unable to connect to server."
      );
    } finally {
      setLoading(null);
    }
  }

  return (
    <div>

      {error && (

        <div className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
          {error}
        </div>

      )}


      <div className="flex flex-wrap gap-2">

        {status ===
        "published" ? (

          <button
            type="button"
            disabled={
              loading !== null
            }
            onClick={() =>
              runAction(
                "close"
              )
            }
            className="flex items-center gap-2 rounded-lg border border-amber-200 px-4 py-2 text-sm font-bold text-amber-700 transition hover:bg-amber-50 disabled:opacity-50"
          >

            {loading ===
            "close" ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}

            Close Job

          </button>

        ) : (

          <button
            type="button"
            disabled={
              loading !== null
            }
            onClick={() =>
              runAction(
                "reopen"
              )
            }
            className="flex items-center gap-2 rounded-lg border border-emerald-200 px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50"
          >

            {loading ===
            "reopen" ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <PlayCircle className="h-4 w-4" />
            )}

            Reopen Job

          </button>

        )}


        <button
          type="button"
          disabled={
            loading !== null
          }
          onClick={() =>
            runAction(
              "delete"
            )
          }
          className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
        >

          {loading ===
          "delete" ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}

          Delete

        </button>

      </div>

    </div>
  );
}