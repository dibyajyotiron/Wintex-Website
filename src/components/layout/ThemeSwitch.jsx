import { Moon, Sun } from "lucide-react";

export function ThemeSwitch({ theme, onToggle }) {
  return (
    <button
      className="theme-switch"
      type="button"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      aria-pressed={theme === "light"}
      onClick={onToggle}
    >
      <span className={theme === "light" ? "theme-option active" : "theme-option"}>
        <Sun size={15} />
        Light
      </span>
      <span className={theme === "dark" ? "theme-option active" : "theme-option"}>
        <Moon size={15} />
        Dark
      </span>
    </button>
  );
}

