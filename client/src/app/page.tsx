import { Suspense } from "react";
import { api } from "@/lib/api";
import type { ApiResponse, Project } from "@/types";

async function ProjectsStatus() {
  let projects: Project[] = [];
  let error: string | null = null;

  try {
    const res = await api<ApiResponse<Project[]>>("/api/projects");
    projects = res.data;
  } catch (e) {
    error = e instanceof Error ? e.message : "Gagal terhubung ke API";
  }

  return (
    <p className="mt-6 rounded-md bg-gray-100 p-3 text-sm">
      {error
        ? `API error: ${error}`
        : `Terhubung ke API: ${projects.length} project ditemukan`}
    </p>
  );
}

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-4">
      <section id="home" className="py-24">
        <h1 className="text-4xl font-bold">Home</h1>
        <p className="mt-4 text-gray-600">Placeholder Homepage (tahap 7).</p>

        {/* Sementara: cek koneksi frontend ke backend */}
        <Suspense
          fallback={
            <p className="mt-6 rounded-md bg-gray-100 p-3 text-sm">
              Menghubungkan ke API...
            </p>
          }
        >
          <ProjectsStatus />
        </Suspense>
      </section>

      <section id="about" className="scroll-mt-20 py-24">
        <h2 className="text-3xl font-bold">About Me</h2>
      </section>

      <section id="skills" className="scroll-mt-20 py-24">
        <h2 className="text-3xl font-bold">Skills</h2>
      </section>

      <section id="projects" className="scroll-mt-20 py-24">
        <h2 className="text-3xl font-bold">Projects</h2>
      </section>

      <section id="contact" className="scroll-mt-20 py-24">
        <h2 className="text-3xl font-bold">Contact</h2>
      </section>
    </main>
  );
}
