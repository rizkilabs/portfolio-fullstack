import Link from "next/link";
import { CATEGORIES, projectsHref } from "@/lib/projects";

export default function CategoryTabs({ active }: { active: string }) {
  return (
    <nav
      aria-label="Filter kategori project"
      className="mb-8 flex flex-wrap gap-2"
    >
      {CATEGORIES.map((c) => {
        const isActive = c.slug === active;
        return (
          <Link
            key={c.slug}
            href={projectsHref(c.slug)}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              isActive
                ? "bg-indigo-600 text-white"
                : "border border-gray-300 text-gray-600 hover:border-indigo-600 hover:text-indigo-600"
            }`}
          >
            {c.label}
          </Link>
        );
      })}
    </nav>
  );
}
