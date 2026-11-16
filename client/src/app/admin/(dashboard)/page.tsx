"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminApi } from "@/lib/adminApi";
import type { ApiResponse, Message, PaginatedResponse, Project } from "@/types";

interface Stats {
  projects: number;
  unread: number;
  totalMessages: number;
  recent: Message[];
}

function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-gray-200 bg-surface p-5 shadow-sm transition hover:shadow-md"
    >
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </Link>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    Promise.all([
      adminApi<ApiResponse<Project[]>>("/api/projects"),
      adminApi<PaginatedResponse<Message>>(
        "/api/messages?isRead=false&limit=1",
      ),
      adminApi<PaginatedResponse<Message>>("/api/messages?limit=5"),
    ])
      .then(([projects, unread, all]) => {
        if (ignore) return;
        setStats({
          projects: projects.data.length,
          unread: unread.meta.total,
          totalMessages: all.meta.total,
          recent: all.data,
        });
      })
      .catch((err) => {
        if (!ignore)
          setError(err instanceof Error ? err.message : "Gagal memuat data");
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-600">Ringkasan portfolio kamu.</p>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}
      {!stats && !error && (
        <p className="mt-6 text-sm text-gray-500">Memuat...</p>
      )}

      {stats && (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Total Project"
              value={stats.projects}
              href="/admin/projects"
            />
            <StatCard
              label="Pesan Belum Dibaca"
              value={stats.unread}
              href="/admin/messages"
            />
            <StatCard
              label="Total Pesan"
              value={stats.totalMessages}
              href="/admin/messages"
            />
          </div>

          <h2 className="mb-3 mt-10 text-lg font-semibold">Pesan Terbaru</h2>
          {stats.recent.length === 0 ? (
            <p className="text-sm text-gray-500">Belum ada pesan masuk.</p>
          ) : (
            <ul className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-surface">
              {stats.recent.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between gap-4 p-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {!m.isRead && (
                        <span className="mr-2 inline-block h-2 w-2 rounded-full bg-indigo-600" />
                      )}
                      {m.subject}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {m.name} · {m.email}
                    </p>
                  </div>
                  <Link
                    href="/admin/messages"
                    className="shrink-0 text-sm text-indigo-600 hover:underline"
                  >
                    Buka
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
