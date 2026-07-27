/**
 * submitContactForm.js
 * ---------------------------------------------------------------------------
 * Posts to the custom WordPress route in functions.php:
 *   POST {VITE_WP_API_URL}/wp-json/recura/v1/contact
 *
 * Submissions appear as private posts titled "Contact: …"
 * ---------------------------------------------------------------------------
 */

const WP_API_URL = import.meta.env.VITE_WP_API_URL;

export function getContactEndpoint() {
  if (!WP_API_URL) return null;
  return `${WP_API_URL.replace(/\/$/, "")}/wp-json/recura/v1/contact`;
}

/**
 * @param {{ name: string, email: string, topic: string, message: string }} fields
 * @returns {Promise<{ ok: boolean, status: string, message: string, raw?: object }>}
 */
export async function submitContactForm(fields) {
  const endpoint = getContactEndpoint();
  if (!endpoint) {
    return {
      ok: false,
      status: "config_error",
      message: "Set VITE_WP_API_URL in .env and restart Vite.",
    };
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: fields.name ?? "",
      email: fields.email ?? "",
      topic: fields.topic ?? "",
      message: fields.message ?? "",
    }),
  });

  let json = null;
  try {
    json = await res.json();
  } catch {
    // ignore
  }

  if (!res.ok) {
    return {
      ok: false,
      status: json?.code || "http_error",
      message: json?.message || `WordPress responded ${res.status}.`,
      raw: json ?? undefined,
    };
  }

  // Saved in WP even if wp_mail() fails on the server
  return {
    ok: true,
    status: json?.status || "saved",
    message: json?.message || "Message received.",
    raw: json ?? undefined,
  };
}

export default submitContactForm;
