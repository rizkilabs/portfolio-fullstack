import { connection } from "next/server";
import { api } from "@/lib/api";
import type { ApiResponse, Project } from "@/types";
import ProjectCard from "./ProjectCard";

export default async function Projects() {
  await connection();

  let projects: Project[];

  try {
    const res = await api<ApiResponse<Project[]>>("/api/projects");
    projects = res.data;
  } catch (err) {
    console.error("Gagal memuat project:", err);
    return (
      <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
        The project couldn't be loaded at this time. Please try again later.
      </p>
    );
  }

  if (projects.length === 0) {
    return <p className="text-gray-500">Belum ada project yang ditampilkan.</p>;
  }

  const sorted = [...projects].sort(
    (a, b) => Number(b.featured) - Number(a.featured),
  );

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {sorted.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
