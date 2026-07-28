/**
 * Shared WP page fetch with in-flight dedupe (stops React Strict Mode /
 * remounts from firing the same URL twice at once).
 */
const inflight = new Map();

export async function fetchWpJson(url) {
  if (!url) throw new Error("Missing WP URL");

  if (inflight.has(url)) {
    return inflight.get(url);
  }

  const promise = (async () => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`WP REST API responded ${res.status}`);
    return res.json();
  })().finally(() => {
    inflight.delete(url);
  });

  inflight.set(url, promise);
  return promise;
}
