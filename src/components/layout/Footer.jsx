import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

export function Footer({ theme, onComingSoon }) {
  const logo =
    theme === "dark"
      ? "/assets/wintex-logo-navbar.png"
      : "/assets/wintex-logo-transparent.png";

  return (
    <footer className="footer">
      <img src={logo} alt="Wintex Scales" />
      <div className="social-row" aria-label="Social channels">
        <button
          type="button"
          aria-label="Facebook coming soon"
          onClick={() => onComingSoon("Facebook")}
        >
          <FaFacebookF />
        </button>
        <button
          type="button"
          aria-label="Instagram coming soon"
          onClick={() => onComingSoon("Instagram")}
        >
          <FaInstagram />
        </button>
        <button
          type="button"
          aria-label="YouTube coming soon"
          onClick={() => onComingSoon("YouTube")}
        >
          <FaYoutube />
        </button>
      </div>
    </footer>
  );
}

