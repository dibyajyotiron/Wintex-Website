import { products as originalProducts } from "../data/products.js";

// Extend the preview catalogue without changing the live V1 product range.
export const products = [
  ...originalProducts.map((product) => product.slug === "digital-indicator-it" ? {
    ...product,
    models: ["WP14", "WP74", "WS14"],
    specs: ["Available models: WP14, WP74 and WS14", ...product.specs],
  } : product),
  {
    slug: "load-cells",
    canonicalPath: "/v2/products/load-cells",
    name: "Load Cells",
    category: "Weighbridge load cells",
    image: "/assets/installation-1.jpeg",
    imageWidth: 1300,
    imageHeight: 928,
    download: "/assets/wintex-product-catalogue.pdf",
    downloadLabel: "Product catalogue",
    summary: "Wintex load cells for weighbridge applications, available in 30 t and 42.5 t capacities. Discuss your platform and weighing system with our team to select the right configuration.",
    capacities: ["30 t", "42.5 t"],
    specs: ["Available rated capacities: 30 t and 42.5 t", "Confirm mounting and indicator compatibility for your installation with the Wintex team"],
    features: ["Load measurement for weighbridge systems", "Capacity selection to suit your installation", "Configuration guidance from the Wintex team"],
    applications: ["Industrial weighbridges", "Vehicle weighing"],
    gallery: [
      { image: "/assets/installation-1.jpeg", width: 1300, height: 928, alt: "Wintex load cell with black mounting assembly" },
      { image: "/assets/installation-2.jpeg", width: 1300, height: 1253, alt: "Wintex load cell with metal mounting assembly" },
    ],
  },
];
