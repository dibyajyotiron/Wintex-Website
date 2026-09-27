const CACHE_VERSION = "wintex-__BUILD_VERSION__";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const HTML_CACHE = `${CACHE_VERSION}-html`;
const STATIC_EXTENSIONS = /\.(?:css|js|png|jpe?g|webp|avif|svg|webmanifest|pdf)$/;
const HASHED_ASSET = /-[\w-]{8,}\.(?:js|css)$/;

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith("wintex-") && !key.startsWith(CACHE_VERSION)).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
async function store(cache, request, response, maxEntries) {
  if (!response.ok || response.type === "opaque") return;
  await cache.put(request, response);
  const keys = await cache.keys();
  await Promise.all(keys.slice(0, Math.max(0, keys.length - maxEntries)).map(key => cache.delete(key)));
}
async function navigation(event) {
  const cache = await caches.open(HTML_CACHE);
  try {
    const response = await fetch(event.request);
    event.waitUntil(store(cache, event.request, response.clone(), 30));
    return response;
  } catch {
    return (await cache.match(event.request)) || (await cache.match("/")) || new Response("<!doctype html><html lang='en'><title>Offline | Wintex Scales</title><h1>You’re offline</h1><p>Reconnect to view this Wintex page.</p></html>", { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } });
  }
}
async function asset(event, pathname) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(event.request);
  if (cached && HASHED_ASSET.test(pathname)) return cached;
  const update = fetch(event.request).then(response => {
    event.waitUntil(store(cache, event.request, response.clone(), 160));
    return response;
  });
  if (cached) {
    event.waitUntil(update.catch(() => {}));
    return cached;
  }
  return update;
}
self.addEventListener("fetch", event => {
  const { request } = event;
  // Netlify lead capture must always go directly to the network.
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === "navigate") event.respondWith(navigation(event));
  else if (STATIC_EXTENSIONS.test(url.pathname)) event.respondWith(asset(event, url.pathname));
});
