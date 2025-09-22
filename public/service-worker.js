const CACHE_NAME = 'incr-ediblecupcakes-v1';
const RUNTIME = 'runtime';

// Zasoby do pre-cachowania
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/Incr-EdibleCupCakes Logo.png',
  '/icon-192.png',
  '/icon-512.png'
];

// Instalacja Service Workera
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

// Aktywacja Service Workera
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME, RUNTIME];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => {
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Obsługa żądań
self.addEventListener('fetch', (event) => {
  // Pomijamy żądania do API
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(RUNTIME).then((cache) => {
          return fetch(event.request).then((response) => {
            // Cachujemy tylko udane odpowiedzi
            if (response.status === 200) {
              cache.put(event.request, response.clone());
            }
            return response;
          });
        });
      })
    );
  }
});
