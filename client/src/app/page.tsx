import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Section from "@/components/Section";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />

      {/* Placeholder: diisi di tahap 8 dan 9 */}
      <Section id="projects" title="Projects">
        <p className="text-gray-500">Segera hadir (tahap 8).</p>
      </Section>
      <Section id="contact" title="Contact">
        <p className="text-gray-500">Segera hadir (tahap 9).</p>
      </Section>
    </main>
  );
}
