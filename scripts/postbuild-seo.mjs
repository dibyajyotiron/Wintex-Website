import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  absoluteUrl,
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
  const isWeighbridge = /weighbridge/i.test(`${product.name} ${product.category}`);
  const title = isWeighbridge
    ? `${product.name} | Pit Type, Pitless & Surface Mounted Weighbridge`
    : `${product.name} | Wintex Electronic Weighing Scale`;

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

function setStaticJsonLd(html, data) {
  const script = `    <script id="wintex-static-jsonld" type="application/ld+json">${escapeScriptJson(data)}</script>\n`;
  return html.replace("</head>", `${script}  </head>`);
}

function productHtml(baseHtml, product) {
  const seo = productSeo(product);
  const url = absoluteUrl(seo.canonicalPath);
  const image = absoluteUrl(product.image);
  let html = baseHtml;

  html = setTitle(html, seo.title);
  html = setCanonical(html, url);
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
await writeFile(
  indexPath,
  setStaticJsonLd(baseHtml, [organizationJsonLd(), websiteJsonLd(), productItemListJsonLd(), breadcrumbJsonLd()]),
);

for (const product of products) {
  const outputDir = path.join(dist, "products", product.slug);
  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, "index.html"), productHtml(baseHtml, product));
}

console.log(`Generated static SEO metadata for the home page and ${products.length} product URLs.`);
