"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminApi } from "@/lib/adminApi";
import type { ApiResponse, Project } from "@/types";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    let ignore = false;

    adminApi<ApiResponse<Project[]>>("/api/projects")
      .then((res) => {
        if (!ignore) {
          setProjects(res.data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!ignore)
          setError(err instanceof Error ? err.message : "Gagal memuat project");
      });

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  async function handleDelete(project: Project) {
    if (
      !window.confirm(
        `Hapus project "${project.title}"? Tindakan ini tidak bisa dibatalkan.`,
      )
    ) {
      return;
    }

    setDeletingId(project.id);
    try {
      await adminApi(`/api/projects/${project.id}`, { method: "DELETE" });
      setReloadKey((k) => k + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus project");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          + Tambah Project
        </Link>
      </div>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}
      {!projects && !error && (
        <p className="mt-6 text-sm text-gray-500">Memuat...</p>
      )}

      {projects && projects.length === 0 && (
        <p className="mt-6 text-sm text-gray-500">Belum ada project.</p>
      )}

      {projects && projects.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Judul</th>
                <th className="px-4 py-3">Teknologi</th>
                <th className="px-4 py-3">Unggulan</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projects.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-medium">{p.title}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {p.techStack.join(", ")}
                  </td>
                  <td className="px-4 py-3">{p.featured ? "Ya" : "-"}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <Link
                      href={`/admin/projects/${p.id}/edit`}
                      className="mr-4 text-indigo-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p)}
                      disabled={deletingId === p.id}
                      className="text-red-600 hover:underline disabled:opacity-50"
                    >
                      {deletingId === p.id ? "Menghapus..." : "Hapus"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
