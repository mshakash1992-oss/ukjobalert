import { randomUUID } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

export const JOB_MEDIA_BUCKET = "job-media";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function mediaFileFromForm(form: FormData, key: string) {
  const value = form.get(key);
  return value instanceof File && value.size > 0 ? value : null;
}

export async function validateJobMedia(file: File | null, kind: "logo" | "job") {
  if (!file) return null;

  if (!ALLOWED_TYPES.has(file.type)) {
    return "Use a JPG, PNG or WebP image.";
  }

  const limit = kind === "logo" ? 2 * 1024 * 1024 : 4 * 1024 * 1024;
  if (file.size > limit) {
    return kind === "logo"
      ? "Company logo must be 2 MB or smaller."
      : "Job photo must be 4 MB or smaller.";
  }

  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const isJpeg = header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
  const isPng = header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4e && header[3] === 0x47;
  const isWebp =
    header[0] === 0x52 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x46 &&
    header[8] === 0x57 && header[9] === 0x45 && header[10] === 0x42 && header[11] === 0x50;

  if (
    (file.type === "image/jpeg" && !isJpeg) ||
    (file.type === "image/png" && !isPng) ||
    (file.type === "image/webp" && !isWebp)
  ) {
    return "The selected file is not a valid image.";
  }

  return null;
}

export async function uploadJobMedia(
  admin: SupabaseClient,
  userId: string,
  file: File,
  kind: "logo" | "job"
) {
  const ext = EXTENSIONS[file.type] || "jpg";
  const path = `${userId}/${kind}/${randomUUID()}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error } = await admin.storage
    .from(JOB_MEDIA_BUCKET)
    .upload(path, bytes, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });

  if (error) {
    throw new Error(`Media upload failed: ${error.message}`);
  }

  const { data } = admin.storage.from(JOB_MEDIA_BUCKET).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

export function mediaPathFromPublicUrl(url: string | null | undefined) {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${JOB_MEDIA_BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length).split("?")[0]);
}

export async function deleteJobMedia(
  admin: SupabaseClient,
  url: string | null | undefined
) {
  const path = mediaPathFromPublicUrl(url);
  if (!path) return;
  await admin.storage.from(JOB_MEDIA_BUCKET).remove([path]);
}
