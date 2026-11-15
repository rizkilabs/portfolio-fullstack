import { Suspense } from "react";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Section from "@/components/Section";
import Projects from "@/components/Projects";
import ProjectsSkeleton from "@/components/ProjectsSkeleton";
import Contact from "@/components/Contact";

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

      <Section id="contact" title="Contact">
        <Contact />{" "}
      </Section>
    </main>
  );
}
