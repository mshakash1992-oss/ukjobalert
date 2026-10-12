"use client";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Camera,
  CheckCircle2,
  ImagePlus,
  LoaderCircle,
  Save,
  Trash2,
  UserRound,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import styles from "./profile.module.css";

type ProfileForm = {
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  jobTitle: string;
  experience: string;
  skills: string;
  workType: string;
};

type WorkPhoto = {
  path: string;
  url: string;
};

const emptyProfile: ProfileForm = {
  firstName: "",
  lastName: "",
  phone: "",
  location: "",
  jobTitle: "",
  experience: "",
  skills: "",
  workType: "",
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function CandidateProfilePage() {
  const supabase = useMemo(() => createClient(), []);
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [form, setForm] = useState<ProfileForm>(emptyProfile);
  const [profilePhoto, setProfilePhoto] = useState<WorkPhoto | null>(null);
  const [workPhotos, setWorkPhotos] = useState<WorkPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const completion = useMemo(() => {
    const values = [
      form.firstName,
      form.lastName,
      phoneOrEmpty(form.phone),
      form.location,
      form.jobTitle,
      form.experience,
      form.skills,
      form.workType,
      profilePhoto?.url ?? "",
    ];
    const completed = values.filter((value) => value.trim().length > 0).length;
    return Math.round((completed / values.length) * 100);
  }, [form, profilePhoto]);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      setUserId(user.id);
      setEmail(user.email ?? "");

      const metadata = user.user_metadata ?? {};
      setForm({
        firstName: metadata.first_name ?? "",
        lastName: metadata.last_name ?? "",
        phone: metadata.phone ?? "",
        location: metadata.location ?? "",
        jobTitle: metadata.job_title ?? "",
        experience: metadata.experience ?? "",
        skills: metadata.skills ?? "",
        workType: metadata.work_type ?? "",
      });

      if (metadata.profile_photo_path) {
        const { data } = supabase.storage
          .from("profile-media")
          .getPublicUrl(metadata.profile_photo_path);

        setProfilePhoto({
          path: metadata.profile_photo_path,
          url: data.publicUrl,
        });
      }

      const storedWorkPhotos = Array.isArray(metadata.work_photo_paths)
        ? metadata.work_photo_paths
        : [];

      setWorkPhotos(
        storedWorkPhotos.map((path: string) => ({
          path,
          url: supabase.storage.from("profile-media").getPublicUrl(path).data.publicUrl,
        }))
      );

      setLoading(false);
    };

    loadProfile();
  }, [supabase]);

  const updateField = (field: keyof ProfileForm, value: string) => {
    setMessage("");
    setForm((current) => ({ ...current, [field]: value }));
  };

  const validateFile = (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      throw new Error("Only JPG, PNG and WebP images are allowed.");
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("Each image must be 5 MB or smaller.");
    }
  };

  const uploadFile = async (file: File, folder: string) => {
    validateFile(file);

    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${userId}/${folder}/${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage
      .from("profile-media")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabase.storage.from("profile-media").getPublicUrl(path);
    return { path, url: data.publicUrl };
  };

  const handleProfilePhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userId) return;

    setUploading(true);
    setMessage("");

    try {
      const uploaded = await uploadFile(file, "profile");

      if (profilePhoto?.path) {
        await supabase.storage.from("profile-media").remove([profilePhoto.path]);
      }

      setProfilePhoto(uploaded);

      const { error } = await supabase.auth.updateUser({
        data: { profile_photo_path: uploaded.path },
      });

      if (error) throw error;
      setMessage("Profile photo updated.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleWorkPhotos = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length || !userId) return;

    if (workPhotos.length + files.length > 6) {
      setMessage("You can add up to 6 work photos.");
      event.target.value = "";
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const uploaded: WorkPhoto[] = [];

      for (const file of files) {
        uploaded.push(await uploadFile(file, "work"));
      }

      const next = [...workPhotos, ...uploaded];
      setWorkPhotos(next);

      const { error } = await supabase.auth.updateUser({
        data: { work_photo_paths: next.map((photo) => photo.path) },
      });

      if (error) throw error;
      setMessage("Work photos updated.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const removeWorkPhoto = async (photo: WorkPhoto) => {
    setUploading(true);
    setMessage("");

    try {
      const { error: removeError } = await supabase.storage
        .from("profile-media")
        .remove([photo.path]);

      if (removeError) throw removeError;

      const next = workPhotos.filter((item) => item.path !== photo.path);
      setWorkPhotos(next);

      const { error } = await supabase.auth.updateUser({
        data: { work_photo_paths: next.map((item) => item.path) },
      });

      if (error) throw error;
      setMessage("Work photo removed.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not remove photo.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({
      data: {
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        phone: form.phone.trim(),
        location: form.location.trim(),
        job_title: form.jobTitle.trim(),
        experience: form.experience.trim(),
        skills: form.skills.trim(),
        work_type: form.workType,
        profile_photo_path: profilePhoto?.path ?? null,
        work_photo_paths: workPhotos.map((photo) => photo.path),
        profile_completion: completion,
      },
    });

    setSaving(false);
    setMessage(error ? error.message : "Profile saved successfully.");
  };

  if (loading) {
    return (
      <main className={styles.loadingPage}>
        <LoaderCircle />
        <span>Loading profile...</span>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <Link href="/account" className={styles.back}>
            <ArrowLeft />
            Back to Dashboard
          </Link>
          <div className={styles.completion}>
            <span>Profile completion</span>
            <strong>{completion}%</strong>
          </div>
        </div>

        <section className={styles.hero}>
          <div className={styles.heroIcon}><UserRound /></div>
          <div>
            <span>CANDIDATE PROFILE</span>
            <h1>Complete Your Profile</h1>
            <p>Add your profile photo, work photos and career information.</p>
          </div>
        </section>

        <form className={styles.form} onSubmit={handleSubmit}>
          <section className={styles.card}>
            <div className={styles.cardHead}>
              <div>
                <h2>Profile photo</h2>
                <p>Add a professional photo to your candidate profile.</p>
              </div>
              <Camera />
            </div>

            <div className={styles.profilePhotoRow}>
              <div className={styles.avatarPreview}>
                {profilePhoto ? (
                  <Image src={profilePhoto.url} alt="Profile" fill sizes="120px" unoptimized />
                ) : (
                  <UserRound />
                )}
              </div>

              <div>
                <label className={styles.uploadButton}>
                  <Camera />
                  {profilePhoto ? "Change Photo" : "Upload Photo"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleProfilePhoto}
                    disabled={uploading}
                  />
                </label>
                <p className={styles.uploadHint}>JPG, PNG or WebP. Maximum 5 MB.</p>
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHead}>
              <div>
                <h2>Basic information</h2>
                <p>Your personal and contact details.</p>
              </div>
              <CheckCircle2 />
            </div>

            <div className={styles.grid}>
              <label><span>First name</span><input value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} placeholder="First name" /></label>
              <label><span>Last name</span><input value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} placeholder="Last name" /></label>
              <label><span>Email address</span><input type="email" value={email} disabled /></label>
              <label><span>Phone number</span><input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+44..." /></label>
              <label className={styles.full}><span>Location</span><input value={form.location} onChange={(e) => updateField("location", e.target.value)} placeholder="London, UK" /></label>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHead}>
              <div>
                <h2>Career information</h2>
                <p>Tell employers about your experience and preferences.</p>
              </div>
              <BriefcaseBusiness />
            </div>

            <div className={styles.grid}>
              <label><span>Current / preferred job title</span><input value={form.jobTitle} onChange={(e) => updateField("jobTitle", e.target.value)} placeholder="e.g. Support Worker" /></label>
              <label>
                <span>Employment preference</span>
                <select value={form.workType} onChange={(e) => updateField("workType", e.target.value)}>
                  <option value="">Select preference</option>
                  <option>Full Time</option><option>Part Time</option><option>Contract</option>
                  <option>Temporary</option><option>Remote</option>
                </select>
              </label>
              <label className={styles.full}><span>Work experience</span><textarea value={form.experience} onChange={(e) => updateField("experience", e.target.value)} rows={5} placeholder="Describe your work experience..." /></label>
              <label className={styles.full}><span>Skills & preferences</span><textarea value={form.skills} onChange={(e) => updateField("skills", e.target.value)} rows={4} placeholder="Skills, qualifications and preferences..." /></label>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHead}>
              <div>
                <h2>Work photos / Portfolio</h2>
                <p>Add up to 6 photos showing your work or portfolio.</p>
              </div>
              <ImagePlus />
            </div>

            <label className={styles.portfolioUpload}>
              <ImagePlus />
              <strong>Add Work Photos</strong>
              <span>Choose JPG, PNG or WebP images — maximum 5 MB each.</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleWorkPhotos}
                disabled={uploading || workPhotos.length >= 6}
              />
            </label>

            {workPhotos.length > 0 && (
              <div className={styles.photoGrid}>
                {workPhotos.map((photo) => (
                  <div className={styles.workPhoto} key={photo.path}>
                    <Image src={photo.url} alt="Work portfolio" fill sizes="220px" unoptimized />
                    <button type="button" onClick={() => removeWorkPhoto(photo)} aria-label="Remove work photo">
                      <Trash2 />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {message && <div className={styles.message}>{message}</div>}

          <div className={styles.actions}>
            <Link href="/account">Cancel</Link>
            <button type="submit" disabled={saving || uploading}>
              {saving ? <LoaderCircle className={styles.spin} /> : <Save />}
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function phoneOrEmpty(value: string) {
  return value ?? "";
}
