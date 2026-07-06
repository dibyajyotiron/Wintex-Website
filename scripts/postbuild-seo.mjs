import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  absoluteUrl,
  address,
  contactEmail,
  defaultSeoDescription,
  organizationName,
  phoneNumbers,
  siteName,
  siteUrl,
} from "../src/config/site.js";
import { products } from "../src/data/products.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const indexPath = path.join(dist, "index.html");

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const escapeScriptJson = (data) => JSON.stringify(data).replaceAll("</script", "<\\/script");

function productSeo(product) {
  const title = product.types
    ? `${product.name} | Pit Type, Pitless, Modular & Semi RCC Weighbridge`
    : /weighbridge/i.test(product.name)
      ? `${product.name} | Automated Weighbridge Solution`
      : `${product.name} | Wintex Electronic Weighing System`;

  return {
    title: `${title} | Wintex Scales`,
    description: `${product.summary} ${product.name} specifications, features, applications, and downloadable product details from ${siteName}.`,
    keywords: [
      product.name,
      product.category,
      "Wintex Scales",
      "Pionear Scales Industries",
      "weighing scale",
      "digital weighing system",
      ...(product.types ? ["pit type weighbridge", "pitless weighbridge", "surface mounted weighbridge"] : []),
      ...product.applications,
    ],
    canonicalPath: `/products/${product.slug}`,
  };
}

function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${siteUrl}/#organization`,
    name: organizationName,
    alternateName: siteName,
    url: siteUrl,
    logo: absoluteUrl("/assets/wintex-logo-transparent.png"),
    image: absoluteUrl("/assets/wintex-logo-transparent.png"),
    email: contactEmail,
    telephone: phoneNumbers.primary,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Narayan Commercial Complex, Gango Pal, Balitikuri Brahmin Para",
      addressLocality: "Howrah",
      addressRegion: "West Bengal",
      postalCode: "711113",
      addressCountry: "IN",
    },
    areaServed: ["India", "West Bengal", "Kolkata", "Howrah", "Jaipur", "Delhi", "Mumbai", "Siliguri"],
    description: defaultSeoDescription,
    makesOffer: products.map((product) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Product",
        name: product.name,
        category: product.category,
        url: absoluteUrl(`/products/${product.slug}`),
      },
    })),
  };
}

function productJsonLd(product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${absoluteUrl(`/products/${product.slug}`)}#product`,
    name: product.name,
    brand: {
      "@type": "Brand",
      name: siteName,
    },
    manufacturer: {
      "@id": `${siteUrl}/#organization`,
    },
    category: product.category,
    image: absoluteUrl(product.image),
    description: product.summary,
    url: absoluteUrl(`/products/${product.slug}`),
    additionalProperty: [
      ...(product.types ?? []).map((value) => ({
        "@type": "PropertyValue",
        name: "Weighbridge type",
        value,
      })),
      ...product.specs.map((value) => ({
        "@type": "PropertyValue",
        name: "Specification",
        value,
      })),
    ],
  };
}

function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: siteName,
    url: siteUrl,
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
  };
}

function productItemListJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${siteUrl}/#products`,
    name: "Wintex weighing scale and weighbridge products",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/products/${product.slug}`),
      name: product.name,
    })),
  };
}

function breadcrumbJsonLd(product) {
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: siteUrl,
    },
  ];

  if (product) {
    items.push(
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: `${siteUrl}/#products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: absoluteUrl(`/products/${product.slug}`),
      },
    );
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

function setTitle(html, title) {
  return html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
}

function setMeta(html, attribute, key, content) {
  const pattern = new RegExp(`<meta\\s+${attribute}="${key}"[^>]*>`, "i");
  const tag = `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`;

  return pattern.test(html) ? html.replace(pattern, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
}

function setCanonical(html, href) {
  const tag = `<link rel="canonical" href="${escapeHtml(href)}" />`;
  return html.replace(/<link\s+rel="canonical"[^>]*>/i, tag);
}

function setAmpHtml(html, href) {
  const tag = `<link rel="amphtml" href="${escapeHtml(href)}" />`;
  const pattern = /<link\s+rel="amphtml"[^>]*>/i;

  return pattern.test(html) ? html.replace(pattern, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
}

function setStaticJsonLd(html, data) {
  const script = `    <script id="wintex-static-jsonld" type="application/ld+json">${escapeScriptJson(data)}</script>\n`;
  return html.replace("</head>", `${script}  </head>`);
}

function ampPathForCanonical(canonicalPath) {
  return canonicalPath === "/" ? "/amp/" : `/amp${canonicalPath}/`;
}

function listItems(items) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function ampStyles() {
  return `
    :root {
      color: #f7f7f7;
      background: #080808;
      font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      --red: #d40f18;
      --muted: #c5c9d1;
      --line: rgba(255,255,255,.14);
      --panel: rgba(14,14,16,.88);
    }
    body { margin: 0; background: #080808; color: #f7f7f7; }
    a { color: inherit; text-decoration: none; }
    .shell { min-height: 100vh; background: linear-gradient(120deg, rgba(8,8,8,.98), rgba(8,8,8,.9), rgba(96,4,9,.72)); }
    .nav { align-items: center; border-bottom: 1px solid var(--line); display: flex; justify-content: space-between; padding: 18px clamp(18px, 5vw, 56px); }
    .brand { color: #fff; font-size: 1.35rem; font-weight: 900; letter-spacing: .04em; }
    .nav span { color: var(--muted); font-size: .9rem; font-weight: 700; }
    .hero { display: grid; gap: clamp(28px, 5vw, 72px); grid-template-columns: minmax(0, .86fr) minmax(320px, .78fr); margin: 0 auto; max-width: 1180px; padding: clamp(52px, 8vw, 92px) clamp(18px, 5vw, 56px); }
    .eyebrow { color: #ff626a; font-size: .78rem; font-weight: 900; letter-spacing: .1em; text-transform: uppercase; }
    h1 { font-size: clamp(3rem, 7vw, 6.4rem); letter-spacing: 0; line-height: .94; margin: 18px 0 22px; }
    h2 { font-size: clamp(2rem, 4.5vw, 3.6rem); line-height: 1.02; margin: 0 0 18px; }
    h3 { font-size: 1.15rem; margin: 0 0 8px; }
    p { color: var(--muted); font-size: 1.05rem; line-height: 1.72; margin: 0; }
    .actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
    .button { border: 1px solid var(--line); border-radius: 999px; display: inline-flex; font-weight: 850; padding: 14px 20px; }
    .button.primary { background: var(--red); border-color: var(--red); color: #fff; }
    .hero-media { align-self: center; background: rgba(255,255,255,.04); border: 1px solid var(--line); border-radius: 8px; box-shadow: 0 30px 80px rgba(0,0,0,.34); overflow: hidden; }
    .section { margin: 0 auto; max-width: 1180px; padding: clamp(48px, 7vw, 82px) clamp(18px, 5vw, 56px); }
    .grid { display: grid; gap: 16px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .metrics { display: grid; gap: 0; grid-template-columns: repeat(4, 1fr); margin-top: 28px; }
    .metric, .card { background: var(--panel); border: 1px solid var(--line); border-radius: 8px; padding: 22px; }
    .metric strong { display: block; font-size: clamp(2rem, 4vw, 3.2rem); line-height: 1; }
    .metric span, .card small { color: var(--muted); display: block; margin-top: 8px; }
    .product-card { background: rgba(16,16,18,.9); border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }
    .product-card div { padding: 18px; }
    .product-card p { font-size: .96rem; }
    .detail { display: grid; gap: 28px; grid-template-columns: minmax(0, .72fr) minmax(280px, .46fr); }
    ul { color: var(--muted); line-height: 1.7; margin: 12px 0 0; padding-left: 20px; }
    .footer { border-top: 1px solid var(--line); color: var(--muted); padding: 32px clamp(18px, 5vw, 56px); }
    @media (max-width: 860px) { .hero, .detail, .grid, .metrics { grid-template-columns: 1fr; } .nav { align-items: flex-start; flex-direction: column; gap: 8px; } }
  `;
}

function ampDocument({ title, description, canonicalUrl, image, jsonLd, body }) {
  return `<!doctype html>
<html amp lang="en-IN">
  <head>
    <meta charset="utf-8">
    <script async src="https://cdn.ampproject.org/v0.js"></script>
    <title>${escapeHtml(title)}</title>
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta name="description" content="${escapeHtml(description)}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
    <meta property="og:image" content="${escapeHtml(image)}">
    <script type="application/ld+json">${escapeScriptJson(jsonLd)}</script>
    <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
    <style amp-custom>${ampStyles()}</style>
  </head>
  <body>
    <main class="shell">
      <nav class="nav">
        <a class="brand" href="${siteUrl}">WINTEX</a>
        <span>Precision You Can Trust</span>
      </nav>
      ${body}
      <footer class="footer">
        <strong>${escapeHtml(organizationName)}</strong><br>
        ${escapeHtml(address)}<br>
        <a href="mailto:${escapeHtml(contactEmail)}">${escapeHtml(contactEmail)}</a> · <a href="${escapeHtml(phoneNumbers.primaryHref)}">${escapeHtml(phoneNumbers.primary)}</a>
      </footer>
    </main>
  </body>
</html>`;
}

function ampImage(src, alt, width, height, className = "") {
  return `<amp-img${className ? ` class="${className}"` : ""} src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" width="${width}" height="${height}" layout="responsive"></amp-img>`;
}

function homeAmpHtml() {
  const title = "Wintex Scales | AMP Weighbridge & Weighing Scale Manufacturer";
  const imagePath = "/assets/hero-weighbridge-shared.jpeg";
  const canonicalUrl = absoluteUrl("/");
  const body = `
      <section class="hero">
        <div>
          <div class="eyebrow">Pionear Scales Industries | Wintex</div>
          <h1>Precision you can trust.</h1>
          <p>${escapeHtml(defaultSeoDescription)}</p>
          <div class="actions">
            <a class="button primary" href="${siteUrl}/#products">View products</a>
            <a class="button" href="${absoluteUrl("/assets/wintex-product-catalogue.pdf")}">Download catalogue</a>
          </div>
        </div>
        <div class="hero-media">
          ${ampImage(absoluteUrl(imagePath), "Wintex weighbridge installed at an industrial site", 968, 811)}
        </div>
      </section>
      <section class="section">
        <h2>Industrial weighing systems from Howrah.</h2>
        <p>Wintex manufactures weighbridges, platform scales, table top scales, precision scales, digital indicators, and weighbridge protection systems for Indian industrial sites.</p>
        <div class="metrics">
          <div class="metric"><strong>1994</strong><span>Established</span></div>
          <div class="metric"><strong>15,000+</strong><span>Systems installed</span></div>
          <div class="metric"><strong>40+</strong><span>Technicians</span></div>
          <div class="metric"><strong>80+</strong><span>Locations served</span></div>
        </div>
      </section>
      <section class="section">
        <h2>Products</h2>
        <div class="grid">
          ${products
            .map(
              (product) => `
                <a class="product-card" href="${absoluteUrl(`/products/${product.slug}`)}">
                  ${ampImage(absoluteUrl(product.image), product.name, product.imageWidth, product.imageHeight)}
                  <div>
                    <small>${escapeHtml(product.category)}</small>
                    <h3>${escapeHtml(product.name)}</h3>
                    <p>${escapeHtml(product.summary)}</p>
                  </div>
                </a>`,
            )
            .join("")}
        </div>
      </section>
    `;

  return ampDocument({
    title,
    description: defaultSeoDescription,
    canonicalUrl,
    image: absoluteUrl(imagePath),
    jsonLd: [organizationJsonLd(), websiteJsonLd(), productItemListJsonLd(), breadcrumbJsonLd()],
    body,
  });
}

function productAmpHtml(product) {
  const seo = productSeo(product);
  const canonicalUrl = absoluteUrl(seo.canonicalPath);
  const body = `
      <section class="section detail">
        <div>
          <div class="eyebrow">${escapeHtml(product.category)}</div>
          <h1>${escapeHtml(product.name)}</h1>
          <p>${escapeHtml(product.summary)}</p>
          <div class="actions">
            <a class="button primary" href="${absoluteUrl(product.download)}">Download specification</a>
            <a class="button" href="mailto:${escapeHtml(contactEmail)}">Email enquiry</a>
          </div>
        </div>
        <div class="hero-media">
          ${ampImage(absoluteUrl(product.image), product.name, product.imageWidth, product.imageHeight)}
        </div>
      </section>
      ${
        product.types
          ? `<section class="section"><h2>Types of weighbridge</h2><ul>${listItems(product.types)}</ul></section>`
          : ""
      }
      <section class="section">
        <div class="grid">
          <article class="card"><h3>Key specifications</h3><ul>${listItems(product.specs)}</ul></article>
          <article class="card"><h3>Product features</h3><ul>${listItems(product.features)}</ul></article>
          <article class="card"><h3>Best used for</h3><ul>${listItems(product.applications)}</ul></article>
        </div>
      </section>`;

  return ampDocument({
    title: seo.title,
    description: seo.description,
    canonicalUrl,
    image: absoluteUrl(product.image),
    jsonLd: [organizationJsonLd(), productJsonLd(product), breadcrumbJsonLd(product)],
    body,
  });
}

function productHtml(baseHtml, product) {
  const seo = productSeo(product);
  const url = absoluteUrl(seo.canonicalPath);
  const ampUrl = absoluteUrl(ampPathForCanonical(seo.canonicalPath));
  const image = absoluteUrl(product.image);
  let html = baseHtml;

  html = setTitle(html, seo.title);
  html = setCanonical(html, url);
  html = setAmpHtml(html, ampUrl);
  html = setMeta(html, "name", "description", seo.description);
  html = setMeta(html, "name", "keywords", seo.keywords.join(", "));
  html = setMeta(html, "property", "og:type", "product");
  html = setMeta(html, "property", "og:title", seo.title);
  html = setMeta(html, "property", "og:description", seo.description);
  html = setMeta(html, "property", "og:url", url);
  html = setMeta(html, "property", "og:image", image);
  html = setMeta(html, "name", "twitter:title", seo.title);
  html = setMeta(html, "name", "twitter:description", seo.description);
  html = setMeta(html, "name", "twitter:image", image);
  html = setStaticJsonLd(html, [organizationJsonLd(), productJsonLd(product), breadcrumbJsonLd(product)]);

  return html;
}

const baseHtml = await readFile(indexPath, "utf8");
const homeAmpUrl = absoluteUrl(ampPathForCanonical("/"));
await writeFile(
  indexPath,
  setAmpHtml(
    setStaticJsonLd(baseHtml, [organizationJsonLd(), websiteJsonLd(), productItemListJsonLd(), breadcrumbJsonLd()]),
    homeAmpUrl,
  ),
);

const ampHomeDir = path.join(dist, "amp");
await mkdir(ampHomeDir, { recursive: true });
await writeFile(path.join(ampHomeDir, "index.html"), homeAmpHtml());

for (const product of products) {
  const outputDir = path.join(dist, "products", product.slug);
  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, "index.html"), productHtml(baseHtml, product));

  const ampProductDir = path.join(dist, "amp", "products", product.slug);
  await mkdir(ampProductDir, { recursive: true });
  await writeFile(path.join(ampProductDir, "index.html"), productAmpHtml(product));
}

console.log(`Generated static SEO metadata and AMP alternates for the home page and ${products.length} product URLs.`);
