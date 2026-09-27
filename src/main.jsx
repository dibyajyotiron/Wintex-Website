import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";

import { normalizedPage } from "./utils/navigation.js";
import App from "./App.jsx";

// Netlify performs permanent redirects; this also supports old preview links locally.
const oldPrefix = /^\/v2(?:\/|$)/.test(location.pathname);
const legacyProduct = location.hash.match(/^#product\/(.+)$/);
if (oldPrefix || legacyProduct) {
  let slug = legacyProduct?.[1];
  try {
    if (slug) slug = decodeURIComponent(slug);
  } catch {}
  const path = legacyProduct
    ? `/products/${encodeURIComponent(slug)}`
    : "/" + location.pathname.replace(/^\/v2\/*/, "");
  location.replace(
    `${path}${location.search}${legacyProduct ? "" : location.hash}`,
  );
} else {
  const root = document.getElementById("root");
  const app = (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  if (
    root.hasChildNodes() &&
    normalizedPage(root.dataset.page || "/") ===
      normalizedPage(location.pathname)
  )
    hydrateRoot(root, app);
  else createRoot(root).render(app);
}

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
