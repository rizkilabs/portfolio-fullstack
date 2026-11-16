export function applyStoredTheme() {
  let stored: string | null = null;
  try {
    stored = localStorage.getItem("theme");
  } catch {
    // abaikan jika storage diblokir
  }

  const dark = stored
    ? stored === "dark"
    : window.matchMedia("(prefers-color-scheme: dark)").matches;

  document.documentElement.classList.toggle("dark", dark);
  // kabari ThemeToggle supaya ikonnya ikut sinkron
  window.dispatchEvent(new Event("themechange"));
}
