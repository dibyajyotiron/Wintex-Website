// Render the same React pages at build time so first paint does not wait for JS.
import { createServer } from 'vite';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { products } from '../src/data/products.js';
const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
try {
  const { render } = await server.ssrLoadModule('/src/entry-static.jsx');
  const routes = ['/', '/enquiry', '/404.html', ...products.map(p => `/products/${p.slug}`)];
  for (const route of routes) {
    const file = route === '/' ? 'dist/index.html' : route === '/404.html' ? 'dist/404.html' : `dist${route}/index.html`;
    const html = await readFile(file, 'utf8');
    if (!html.includes('<div id="root"></div>')) throw new Error(`Expected fresh Vite/SEO output at ${file}; run npm run build.`);
    await writeFile(file, html.replace('<div id="root"></div>', () => `<div id="root" data-page="${route}">${render(route)}</div>`));
  }
  console.log(`Prerendered ${routes.length} visible React pages.`);
} finally { await server.close(); }

// Hash every build-owned inline script, including theme bootstrapping and AMP.
// No unsafe-inline / unsafe-eval permission is granted to scripts.
const hashes = new Set();
async function collectScripts(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = `${directory}/${entry.name}`;
    if (entry.isDirectory()) await collectScripts(file);
    else if (entry.name.endsWith('.html')) {
      const html = await readFile(file, 'utf8');
      for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
        if (!/\bsrc=/.test(match[1])) hashes.add(`'sha256-${createHash('sha256').update(match[2]).digest('base64')}'`);
      }
    }
  }
}
await collectScripts('dist');
const csp = [
  "default-src 'self'",
  `script-src 'self' ${[...hashes].join(' ')} https://scripts.simpleanalyticscdn.com https://cdn.ampproject.org`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://www.wintex-scales.com https://wintex-scales.com https://queue.simpleanalyticscdn.com",
  "font-src 'self' data:",
  "connect-src 'self' https://queue.simpleanalyticscdn.com https://ingesteer.services-prod.nsvcs.net https://cdn.ampproject.org",
  "frame-src https://www.google.com",
  "base-uri 'self'", "object-src 'none'", "frame-ancestors 'none'", "form-action 'self'", "upgrade-insecure-requests",
].join('; ');
await writeFile('dist/_headers', `/*\n  Content-Security-Policy: ${csp}\n`);
console.log('Generated hash-based CSP for inline scripts and approved integrations.');
