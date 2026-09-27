export function normalizedPage(path) {
  return (path.replace(/^\/v2(?=\/|$)/, "").replace(/\/index\.html$/, "").replace(/\/+$/, "") || "/");
}

export function sectionTarget(href, currentHref) {
  const current = new URL(currentHref);
  const next = new URL(href, current);
  if (next.origin !== current.origin || normalizedPage(next.pathname) !== normalizedPage(current.pathname)) return null;
  if (!next.hash && normalizedPage(next.pathname) !== "/") return null;
  try {
    const id = decodeURIComponent(next.hash.slice(1)) || "top";
    return ({ contact: "enquiry", services: "expertise", quality: "about" })[id] || id;
  } catch { return null; }
}

export function handleSectionClick(event) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const anchor = event.target.closest?.("a[href]");
  if (!anchor || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
  const id = sectionTarget(anchor.getAttribute("href"), window.location.href);
  const section = id && document.getElementById(id);
  if (!section) return;
  event.preventDefault();
  const hash = `#${id}`;
  if (window.location.hash !== hash) history.pushState(null, "", `${window.location.pathname}${window.location.search}${hash}`);
  section.setAttribute("tabindex", "-1");
  section.focus({ preventScroll: true });
  section.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
}
