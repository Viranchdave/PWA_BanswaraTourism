const CACHE_NAME = 'safar-cache-v1';

const URLS_TO_CACHE = [
  'index.html',
  'Home.html',
  'About Banswara.html',
  'TouristCircuits.html',
  'NearestAttract.html',
  'C.html',
  'Cont1.html',
  'TOC.html',
  'privacy_policy_embedded.html',
  'icon.png',
  'logo.png',
  'manifest.json',
  'service-worker.js',
  // Add paths to CSS, JS, fonts, etc. if needed
];

// INSTALL: Cache essential files
self.addEventListener('install', event => {
  self.skipWaiting(); // Activate new service worker immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// ACTIVATE: Remove old caches and take control immediately
self.addEventListener('activate', event => {
  self.clients.claim(); // Take control of all clients immediately
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});

// FETCH: Serve from cache first, then network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Serve from cache if available, else fetch from network
      return response || fetch(event.request).catch(() => {
        // Optionally add: return caches.match('/offline.html');
        return new Response('You are offline. Content not available.', {
          status: 503,
          statusText: 'Offline',
          headers: new Headers({ 'Content-Type': 'text/plain' })
        });
      });
    })
  );
});
