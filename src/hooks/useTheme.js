import { useEffect, useState } from "react";

const storageKey = "wintex-theme";

export function useTheme() {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || "light",
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(storageKey, theme);
  }, [theme]);

  const toggleTheme = () => {
    document.documentElement.classList.add("theme-transitioning");

    setTheme((current) =>
      current === "dark" ? "light" : "dark",
    );

    window.setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 520);
  };

  return { theme, toggleTheme };
}