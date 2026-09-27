import { useEffect, useState } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { MotionConfig, motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  Download,
  Check,
  Plus,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Gauge,
  SlidersHorizontal,
  Wrench,
} from "lucide-react";
import { Button, ButtonLink } from "./components/motion/button/base";
import { AnimatedNumber } from "./components/motion/animated-number";
import {
  WhatsAppIcon,
  FacebookIcon,
  InstagramIcon,
  YouTubeIcon,
  XIcon,
} from "./components/common/BrandIcons";
import { ThemeToggle } from "./components/motion/theme-toggle";
import { OptimizedImage } from "./components/common/OptimizedImage";
import { products } from "./data/products.js";
import {
  proofPoints,
  clientLogos,
  services,
  companyHighlights,
  branchLocations,
} from "./data/siteContent";
import {
  address,
  contactEmail,
  phoneNumbers,
  whatsappNumber,
  cataloguePath,
  mapUrl,
} from "./config/site";
import { NETLIFY_FORMS, submitNetlifyForm } from "./utils/netlifyForms";
import { useSeoMeta } from "./hooks/useSeoMeta";
import { enquiryLinks, handoffEnquiry } from "./utils/enquiry.js";
import {
  handleSectionClick,
  sectionTarget,
  normalizedPage,
} from "./utils/navigation.js";
import "./App.css";

const productUrl = (product) => `/products/${product.slug}`;
const quoteUrl = (product) =>
  `/enquiry${product ? `?product=${encodeURIComponent(product.slug)}` : ""}`;
const groups = [
  "All products",
  "Weighbridges",
  "Industrial & retail",
  "Precision",
  "Components & electronics",
];
const groupFor = (product) =>
  /weighbridges|unmanned/.test(product.slug)
    ? groups[1]
    : /jewellery|micro-mini/.test(product.slug)
      ? groups[3]
      : /indicator|protection|load-cells/.test(product.slug)
        ? groups[4]
        : groups[2];

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

function Reveal({ children, className = "" }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 1, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.55 }}
    >
      {children}
    </motion.div>
  );
}

function Action({ children, href, secondary = false, ...props }) {
  return (
    <ButtonLink
      href={href}
      className={`v2-button${secondary ? " v2-button-secondary" : ""}`}
      {...props}
    >
      {children}
    </ButtonLink>
  );
}

function ProductImage({ product, eager = false }) {
  return (
    <OptimizedImage
      src={product.image}
      alt={product.name}
      width={product.imageWidth}
      height={product.imageHeight}
      widths={[360, 640, 960, 1280]}
      sizes="(max-width: 700px) 90vw, 45vw"
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
    />
  );
}

function TextSizeControl() {
  const [size, setSize] = useState("standard");
  const mounted = useMounted();
  useEffect(() => {
    try {
      const saved = localStorage.getItem("wintex-text-size");
      if (["standard", "large", "largest"].includes(saved)) setSize(saved);
    } catch {}
  }, []);
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.style.setProperty(
      "--v2-text-scale",
      { standard: "1", large: "1.125", largest: "1.25" }[size],
    );
    try {
      localStorage.setItem("wintex-text-size", size);
    } catch {}
  }, [size, mounted]);
  return (
    <details
      className="v2-text-settings"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.currentTarget.open = false;
          event.currentTarget.querySelector("summary").focus();
        }
      }}
    >
      <summary aria-label="Text size settings" title="Adjust text size">
        Aa
      </summary>
      <div className="v2-text-panel">
        <strong>Text size</strong>
        <p>Choose a comfortable reading size.</p>
        <div role="group" aria-label="Reading size">
          {[
            ["standard", "Standard"],
            ["large", "Larger"],
            ["largest", "Largest"],
          ].map(([value, label]) => (
            <Button
              key={value}
              className="v2-size-option"
              aria-pressed={size === value}
              onClick={(event) => {
                setSize(value);
                const control = event.currentTarget.closest("details");
                control.open = false;
                control.querySelector("summary").focus();
              }}
            >
              {label}
              {size === value && <Check size={15} />}
            </Button>
          ))}
        </div>
      </div>
    </details>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();
  useEffect(() => {
    const close = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return (
    <header className="v2-header">
      <a href="/" className="v2-brand" aria-label="Wintex Scales home">
        <OptimizedImage
          src={
            mounted && resolvedTheme === "dark"
              ? "/assets/wintex-logo-dark.png"
              : "/assets/wintex-logo-transparent.png"
          }
          alt="Wintex — Precision you can trust"
          width={977}
          height={243}
          widths={[180, 360, 720]}
          sizes="176px"
          loading="eager"
        />
      </a>
      <nav
        id="v2-navigation"
        className={open ? "v2-nav is-open" : "v2-nav"}
        aria-label="Main navigation"
      >
        {[
          ["Home", "top"],
          ["Clients", "clients"],
          ["About", "about"],
          ["Products", "products"],
          ["Automation", "automation"],
          ["Services", "expertise"],
          ["Contact", "enquiry"],
        ].map(([label, id]) => (
          <a key={id} href={`/#${id}`} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
        <a className="v2-mobile-contact" href="/#enquiry">
          Get in touch <ArrowUpRight size={16} />
        </a>
      </nav>
      <div className="v2-header-actions">
        <TextSizeControl />
        <ThemeToggle
          className="v2-icon-button"
          iconClassName="v2-theme-icon"
          variant="circle"
          start="top-right"
        />
        <Action href="/#enquiry">
          Let’s talk <ArrowUpRight size={16} />
        </Action>
        <button
          className="v2-icon-button v2-menu"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-controls="v2-navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}

function ProductCard({ product }) {
  return (
    <a className="v2-product-card" href={productUrl(product)}>
      <div className="v2-product-image">
        <ProductImage product={product} />
        <span className="v2-round-arrow">
          <ArrowUpRight size={22} />
        </span>
      </div>
      <div className="v2-product-caption">
        <p className="v2-eyebrow">{product.category}</p>
        <h3>{product.name}</h3>
        <span>
          Explore specifications <ArrowRight size={16} />
        </span>
      </div>
    </a>
  );
}

function Catalogue() {
  const [group, setGroup] = useState(groups[0]);
  const shown = products.filter(
    (product) => group === groups[0] || groupFor(product) === group,
  );
  return (
    <section className="v2-section" id="products">
      <Reveal className="v2-section-heading">
        <div>
          <p className="v2-eyebrow">Our product range</p>
          <h2>
            Weighing systems.
            <br />
            <span className="v2-muted">For every operation.</span>
          </h2>
        </div>
        <p>
          From a fraction of a gram to a fully loaded truck. Purpose-built
          weighing systems for the way you work.
        </p>
      </Reveal>
      <div className="v2-filters" role="group" aria-label="Filter products">
        {groups.map((item) => (
          <Button
            key={item}
            aria-pressed={group === item}
            onClick={() => setGroup(item)}
            className={`v2-filter ${group === item ? "is-active" : ""}`}
          >
            {item}
          </Button>
        ))}
      </div>
      <p className="v2-sr-only" aria-live="polite">
        {shown.length} products shown
      </p>
      <div className="v2-product-grid">
        {shown.map((product) => (
          <Reveal key={product.slug}>
            <ProductCard product={product} index={products.indexOf(product)} />
          </Reveal>
        ))}
      </div>
      <div className="v2-catalogue-footer">
        <p>One range. Countless applications.</p>
        <a href={cataloguePath} download>
          Download the complete catalogue <Download size={18} />
        </a>
      </div>
    </section>
  );
}

function Home() {
  const icons = [SlidersHorizontal, Gauge, Wrench];
  return (
    <>
      <section className="v2-hero">
        <div className="v2-hero-copy">
          <p className="v2-eyebrow">
            <span className="v2-status-dot" /> Precision engineered. Since 1994.
          </p>
          <h1>
            <span className="block">Precision.</span>
            <span className="block">At every scale.</span>
          </h1>
          <p className="v2-hero-description">
            Industrial weighbridges. Commercial scales.
            <br />
            Engineered, installed, and supported by weighing specialists since
            1994.
          </p>
          <div className="v2-actions">
            <Action href="#products">
              Explore our products <ArrowUpRight size={18} />
            </Action>
            <a className="v2-text-link" href={cataloguePath} download>
              View catalogue <Download size={17} />
            </a>
          </div>
          <div className="v2-hero-note">
            <span className="v2-note-line" />
            <span>
              ENGINEERED IN INDIA.
              <br />
              TRUSTED ACROSS INDUSTRIES.
            </span>
          </div>
        </div>
        <div className="v2-hero-visual">
          <OptimizedImage
            src="/assets/hero-weighbridge-shared.jpeg"
            alt="Wintex weighbridge supporting a concrete mixer truck at an industrial site"
            width={1370}
            height={1148}
            widths={[640, 960, 1280]}
            sizes="(max-width: 600px) 88vw, 45vw"
            loading="eager"
            fetchPriority="high"
          />
          <div className="v2-image-label">
            <span>HEAVY-DUTY PERFORMANCE</span>
            <a href={productUrl(products[0])}>
              Precision at every scale <ArrowUpRight />
            </a>
          </div>
          <span className="v2-vertical-label">
            WINTEX / INDUSTRIAL WEIGHING SOLUTIONS
          </span>
        </div>
      </section>
      <section className="v2-clients" id="clients">
        <p className="v2-eyebrow">Trusted by industry leaders</p>
        <div>
          {clientLogos.map((client) => (
            <OptimizedImage
              key={client.name}
              src={client.image}
              alt={client.name}
              width={client.width}
              height={client.height}
              widths={[180, 360, 720]}
              sizes="140px"
            />
          ))}
          <a
            className="v2-client-added"
            href="https://wbpwd.gov.in/"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="/assets/optimized/wbpwd-logo-360.webp"
              alt="Public Works Department, West Bengal"
              width="235"
              height="105"
              loading="lazy"
            />
            <span>West Bengal PWD</span>
          </a>
          <a
            className="v2-client-added"
            href="https://www.adani.com/businesses/transport-logistics/agri-logistics"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="/assets/optimized/adani-logo-360.webp"
              alt="Adani"
              width="133"
              height="50"
              loading="lazy"
            />
            <span>Agri Logistics</span>
          </a>
        </div>
      </section>
      <CompanySection />
      <Catalogue />
      <section className="v2-automation v2-section" id="automation">
        <Reveal className="v2-automation-copy">
          <p className="v2-eyebrow">Connected. Automated. In control.</p>
          <h2>
            A smarter way
            <br />
            to weigh.
          </h2>
          <p>
            Move from manual checkpoints to a connected weighing workflow.
            Wintex unmanned systems bring vehicle identification, positioning,
            monitoring, and ERP integration together.
          </p>
          <div className="v2-tags">
            <span>ANPR + RFID</span>
            <span>ERP integration</span>
            <span>Remote monitoring</span>
          </div>
          <Action href={productUrl(products[1])}>
            Explore unmanned systems <ArrowUpRight size={18} />
          </Action>
        </Reveal>
        <Reveal className="v2-automation-media">
          <ProductImage product={products[1]} />
          <div>
            <span>
              <Check size={16} /> Vehicle identification
            </span>
            <span>
              <Check size={16} /> Automated weighing
            </span>
            <span>
              <Check size={16} /> Connected reporting
            </span>
          </div>
        </Reveal>
      </section>
      <section className="v2-section" id="expertise">
        <Reveal className="v2-section-heading">
          <div>
            <p className="v2-eyebrow">Beyond the equipment</p>
            <h2>
              From installation.
              <br />
              <span className="v2-muted">To ongoing accuracy.</span>
            </h2>
          </div>
          <p>
            From the first site survey to everyday operation, our team keeps
            your weighing systems working at their best.
          </p>
        </Reveal>
        <div className="v2-service-grid">
          {services.map((service, index) => {
            const Icon = icons[index];
            return (
              <Reveal className="v2-service" key={service.title}>
                <div>
                  <Icon size={28} strokeWidth={1.4} />
                </div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </Reveal>
            );
          })}
        </div>
        <ButtonLink
          href="#enquiry"
          className="v2-service-contact"
          pressScale={0.995}
        >
          <span>Discuss your weighing or service requirement</span>
          <ArrowRight size={23} />
        </ButtonLink>
      </section>
      <Enquiry embedded />
    </>
  );
}

function CompanySection() {
  return (
    <section
      className="v2-company"
      id="about"
      aria-labelledby="v2-company-title"
    >
      <Reveal className="v2-company-intro">
        <div>
          <p className="v2-eyebrow">The Wintex standard</p>
          <h2 id="v2-company-title">
            Three decades.
            <br />
            <span className="v2-muted">One commitment.</span>
          </h2>
        </div>
        <div className="v2-company-story">
          <p>
            Since 1994, Pionear Scales Industries has built Wintex around
            accurate measurement and dependable service.
          </p>
          <p>
            From precision counters to industrial weighbridges, we engineer,
            install, and support systems for real operating conditions.
          </p>
        </div>
      </Reveal>
      <div className="v2-metrics" aria-label="Wintex in numbers">
        {proofPoints.map((point) => (
          <div key={point.label}>
            <strong aria-label={point.value}>
              <span aria-hidden="true">
                <AnimatedNumber
                  value={Number(point.value.replace(/[^0-9]/g, ""))}
                  duration={1.8}
                  format={(value) =>
                    Math.round(value).toLocaleString("en-IN", {
                      useGrouping: point.value.includes(","),
                    })
                  }
                />
                {point.value.endsWith("+") ? "+" : ""}
              </span>
            </strong>
            <span>{point.label}</span>
          </div>
        ))}
      </div>
      <div className="v2-company-principles">
        {companyHighlights.map((item) => (
          <Reveal key={item.title}>
            <Check size={20} />
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ProductDetail({ product }) {
  return (
    <>
      <section className="v2-section v2-detail-top">
        <a className="v2-back" href="/#products">
          <ArrowLeft size={17} /> All products
        </a>
        <div className="v2-detail-hero">
          <div className="v2-detail-media">
            <ProductImage product={product} eager />
            <span className="v2-eyebrow">WINTEX / {product.category}</span>
          </div>
          <div className="v2-detail-copy">
            <p className="v2-eyebrow">Purpose-built precision</p>
            <h1>{product.name}</h1>
            <p>{product.summary}</p>
            {(product.models || product.capacities) && (
              <div className="v2-product-options">
                <p className="v2-eyebrow">
                  {product.models ? "Available models" : "Rated capacities"}
                </p>
                <div>
                  {(product.models || product.capacities).map((option) => (
                    <span key={option}>{option}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="v2-tags">
              {product.applications.map((app) => (
                <span key={app}>{app}</span>
              ))}
            </div>
            <div className="v2-actions">
              <Action href={quoteUrl(product)}>
                Request a quote <ArrowUpRight size={18} />
              </Action>
              <Action secondary href={product.download} download>
                {product.downloadLabel || "Specifications"}{" "}
                <Download size={17} />
              </Action>
            </div>
            <p className="v2-detail-note">
              <Check size={16} /> Configuration guidance · Installation ·
              After-sales support
            </p>
          </div>
        </div>
      </section>
      {product.gallery && (
        <section className="v2-section v2-load-gallery">
          <div className="v2-section-heading">
            <div>
              <p className="v2-eyebrow">Wintex load cells</p>
              <h2>Built into your weighing system.</h2>
            </div>
            <p>
              Available in 30 t and 42.5 t capacities. Contact our team to
              confirm the right assembly for your installation.
            </p>
          </div>
          <div>
            {product.gallery.map((photo) => (
              <figure key={photo.image}>
                <OptimizedImage
                  src={photo.image}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  widths={[360, 640, 960, 1280]}
                  sizes="(max-width: 600px) 88vw, 45vw"
                />
              </figure>
            ))}
          </div>
        </section>
      )}
      <section className="v2-section v2-technical">
        <div>
          <p className="v2-eyebrow">Designed for your operation</p>
          <h2>
            The details
            <br />
            make the difference.
          </h2>
          <p>
            Explore the capabilities of {product.name.toLowerCase()} and discuss
            the right configuration with our team.
          </p>
        </div>
        <div>
          {[
            ["Technical specifications", product.specs],
            ["Features & capabilities", product.features],
            ...(product.types
              ? [["Available configurations", product.types]]
              : []),
            ["Applications", product.applications],
          ].map(([title, items], index) => (
            <details className="v2-specs" key={title} open={index === 0}>
              <summary>
                {title}
                <Plus size={20} />
              </summary>
              <ul>
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </section>
      {product.typeGallery && (
        <section className="v2-section v2-foundations" id="foundations">
          <div className="v2-section-heading">
            <div>
              <p className="v2-eyebrow">A structure for every site</p>
              <h2>Choose your foundation.</h2>
            </div>
            <p>
              Four installation formats. Explore the structure that suits your
              site, access, and operating requirements.
            </p>
          </div>
          <div className="v2-foundation-grid">
            {product.typeGallery.map((type) => (
              <Reveal key={type.title} className="v2-foundation">
                <figure>
                  <OptimizedImage
                    src={type.image}
                    alt={type.title}
                    width={type.imageWidth}
                    height={type.imageHeight}
                    widths={[360, 540, 720]}
                    sizes="(max-width: 600px) 88vw, 45vw"
                  />
                  <figcaption>
                    <h3>{type.title}</h3>
                    <p>{type.text}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>
      )}
      <section className="v2-section v2-related">
        <div className="v2-section-heading">
          <div>
            <p className="v2-eyebrow">Keep exploring</p>
            <h2>More from Wintex.</h2>
          </div>
          <a className="v2-text-link" href="/#products">
            View all products <ArrowUpRight size={18} />
          </a>
        </div>
        <div className="v2-product-grid">
          {products
            .filter((item) => item.slug !== product.slug)
            .sort(
              (a, b) =>
                Number(groupFor(b) === groupFor(product)) -
                Number(groupFor(a) === groupFor(product)),
            )
            .slice(0, 3)
            .map((item) => (
              <ProductCard
                key={item.slug}
                product={item}
                index={products.indexOf(item)}
              />
            ))}
        </div>
      </section>
      <Enquiry product={product} embedded />
    </>
  );
}

function LocationMap() {
  const [attempt, setAttempt] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setSlow(true), 8000);
    return () => window.clearTimeout(timer);
  }, [attempt]);
  return (
    <div className="v2-map">
      <div className="v2-map-frame">
        {!loaded && (
          <div className="v2-map-placeholder" role="status">
            <MapPin size={28} />
            <strong>Pionear Scales Industries</strong>
            <span>
              {slow
                ? "The map is taking longer to load. Open Google Maps for directions."
                : "Loading the location map…"}
            </span>
            <a href={mapUrl} target="_blank" rel="noreferrer">
              Open Google Maps <ArrowUpRight size={16} />
            </a>
          </div>
        )}
        <iframe
          key={attempt}
          title="Pionear Scales Industries location"
          src="https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s22.6049346,88.2996271!6i16"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(false);
            setSlow(true);
          }}
          style={{ opacity: loaded ? 1 : 0 }}
        />
      </div>
      <div className="v2-map-actions">
        <a href={mapUrl} target="_blank" rel="noreferrer">
          Open in Google Maps <ArrowUpRight size={16} />
        </a>
        <button
          type="button"
          onClick={() => {
            setLoaded(false);
            setSlow(false);
            setAttempt((value) => value + 1);
          }}
        >
          Reload map
        </button>
      </div>
      <p className="v2-map-help">
        Map not displaying? Open Google Maps directly for the location and
        directions.
      </p>
    </div>
  );
}

function Enquiry({ product, embedded = false }) {
  const mounted = useMounted();
  const params = new URLSearchParams(mounted ? window.location.search : "");
  const [status, setStatus] = useState("idle");
  const [fields, setFields] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    requirement: product
      ? `I would like a quote for ${product.name}. `
      : params.get("service")
        ? `I would like to discuss ${params.get("service")}. `
        : "",
  });
  useEffect(() => {
    if (mounted)
      setFields((previous) => ({
        ...previous,
        requirement:
          previous.requirement ||
          (product
            ? `I would like a quote for ${product.name}. `
            : params.get("service")
              ? `I would like to discuss ${params.get("service")}. `
              : ""),
      }));
  }, [mounted, product]);
  const links = enquiryLinks(fields, product?.name);
  const message = links.message;
  const submit = (event) => {
    event.preventDefault();
    const channel =
      event.nativeEvent.submitter?.value === "email" ? "email" : "whatsapp";
    if (new FormData(event.currentTarget).get("bot-field")) return;
    handoffEnquiry(channel, fields, product?.name);
    setStatus(channel);
  };
  return (
    <section
      className={`v2-section v2-enquiry ${embedded ? "v2-enquiry-embedded" : ""}`}
      id="enquiry"
    >
      <div>
        {!embedded && (
          <a href="/" className="v2-back">
            <ArrowLeft size={17} /> Back to Wintex
          </a>
        )}
        <p className="v2-eyebrow">Let’s get it right</p>
        {embedded ? (
          <h2>
            Your next step
            <br />
            starts here.
          </h2>
        ) : (
          <h1>
            Let’s discuss
            <br />
            <span className="v2-muted">your requirements.</span>
          </h1>
        )}
        <p>
          Share your application, capacity, and site requirements. Our team will
          help you choose the right weighing solution.
        </p>
        <div className="v2-contact-details">
          <a href={phoneNumbers.primaryHref} title="Open your phone app">
            <Phone size={20} />
            <span>
              Call our team<strong>{phoneNumbers.primary}</strong>
            </span>
          </a>
          <a href={`mailto:${contactEmail}`} title="Open your email app">
            <Mail size={20} />
            <span>
              Email us<strong>{contactEmail}</strong>
            </span>
          </a>
          <a href={mapUrl} target="_blank" rel="noreferrer">
            <MapPin size={20} />
            <span>
              Visit us<strong>{address}</strong>
            </span>
          </a>
        </div>
        <LocationMap />
        <p className="v2-eyebrow">Our network</p>
        <p className="v2-branches">{branchLocations.join(" · ")}</p>
      </div>
      <form
        className="v2-form"
        name={NETLIFY_FORMS.quote}
        method="POST"
        onSubmit={submit}
      >
        <label hidden>
          Leave this field empty
          <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
        <input type="hidden" name="form-name" value={NETLIFY_FORMS.quote} />
        <input type="hidden" name="channel" value="website" />
        <input type="hidden" name="message" value={message} />
        <h3>
          {product ? `Enquire about ${product.name}` : "Tell us what you need."}
        </h3>
        <p>Fields marked * are required.</p>
        <div className="v2-form-grid">
          {[
            ["name", "Your name", "text", "name", true],
            ["company", "Company", "text", "organization", false],
            ["email", "Email address", "email", "email", false],
            ["phone", "Phone number", "tel", "tel", true],
          ].map(([name, label, type, autoComplete, required]) => (
            <label key={name}>
              {label}
              {required && " *"}
              <input
                name={name}
                type={type}
                autoComplete={autoComplete}
                required={required}
                maxLength={180}
                value={fields[name]}
                onChange={(event) => {
                  setFields({ ...fields, [name]: event.target.value });
                  if (status !== "sending") setStatus("idle");
                }}
              />
            </label>
          ))}
        </div>
        <label>
          Your requirement *
          <textarea
            name="requirement"
            rows={5}
            required
            maxLength={5000}
            placeholder="What do you need to weigh? Tell us about capacity, accuracy, and your site."
            value={fields.requirement}
            onChange={(event) => {
              setFields({ ...fields, requirement: event.target.value });
              if (status !== "sending") setStatus("idle");
            }}
          />
        </label>
        <div className="v2-enquiry-actions">
          <Button
            type="submit"
            name="send-channel"
            value="whatsapp"
            className="v2-button v2-send-whatsapp"
          >
            Send by WhatsApp <WhatsAppIcon size={20} />
          </Button>
          <Button
            type="submit"
            name="send-channel"
            value="email"
            className="v2-button v2-button-secondary"
          >
            Send by email <Mail size={19} />
          </Button>
        </div>
        <p className="v2-compose-note">
          Your details open as a draft in the selected app. Review and send it
          there.
        </p>
        <div aria-live="polite" role="status">
          {(status === "whatsapp" || status === "email") && (
            <p className="v2-handoff-status">
              {status === "whatsapp" ? "WhatsApp" : "Your email app"} should
              open with your enquiry. If it didn’t,{" "}
              <a
                href={links[status]}
                target={status === "whatsapp" ? "_blank" : undefined}
                rel={status === "whatsapp" ? "noreferrer" : undefined}
              >
                open it here
              </a>
              . Your details remain in this form.
            </p>
          )}
        </div>
        <p className="v2-form-privacy">
          By choosing either option, you submit your details to Wintex through
          Netlify Forms so our team can respond, and open a draft in your
          selected app. Sending that draft is a separate step.
        </p>
      </form>
    </section>
  );
}

function ContactDock() {
  const [open, setOpen] = useState(false);
  const [botField, setBotField] = useState("");
  const [message, setMessage] = useState(
    "Hello Wintex, I would like to discuss a weighing system requirement.",
  );
  const reduce = useReducedMotion();
  useEffect(() => {
    const close = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return (
    <aside className="v2-contact-dock" aria-label="WhatsApp contact">
      {open && (
        <motion.div
          id="v2-whatsapp-panel"
          className="v2-whatsapp-panel"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h3>Chat with Wintex</h3>
            <Button
              className="v2-icon-button"
              aria-label="Close chat panel"
              onClick={() => setOpen(false)}
            >
              <X size={18} />
            </Button>
          </div>
          <p>
            Discuss products, installation, or service with our team. Continuing
            also sends your message to Wintex through Netlify Forms.
          </p>
          <label hidden>
            Leave this field empty
            <input
              name="bot-field"
              value={botField}
              onChange={(event) => setBotField(event.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
          <label htmlFor="v2-chat-message">Your message</label>
          <textarea
            id="v2-chat-message"
            rows={4}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <Action
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
              // Keep the link's native navigation synchronous; capture interest independently.
              void submitNetlifyForm(
                NETLIFY_FORMS.whatsappInterest,
                {
                  message,
                  source: "floating-whatsapp-widget",
                  "bot-field": botField,
                },
                { keepalive: true },
              ).catch(() => {});
            }}
          >
            Continue on WhatsApp <WhatsAppIcon size={19} />
          </Action>
          <a className="v2-chat-phone" href={phoneNumbers.primaryHref}>
            Or call {phoneNumbers.primary}
          </a>
        </motion.div>
      )}
      <Button
        className="v2-whatsapp-toggle"
        aria-label={open ? "Close WhatsApp chat" : "Open WhatsApp chat"}
        aria-expanded={open}
        aria-controls="v2-whatsapp-panel"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={22} /> : <WhatsAppIcon size={25} />}
        <span>{open ? "Close" : "Chat with us"}</span>
      </Button>
    </aside>
  );
}

function Footer() {
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();
  return (
    <footer className="v2-footer">
      <div className="v2-footer-top">
        <a
          href="/"
          className="v2-footer-wordmark"
          aria-label="Wintex Scales home"
        >
          <OptimizedImage
            src={
              mounted && resolvedTheme === "dark"
                ? "/assets/wintex-logo-dark.png"
                : "/assets/wintex-logo-transparent.png"
            }
            alt="Wintex — Precision you can trust"
            width={977}
            height={243}
            widths={[180, 360, 720]}
            sizes="230px"
          />
        </a>
        <p>
          Engineered for accuracy.
          <br />
          Built for your business.
        </p>
        <div>
          <a href="/#products">
            Our products <ArrowUpRight size={16} />
          </a>
          <a href={cataloguePath} download>
            Product catalogue <Download size={16} />
          </a>
          <a href="/#enquiry">
            Get in touch <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
      <div className="v2-social-links" aria-label="Social channels">
        {[
          [
            "Facebook",
            "https://www.facebook.com/pionearscalesindustries",
            FacebookIcon,
          ],
          [
            "Instagram",
            "https://www.instagram.com/pionearscalesindustries",
            InstagramIcon,
          ],
          [
            "YouTube",
            "https://www.youtube.com/@pionearscalesindustries",
            YouTubeIcon,
          ],
          ["X", "https://x.com/pionearscale", XIcon],
        ].map(([name, href, Icon]) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={name}
          >
            <Icon />
          </a>
        ))}
      </div>
      <div className="v2-footer-bottom">
        <span>
          © {new Date().getFullYear()} Pionear Scales Industries. All rights
          reserved.
        </span>
        <span>Howrah, India · Since 1994</span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}

function Experience({ pathname }) {
  const mounted = useMounted();
  const path = normalizedPage(pathname ?? window.location.pathname);
  const product = products.find((item) => productUrl(item) === path);
  const isEnquiry = path === "/enquiry" || path === "/contact";
  const enquiryProduct = products.find(
    (item) =>
      item.slug ===
      new URLSearchParams(mounted ? window.location.search : "").get("product"),
  );
  const isHome = path === "/";
  useSeoMeta(product, {
    isEnquiry,
    notFound: !isHome && !product && !isEnquiry,
  });
  useEffect(() => {
    if (isEnquiry) document.title = "Discuss your requirement | Wintex Scales";
    if (!isHome && !product && !isEnquiry)
      document.title = "Page not found | Wintex Scales";
    const scrollToHash = () => {
      if (window.location.hash)
        requestAnimationFrame(() =>
          document
            .getElementById(
              sectionTarget(window.location.href, window.location.href),
            )
            ?.scrollIntoView(),
        );
    };
    scrollToHash();
    window.addEventListener("popstate", scrollToHash);
    window.addEventListener("hashchange", scrollToHash);
    return () => {
      window.removeEventListener("popstate", scrollToHash);
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, [isEnquiry, isHome, product]);
  return (
    <div className="v2-site" id="top" onClick={handleSectionClick}>
      <a href="#main" className="v2-skip">
        Skip to content
      </a>
      <Header />
      <main id="main">
        {product ? (
          <ProductDetail product={product} />
        ) : isEnquiry ? (
          <Enquiry product={enquiryProduct} />
        ) : isHome ? (
          <Home />
        ) : (
          <section className="v2-section v2-not-found">
            <p className="v2-eyebrow">404 / Off the scale</p>
            <h1>
              This page
              <br />
              couldn’t be found.
            </h1>
            <Action href="/#products">
              Explore our products <ArrowRight size={18} />
            </Action>
          </section>
        )}
      </main>
      <Footer />
      <ContactDock />
    </div>
  );
}

export default function App({ pathname }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      storageKey="wintex-theme"
      defaultTheme="system"
      enableSystem
    >
      <MotionConfig reducedMotion="user">
        <Experience pathname={pathname} />
      </MotionConfig>
    </ThemeProvider>
  );
}
