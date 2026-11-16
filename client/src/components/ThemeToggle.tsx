"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("themechange", callback);
  return () => window.removeEventListener("themechange", callback);
}

const getSnapshot = () => document.documentElement.classList.contains("dark");
const getServerSnapshot = () => false;

export default function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // abaikan jika storage diblokir
    }
    window.dispatchEvent(new Event("themechange"));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
      className="rounded-lg p-2 text-lg leading-none transition hover:bg-gray-100"
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
