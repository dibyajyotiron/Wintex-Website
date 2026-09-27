import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { products } from "../src/data/products.js";
import { products as v2Products } from "../src/v2/products.js";
import { NETLIFY_FORMS, submitNetlifyForm } from "../src/utils/netlifyForms.js";

// Run after the production build to catch route, asset, and Netlify contract drift.
const routes = ["", "enquiry", "contact", ...v2Products.map((p) => `products/${p.slug}`)];
for (const route of routes) {
  const html = await readFile(new URL(`../dist/v2/${route ? `${route}/` : ""}index.html`, import.meta.url), "utf8");
  assert.match(html, /content="noindex, follow"/);
  assert.match(html, /name="wintex_quote"/);
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
}

const originalFetch = globalThis.fetch;
const originalWindow = globalThis.window;
try {
  globalThis.window = { location: { href: "https://www.wintex-scales.com/v2/enquiry?product=jewellery-scale" } };
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "/");
    assert.equal(options.method, "POST");
    const body = new URLSearchParams(options.body);
    assert.equal(body.get("form-name"), "wintex_quote");
    assert.equal(body.get("requirement"), "Jewellery Scale & calibration");
    assert.equal(body.get("channel"), "v2-website");
    assert.ok(body.get("page").includes("/v2/enquiry"));
    assert.ok(body.get("submitted_at"));
    return { ok: true };
  };
  await submitNetlifyForm(NETLIFY_FORMS.quote, { requirement: "Jewellery Scale & calibration", channel: "v2-website" });
  globalThis.fetch = async () => ({ ok: false, status: 503 });
  await assert.rejects(() => submitNetlifyForm(NETLIFY_FORMS.quote, {}), /503/);
} finally {
  globalThis.fetch = originalFetch;
  if (originalWindow === undefined) delete globalThis.window;
  else globalThis.window = originalWindow;
}
console.log(`V2 checks passed: ${routes.length} routes, ${v2Products.length} V2 products, asset links, legacy metadata, and Netlify success/error contract.`);

const { enquiryLinks, handoffEnquiry } = await import('../src/v2/enquiry.js');
const sample = { name: 'QA & Review', company: 'Test + Co', email: '', phone: '0000000000', requirement: '60 ton bridge\nCapacity & installation' };
const links = enquiryLinks(sample, 'Weighbridge');
assert.equal(new URL(links.whatsapp).searchParams.get('text'), links.message);
assert.equal(new URL(links.email).searchParams.get('body'), links.message);
assert.equal(new URL(links.email).searchParams.get('subject'), 'Enquiry for Weighbridge');
assert.ok(links.message.includes('Name: QA & Review'));
assert.ok(links.message.includes('Product: Weighbridge'));
const calls = [];
let destination = 'https://www.wintex-scales.com/v2';
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

assert.deepEqual(v2Products.find(p => p.slug === "digital-indicator-it").models, ["WP14", "WP74", "WS14"]);
const loadCells = v2Products.find(p => p.slug === "load-cells");
assert.deepEqual(loadCells.capacities, ["30 t", "42.5 t"]);
for (const asset of [loadCells.image, loadCells.download, ...loadCells.gallery.map(p => p.image), "/assets/wbpwd-logo.png", "/assets/adani-logo.svg"]) await access(new URL(`../public${asset}`, import.meta.url));
const loadHtml = await readFile(new URL("../dist/v2/products/load-cells/index.html", import.meta.url), "utf8");
assert.ok(loadHtml.includes('rel="canonical" href="https://www.wintex-scales.com/v2/products/load-cells"'));
console.log("V2 additions verified: IT models, load-cell capacities and photos, client logos, and new-product canonical URL.");
