import Section from "./Section";
import {
  biodata,
  education,
  certifications,
  experience,
  careerGoal,
} from "@/data/profile";

export default function About() {
  return (
    <Section id="about" title="About Me">
      <div className="grid gap-12 md:grid-cols-2">
        {/* Biodata */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Biodata</h3>
          <dl className="space-y-2 text-sm">
            {biodata.map((item) => (
              <div key={item.label} className="flex gap-4">
                <dt className="w-24 shrink-0 text-gray-500">{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Tujuan karier */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Tujuan Karier</h3>
          <p className="text-sm leading-relaxed text-gray-600">{careerGoal}</p>
        </div>

        {/* Pendidikan */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Pendidikan</h3>
          <ul className="space-y-4">
            {education.map((item) => (
              <li
                key={item.school}
                className="border-l-2 border-indigo-200 pl-4"
              >
                <p className="font-medium">{item.school}</p>
                <p className="text-sm text-gray-600">{item.detail}</p>
                <p className="text-xs text-gray-500">{item.period}</p>
              </li>
            ))}
          </ul>

          <h3 className="mb-3 mt-8 text-lg font-semibold">
            Sertifikasi dan Pelatihan
          </h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
            {certifications.map((cert) => (
              <li key={cert}>{cert}</li>
            ))}
          </ul>
        </div>

        {/* Pengalaman */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Pengalaman</h3>
          <ul className="space-y-4">
            {experience.map((item) => (
              <li
                key={`${item.company}-${item.period}`}
                className="border-l-2 border-indigo-200 pl-4"
              >
                <p className="font-medium">{item.role}</p>
                <p className="text-sm text-gray-600">{item.company}</p>
                <p className="text-xs text-gray-500">{item.period}</p>
                {item.description && (
                  <p className="mt-1 text-sm text-gray-600">
                    {item.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
