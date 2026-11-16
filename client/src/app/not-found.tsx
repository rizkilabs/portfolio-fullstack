import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium text-indigo-600">404</p>
      <h1 className="mt-2 text-3xl font-bold">Halaman tidak ditemukan</h1>
      <p className="mt-3 max-w-md text-sm text-gray-600">
        Alamat yang kamu buka tidak ada atau sudah dipindahkan.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        Kembali ke beranda
      </Link>
    </main>
  );
}
