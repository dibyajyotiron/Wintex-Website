import { FacebookIcon, InstagramIcon, YouTubeIcon } from "../common/BrandIcons";
import { OptimizedImage } from "../common/OptimizedImage";

export function Footer({ theme, onComingSoon }) {
  const logo =
    theme === "dark"
      ? "/assets/wintex-logo-navbar.png"
      : "/assets/wintex-logo-transparent.png";
  const logoDimensions =
    theme === "dark" ? { width: 977, height: 176 } : { width: 977, height: 243 };

  return (
    <footer className="footer">
      <OptimizedImage
        src={logo}
        alt="Wintex Scales"
        width={logoDimensions.width}
        height={logoDimensions.height}
        widths={[180, 360, 720]}
        sizes="226px"
      />
      <div className="social-row" aria-label="Social channels">
        <button
          type="button"
          aria-label="Facebook coming soon"
          onClick={() => onComingSoon("Facebook")}
        >
          <FacebookIcon />
        </button>
        <button
          type="button"
          aria-label="Instagram coming soon"
          onClick={() => onComingSoon("Instagram")}
        >
          <InstagramIcon />
        </button>
        <button
          type="button"
          aria-label="YouTube coming soon"
          onClick={() => onComingSoon("YouTube")}
        >
          <YouTubeIcon />
        </button>
      </div>
    </footer>
  );
}
