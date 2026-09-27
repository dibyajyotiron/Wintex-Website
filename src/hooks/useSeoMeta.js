import { useEffect } from "react";
import {
  absoluteUrl,
  defaultSeoDescription,
  siteName,
  siteUrl,
} from "../config/site";
import {
  breadcrumbJsonLd,
  homeSeo,
  organizationJsonLd,
  productItemListJsonLd,
  productJsonLd,
  productSeo,
  websiteJsonLd,
} from "../data/seo";

function setMeta(name, content, attribute = "name") {
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function setLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

function setJsonLd(id, data) {
  let element = document.getElementById(id);
  if (!element) {
    element = document.createElement("script");
    element.id = id;
    element.type = "application/ld+json";
    document.head.appendChild(element);
  }
  element.textContent = JSON.stringify(data);
}

export function useSeoMeta(product, { isEnquiry = false, notFound = false } = {}) {
  useEffect(() => {
    const seo = notFound ? { title: "Page not found | Wintex Scales", description: "The requested page could not be found.", keywords: [], canonicalPath: "/404.html" }
      : isEnquiry ? { title: "Discuss your requirement | Wintex Scales", description: "Contact Wintex Scales for weighing systems, pricing, installation, calibration and support. Send your requirement by WhatsApp or email.", keywords: homeSeo.keywords, canonicalPath: "/enquiry" }
      : product ? productSeo(product) : homeSeo;
    const canonical = absoluteUrl(seo.canonicalPath);
    const image = product
      ? absoluteUrl(product.image)
      : absoluteUrl("/assets/wintex-logo-transparent.png");

    document.title = seo.title;
    setMeta("description", seo.description || defaultSeoDescription);
    setMeta("keywords", seo.keywords.join(", "));
    setMeta("robots", notFound ? "noindex, follow" : "index, follow, max-image-preview:large");
    setMeta("author", siteName);
    setLink("canonical", canonical);

    setMeta("og:type", product ? "product" : "website", "property");
    setMeta("og:site_name", siteName, "property");
    setMeta("og:title", seo.title, "property");
    setMeta("og:description", seo.description, "property");
    setMeta("og:url", canonical, "property");
    setMeta("og:image", image, "property");

    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", seo.title);
    setMeta("twitter:description", seo.description);
    setMeta("twitter:image", image);

    if (notFound) {
      document.getElementById("wintex-static-jsonld")?.remove();
    } else if (isEnquiry) {
      setJsonLd("wintex-static-jsonld", [organizationJsonLd(), {
        "@context": "https://schema.org", "@type": "ContactPage", name: seo.title, url: canonical,
      }]);
    } else if (product) {
      setJsonLd("wintex-static-jsonld", [
        organizationJsonLd(),
        productJsonLd(product),
        breadcrumbJsonLd(product),
      ]);
    } else {
      setJsonLd("wintex-static-jsonld", [
        organizationJsonLd(),
        websiteJsonLd(),
        productItemListJsonLd(),
        breadcrumbJsonLd(),
      ]);
    }

    if (isEnquiry || notFound) document.querySelector('link[rel="amphtml"]')?.remove();
    else setLink("amphtml", absoluteUrl(product ? `/amp/products/${product.slug}/` : "/amp/"));

    setMeta("application-name", siteName);
    setMeta("theme-color", product ? "#090909" : "#d40f18");
    setMeta("geo.region", "IN-WB");
    setMeta("geo.placename", "Howrah, West Bengal");
    setMeta("ICBM", "22.6049346, 88.2996271");
    setLink("home", siteUrl);
  }, [product, isEnquiry, notFound]);
}
