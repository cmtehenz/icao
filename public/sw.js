const CACHE = "icao-pwa-v4";

/** Never cache API routes (tokens, auth). */
function isApi(path) {
  return path.startsWith("/api/");
}

/** Next.js build chunks — cache only hashed production assets. */
function isNextChunk(path) {
  return path.startsWith("/_next/");
}

function shouldPrecache(path) {
  return (
    path === "/" ||
    path === "/escutar-prova" ||
    path === "/icon.svg" ||
    path === "/icon-192.png" ||
    path === "/icon-512.png" ||
    path === "/apple-touch-icon.png" ||
    path === "/manifest.webmanifest"
  );
}

/** Runtime cache: exam ATC MP3s + Escutar Prova shell. */
function shouldRuntimeCache(url) {
  const path = new URL(url).pathname;
  if (isApi(path)) return false;
  if (path.startsWith("/provas/")) return true;
  if (path === "/escutar-prova") return true;
  if (path.startsWith("/_next/static/")) return true;
  return shouldPrecache(path);
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.addAll([
        "/",
        "/escutar-prova",
        "/icon.svg",
        "/icon-192.png",
        "/icon-512.png",
        "/apple-touch-icon.png",
      ]),
    ),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE && !key.startsWith("icao-escutar-prova-audio")).map((key) => caches.delete(key))),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (isApi(url.pathname)) return;

  // ATC + static: cache-first (works offline after first visit / pack download)
  if (url.pathname.startsWith("/provas/")) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request)
          .then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(CACHE).then((cache) => cache.put(event.request, copy));
            }
            return response;
          })
          .catch(() => cached);
      }),
    );
    return;
  }

  if (!shouldRuntimeCache(event.request.url) && !isNextChunk(url.pathname)) return;

  // App shell / hashed assets: network-first, fall back to cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok && shouldRuntimeCache(event.request.url)) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match("/escutar-prova"))),
  );
});
