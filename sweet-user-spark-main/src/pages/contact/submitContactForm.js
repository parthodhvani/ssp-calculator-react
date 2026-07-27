/**
 * submitContactForm.js
 * ---------------------------------------------------------------------------
 * Posts the contact form to Contact Form 7's built-in REST route.
 * No custom WP route required.
 *
 * Endpoint:
 *   POST {VITE_WP_API_URL}/wp-json/contact-form-7/v1/contact-forms/{FORM_ID}/feedback
 *
 * Env:
 *   VITE_WP_API_URL
 *   VITE_WP_CF7_FORM_ID   ← numeric ID from CF7 edit URL (?post=123)
 *
 * CF7 form fields must be named:
 *   your-name, your-email, your-topic, your-message
 *
 * To see submissions in WP admin: install the Flamingo plugin
 * (Flamingo → Inbound Messages).
 * ---------------------------------------------------------------------------
 */

const WP_API_URL = import.meta.env.VITE_WP_API_URL;
const CF7_FORM_ID = import.meta.env.VITE_WP_CF7_FORM_ID;

export function getCf7Endpoint() {
  if (!WP_API_URL || !CF7_FORM_ID) return null;
  const base = WP_API_URL.replace(/\/$/, "");
  const id = String(CF7_FORM_ID).trim();
  return `${base}/wp-json/contact-form-7/v1/contact-forms/${encodeURIComponent(id)}/feedback`;
}

/**
 * @param {{ name: string, email: string, topic: string, message: string }} fields
 * @returns {Promise<{ ok: boolean, status: string, message: string, raw?: object }>}
 */
export async function submitContactForm(fields) {
  const endpoint = getCf7Endpoint();
  if (!endpoint) {
    return {
      ok: false,
      status: "config_error",
      message:
        "Contact form is not configured. Set VITE_WP_API_URL and VITE_WP_CF7_FORM_ID, then restart Vite.",
    };
  }

  const formId = String(CF7_FORM_ID).trim();
  const body = new FormData();

  // CF7 field names (must match the form template in WP)
  body.append("your-name", fields.name ?? "");
  body.append("your-email", fields.email ?? "");
  body.append("your-topic", fields.topic ?? "");
  body.append("your-message", fields.message ?? "");

  // Required CF7 meta for headless submit
  body.append("_wpcf7", formId);
  body.append("_wpcf7_version", "5.9");
  body.append("_wpcf7_locale", "en_US");
  body.append("_wpcf7_unit_tag", `wpcf7-f${formId}-o1`);
  body.append("_wpcf7_container_post", "0");

  const res = await fetch(endpoint, {
    method: "POST",
    body, // do NOT set Content-Type — browser sets multipart boundary
  });

  let json = null;
  try {
    json = await res.json();
  } catch {
    // non-JSON error body
  }

  const status = json?.status || (res.ok ? "unknown" : "http_error");
  const message =
    json?.message ||
    (res.ok
      ? "Submitted."
      : `WordPress responded ${res.status}. Check CF7 form ID and CORS.`);

  // CF7 success statuses: mail_sent | mail_failed (mail failed but stored) | validation_failed | spam | …
  const ok = status === "mail_sent";

  return { ok, status, message, raw: json ?? undefined };
}

export default submitContactForm;
