const CACHE = "icao-pwa-v3";

/** Never cache Next.js chunks — hashes change on every dev/build. */
function shouldCache(url) {
  const path = new URL(url).pathname;
  if (path.startsWith("/_next/")) return false;
  if (path.startsWith("/api/")) return false;
  return (
    path === "/" ||
    path === "/icon.svg" ||
    path === "/icon-192.png" ||
    path === "/icon-512.png" ||
    path === "/apple-touch-icon.png" ||
    path === "/manifest.webmanifest"
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.addAll(["/", "/icon.svg", "/icon-192.png", "/icon-512.png", "/apple-touch-icon.png"]),
    ),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (!shouldCache(event.request.url)) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetched = fetch(event.request)
        .then((response) => {
          if (response.ok && shouldCache(event.request.url)) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || fetched;
    }),
  );
});
