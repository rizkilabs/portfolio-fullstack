import { Suspense } from "react";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Section from "@/components/Section";
import Projects from "@/components/Projects";
import ProjectsSkeleton from "@/components/ProjectsSkeleton";
import CategoryTabs from "@/components/CategoryTabs";
import Contact from "@/components/Contact";
import { CATEGORIES } from "@/lib/projects";
import { profile } from "@/data/profile";
import { siteUrl } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  url: siteUrl,
  sameAs: [profile.github],
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string | string[];
    page?: string | string[];
  }>;
}) {
  const sp = await searchParams;

  const categoryParam = typeof sp.category === "string" ? sp.category : "";
  const active =
    CATEGORIES.find((c) => c.slug === categoryParam) ?? CATEGORIES[0];

  const pageParam = typeof sp.page === "string" ? sp.page : "1";
  const page = Math.max(1, Number.parseInt(pageParam, 10) || 1);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <Hero />
      <About />
      <Skills />

      <Section id="projects" title="Projects">
        <CategoryTabs active={active.slug} />
        <Suspense
          key={`${active.slug}-${page}`}
          fallback={<ProjectsSkeleton />}
        >
          <Projects category={active.slug} page={page} />
        </Suspense>
      </Section>

      <Contact />
    </main>
  );
}
