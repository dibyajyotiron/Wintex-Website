import { Menu, X } from "lucide-react";
import { useState } from "react";
import { OptimizedImage } from "../common/OptimizedImage";
import { navItems } from "../../data/navigation";
import { ThemeSwitch } from "./ThemeSwitch";

export function Header({ activeSection, theme, onToggleTheme, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const logo =
    theme === "dark"
      ? "/assets/wintex-logo-navbar.png"
      : "/assets/wintex-logo-transparent.png";
  const logoDimensions =
    theme === "dark" ? { width: 977, height: 176 } : { width: 977, height: 243 };

  return (
    <header className="site-header">
      <a
        className="brand"
        href="#top"
        aria-label="Wintex Scales home"
        onClick={(event) => {
          event.preventDefault();
          setMenuOpen(false);
          onNavigate("top");
        }}
      >
        <OptimizedImage
          src={logo}
          alt="Wintex Scales"
          width={logoDimensions.width}
          height={logoDimensions.height}
          widths={[180, 360, 720]}
          sizes="232px"
          loading="eager"
          fetchPriority="high"
        />
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
            onClick={(event) => {
              event.preventDefault();
              setMenuOpen(false);
              onNavigate(item.href.slice(1));
            }}
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
