"use client";

import { useEffect, useState } from "react";

const THEME_KEY = "icao_theme";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "dark" || stored === "light") setTheme(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme, hydrated]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return { theme, toggle, hydrated };
}
