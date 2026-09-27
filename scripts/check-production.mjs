import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { products } from "../src/data/products.js";
import { NETLIFY_FORMS, submitNetlifyForm } from "../src/utils/netlifyForms.js";

// Run after the production build to catch route, asset, and Netlify contract drift.
const routes = ["", "enquiry", ...products.map((p) => `products/${p.slug}`)];
for (const route of routes) {
  const html = await readFile(new URL(`../dist/${route ? `${route}/` : ""}index.html`, import.meta.url), "utf8");
  assert.match(html, /content="index, follow, max-image-preview:large"/);
  assert.ok(!html.includes("/v2/"));
  assert.match(html, /name="wintex_quote"/);
  assert.match(html, /<div id="root" data-page="[^"]+"><[^>]+/);
  assert.match(html, /<h1[ >]/);
  assert.match(html, /netlify-honeypot="bot-field"/);
  assert.ok(!/<div class="v2-(hero-visual|detail-media)"[^>]*opacity:0/.test(html));
  const policy = await readFile(new URL('../dist/_headers', import.meta.url), 'utf8');
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (!/\bsrc=/.test(match[1])) assert.ok(policy.includes(createHash('sha256').update(match[2]).digest('base64')), 'CSP must allow build-owned inline scripts');
  }
  for (const field of ["name", "company", "email", "phone", "requirement", "message", "channel", "page", "submitted_at"]) {
    assert.ok(html.includes(`name="${field}"`), `Missing Netlify field: ${field}`);
  }
}
for (const product of products) {
  for (const asset of [product.image, product.download, ...(product.typeGallery ?? []).map((type) => type.image)]) {
    await access(new URL(`../public${asset}`, import.meta.url));
  }
  const legacy = await readFile(new URL(`../dist/products/${product.slug}/index.html`, import.meta.url), "utf8");
  assert.ok(!legacy.includes('content="noindex, follow"'), "Legacy product indexing changed");
  assert.ok(legacy.includes(`data-page="/products/${product.slug}"`));
  assert.equal(legacy.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1].replaceAll('&amp;', '&'), product.name, 'Product HTML must render the correct product before JS');
}

const originalFetch = globalThis.fetch;
const originalWindow = globalThis.window;
try {
  globalThis.window = { location: { href: "https://www.wintex-scales.com/enquiry?product=jewellery-scale" } };
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "/");
    assert.equal(options.method, "POST");
    const body = new URLSearchParams(options.body);
    assert.equal(body.get("form-name"), "wintex_quote");
    assert.equal(body.get("requirement"), "Jewellery Scale & calibration");
    assert.equal(body.get("channel"), "website");
    assert.equal(body.get("page"), "https://www.wintex-scales.com/enquiry");
    assert.equal(body.get("bot-field"), "");
    assert.ok(body.get("submitted_at"));
    return { ok: true };
  };
  await submitNetlifyForm(NETLIFY_FORMS.quote, { requirement: "Jewellery Scale & calibration", channel: "website" });
  let spamRequests = 0;
  globalThis.fetch = async () => { spamRequests++; return { ok: true }; };
  await submitNetlifyForm(NETLIFY_FORMS.quote, { "bot-field": "spam" });
  assert.equal(spamRequests, 0);
  await submitNetlifyForm(NETLIFY_FORMS.whatsappInterest, { message: "deduplication test" });
  await submitNetlifyForm(NETLIFY_FORMS.whatsappInterest, { message: "deduplication test" });
  assert.equal(spamRequests, 1);
  globalThis.fetch = async () => ({ ok: false, status: 503 });
  await assert.rejects(() => submitNetlifyForm(NETLIFY_FORMS.quote, {}), /503/);
} finally {
  globalThis.fetch = originalFetch;
  if (originalWindow === undefined) delete globalThis.window;
  else globalThis.window = originalWindow;
}
console.log(`Production checks passed: ${routes.length} routes, ${products.length} products, asset links, legacy metadata, and Netlify success/error contract.`);

const { enquiryLinks, handoffEnquiry } = await import('../src/utils/enquiry.js');
const sample = { name: 'QA & Review', company: 'Test + Co', email: '', phone: '0000000000', requirement: '60 ton bridge\nCapacity & installation' };
const links = enquiryLinks(sample, 'Weighbridge');
assert.equal(new URL(links.whatsapp).searchParams.get('text'), links.message);
assert.equal(new URL(links.email).searchParams.get('body'), links.message);
assert.equal(new URL(links.email).searchParams.get('subject'), 'Enquiry for Weighbridge');
assert.ok(links.message.includes('Name: QA & Review'));
assert.ok(links.message.includes('Product: Weighbridge'));
const calls = [];
let destination = 'https://www.wintex-scales.com/';
try {
  globalThis.window = {
    open: (url, target, features) => calls.push({ action: 'open', url, target, features }),
    location: { get href() { return destination; }, set href(value) { calls.push({ action: 'navigate', url: value }); destination = value; } },
  };
  globalThis.fetch = async (url, options) => {
    calls.push({ action: 'capture', channel: new URLSearchParams(options.body).get('channel'), keepalive: options.keepalive });
    throw new Error('Simulated offline capture');
  };
  handoffEnquiry('whatsapp', sample, 'Weighbridge');
  assert.equal(calls[0].action, 'open');
  assert.equal(calls[0].url, links.whatsapp);
  assert.equal(calls[1].channel, 'whatsapp');
  assert.equal(calls[1].keepalive, true);
  handoffEnquiry('email', sample, 'Weighbridge');
  assert.equal(calls[2].action, 'navigate');
  assert.equal(calls[2].url, links.email);
  assert.equal(calls[3].channel, 'email');
  await new Promise(resolve => setTimeout(resolve, 0));
} finally {
  globalThis.fetch = originalFetch;
  if (originalWindow === undefined) delete globalThis.window;
  else globalThis.window = originalWindow;
}
console.log('Enquiry handoff checks passed: both apps open synchronously, text is encoded correctly, and capture failures do not block either channel.');

assert.deepEqual(products.find(p => p.slug === "digital-indicator-it").models, ["WP14", "WP74", "WS14"]);
const loadCells = products.find(p => p.slug === "load-cells");
assert.deepEqual(loadCells.capacities, ["30 t", "42.5 t"]);
for (const asset of [loadCells.image, loadCells.download, ...loadCells.gallery.map(p => p.image), "/assets/wbpwd-logo.png", "/assets/adani-logo.svg"]) await access(new URL(`../public${asset}`, import.meta.url));
const loadHtml = await readFile(new URL("../dist/products/load-cells/index.html", import.meta.url), "utf8");
assert.ok(loadHtml.includes('rel="canonical" href="https://www.wintex-scales.com/products/load-cells"'));
console.log("Catalogue additions verified: IT models, load-cell capacities and photos, client logos, and new-product canonical URL.");

const sitemap = await readFile(new URL('../dist/sitemap.xml', import.meta.url), 'utf8');
const llms = await readFile(new URL('../dist/llms.txt', import.meta.url), 'utf8');
for (const product of products) {
  const html = await readFile(new URL(`../dist/products/${product.slug}/index.html`, import.meta.url), 'utf8');
  const amp = await readFile(new URL(`../dist/amp/products/${product.slug}/index.html`, import.meta.url), 'utf8');
  assert.ok(html.includes(`<link rel="canonical" href="https://www.wintex-scales.com/products/${product.slug}"`));
  assert.ok(html.includes(`/amp/products/${product.slug}/`));
  assert.ok(html.match(/<title>([\s\S]*?)<\/title>/)[1].includes(product.name.replaceAll("&", "&amp;")), "Product title missing from static HTML");
  assert.ok(amp.includes('<html amp'));
  assert.ok(amp.includes(product.name.replaceAll('&', '&amp;')));
  assert.ok(sitemap.includes(`/products/${product.slug}`));
  assert.ok(llms.includes(`/products/${product.slug}`));
  const scripts = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 1);
  assert.ok(JSON.parse(scripts[0][1]).some(item => item['@type'] === 'Product'));
}
const notFound = await readFile(new URL('../dist/404.html', import.meta.url), 'utf8');
assert.match(notFound, /content="noindex, follow"/);
const netlify = await readFile(new URL('../netlify.toml', import.meta.url), 'utf8');
assert.ok(netlify.includes('from = "/v2/*"'));
assert.ok(netlify.includes('status = 301'));
assert.ok(netlify.includes('status = 404'));
const sw = await readFile(new URL('../dist/sw.js', import.meta.url), 'utf8');
assert.ok(!sw.includes('__BUILD_VERSION__'));
assert.ok(sw.includes('request.method !== "GET"'));
console.log('Production SEO verified: canonicals, JSON-LD, AMP, complete sitemap/crawler files, preview redirects, true 404s, and versioned offline caching.');

const { sectionTarget } = await import('../src/utils/navigation.js');
for (const home of ['https://www.wintex-scales.com/', 'https://www.wintex-scales.com/?campaign=test', 'https://www.wintex-scales.com/v2', 'https://www.wintex-scales.com/v2/', 'https://www.wintex-scales.com/index.html']) {
  assert.equal(sectionTarget('/#products', home), 'products');
  assert.equal(sectionTarget('/v2#about', home), 'about');
  assert.equal(sectionTarget('#contact', home), 'enquiry');
}
assert.equal(sectionTarget('/#products', 'https://www.wintex-scales.com/products/load-cells'), null);
assert.equal(sectionTarget('https://other.example/#products', 'https://www.wintex-scales.com/'), null);
assert.equal(sectionTarget('/products/load-cells/#enquiry', 'https://www.wintex-scales.com/products/load-cells'), 'enquiry');
assert.equal(sectionTarget('#%invalid', 'https://www.wintex-scales.com/'), null);
console.log('Section navigation checks passed: trailing slashes, legacy preview paths, campaign queries, old anchors, and cross-page links.');

const homeHtml = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
assert.match(homeHtml, /<form name="whatsapp_interest"[^>]*data-netlify="true"/);
assert.ok(homeHtml.includes('name="source"'));
assert.match(homeHtml, /<form name="wintex_quote"[^>]*data-netlify="true"/);
const { runInNewContext } = await import('node:vm');
const listeners = {};
const cachedHome = new Response('cached home', { headers: { 'Content-Type': 'text/html' } });
runInNewContext(sw, {
  self: { location: { origin: 'https://www.wintex-scales.com' }, addEventListener: (name, handler) => { listeners[name] = handler; } },
  caches: { open: async () => ({ match: async key => key === '/' ? cachedHome.clone() : undefined }) },
  fetch: async () => { throw new Error('offline'); },
  Response, URL,
});
let interceptedPost = false;
listeners.fetch({ request: { method: 'POST', url: 'https://www.wintex-scales.com/' }, respondWith: () => { interceptedPost = true; } });
assert.equal(interceptedPost, false, 'Service worker must not intercept Netlify form POSTs');
let offlineResult;
listeners.fetch({ request: { method: 'GET', mode: 'navigate', url: 'https://www.wintex-scales.com/products/load-cells' }, waitUntil: () => {}, respondWith: promise => { offlineResult = promise; } });
assert.equal(await (await offlineResult).text(), 'cached home');
console.log('Service-worker checks passed: tracking POST bypass and awaited offline home fallback.');
