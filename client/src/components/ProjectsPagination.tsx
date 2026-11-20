import Link from "next/link";
import { projectsHref } from "@/lib/projects";

function getPages(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("...");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("...");
  pages.push(total);

  return pages;
}

const base = "rounded-lg border px-3 py-2 text-sm transition";
const idle =
  "border-gray-300 text-gray-600 hover:border-indigo-600 hover:text-indigo-600";
const disabled = "cursor-not-allowed border-gray-200 text-gray-400";

export default function ProjectsPagination({
  slug,
  page,
  totalPages,
}: {
  slug: string;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Halaman project"
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      {page > 1 ? (
        <Link href={projectsHref(slug, page - 1)} className={`${base} ${idle}`}>
          Sebelumnya
        </Link>
      ) : (
        <span className={`${base} ${disabled}`}>Sebelumnya</span>
      )}

      {getPages(page, totalPages).map((p, i) =>
        p === "..." ? (
          <span key={`gap-${i}`} className="px-1 text-gray-500">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={projectsHref(slug, p)}
            aria-current={p === page ? "page" : undefined}
            className={`${base} ${
              p === page ? "border-indigo-600 bg-indigo-600 text-white" : idle
            }`}
          >
            {p}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link href={projectsHref(slug, page + 1)} className={`${base} ${idle}`}>
          Berikutnya
        </Link>
      ) : (
        <span className={`${base} ${disabled}`}>Berikutnya</span>
      )}
    </nav>
  );
}
