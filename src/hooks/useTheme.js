import { useEffect, useState } from "react";

const storageKey = "wintex-theme";

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem(storageKey);
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
    return "dark";
  });

  useEffect(() => {
    document.documentElement.classList.add("theme-transitioning");
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(storageKey, theme);

    const timeout = window.setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 520);

    return () => window.clearTimeout(timeout);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  return { theme, toggleTheme };
}
