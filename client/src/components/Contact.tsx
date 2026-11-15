import Section from "./Section";
import ContactForm from "./ContactForm";
import { profile } from "@/data/profile";

export default function Contact() {
  return (
    <Section id="contact" title="Contact">
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <h3 className="text-lg font-semibold">Mari ngobrol</h3>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            Punya pertanyaan, tawaran kerja sama, atau sekadar ingin berkenalan?
            Kirim pesan lewat form ini atau hubungi saya langsung.
          </p>

          <ul className="mt-6 space-y-3 text-sm">
            <li>
              <span className="text-gray-500">Email: </span>
              <a
                href={`mailto:${profile.email}`}
                className="text-indigo-600 hover:underline"
              >
                {profile.email}
              </a>
            </li>
            <li>
              <span className="text-gray-500">GitHub: </span>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                {profile.github.replace("https://", "")}
              </a>
            </li>
          </ul>
        </div>

        <ContactForm />
      </div>
    </Section>
  );
}
