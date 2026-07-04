import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ChevronDown,
  Download,
  ExternalLink,
  FileText,
  Gauge,
  Mail,
  MapPin,
  Menu,
  Moon,
  Phone,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sun,
  Wrench,
  X,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
// import {} from "./components/services";

const whatsappNumber = "918777727028";
const contactEmail = "wintexscales74@gmail.com";
const mapUrl =
  "https://www.google.com/maps/place/Pionear+Scales+Industries/@22.6076521,88.2982335,16.03z/data=!4m6!3m5!1s0x3a02787155555555:0xe7dbf07393283989!8m2!3d22.6049346!4d88.2996271!16s%2Fg%2F11frsld4q2?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D";
const mapEmbedUrl =
  "https://www.google.com/maps?q=22.6049346,88.2996271(Pionear%20Scales%20Industries)&z=16&output=embed";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Products", href: "#products" },
  { label: "Quality", href: "#quality" },
  // { label: "Field", href: "#field" },
  { label: "Clients", href: "#clients" },
  { label: "Contact", href: "#contact" },
];

const sectionOrder = [
  "about",
  "services",
  "products",
  "quality",
  "field",
  "clients",
  "contact",
];

function SectionArrow({ to, label }) {
  return (
    <div className="scroll-cue-row">
      <a className="scroll-cue" href={`#${to}`} aria-label={label}>
        <span className="scroll-cue-orbit" />
        <span className="scroll-cue-core">
          <ChevronDown size={22} />
        </span>
        <span className="scroll-cue-trail" />
      </a>
    </div>
  );
}

const companyHighlights = [
  {
    title: "Precision electronics",
    text: "Micro-processor and IC based systems engineered for repeatable accuracy.",
  },
  {
    title: "Strict quality control",
    text: "Products are tested against internal standards and Government of India Weights & Measures expectations.",
  },
  {
    title: "R&D-led range",
    text: "From weighbridges to platform and table-top scales, Wintex keeps improving the product line for real operating conditions.",
  },
  {
    title: "After-sales confidence",
    text: "Installation, calibration, maintenance, and responsive support keep customer operations moving.",
  },
];

const services = [
  {
    icon: SlidersHorizontal,
    title: "Custom Weighing Systems",
    text: "Electronic weighing systems configured for factories, logistics yards, retail counters, farms, and heavy industry.",
  },
  {
    icon: Gauge,
    title: "Installation & Calibration",
    text: "Certified technicians align, install, test, and calibrate each system for dependable operating accuracy.",
  },
  {
    icon: Wrench,
    title: "Maintenance & Support",
    text: "Responsive support, preventive maintenance, and field troubleshooting to keep business-critical equipment running.",
  },
];

const products = [
  {
    slug: "pitless-weighbridge",
    name: "Pitless Weighbridge",
    category: "Heavy-duty vehicle weighing",
    image: "/assets/pitless-weighbridge.png",
    download: "/assets/specs/pitless-weighbridge.pdf",
    summary:
      "A rugged vehicle-weighing system designed for factories, dispatch yards, mining sites, agricultural procurement, and logistics hubs where uptime and legal-for-trade accuracy matter.",
    specs: [
      "Surface-mounted and pit-mounted platform structures",
      "Modular steel fabrication with up to two modules per weighbridge",
      "4, 6, 8 or 10 loadcells depending on module count and platform length",
      "Loadcell capacities: 10 ton, 30 ton and 42.5 ton",
      "Linearity: <+/- 0.025% full scale output",
      "Safe overload: 150% of rated capacity",
      "Temperature compensated range: 0-60 Degree C",
      "Construction: electro-less nickel plated tool steel",
    ],
    features: [
      "Digital indicator with micro processor based system",
      "Special optical isolators for environmental noise protection",
      "Simple front-panel calibration",
      "Anti-skid 12 mm platform plates",
      "Nickel-plated loadcells sealed against moisture",
    ],
    applications: ["Factory dispatch", "Logistics yards", "Mines and quarries"],
  },
  {
    slug: "platform-scale",
    name: "Platform Scale",
    category: "Industrial floor weighing",
    image: "/assets/platform-scale.jpg",
    download: "/assets/specs/platform-scale.pdf",
    summary:
      "A heavy-duty floor weighing solution for material movement, packing, manufacturing, and warehouse operations that need stable readings through repeated daily use.",
    specs: [
      "50 kg to 5 ton platform options",
      "Rugged platform construction",
      "Digital indicator with service support",
    ],
    features: [
      "Industrial platform build",
      "Anti-skid working surface",
      "Configurable platform size",
      "Easy calibration and service",
    ],
    applications: [
      "Warehouse loading",
      "Manufacturing",
      "Bulk material handling",
    ],
  },
  {
    slug: "table-top-scale",
    name: "Table Top Scale",
    category: "Retail and counter operations",
    image: "/assets/table-top-medium.jpg",
    download: "/assets/specs/table-top-scale.pdf",
    summary:
      "A compact digital counter scale for fast weighing at retail counters, labs, food processing desks, and dispatch points.",
    specs: [
      "3 kg to 60 kg options",
      "Fast response weighing",
      "Compact counter footprint",
    ],
    features: [
      "Bright digital display",
      "Fast zero tracking",
      "Rechargeable backup option",
      "Simple daily operation",
    ],
    applications: ["Retail counters", "Food processing", "Dispatch desks"],
  },
  {
    slug: "pole-display-scale",
    name: "Pole Display Scale",
    category: "Fast moving counters",
    image: "/assets/table-top-pole.jpg",
    download: "/assets/specs/pole-display-scale.pdf",
    summary:
      "A customer-facing scale with pole display for billing counters and wholesale environments where visibility and speed are important.",
    specs: [
      "6 kg to 100 kg options",
      "Customer-facing pole display",
      "Designed for busy billing environments",
    ],
    features: [
      "Raised display",
      "Stable counter base",
      "Clear readout visibility",
      "Billing-friendly workflow",
    ],
    applications: ["Grocery counters", "Wholesale markets", "Packing stations"],
  },
  {
    slug: "micro-mini-scale",
    name: "Micro Mini Scale",
    category: "Compact precision work",
    image: "/assets/micro-mini-scale.jpg",
    download: "/assets/specs/micro-mini-scale.pdf",
    summary:
      "A small footprint precision scale for light-duty work, testing, component weighing, and counters where space is limited.",
    specs: [
      "Accurate and fast weighing using latest 24-bit sigma-delta converter",
      "0.8 inch high dual bright green LED display",
      "Triple accuracy",
      "RS-232 compatible PC connection optional",
      "Printer port optional",
    ],
    features: [
      "Self-diagnostic software for error reporting",
      "Auto zero tracking",
      "Standby mode to conserve power",
      "Carat, tola and grams conversion",
      "Piece counting",
      "Up to 72 hrs battery backup with low battery warning",
      "SMPS 130-280v technology",
      "Full digital calibration",
    ],
    applications: ["Laboratories", "Retail counters", "Quality checks"],
  },
  {
    slug: "jewellery-scale",
    name: "Jewellery Scale",
    category: "High sensitivity measurement",
    image: "/assets/jewellery-scale.jpg",
    download: "/assets/specs/jewellery-scale.pdf",
    summary:
      "A high-sensitivity scale for jewellery and valuables, designed for premium retail environments where fine measurement confidence is essential.",
    specs: [
      "Accurate and fast weighing using latest 24-bit sigma-delta converter",
      "0.8 inch high dual bright green LED display",
      "Triple accuracy",
      "Various conversion units including carat, tola and grams",
      "Sturdy stainless steel cabinet",
    ],
    features: [
      "One touch calibration and automatic self-calibration support",
      "Self-diagnostic software for error reporting",
      "Auto zero tracking",
      "Piece counting",
      "Printer port optional",
      "RS-232 PC connection optional",
      "Full digital calibration",
    ],
    applications: ["Jewellery stores", "Precious metals", "Laboratories"],
  },
];

const proofPoints = [
  { value: "1994", label: "Established" },
  { value: "10,000+", label: "Systems installed" },
  { value: "40+", label: "Technicians" },
  { value: "80+", label: "Locations served" },
];

const clientLogos = [
  { name: "Tata Steel", image: "/assets/tata-steel-logo.png" },
  { name: "L&T", image: "/assets/lt-logo.png" },
  { name: "Exide", image: "/assets/exide-logo.jpg" },
  { name: "Jindal Steel and Power", image: "/assets/jindal-logo.jpg" },
  { name: "Industrial client", image: "/assets/client-mark.png" },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeSection, setActiveSection] = useState("top");
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem("wintex-theme");
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
    return "dark";
  });
  const [chatMessage, setChatMessage] = useState(
    "Hello Wintex, I would like to discuss a weighing system requirement.",
  );
  const [formState, setFormState] = useState({
    name: "",
    company: "",
    phone: "",
    requirement: "",
  });

  useEffect(() => {
    const applyRoute = () => {
      const match = window.location.hash.match(/^#product\/(.+)$/);
      const product = match
        ? products.find((item) => item.slug === match[1])
        : null;
      setSelectedProduct(product ?? null);
      if (product) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    applyRoute();
    window.addEventListener("hashchange", applyRoute);
    return () => window.removeEventListener("hashchange", applyRoute);
  }, []);

  useEffect(() => {
    const revealItems = [...document.querySelectorAll(".reveal")];
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );

    revealItems.forEach((item) => revealObserver.observe(item));
    return () => revealObserver.disconnect();
  }, [selectedProduct]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("wintex-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (selectedProduct) return undefined;

    const updateActiveSection = () => {
      const viewportAnchor = window.scrollY + window.innerHeight * 0.34;
      let current = "top";
      sectionOrder.forEach((id) => {
        const element = document.getElementById(id);
        if (element && element.offsetTop <= viewportAnchor) {
          current = id;
        }
      });
      setActiveSection(current);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [selectedProduct]);

  const whatsappUrl = useMemo(() => {
    const message = [
      "Hello Wintex, I would like to discuss a weighing system requirement.",
      formState.name && `Name: ${formState.name}`,
      formState.company && `Company: ${formState.company}`,
      formState.phone && `Phone: ${formState.phone}`,
      formState.requirement && `Requirement: ${formState.requirement}`,
    ]
      .filter(Boolean)
      .join("\n");

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  }, [formState]);

  const emailUrl = useMemo(() => {
    const body = [
      "Hello Wintex, I would like to discuss a weighing system requirement.",
      formState.name && `Name: ${formState.name}`,
      formState.company && `Company: ${formState.company}`,
      formState.phone && `Phone: ${formState.phone}`,
      formState.requirement && `Requirement: ${formState.requirement}`,
    ]
      .filter(Boolean)
      .join("\n");

    return `mailto:${contactEmail}?subject=${encodeURIComponent("Wintex weighing system enquiry")}&body=${encodeURIComponent(body)}`;
  }, [formState]);

  const productEmailUrl = useMemo(() => {
    if (!selectedProduct) return `mailto:${contactEmail}`;

    const body = [
      `Hello Wintex, I would like to enquire about ${selectedProduct.name}.`,
      "",
      `Product: ${selectedProduct.name}`,
      `Category: ${selectedProduct.category}`,
      "",
      "Please share pricing, availability, configuration options, and next steps.",
    ].join("\n");

    return `mailto:${contactEmail}?subject=${encodeURIComponent(`Enquiry for ${selectedProduct.name}`)}&body=${encodeURIComponent(body)}`;
  }, [selectedProduct]);

  const showSoon = (channel) => {
    setToast(`${channel} is coming soon`);
    window.setTimeout(() => setToast(""), 2200);
  };

  const sendChat = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(chatMessage)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const openProduct = (product) => {
    setSelectedProduct(product);
    window.location.hash = `product/${product.slug}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeProduct = () => {
    setSelectedProduct(null);
    window.history.replaceState(null, "", "#products");
    window.setTimeout(() => {
      document
        .getElementById("products")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const enquireFromProduct = () => {
    setSelectedProduct(null);
    window.location.hash = "contact";
  };

  return (
    <div className="site-shell">
      <header className="site-header">
        <a
          className="brand"
          href="#top"
          aria-label="Wintex Scales home"
          onClick={() => setMenuOpen(false)}
        >
          <img
            src={
              theme === "dark"
                ? "/assets/wintex-logo-navbar.png"
                : "/assets/wintex-logo-transparent.png"
            }
            alt="Wintex Scales"
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
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <button
          className="theme-switch"
          type="button"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          aria-pressed={theme === "light"}
          onClick={() =>
            setTheme((current) => (current === "dark" ? "light" : "dark"))
          }
        >
          <span
            className={
              theme === "light" ? "theme-option active" : "theme-option"
            }
          >
            <Sun size={15} />
            Light
          </span>
          <span
            className={
              theme === "dark" ? "theme-option active" : "theme-option"
            }
          >
            <Moon size={15} />
            Dark
          </span>
        </button>
        <button
          className="icon-button menu-button"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <main id="top">
        {selectedProduct ? (
          <section className="product-page section-band reveal">
            <button
              className="back-button"
              type="button"
              onClick={closeProduct}
            >
              <ArrowLeft size={17} />
              Back to products
            </button>
            <div className="product-page-hero">
              <div className="product-page-copy">
                <span>{selectedProduct.category}</span>
                <h1>{selectedProduct.name}</h1>
                <p>{selectedProduct.summary}</p>
                <div className="hero-actions">
                  <a
                    className="primary-action"
                    href={selectedProduct.download}
                    download
                  >
                    Download specification
                    <Download size={18} />
                  </a>
                  <button
                    className="secondary-action"
                    type="button"
                    onClick={enquireFromProduct}
                  >
                    Enquire now
                    <ArrowRight size={18} />
                  </button>
                  <a className="secondary-action" href={productEmailUrl}>
                    Email enquiry
                    <Mail size={18} />
                  </a>
                </div>
              </div>
              <div className="product-page-media">
                <img src={selectedProduct.image} alt={selectedProduct.name} />
              </div>
            </div>
            <div className="product-info-grid">
              <article>
                <strong>Key specifications</strong>
                <ul>
                  {selectedProduct.specs.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
              <article>
                <strong>Product features</strong>
                <ul>
                  {selectedProduct.features.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
              <article>
                <strong>Best used for</strong>
                <ul>
                  {selectedProduct.applications.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>
          </section>
        ) : (
          <>
            <section className="hero section-band reveal" id="hero">
              <div className="hero-content">
                <div className="eyebrow">
                  <BadgeCheck size={16} />
                  Pionear Scales Industries | Wintex
                </div>
                <h1>Precision you can trust.</h1>
                <p>
                  A quality-conscious Indian manufacturer of electronic weighing
                  systems, built with micro-processor and IC-based electronics,
                  strict testing, and decades of after-sales support.
                </p>
                <div className="hero-actions">
                  <a className="primary-action" href="#about">
                    About the company
                    <ArrowRight size={18} />
                  </a>
                  <a
                    className="secondary-action"
                    href="/assets/wintex-product-catalogue.pdf"
                    download
                  >
                    <Download size={18} />
                    Download catalogue
                  </a>
                  <a className="secondary-action" href="tel:+918777727028">
                    <Phone size={18} />
                    +91 87777 27028
                  </a>
                </div>
              </div>
            </section>

            <section
              className="metric-strip reveal"
              aria-label="Wintex scale and reach"
            >
              {proofPoints.map((point) => (
                <div key={point.label} className="metric">
                  <strong>{point.value}</strong>
                  <span>{point.label}</span>
                </div>
              ))}
            </section>

            <SectionArrow to="about" label="Scroll to about company" />

            <section className="section-band about-company reveal" id="about">
              <div className="about-copy">
                <span>About company</span>
                <h2>
                  Built for businesses that cannot afford inaccurate weight.
                </h2>
                <p>
                  Pionear Scales Industries manufactures Wintex electronic
                  weighing systems with high-quality components, micro-processor
                  based electronics, strict production checks, and practical
                  after-sales support.
                </p>
                <div className="about-highlight-grid">
                  {companyHighlights.map((item) => (
                    <article key={item.title}>
                      <CheckCircle2 size={22} />
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>
            <SectionArrow to="services" label="Scroll to services" />

            <section className="section-band services reveal" id="services">
              <div className="section-heading">
                <span>Services</span>
                <h2>From system selection to long-term field support.</h2>
                <p>
                  One partner for choosing the right weighing system, deploying
                  it correctly, and keeping it calibrated.
                </p>
              </div>
              <div className="service-grid">
                {services.map((service) => {
                  const Icon = service.icon;
                  return (
                    <article className="service-card" key={service.title}>
                      <div className="service-icon">
                        <Icon size={26} />
                      </div>
                      <h3>{service.title}</h3>
                      <p>{service.text}</p>
                    </article>
                  );
                })}
              </div>
            </section>
            <SectionArrow to="products" label="Scroll to products" />

            <section className="section-band products reveal" id="products">
              <div className="section-heading split-heading">
                <div>
                  <span>Products</span>
                  <h2>
                    Built for precision across every weighing environment.
                  </h2>
                </div>
                <p>
                  Heavy-duty weighbridges, platform scales, table-top units,
                  jewellery scales, and specialized compact systems for
                  commercial and industrial use. Click any product to view its
                  specification page.
                </p>
              </div>
              <div className="catalogue-row">
                <a
                  className="secondary-action catalogue-action"
                  href="/assets/wintex-product-catalogue.pdf"
                  download
                >
                  <FileText size={18} />
                  Download full catalogue
                </a>
              </div>
              <div className="product-grid">
                {products.map((product) => (
                  <button
                    className="product-card"
                    key={product.name}
                    type="button"
                    onClick={() => openProduct(product)}
                  >
                    <img src={product.image} alt={product.name} />
                    <div>
                      <span>{product.category}</span>
                      <h3>{product.name}</h3>
                      <small>View specification</small>
                    </div>
                  </button>
                ))}
              </div>
            </section>
            <SectionArrow to="quality" label="Scroll to quality and legacy" />

            <section className="section-band quality reveal" id="quality">
              <div className="quality-media">
                <img src="/assets/circuit-board.jpg" alt="IC board close up" />
              </div>
              <div className="quality-copy">
                <span>Quality & legacy</span>
                <h2>
                  Manufactured with strict controls, calibrated for trust.
                </h2>
                <p>
                  Wintex systems use microprocessor and IC-based electronics,
                  controlled production processes, and disciplined testing
                  aligned with Department of Weights & Measures standards.
                </p>
                <div className="quality-list">
                  <div>
                    <ShieldCheck size={22} />
                    <span>Legal metrology approved</span>
                  </div>
                  <div>
                    <CheckCircle2 size={22} />
                    <span>Quality-tested components</span>
                  </div>
                  <div>
                    <Building2 size={22} />
                    <span>R&D-led product development</span>
                  </div>
                </div>
              </div>
            </section>
            <SectionArrow to="field" label="Scroll to field execution" />

            <section className="section-band clients reveal" id="clients">
              <div className="section-heading">
                <span>Clients</span>
                <h2>Trusted by demanding industrial teams.</h2>
              </div>
              <div className="logo-grid">
                {clientLogos.map((client) => (
                  <div className="logo-tile" key={client.name}>
                    <img src={client.image} alt={`${client.name} logo`} />
                  </div>
                ))}
              </div>
            </section>
            <SectionArrow to="contact" label="Scroll to contact" />

            <section className="section-band contact reveal" id="contact">
              <div className="contact-copy">
                <span>Contact</span>
                <h2>Get the right weighing system specified.</h2>
                <p>
                  Tell us what you need to weigh, where it will run, and the
                  accuracy or capacity you need. We will continue the
                  conversation on WhatsApp or phone.
                </p>
                <address>
                  Narayan Commercial Complex, Gango Pal, Balitikuri Brahmin
                  Para, Howrah - 711113, W.B. India
                  <br />
                  <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                  <br />
                  <a href="tel:+913326535806">+91 33 2653 5806</a> /{" "}
                  <a href="tel:+918777727028">+91 87777 27028</a>
                </address>
                <a
                  className="map-link"
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MapPin size={18} />
                  Open Pionear Scales Industries on Google Maps
                  <ExternalLink size={16} />
                </a>
                <div
                  className="embedded-map"
                  aria-label="Map showing Pionear Scales Industries location"
                >
                  <iframe
                    title="Pionear Scales Industries map"
                    src={mapEmbedUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="map-pin-card">
                    <MapPin size={18} />
                    <span>Pionear Scales Industries</span>
                  </div>
                </div>
                <div className="branch-list" aria-label="Branch offices">
                  {[
                    "Kolkata",
                    "Jaipur",
                    "Delhi",
                    "Ambala",
                    "Mumbai",
                    "Siliguri",
                    "Tata Nagar",
                    "Bhutan",
                    "Bangladesh",
                  ].map((branch) => (
                    <span key={branch}>{branch}</span>
                  ))}
                </div>
              </div>

              <form className="quote-form" onSubmit={handleFormSubmit}>
                <label>
                  Name
                  <input
                    value={formState.name}
                    onChange={(event) =>
                      setFormState({ ...formState, name: event.target.value })
                    }
                    type="text"
                    name="name"
                    autoComplete="name"
                    required
                  />
                </label>
                <label>
                  Company
                  <input
                    value={formState.company}
                    onChange={(event) =>
                      setFormState({
                        ...formState,
                        company: event.target.value,
                      })
                    }
                    type="text"
                    name="company"
                    autoComplete="organization"
                  />
                </label>
                <label>
                  Phone
                  <input
                    value={formState.phone}
                    onChange={(event) =>
                      setFormState({ ...formState, phone: event.target.value })
                    }
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    required
                  />
                </label>
                <label>
                  Requirement
                  <textarea
                    value={formState.requirement}
                    onChange={(event) =>
                      setFormState({
                        ...formState,
                        requirement: event.target.value,
                      })
                    }
                    name="requirement"
                    rows="4"
                    placeholder="Example: 60 ton pitless weighbridge for factory dispatch"
                    required
                  />
                </label>
                <button type="submit" className="primary-action form-action">
                  Send on WhatsApp
                  <FaWhatsapp size={20} />
                </button>
                <a
                  className="secondary-action form-email-action"
                  href={emailUrl}
                >
                  Send by email
                  <Mail size={18} />
                </a>
              </form>
            </section>
          </>
        )}
      </main>

      <footer className="footer">
        <img
          src={
            theme === "dark"
              ? "/assets/wintex-logo-navbar.png"
              : "/assets/wintex-logo-transparent.png"
          }
          alt="Wintex Scales"
        />
        <div className="social-row" aria-label="Social channels">
          <button
            type="button"
            aria-label="Facebook coming soon"
            onClick={() => showSoon("Facebook")}
          >
            <FaFacebookF />
          </button>
          <button
            type="button"
            aria-label="Instagram coming soon"
            onClick={() => showSoon("Instagram")}
          >
            <FaInstagram />
          </button>
          <button
            type="button"
            aria-label="YouTube coming soon"
            onClick={() => showSoon("YouTube")}
          >
            <FaYoutube />
          </button>
        </div>
      </footer>

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}

      <div
        className={chatOpen ? "whatsapp-widget widget-open" : "whatsapp-widget"}
      >
        {chatOpen && (
          <div className="chat-panel">
            <div>
              <strong>Chat with Wintex</strong>
              <button
                type="button"
                aria-label="Close WhatsApp chat"
                onClick={() => setChatOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <textarea
              value={chatMessage}
              onChange={(event) => setChatMessage(event.target.value)}
              rows="4"
            />
            <button type="button" onClick={sendChat}>
              <Send size={17} />
              Send to WhatsApp
            </button>
          </div>
        )}
        <button
          className="chat-toggle"
          type="button"
          aria-label={chatOpen ? "Close WhatsApp chat" : "Open WhatsApp chat"}
          aria-expanded={chatOpen}
          onClick={() => setChatOpen((open) => !open)}
        >
          {chatOpen ? <X size={24} /> : <FaWhatsapp />}
        </button>
      </div>
    </div>
  );
}

export default App;
