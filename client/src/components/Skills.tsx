import Section from "./Section";
import { skills } from "@/data/profile";

export default function Skills() {
  return (
    <Section id="skills" title="Skills">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map((group) => (
          <div
            key={group.category}
            className="rounded-xl border border-gray-200 p-5 shadow-sm"
          >
            <h3 className="mb-4 font-semibold text-indigo-600">
              {group.category}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
