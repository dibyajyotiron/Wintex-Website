# Wintex Scales

The approved redesign is the production application at `/`. All ten products use `/products/<slug>` and enquiries use `/enquiry`.

## Development and verification

```sh
npm ci
npm run dev
npm run build
npm run check
npm run preview
```

The build generates responsive AVIF/WebP images, PWA icons, page-specific SEO HTML, AMP alternatives, a complete sitemap, crawler information, and a versioned service worker. `npm run check` verifies the route/asset inventory, metadata, structured data, AMP links, Netlify form contracts, and synchronous email/WhatsApp handoffs. `npm run check:v2` remains an alias for older workflows.

## Netlify deployment

`netlify.toml` uses Node 22, builds with `npm run build && npm run check`, and publishes `dist` only when the checks pass. Enable Netlify Forms detection in the existing site's dashboard. All valid pages are emitted as real HTML files, so direct product links and refreshes work without a blanket SPA rewrite. Unknown URLs receive the generated 404 page with HTTP 404, rather than an indexable home-page response.

- `/v2` and `/v2/*` permanently redirect to the corresponding production URLs.
- `/contact` redirects to `/enquiry`.
- Old `#product/<slug>` links still resolve in the browser.
- Old `#contact`, `#services`, and `#quality` anchors resolve to their replacement sections.
- Same-page section links use history and scrolling without reloading, including trailing-slash variants. Modified clicks and product-to-home links retain normal browser navigation.

No domain, account, notification recipient, or DNS settings are changed by the build.

## Netlify lead tracking

The static hidden form definitions in `index.html` retain the deployed names and fields:

- `wintex_quote`: name, company, email, phone, requirement, message, channel, page, submitted_at.
- `whatsapp_interest`: message, source, page, submitted_at.

WhatsApp and email compose synchronously in the original click event. The website copy is posted separately to `/` using URL-encoded `form-name` and matching fields with `keepalive`, so tracking does not block the selected app. The service worker never intercepts POST requests. A successful HTTP response is treated as capture success; offline or failed tracking does not falsely report that a message was sent. Users send the prepared message in their chosen app.

After deployment, verify Forms detection and both form submissions in the existing Netlify dashboard. Local mocks cannot prove live Netlify ingestion, spam filtering, or notification delivery. Existing form notification settings must be checked there.

The integration follows [Netlify's JavaScript form setup](https://docs.netlify.com/manage/forms/setup/) and [redirect status handling](https://docs.netlify.com/manage/routing/redirects/redirect-options/).

## SEO

Each canonical product page includes its own title, description, Open Graph/Twitter metadata, Product, Organization, and Breadcrumb JSON-LD. The home page includes Organization, WebSite, ItemList, and Breadcrumb schemas. The enquiry page has ContactPage metadata. Unknown pages are noindex.

Home and all ten products retain static AMP alternates under `/amp/` and `/amp/products/<slug>/`. Sitemap and `llms.txt` are generated from the product catalogue; `robots.txt` links to the sitemap. To validate AMP:

```sh
npx --yes amphtml-validator dist/amp/index.html dist/amp/products/*/index.html
```

## Performance

Responsive images use explicit dimensions, AVIF/WebP sources and lazy loading. Hero/product lead images are prioritized. The map is lazy-loaded, with retry and a direct Google Maps fallback. Build-hashed JS/CSS and bounded offline caches are versioned per build; unversioned assets revalidate in the background. Old cache generations are removed on activation. The PWA manifest and icons are retained.

## Source

- `src/App.jsx`, `src/App.css`: approved UI. Existing `v2-` CSS names are intentionally retained to avoid unnecessary selector changes; they do not represent a separate application.
- `src/data/products.js`: all products, IT models, load-cell capacities, photos, and PDFs.
- `src/data/siteContent.js`: company facts, clients, services, branches.
- `src/config/site.js`: canonical domain, phone, email, map, WhatsApp, and catalogue settings.
- `src/utils/enquiry.js`, `src/utils/netlifyForms.js`: compose actions and tracking.
- `src/data/seo.js`, `src/hooks/useSeoMeta.js`, `scripts/postbuild-seo.mjs`: metadata and discovery output.
- `src/components/motion/`: installed beUI components and their shared helpers.

Replace source assets in `public/assets/` with the same filenames, then rebuild. Product PDFs remain under `public/assets/specs/`. Theme and reading-size preferences persist locally using the existing Wintex keys.
