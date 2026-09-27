import React from "react";
import { createRoot } from "react-dom/client";

// Load each experience and its styles independently so /v2 cannot restyle production pages.
const isV2 = /^\/v2(?:\/|$)/.test(window.location.pathname);
const { default: App } = isV2
  ? await import("./v2/V2App.jsx")
  : await import("./App.jsx");
if (!isV2) await import("./App.css");

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

const loadBackground = () => {
  document.body.classList.add("background-ready");
};

if ("requestIdleCallback" in window) {
  requestIdleCallback(loadBackground, { timeout: 1500 });
} else {
  setTimeout(loadBackground, 800);
}
