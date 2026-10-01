"use client";

import { useEffect, useId, useState } from "react";
import { ImagePlus, Trash2, Upload } from "lucide-react";

type Props = {
  label: string;
  help: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  existingUrl?: string | null;
  removed?: boolean;
  onRemovedChange?: (removed: boolean) => void;
  compact?: boolean;
};

export default function JobMediaPicker({
  label,
  help,
  file,
  onFileChange,
  existingUrl = null,
  removed = false,
  onRemovedChange,
  compact = false,
}: Props) {
  const inputId = useId();
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const visibleImage = preview || (!removed ? existingUrl : null);

  function clearImage() {
    onFileChange(null);
    if (existingUrl && onRemovedChange) onRemovedChange(true);
  }

  return (
    <div className="border border-[#d0d5dd] bg-white p-4">
      <div className="flex items-start gap-4">
        <div className={`${compact ? "h-16 w-16" : "h-24 w-32"} flex shrink-0 items-center justify-center overflow-hidden border border-[#e4e7ec] bg-[#f7f8fa]`}>
          {visibleImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={visibleImage} alt="Selected upload preview" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-6 w-6 text-[#98a2b3]" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-[#101828]">{label}</p>
          <p className="mt-1 text-[11px] leading-5 text-[#667085]">{help}</p>
          {file && <p className="mt-2 truncate text-[11px] font-medium text-[#344054]">{file.name}</p>}

          <div className="mt-3 flex flex-wrap gap-2">
            <label htmlFor={inputId} className="inline-flex cursor-pointer items-center gap-2 border border-[#cfd5dc] bg-white px-3 py-2 text-[11px] font-semibold text-[#344054] transition hover:border-[#98a2b3] hover:bg-[#f9fafb]">
              <Upload className="h-3.5 w-3.5" />
              {visibleImage ? "Replace" : "Upload"}
            </label>
            <input
              id={inputId}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(event) => {
                const next = event.target.files?.[0] || null;
                onFileChange(next);
                if (next && onRemovedChange) onRemovedChange(false);
                event.currentTarget.value = "";
              }}
            />

            {visibleImage && (
              <button type="button" onClick={clearImage} className="inline-flex items-center gap-2 px-3 py-2 text-[11px] font-semibold text-[#b42318] transition hover:bg-[#fef3f2]">
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
