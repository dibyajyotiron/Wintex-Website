import { contactEmail, whatsappNumber } from "../config/site.js";
import { NETLIFY_FORMS, submitNetlifyForm } from "../utils/netlifyForms.js";

export function enquiryLinks(fields, productName) {
  const labels = { name: "Name", company: "Company", email: "Email", phone: "Phone", requirement: "Requirement" };
  const message = [
    "Hello Wintex, I would like to discuss a weighing system requirement.",
    productName && `Product: ${productName}`,
    ...Object.entries(labels).filter(([key]) => fields[key]?.trim()).map(([key, label]) => `${label}: ${fields[key].trim()}`),
  ].filter(Boolean).join("\n");
  return {
    message,
    whatsapp: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
    email: `mailto:${contactEmail}?subject=${encodeURIComponent(productName ? `Enquiry for ${productName}` : "Wintex weighing system enquiry")}&body=${encodeURIComponent(message)}`,
  };
}

export function handoffEnquiry(channel, fields, productName) {
  const links = enquiryLinks(fields, productName);
  // Open the selected app in the original user gesture, before any network work.
  if (channel === "email") window.location.href = links.email;
  else window.open(links.whatsapp, "_blank", "noopener,noreferrer");
  // Lead capture is best effort; it must never prevent composing an enquiry.
  void submitNetlifyForm(NETLIFY_FORMS.quote, {
    ...fields, channel, message: links.message,
  }, { keepalive: true }).catch(() => {});
  return links;
}
