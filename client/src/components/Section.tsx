import Reveal from "./Reveal";

export default function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-16 border-t border-gray-100 py-20">
      <Reveal>
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-10 text-3xl font-bold">{title}</h2>
          {children}
        </div>
      </Reveal>
    </section>
  );
}
