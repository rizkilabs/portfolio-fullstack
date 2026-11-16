"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { applyStoredTheme } from "@/lib/theme";

// Memasang ulang class "dark" setelah hydration dan setiap pindah halaman
export default function ThemeSync() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    applyStoredTheme();
  }, [pathname]);

  return null;
}
