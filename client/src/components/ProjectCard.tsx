import Image from "next/image";
import type { Project } from "@/types";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-gray-200 shadow-sm transition hover:shadow-md">
      <div className="relative aspect-[3/2] bg-gray-100">
        {project.thumbnail ? (
          <Image
            src={project.thumbnail}
            alt={`Thumbnail ${project.title}`}
            fill
            unoptimized
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            Tidak ada thumbnail
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold">{project.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">
          {project.description}
        </p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <li
              key={tech}
              className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300"
            >
              {tech}
            </li>
          ))}
        </ul>

        {(project.githubUrl || project.liveUrl) && (
          <div className="mt-5 flex gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition hover:border-indigo-600 hover:text-indigo-600"
              >
                GitHub
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                Live Demo
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
