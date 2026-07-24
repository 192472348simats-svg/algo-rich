// Pyodide Service Worker — Caches CDN files after first download
// On subsequent visits, Pyodide loads instantly from cache instead of re-downloading ~8MB.
// See: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API

const PYODIDE_CACHE = "pyodide-v0.26.4";
const PYODIDE_CDN_PREFIX = "https://cdn.jsdelivr.net/pyodide/v0.26.4/";

self.addEventListener("install", () => {
  // Skip waiting so the service worker activates immediately
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Clean up old Pyodide cache versions
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith("pyodide-") && key !== PYODIDE_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // Only intercept Pyodide CDN requests
  if (!url.startsWith(PYODIDE_CDN_PREFIX)) return;

  event.respondWith(
    caches.open(PYODIDE_CACHE).then((cache) =>
      cache.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Serve from cache instantly
          return cachedResponse;
        }

        // Not cached — fetch from CDN and store in cache
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse.ok) {
            // Clone response before storing (response body can only be read once)
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
      })
    )
  );
});
