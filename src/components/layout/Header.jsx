import { Menu, X } from "lucide-react";
import { useState } from "react";
import { navItems } from "../../data/navigation";
import { ThemeSwitch } from "./ThemeSwitch";

export function Header({ activeSection, theme, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const logo =
    theme === "dark"
      ? "/assets/wintex-logo-navbar.png"
      : "/assets/wintex-logo-transparent.png";

  return (
    <header className="site-header">
      <a
        className="brand"
        href="#top"
        aria-label="Wintex Scales home"
        onClick={() => setMenuOpen(false)}
      >
        <img src={logo} alt="Wintex Scales" />
      </a>
      <nav
        className={menuOpen ? "nav nav-open" : "nav"}
        aria-label="Primary navigation"
      >
        {navItems.map((item) => (
          <a
            key={item.href}
            className={activeSection === item.href.slice(1) ? "active" : ""}
            href={item.href}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <ThemeSwitch theme={theme} onToggle={onToggleTheme} />
      <button
        className="icon-button menu-button"
        aria-label="Toggle menu"
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
    </header>
  );
}

