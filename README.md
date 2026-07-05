# Wintex Website

Modern single-page React/Vite website for Wintex Scales / Pionear Scales Industries.

## Local Development

```bash
npm install
npm run dev
```

The local Vite server usually runs at `http://localhost:5173`.

## Production Build

```bash
npm run build
```

The compiled site is generated in `dist/`.

The production build also generates static SEO shells for every product URL under:

```text
dist/products/<product-slug>/index.html
```

These files let crawlers and AI indexing systems see product-specific titles, descriptions, canonical URLs, Open Graph tags, and JSON-LD before the React app hydrates.

## Netlify Deployment

Netlify must build the Vite app before publishing it. This repo includes `netlify.toml` with:

- Build command: `npm run build`
- Publish directory: `dist`
- SPA fallback redirect: `/* -> /index.html`

The previous Netlify log showed `No build steps found` and `Starting to deploy site from '/'`, which means Netlify was uploading the source folder instead of the built Vite output. The `netlify.toml` file fixes that.

## Netlify Forms

The site captures leads through Netlify Forms:

- `wintex_quote`: contact section submissions from WhatsApp or email clicks.
- `whatsapp_interest`: floating WhatsApp widget interest captures.

The hidden static form definitions live in:

```text
index.html
```

The React submission helper lives in:

```text
src/utils/netlifyForms.js
```

In Netlify, make sure Forms detection is enabled, then redeploy. After deploy, Netlify should detect both form names and show submissions in the Forms tab.

## Project Structure

```text
src/
  App.jsx                         Main app coordinator
  App.css                         Global styling and responsive design
  components/
    common/                       Reusable UI such as scroll cue and toast
    layout/                       Header, footer, theme switch, WhatsApp widget
    product/                      Product detail page
    sections/                     Home page sections
  config/
    site.js                       Contact details, map links, catalogue path
  data/
    navigation.js                 Navbar and section order
    products.js                   Product cards, details, images, spec PDFs
    siteContent.js                About, services, clients, branches, page content
  hooks/                          Theme, hash routing, active section logic
```

## Replacing Assets

All public assets are served from `public/assets/`.

### Logo Files

Replace these files while keeping the same filenames:

- Dark navbar/footer logo: `public/assets/wintex-logo-navbar.png`
- Light-mode logo: `public/assets/wintex-logo-transparent.png`
- General logo assets: `public/assets/wintex-logo.png`, `public/assets/wintex-logo-lockup.png`

If you change filenames, update the references in:

- `src/components/layout/Header.jsx`
- `src/components/layout/Footer.jsx`

### Catalogue PDF

Replace:

```text
public/assets/wintex-product-catalogue.pdf
```

If you change the filename, update:

```text
src/config/site.js
```

Specifically update `cataloguePath`.

### Product Specification PDFs

Product spec PDFs live here:

```text
public/assets/specs/
```

Current product PDF paths are configured in:

```text
src/data/products.js
```

Each product has a `download` field, for example:

```js
download: "/assets/specs/pitless-weighbridge.pdf"
```

To replace a spec, keep the same filename. To use a new filename, update the matching product's `download` field.

### Product Images

Product images live in:

```text
public/assets/
```

Product image references are configured in:

```text
src/data/products.js
```

Each product has an `image` field, for example:

```js
image: "/assets/pitless-weighbridge.png"
```

### Section and Client Images

Other section images and client logos are configured in:

```text
src/data/siteContent.js
```

Useful fields:

- `clientLogos` for client logo tiles
- `companyHighlights`, `services`, `proofPoints`, and `branchLocations` for page text

### Circuit Board Background

The main site background and quality section image use:

```text
public/assets/circuit-board.jpg
```

CSS background reference:

```text
src/App.css
```

Quality section reference:

```text
src/components/sections/QualitySection.jsx
```

## Updating Contact, WhatsApp, Email, or Map

Update:

```text
src/config/site.js
```

Important fields:

- `whatsappNumber`
- `contactEmail`
- `phoneNumbers`
- `address`
- `mapUrl`
- `mapEmbedUrl`

Use the WhatsApp number without `+`, spaces, or hyphens.

## Adding or Editing Products

Edit:

```text
src/data/products.js
```

Each product supports:

- `slug`: used in URL hash, for example `#product/pitless-weighbridge`
- `name`
- `category`
- `image`
- `download`
- `summary`
- `specs`
- `features`
- `applications`

After adding a product, run:

```bash
npm run build
```

## SEO and AI Search Files

Search metadata is configured in:

```text
src/data/seo.js
src/hooks/useSeoMeta.js
```

Product SEO pages use clean URLs such as:

```text
https://www.wintex-scales.com/products/electronic-weighbridges
```

Static product SEO shells are generated automatically by:

```text
scripts/postbuild-seo.mjs
```

If you add, remove, or rename a product slug in `src/data/products.js`, also update:

```text
public/sitemap.xml
public/llms.txt
```

Crawler files:

- `public/sitemap.xml` lists the home page and product detail URLs for Google Search Console submission.
- `public/robots.txt` allows crawlers and points them to the sitemap.
- `public/llms.txt` gives AI search/indexing systems a plain-text summary of the company, products, and key URLs.

The production domain is configured in:

```text
src/config/site.js
```

Update `siteUrl` if the domain changes.

## Navigation

Navbar items and scroll-section order are defined in:

```text
src/data/navigation.js
```

Every navbar item should point to a real section `id` in the rendered page.
