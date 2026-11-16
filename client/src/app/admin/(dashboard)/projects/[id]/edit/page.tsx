"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import { api, ApiError } from "@/lib/api";
import type { ApiResponse, Project } from "@/types";

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    api<ApiResponse<Project>>(`/api/projects/${id}`)
      .then((res) => {
        if (!ignore) setProject(res.data);
      })
      .catch((err) => {
        if (ignore) return;
        setError(
          err instanceof ApiError && err.status === 404
            ? "Project tidak ditemukan"
            : "Gagal memuat project",
        );
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Edit Project</h1>
      {error && (
        <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>
      )}
      {!project && !error && <p className="text-sm text-gray-500">Memuat...</p>}
      {project && <ProjectForm project={project} />}
    </div>
  );
}
