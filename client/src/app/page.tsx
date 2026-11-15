import { Suspense } from "react";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Section from "@/components/Section";
import Projects from "@/components/Projects";
import ProjectsSkeleton from "@/components/ProjectsSkeleton";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />

      <Section id="projects" title="Projects">
        <Suspense fallback={<ProjectsSkeleton />}>
          <Projects />
        </Suspense>
      </Section>

      {/* Placeholder: diisi di tahap 9 */}
      <Section id="contact" title="Contact">
        <p className="text-gray-500">Segera hadir (tahap 9).</p>
      </Section>
    </main>
  );
}
