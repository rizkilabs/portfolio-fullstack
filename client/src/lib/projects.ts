import type { ProjectCategory } from "@/types";

export const PROJECTS_PER_PAGE = 6;

export const CATEGORY_LABEL: Record<ProjectCategory, string> = {
  FRONTEND: "Frontend",
  BACKEND: "Backend",
  DATABASE: "Database",
  FULLSTACK: "Full Stack",
};

// slug dipakai di URL, api dipakai saat memanggil backend
export const CATEGORIES: {
  slug: string;
  label: string;
  api: ProjectCategory | null;
}[] = [
  { slug: "all", label: "Semua", api: null },
  { slug: "frontend", label: "Frontend", api: "FRONTEND" },
  { slug: "backend", label: "Backend", api: "BACKEND" },
  { slug: "database", label: "Database", api: "DATABASE" },
  { slug: "fullstack", label: "Full Stack", api: "FULLSTACK" },
];

export function projectsHref(slug: string, page = 1) {
  const params = new URLSearchParams();
  if (slug !== "all") params.set("category", slug);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return `/${query ? `?${query}` : ""}#projects`;
}
