import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assetDir = path.join(root, "public", "assets");
const optimizedDir = path.join(assetDir, "optimized");
const iconDir = path.join(assetDir, "icons");

const productWidths = [360, 540, 640, 720, 960, 1280];
const logoWidths = [180, 360, 720];

const imageJobs = [
  { file: "hero-weighbridge-shared.jpeg", widths: [640, 960, 1280] },
  { file: "pitless-weighbridge.png", widths: productWidths },
  { file: "weighbridge-main.png", widths: productWidths },
  { file: "unmanned-weighbridge-system.png", widths: productWidths },
  { file: "power-lightning-protection-device.png", widths: productWidths },
  { file: "heavy-duty-platform-scale.png", widths: productWidths },
  { file: "weighbridge-type-pit.png", widths: [360, 540, 720] },
  { file: "weighbridge-type-pitless.png", widths: [360, 540, 720] },
  { file: "weighbridge-type-modular.png", widths: [360, 540, 720] },
  { file: "weighbridge-type-semi-rcc.png", widths: [360, 540, 720] },
  { file: "table-top-medium.jpg", widths: productWidths },
  { file: "chicken-scale.jpg", widths: productWidths },
  { file: "jewellery-scale.jpg", widths: productWidths },
  { file: "micro-mini-scale.jpg", widths: productWidths },
  { file: "wintex-product-render-2.jpg", widths: productWidths },
  { file: "circuit-board.jpg", widths: [480, 720, 960, 1440, 1800] },
  { file: "tata-steel-logo.png", widths: logoWidths },
  { file: "lt-logo.png", widths: logoWidths },
  { file: "exide-logo.jpg", widths: logoWidths },
  { file: "jindal-logo.jpg", widths: logoWidths },
  { file: "client-mark.png", widths: logoWidths },
  { file: "wintex-logo-navbar.png", widths: logoWidths },
  { file: "wintex-logo-transparent.png", widths: logoWidths },
];

function basename(file) {
  return file.replace(/\.[^.]+$/, "");
}

async function writeVariant(file, width, format) {
  const input = path.join(assetDir, file);
  const output = path.join(optimizedDir, `${basename(file)}-${width}.${format}`);
  const pipeline = sharp(input)
    .rotate()
    .resize({ width, withoutEnlargement: true });

  if (format === "avif") {
    await pipeline.avif({ quality: 58, effort: 4 }).toFile(output);
    return;
  }

  await pipeline.webp({ quality: 76, effort: 4 }).toFile(output);
}

async function generateResponsiveImages() {
  await fs.mkdir(optimizedDir, { recursive: true });

  for (const job of imageJobs) {
    for (const width of job.widths) {
      await writeVariant(job.file, width, "avif");
      await writeVariant(job.file, width, "webp");
    }
  }
}

async function makeIcon(size, output, { maskable = false } = {}) {
  const logo = await sharp(path.join(assetDir, "wintex-logo-navbar.png"))
    .resize({
      width: Math.round(size * (maskable ? 0.62 : 0.78)),
      height: Math.round(size * (maskable ? 0.62 : 0.78)),
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 8, g: 8, b: 8, alpha: 1 },
    },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toFile(path.join(iconDir, output));
}

async function generateIcons() {
  await fs.mkdir(iconDir, { recursive: true });
  await makeIcon(192, "icon-192.png");
  await makeIcon(512, "icon-512.png");
  await makeIcon(512, "maskable-icon-512.png", { maskable: true });
  await makeIcon(180, "apple-touch-icon.png");
}

await generateResponsiveImages();
await generateIcons();

console.log(`Generated responsive assets in ${path.relative(root, optimizedDir)} and PWA icons in ${path.relative(root, iconDir)}.`);
