import Link from "next/link";

const links = [
  { href: "/#about", label: "About" },
  { href: "/#skills", label: "Skills" },
  { href: "/#projects", label: "Projects" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-surface/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="font-bold">
          Rizki<span className="text-indigo-600">.dev</span>
        </Link>
        <ul className="flex gap-4 text-sm sm:gap-6">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-gray-600 transition hover:text-indigo-600"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
