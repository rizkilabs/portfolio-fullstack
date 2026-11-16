"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold">Terjadi kesalahan</h1>
      <p className="mt-3 max-w-md text-sm text-gray-600">
        Halaman ini gagal dimuat. Silakan coba lagi, atau kembali ke beranda.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Coba lagi
        </button>
        <Link
          href="/"
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium transition hover:bg-gray-100"
        >
          Beranda
        </Link>
      </div>
    </main>
  );
}
