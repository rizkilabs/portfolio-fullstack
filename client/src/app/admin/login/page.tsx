"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { setToken } from "@/lib/auth";
import type { Admin, ApiResponse } from "@/types";

interface LoginData {
  token: string;
  admin: Admin;
}

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 disabled:bg-gray-50";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api<ApiResponse<LoginData>>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password }),
      });
      setToken(res.data.token);
      router.replace("/admin");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.status === 400 ? "Format email tidak valid" : err.message);
      } else {
        setError("Tidak dapat terhubung ke server");
      }
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-5 rounded-xl border border-gray-200 bg-surface p-8 shadow-sm"
      >
        <div>
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="mt-1 text-sm text-gray-600">
            Masuk untuk mengelola portfolio.
          </p>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <div>
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Masuk..." : "Masuk"}
        </button>
      </form>
    </main>
  );
}
