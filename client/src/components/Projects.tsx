import { redirect } from "next/navigation";
import { api } from "@/lib/api";
import { CATEGORIES, PROJECTS_PER_PAGE, projectsHref } from "@/lib/projects";
import type { PaginatedResponse, Project } from "@/types";
import ProjectCard from "./ProjectCard";
import ProjectsPagination from "./ProjectsPagination";

export default async function Projects({
  category,
  page,
}: {
  category: string;
  page: number;
}) {
  const active = CATEGORIES.find((c) => c.slug === category) ?? CATEGORIES[0];

  const query = new URLSearchParams({
    page: String(page),
    limit: String(PROJECTS_PER_PAGE),
  });
  if (active.api) query.set("category", active.api);

  let result: PaginatedResponse<Project>;
  try {
    result = await api<PaginatedResponse<Project>>(`/api/projects?${query}`);
    if (!result.meta) throw new Error("API belum mendukung pagination");
  } catch (err) {
    console.error("Gagal memuat project:", err);
    return (
      <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
        Project belum bisa dimuat saat ini. Silakan coba lagi nanti.
      </p>
    );
  }

  const { data: projects, meta } = result;

  // halaman di luar jangkauan (misal /?page=99): arahkan ke halaman terakhir
  if (meta.totalPages > 0 && page > meta.totalPages) {
    redirect(projectsHref(active.slug, meta.totalPages));
  }

  if (projects.length === 0) {
    return (
      <p className="text-gray-500">
        {active.api
          ? `Belum ada project di kategori ${active.label}.`
          : "Belum ada project yang ditampilkan."}
      </p>
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      <ProjectsPagination
        slug={active.slug}
        page={meta.page}
        totalPages={meta.totalPages}
      />
    </>
  );
}
