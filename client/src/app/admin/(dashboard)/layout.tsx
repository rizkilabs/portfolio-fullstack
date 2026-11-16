"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminApi } from "@/lib/adminApi";
import { ApiError } from "@/lib/api";
import { clearToken, getToken } from "@/lib/auth";
import type { Admin, ApiResponse } from "@/types";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/messages", label: "Messages" },
];

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/admin/login");
      return;
    }

    adminApi<ApiResponse<Admin>>("/api/auth/me")
      .then((res) => setAdmin(res.data))
      .catch((err) => {
        // 401 sudah ditangani adminApi (redirect ke login)
        if (!(err instanceof ApiError && err.status === 401)) {
          setLoadError("Tidak dapat terhubung ke server.");
        }
      });
  }, [router]);

  function handleLogout() {
    clearToken();
    router.replace("/admin/login");
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-sm text-red-700">
        {loadError}
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">
        Memuat...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <aside className="border-b border-gray-200 bg-white md:w-60 md:shrink-0 md:border-b-0 md:border-r">
        <div className="px-4 py-4">
          <p className="font-bold">Admin Panel</p>
          <p className="truncate text-xs text-gray-500">{admin.email}</p>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-2 pb-3 md:flex-col md:pb-6">
          {links.map((link) => {
            const active =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/"
            className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-100"
          >
            Lihat Website
          </Link>
          <button
            onClick={handleLogout}
            className="whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-8">{children}</main>
    </div>
  );
}
