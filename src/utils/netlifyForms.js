export const NETLIFY_FORMS = {
  quote: "wintex_quote",
  whatsappInterest: "whatsapp_interest",
};

const recentSubmissions = new Map();

export async function submitNetlifyForm(formName, fields, { keepalive = false } = {}) {
  // Honeypots supplement Netlify's server-side spam filtering, not rate limiting.
  if (fields["bot-field"]) return;
  const fingerprint = JSON.stringify(fields);
  const previous = recentSubmissions.get(formName);
  if (previous?.fingerprint === fingerprint && Date.now() - previous.time < 30000) return previous.promise;
  const page = new URL(window.location.href);
  const payload = new URLSearchParams({
    "form-name": formName,
    submitted_at: new Date().toISOString(),
    page: /^https?:$/.test(page.protocol) ? page.origin + page.pathname : "",
    "bot-field": "",
    ...Object.fromEntries(
      Object.entries(fields).map(([key, value]) => [key, value ?? ""]),
    ),
  });

  // Coalesce accidental repeated clicks; server-side filtering remains essential.
  const submission = { fingerprint, time: Date.now() };
  submission.promise = fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: payload.toString(),
    keepalive,
  }).then(response => {
    if (!response.ok) throw new Error(`Netlify form submission failed with ${response.status}`);
  }).catch(error => {
    if (recentSubmissions.get(formName) === submission) recentSubmissions.delete(formName);
    throw error;
  });
  recentSubmissions.set(formName, submission);
  return submission.promise;
}
