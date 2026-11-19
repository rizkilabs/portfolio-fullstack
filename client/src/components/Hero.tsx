import Image from "next/image";
import { profile } from "@/data/profile";

export default function Hero() {
  return (
    <section
      id="home"
      className="mx-auto flex max-w-5xl flex-col-reverse items-center gap-10 px-4 py-16 md:flex-row md:justify-between md:py-28"
    >
      <div className="text-center md:text-left">
        <p className="text-sm font-medium text-indigo-600">Hi, I'm</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
          {profile.name}
        </h1>
        <p className="mt-3 text-xl text-gray-600">{profile.title}</p>
        <p className="mt-5 max-w-xl text-gray-600">{profile.summary}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
          <a
            href={profile.cv}
            download
            className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Download CV
          </a>
          <a
            href="#contact"
            className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold transition hover:border-indigo-600 hover:text-indigo-600"
          >
            Contact Me
          </a>
        </div>
      </div>

      <Image
        src={profile.photo}
        alt={`Foto ${profile.name}`}
        width={320}
        height={320}
        priority
        className="h-56 w-56 rounded-full object-cover shadow-lg ring-4 ring-indigo-100 sm:h-72 sm:w-72"
      />
    </section>
  );
}
