export const whatsappNumber = "918777727028";

export const contactEmail = "wintexscales74@gmail.com";

export const phoneNumbers = {
  primary: "+91 87777 27028",
  primaryHref: "tel:+918777727028",
  office: "+91 33 2653 5806",
  officeHref: "tel:+913326535806",
};

export const mapUrl =
  "https://www.google.com/maps/place/Pionear+Scales+Industries/@22.6076521,88.2982335,16.03z/data=!4m6!3m5!1s0x3a02787155555555:0xe7dbf07393283989!8m2!3d22.6049346!4d88.2996271!16s%2Fg%2F11frsld4q2?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D";

export const mapEmbedUrl =
  "https://www.google.com/maps?q=22.6049346,88.2996271(Pionear%20Scales%20Industries)&z=16&output=embed";

export const address =
  "Narayan Commercial Complex, Gango Pal, Balitikuri Brahmin Para, Howrah - 711113, W.B. India";

export const cataloguePath = "/assets/wintex-product-catalogue.pdf";

export const siteUrl = "https://www.wintex-scales.com";

export const siteName = "Wintex Scales";

export const organizationName = "Pionear Scales Industries";

export const defaultSeoDescription =
  "Wintex Scales manufactures electronic weighing scales, weighbridges, precision scales, platform scales, table top scales, jewellery scales, and digital weighing systems in Howrah, West Bengal.";

export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function productPath(slug) {
  return `/products/${slug}`;
}
