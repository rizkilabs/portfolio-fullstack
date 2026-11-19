"use client";

import { useState } from "react";
import { api, ApiError } from "@/lib/api";

type FieldName = "name" | "email" | "subject" | "message";

interface FormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string; // honeypot: tidak boleh diisi manusia
}

type Errors = Partial<Record<FieldName, string>>;
type Status = "idle" | "submitting" | "success" | "error";

const initialValues: FormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
};

const MESSAGE_MAX = 2000;

// Aturan sama dengan validasi di backend (tahap 5)
function validate(values: FormValues): Errors {
  const errors: Errors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const subject = values.subject.trim();
  const message = values.message.trim();

  if (name.length < 2) errors.name = "Nama minimal 2 karakter";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Email tidak valid";
  if (subject.length < 3) errors.subject = "Subject minimal 3 karakter";
  if (message.length < 10) errors.message = "Pesan minimal 10 karakter";

  return errors;
}

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 disabled:bg-gray-50";

export default function ContactForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const submitting = status === "submitting";

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    // hapus pesan error field yang sedang diketik
    if (name in errors) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (status === "success") setStatus("idle");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const clientErrors = validate(values);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) return;

    setStatus("submitting");
    setServerError(null);

    try {
      await api("/api/messages", {
        method: "POST",
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          subject: values.subject.trim(),
          message: values.message.trim(),
          website: values.website,
        }),
      });

      setValues(initialValues);
      setStatus("success");
    } catch (err) {
      if (err instanceof ApiError) {
        // 400: tampilkan error per field dari backend
        if (err.status === 400 && err.errors) {
          const fieldErrors: Errors = {};
          for (const key of ["name", "email", "subject", "message"] as const) {
            const first = err.errors[key]?.[0];
            if (first) fieldErrors[key] = first;
          }
          setErrors(fieldErrors);
          setStatus("idle");
          return;
        }
        // 429, 500, dan lainnya: pesan dari server
        setServerError(err.message);
      } else {
        setServerError(
          "Tidak dapat terhubung ke server. Periksa koneksi internet kamu.",
        );
      }
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {status === "success" && (
        <p
          role="status"
          className="rounded-lg bg-green-50 p-4 text-sm text-green-700"
        >
          Terima kasih! Pesanmu sudah terkirim, saya akan membalas secepatnya.
        </p>
      )}
      {status === "error" && serverError && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-4 text-sm text-red-700"
        >
          {serverError}
        </p>
      )}

      <div>
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          maxLength={100}
          value={values.name}
          onChange={handleChange}
          disabled={submitting}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={inputClass}
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-xs text-red-600">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={150}
          value={values.email}
          onChange={handleChange}
          disabled={submitting}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={inputClass}
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-xs text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="subject" className="text-sm font-medium">
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          maxLength={150}
          value={values.subject}
          onChange={handleChange}
          disabled={submitting}
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? "subject-error" : undefined}
          className={inputClass}
        />
        {errors.subject && (
          <p id="subject-error" className="mt-1 text-xs text-red-600">
            {errors.subject}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          maxLength={MESSAGE_MAX}
          value={values.message}
          onChange={handleChange}
          disabled={submitting}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={inputClass}
        />
        <div className="mt-1 flex justify-between text-xs">
          {errors.message ? (
            <p id="message-error" className="text-red-600">
              {errors.message}
            </p>
          ) : (
            <span />
          )}
          <span className="text-gray-500">
            {values.message.length}/{MESSAGE_MAX}
          </span>
        </div>
      </div>

      {/* Honeypot: disembunyikan dari pengunjung, bot biasanya mengisinya */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Mengirim..." : "Send a Message"}
      </button>
    </form>
  );
}
