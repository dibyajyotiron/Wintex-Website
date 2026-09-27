export const NETLIFY_FORMS = {
  quote: "wintex_quote",
  whatsappInterest: "whatsapp_interest",
};

export async function submitNetlifyForm(formName, fields, { keepalive = false } = {}) {
  const payload = new URLSearchParams({
    "form-name": formName,
    submitted_at: new Date().toISOString(),
    page: window.location.href,
    ...Object.fromEntries(
      Object.entries(fields).map(([key, value]) => [key, value ?? ""]),
    ),
  });

  const response = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: payload.toString(),
    keepalive,
  });

  if (!response.ok) {
    throw new Error(`Netlify form submission failed with ${response.status}`);
  }
}
