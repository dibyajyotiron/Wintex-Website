import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import PDFDocument from 'pdfkit';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assetDir = path.join(root, 'public', 'assets');
const specDir = path.join(assetDir, 'specs');

fs.mkdirSync(specDir, { recursive: true });

const brand = {
  red: '#e50914',
  redDark: '#9d0710',
  black: '#090909',
  graphite: '#171719',
  ink: '#161616',
  muted: '#5c6069',
  pale: '#f4f5f7',
};

const products = [
  {
    name: 'Pitless Weighbridge',
    slug: 'pitless-weighbridge',
    category: 'Heavy-duty vehicle weighing',
    capacity: 'Loadcell capacities: 10 ton, 30 ton and 42.5 ton',
    accuracy: 'Linearity <+/- 0.025% FSO, non-repeatability <+/- 0.01% FSO',
    image: 'pitless-weighbridge.png',
    summary:
      'A rugged vehicle-weighing system for factories, dispatch yards, mining sites, agricultural procurement, and logistics hubs.',
    features: [
      'Surface or pit mounted platform',
      '4, 6, 8 or 10 loadcell support',
      '150% safe overload',
      '0-60 Degree C compensated range',
      'Micro processor digital indicator',
      'Front panel calibration',
    ],
    applications: ['Factory dispatch', 'Mines and quarries', 'Logistics yards', 'Agricultural procurement'],
  },
  {
    name: 'Platform Scale',
    slug: 'platform-scale',
    category: 'Industrial floor weighing',
    capacity: '50 kg to 5 ton platform sizes',
    accuracy: 'Industrial-grade stability for daily operations',
    image: 'platform-scale.jpg',
    summary:
      'A heavy-duty floor weighing solution for material movement, packing, manufacturing, and warehouse operations.',
    features: ['Rugged platform build', 'Anti-skid surface', 'Configurable size', 'Easy calibration'],
    applications: ['Warehouse loading', 'Manufacturing', 'Packing lines', 'Bulk material handling'],
  },
  {
    name: 'Table Top Scale',
    slug: 'table-top-scale',
    category: 'Retail and counter operations',
    capacity: '3 kg to 60 kg options',
    accuracy: 'Fast response digital weighing',
    image: 'table-top-medium.jpg',
    summary: 'A compact digital counter scale for retail counters, labs, food processing desks, and dispatch points.',
    features: ['Bright digital display', 'Fast zero tracking', 'Battery backup option', 'Simple daily operation'],
    applications: ['Retail counters', 'Food processing', 'Laboratories', 'Dispatch desks'],
  },
  {
    name: 'Pole Display Scale',
    slug: 'pole-display-scale',
    category: 'Fast moving counters',
    capacity: '6 kg to 100 kg options',
    accuracy: 'Clear customer-facing readout',
    image: 'table-top-pole.jpg',
    summary: 'A customer-facing weighing system for counters and wholesale environments where visibility matters.',
    features: ['Raised display', 'Stable counter base', 'Clear readout', 'Billing-friendly workflow'],
    applications: ['Grocery counters', 'Wholesale markets', 'Packing stations', 'Billing desks'],
  },
  {
    name: 'Micro Mini Scale',
    slug: 'micro-mini-scale',
    category: 'Compact precision work',
    capacity: 'Compact capacity ranges for precise weighing',
    accuracy: 'Latest 24-bit sigma-delta converter with triple accuracy',
    image: 'micro-mini-scale.jpg',
    summary: 'A small footprint precision scale for light-duty work, testing, component weighing, and quality checks.',
    features: [
      '0.8 inch dual bright green LED',
      'Auto zero tracking',
      'RS-232 PC connection optional',
      'Printer port optional',
      'Carat, tola and grams conversion',
      '72 hrs battery backup',
    ],
    applications: ['Labs', 'Retail counters', 'Component weighing', 'Quality checks'],
  },
  {
    name: 'Jewellery Scale',
    slug: 'jewellery-scale',
    category: 'High sensitivity measurement',
    capacity: 'Fine weighing ranges for jewellery and valuables',
    accuracy: 'Latest 24-bit sigma-delta converter with triple accuracy',
    image: 'jewellery-scale.jpg',
    summary: 'A high-sensitivity scale for jewellery and valuables where fine measurement confidence is essential.',
    features: [
      'One touch calibration',
      'Automatic self-calibration support',
      'Piece counting',
      'Self-diagnostic software',
      'Full digital calibration',
      'Sturdy stainless steel cabinet',
    ],
    applications: ['Jewellery stores', 'Precious metals', 'Laboratories', 'Quality inspection'],
  },
];

async function generateLogos() {
  const fullLogo = path.join(assetDir, 'wintex-logo.png');
  const transparentLogo = path.join(assetDir, 'wintex-logo-transparent.png');
  const lockupLogo = path.join(assetDir, 'wintex-logo-lockup.png');
  const navbarLogo = path.join(assetDir, 'wintex-logo-navbar.png');

  const { data, info } = await sharp(fullLogo).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const isLightNeutral = max > 178 && max - min < 34;
    const isShadowNeutral = max > 132 && max - min < 18;
    if (isLightNeutral || isShadowNeutral) {
      data[i + 3] = 0;
    }
  }

  await sharp(data, { raw: info })
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(transparentLogo);

  await sharp(transparentLogo)
    .extract({ left: 0, top: 0, width: 977, height: 176 })
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(lockupLogo);

  const lockup = await sharp(lockupLogo).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const logoData = lockup.data;
  for (let i = 0; i < logoData.length; i += lockup.info.channels) {
    if (logoData[i + 3] < 8) continue;
    const r = logoData[i];
    const g = logoData[i + 1];
    const b = logoData[i + 2];
    const isRed = r > 95 && r > g * 1.35 && r > b * 1.35;
    if (isRed) {
      logoData[i] = 255;
      logoData[i + 1] = 25;
      logoData[i + 2] = 35;
    } else {
      logoData[i] = 255;
      logoData[i + 1] = 255;
      logoData[i + 2] = 255;
    }
  }
  await sharp(logoData, { raw: lockup.info }).png().toFile(navbarLogo);
}

function imagePath(file) {
  return path.join(assetDir, file);
}

function cardImage(doc, file, x, y, w, h) {
  doc.save().roundedRect(x, y, w, h, 8).clip();
  doc.image(imagePath(file), x, y, { width: w, height: h, fit: [w, h], align: 'center', valign: 'center' });
  doc.restore();
}

function pageFrame(doc, title, page) {
  doc.rect(0, 0, 596, 842).fill('#ffffff');
  doc.rect(0, 0, 596, 92).fill(brand.black);
  doc.image(imagePath('wintex-logo-navbar.png'), 36, 23, { width: 190 });
  doc.font('Helvetica-Bold').fontSize(10).fillColor('#ffffff').text(title, 380, 30, { width: 170, align: 'right' });
  doc.font('Helvetica').fontSize(8).fillColor('#a8adb6').text(`Page ${page}`, 380, 50, { width: 170, align: 'right' });
  doc.rect(0, 88, 596, 4).fill(brand.red);
}

function pill(doc, text, x, y, w) {
  doc.roundedRect(x, y, w, 24, 12).fill('#fff0f1');
  doc.font('Helvetica-Bold').fontSize(8).fillColor(brand.red).text(text, x, y + 8, { width: w, align: 'center' });
}

function productCard(doc, product, x, y, w, h) {
  doc.roundedRect(x, y, w, h, 8).fill('#f5f6f8');
  cardImage(doc, product.image, x + 10, y + 10, w - 20, 94);
  doc.font('Helvetica-Bold').fontSize(12).fillColor(brand.ink).text(product.name, x + 14, y + 116, { width: w - 28 });
  doc.font('Helvetica').fontSize(8.5).fillColor(brand.muted).text(product.category, x + 14, y + 134, { width: w - 28 });
  doc.font('Helvetica-Bold').fontSize(8).fillColor(brand.red).text(product.capacity, x + 14, y + 152, { width: w - 28 });
}

function drawContactFooter(doc) {
  doc.rect(0, 760, 596, 82).fill(brand.black);
  doc.font('Helvetica-Bold').fontSize(12).fillColor('#ffffff').text('Pionear Scales Industries', 36, 778);
  doc
    .font('Helvetica')
    .fontSize(8.5)
    .fillColor('#d7d9dd')
    .text('Narayan Commercial Complex, Gango Pal, Balitikuri Brahmin Para, Howrah - 711113, W.B. India', 36, 798, {
      width: 360,
    })
    .text('wintexscales74@gmail.com | +91 33 2653 5806 | +91 87777 27028', 36, 814, { width: 360 });
  doc.font('Helvetica-Bold').fontSize(10).fillColor(brand.red).text('Precision You Can Trust!', 410, 796, {
    width: 130,
    align: 'right',
  });
}

async function writePdf(file, draw) {
  await new Promise((resolve) => {
    const doc = new PDFDocument({ size: 'A4', margin: 0, autoFirstPage: false });
    const stream = fs.createWriteStream(file);
    stream.on('finish', resolve);
    doc.pipe(stream);
    draw(doc);
    doc.end();
  });
}

function makeSpec(product) {
  return writePdf(path.join(specDir, `${product.slug}.pdf`), (doc) => {
    doc.addPage();
    pageFrame(doc, `${product.name} Specification`, 1);
    cardImage(doc, product.image, 36, 122, 230, 220);
    doc.font('Helvetica-Bold').fontSize(29).fillColor(brand.ink).text(product.name, 292, 130, { width: 240 });
    doc.font('Helvetica').fontSize(11).fillColor(brand.muted).text(product.summary, 292, 206, { width: 240, lineGap: 4 });
    doc.font('Helvetica-Bold').fontSize(13).fillColor(brand.red).text('Core specification', 36, 382);
    [
      ['Capacity', product.capacity],
      ['Accuracy', product.accuracy],
      ['Electronics', 'Micro-processor and IC based digital weighing system'],
      ['Support', 'Installation, calibration, maintenance, and after-sales service'],
    ].forEach(([label, value], index) => {
      const y = 414 + index * 36;
      doc.font('Helvetica-Bold').fontSize(10).fillColor(brand.ink).text(label, 36, y);
      doc.font('Helvetica').fontSize(9.5).fillColor(brand.muted).text(value, 148, y, { width: 365 });
    });
    doc.font('Helvetica-Bold').fontSize(13).fillColor(brand.red).text('Features', 36, 592);
    product.features.forEach((item, index) => pill(doc, item, 36 + (index % 2) * 180, 622 + Math.floor(index / 2) * 34, 160));
    drawContactFooter(doc);
  });
}

function makeCatalogue() {
  return writePdf(path.join(assetDir, 'wintex-product-catalogue.pdf'), (doc) => {
    doc.addPage();
    doc.rect(0, 0, 596, 842).fill(brand.black);
    doc.image(imagePath('circuit-board.jpg'), 0, 0, { width: 596, height: 842, fit: [596, 842] });
    doc.rect(0, 0, 596, 842).fillOpacity(0.78).fill(brand.black).fillOpacity(1);
    doc.image(imagePath('wintex-logo-navbar.png'), 42, 46, { width: 250 });
    doc.font('Helvetica-Bold').fontSize(52).fillColor('#ffffff').text('Product Catalogue', 42, 170, { width: 430 });
    doc.font('Helvetica').fontSize(15).fillColor('#d7d9dd').text('Electronic weighing systems, weighbridges, platform scales, table-top scales, and precision instruments.', 46, 300, { width: 300, lineGap: 6 });
    cardImage(doc, 'wintex-product-render-1.jpg', 376, 88, 168, 246);
    cardImage(doc, 'pitless-weighbridge.png', 46, 428, 238, 160);
    cardImage(doc, 'table-top-medium.jpg', 310, 428, 238, 160);
    ['SMPS', 'Auto zero tracking', 'Micro processor controller', 'Bright LED display', 'Overload protection', 'Auto calibration', 'Tare mode', 'High speed weighing'].forEach((item, index) => {
      pill(doc, item, 46 + (index % 2) * 164, 640 + Math.floor(index / 2) * 34, 144);
    });
    doc.font('Helvetica-Bold').fontSize(12).fillColor(brand.red).text('Government-approved weighing systems | Precision You Can Trust!', 46, 792);

    doc.addPage();
    pageFrame(doc, 'Table Top, Platform & Precision Range', 2);
    doc.font('Helvetica-Bold').fontSize(30).fillColor(brand.ink).text('Scale range for every counter and floor.', 36, 124, { width: 500 });
    doc.font('Helvetica').fontSize(11).fillColor(brand.muted).text('Modernized from the original Wintex catalogue product range with updated product imagery and cleaner specifications.', 36, 198, { width: 500 });
    const gridProducts = products.filter((item) => item.slug !== 'pitless-weighbridge');
    gridProducts.forEach((product, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      productCard(doc, product, 36 + col * 264, 250 + row * 170, 232, 156);
    });
    drawContactFooter(doc);

    doc.addPage();
    pageFrame(doc, 'Weighbridge & Industrial Systems', 3);
    cardImage(doc, 'pitless-weighbridge.png', 36, 126, 524, 274);
    doc.font('Helvetica-Bold').fontSize(34).fillColor(brand.ink).text('Fully electronic weighbridge systems.', 36, 430, { width: 420 });
    doc.font('Helvetica').fontSize(11).fillColor(brand.muted).text(products[0].summary, 36, 512, { width: 500, lineGap: 4 });
    [
      ['Capacity', '30t, 40t, 50t, 60t, 80t, 100t and custom site configurations'],
      ['Platform size', 'Designed as per customer demand and site requirements'],
      ['Indicator', 'Digital indicator and intelligent terminal options'],
      ['Software', 'Weighlink-style database reporting, vehicle, supplier, material and transaction records'],
    ].forEach(([label, value], index) => {
      const y = 590 + index * 38;
      doc.font('Helvetica-Bold').fontSize(10).fillColor(brand.red).text(label, 36, y);
      doc.font('Helvetica').fontSize(9.5).fillColor(brand.ink).text(value, 132, y, { width: 390 });
    });
    drawContactFooter(doc);

    doc.addPage();
    pageFrame(doc, 'Company Profile & Support', 4);
    doc.font('Helvetica-Bold').fontSize(31).fillColor(brand.ink).text('Engineered around accuracy, reliability, and customer trust.', 36, 126, { width: 500 });
    doc.font('Helvetica').fontSize(11).fillColor(brand.muted).text('Pionear Scales Industries manufactures Wintex electronic weighing systems using hi-tech electronic components, micro-processor based circuits, strict quality checks, and practical after-sales service.', 36, 216, { width: 500, lineGap: 5 });
    const blocks = [
      ['Quality control', 'Each system is checked through disciplined production and testing processes aligned with accepted weighing standards.'],
      ['R&D led products', 'A dedicated R&D approach helps develop rugged mechanical structures and improved electronic systems.'],
      ['Service network', 'Factory and branch support across Kolkata, Jaipur, Mumbai, Delhi, Siliguri, Tata Nagar, Bhutan and Bangladesh.'],
      ['Customer fit', 'Products are selected and configured around customer capacity, workflow, accuracy and site needs.'],
    ];
    blocks.forEach(([title, text], index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = 36 + col * 264;
      const y = 348 + row * 132;
      doc.roundedRect(x, y, 232, 104, 8).fill('#f5f6f8');
      doc.font('Helvetica-Bold').fontSize(12).fillColor(brand.red).text(title, x + 16, y + 16, { width: 198 });
      doc.font('Helvetica').fontSize(9).fillColor(brand.muted).text(text, x + 16, y + 38, { width: 198, lineGap: 3 });
    });
    cardImage(doc, 'installation-1.jpeg', 36, 632, 248, 96);
    cardImage(doc, 'installation-2.jpeg', 312, 632, 248, 96);
    drawContactFooter(doc);
  });
}

await generateLogos();
await Promise.all(products.map(makeSpec));
await makeCatalogue();
