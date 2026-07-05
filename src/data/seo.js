import {
  absoluteUrl,
  address,
  contactEmail,
  defaultSeoDescription,
  organizationName,
  phoneNumbers,
  siteName,
  siteUrl,
} from "../config/site";
import { products } from "./products";

export const homeSeo = {
  title: "Wintex Scales | Weighbridge, Weighing Scale & Precision Scale Manufacturer",
  description: defaultSeoDescription,
  keywords: [
    "wintex",
    "scales",
    "weighbridge manufacturer",
    "weighbridge in India",
    "electronic weighbridge",
    "weighing scale manufacturer",
    "precision scale",
    "platform scale",
    "table top weighing scale",
    "jewellery scale",
    "digital weighing scale",
    "Pionear Scales Industries",
    "Wintex Scales",
  ],
  canonicalPath: "/",
};

const locality = "Howrah";
const region = "West Bengal";
const country = "IN";

export function productSeo(product) {
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

export function organizationJsonLd() {
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
      addressLocality: locality,
      addressRegion: region,
      postalCode: "711113",
      addressCountry: country,
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

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: siteName,
    url: siteUrl,
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function productItemListJsonLd() {
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

export function productJsonLd(product) {
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

export function breadcrumbJsonLd(product) {
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: siteUrl,
    },
  ];

  if (product) {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: "Products",
      item: `${siteUrl}/#products`,
    });
    items.push({
      "@type": "ListItem",
      position: 3,
      name: product.name,
      item: absoluteUrl(`/products/${product.slug}`),
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

