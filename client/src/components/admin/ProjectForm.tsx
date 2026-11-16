"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/adminApi";
import { ApiError } from "@/lib/api";
import type { Project } from "@/types";

type Errors = Record<string, string>;

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 disabled:bg-gray-50";

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : (
        hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>
      )}
    </div>
  );
}

export default function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const [values, setValues] = useState({
    title: project?.title ?? "",
    slug: project?.slug ?? "",
    description: project?.description ?? "",
    thumbnail: project?.thumbnail ?? "",
    techStack: project?.techStack.join(", ") ?? "",
    githubUrl: project?.githubUrl ?? "",
    liveUrl: project?.liveUrl ?? "",
    featured: project?.featured ?? false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);

    const techStack = values.techStack
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const clientErrors: Errors = {};
    if (values.title.trim().length < 3)
      clientErrors.title = "Judul minimal 3 karakter";
    if (values.description.trim().length < 10)
      clientErrors.description = "Deskripsi minimal 10 karakter";
    if (techStack.length === 0) clientErrors.techStack = "Minimal 1 teknologi";
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) return;

    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      techStack,
      thumbnail: values.thumbnail.trim() || null,
      githubUrl: values.githubUrl.trim() || null,
      liveUrl: values.liveUrl.trim() || null,
      featured: values.featured,
      // slug kosong dikirim sebagai "tidak ada": otomatis dibuat dari judul (tambah)
      // atau tetap memakai slug lama (edit)
      ...(values.slug.trim() ? { slug: values.slug.trim() } : {}),
    };

    const url = project ? `/api/projects/${project.id}` : "/api/projects";
    const method = project ? "PUT" : "POST";

    setSaving(true);
    try {
      await adminApi(url, { method, body: JSON.stringify(payload) });
      router.push("/admin/projects");
    } catch (err) {
      if (err instanceof ApiError && err.status === 400 && err.errors) {
        const fieldErrors: Errors = {};
        for (const [key, messages] of Object.entries(err.errors)) {
          if (messages[0]) fieldErrors[key] = messages[0];
        }
        setErrors(fieldErrors);
      } else if (err instanceof ApiError) {
        setServerError(err.message); // termasuk 409: slug sudah dipakai
      } else {
        setServerError("Tidak dapat terhubung ke server");
      }
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-2xl space-y-5">
      {serverError && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-4 text-sm text-red-700"
        >
          {serverError}
        </p>
      )}

      <Field id="title" label="Judul" error={errors.title}>
        <input
          id="title"
          name="title"
          maxLength={100}
          value={values.title}
          onChange={handleChange}
          disabled={saving}
          className={inputClass}
        />
      </Field>

      <Field
        id="slug"
        label="Slug (opsional)"
        error={errors.slug}
        hint="Huruf kecil, angka, dan tanda -. Kosongkan untuk dibuat otomatis dari judul."
      >
        <input
          id="slug"
          name="slug"
          value={values.slug}
          onChange={handleChange}
          disabled={saving}
          className={inputClass}
        />
      </Field>

      <Field id="description" label="Deskripsi" error={errors.description}>
        <textarea
          id="description"
          name="description"
          rows={4}
          maxLength={1000}
          value={values.description}
          onChange={handleChange}
          disabled={saving}
          className={inputClass}
        />
      </Field>

      <Field
        id="techStack"
        label="Teknologi"
        error={errors.techStack}
        hint="Pisahkan dengan koma, misal: React, Node.js, PostgreSQL"
      >
        <input
          id="techStack"
          name="techStack"
          value={values.techStack}
          onChange={handleChange}
          disabled={saving}
          className={inputClass}
        />
      </Field>

      <Field
        id="thumbnail"
        label="URL Thumbnail (opsional)"
        error={errors.thumbnail}
        hint="Link gambar yang bisa dibuka publik. Upload gambar bisa jadi tantangan tambahan nanti."
      >
        <input
          id="thumbnail"
          name="thumbnail"
          type="url"
          value={values.thumbnail}
          onChange={handleChange}
          disabled={saving}
          className={inputClass}
        />
      </Field>

      <Field
        id="githubUrl"
        label="Link GitHub (opsional)"
        error={errors.githubUrl}
      >
        <input
          id="githubUrl"
          name="githubUrl"
          type="url"
          value={values.githubUrl}
          onChange={handleChange}
          disabled={saving}
          className={inputClass}
        />
      </Field>

      <Field
        id="liveUrl"
        label="Link Live Demo (opsional)"
        error={errors.liveUrl}
      >
        <input
          id="liveUrl"
          name="liveUrl"
          type="url"
          value={values.liveUrl}
          onChange={handleChange}
          disabled={saving}
          className={inputClass}
        />
      </Field>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={values.featured}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, featured: e.target.checked }))
          }
          disabled={saving}
        />
        Tampilkan sebagai project unggulan (muncul paling awal)
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving
            ? "Menyimpan..."
            : project
              ? "Simpan Perubahan"
              : "Tambah Project"}
        </button>
        <Link
          href="/admin/projects"
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium transition hover:bg-gray-100"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
