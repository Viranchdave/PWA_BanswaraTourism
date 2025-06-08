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
  'offline.html',         // <-- add offline fallback page here
  // Add your CSS, JS, fonts, etc. here explicitly
];

// INSTALL: Cache essential files
self.addEventListener('install', event => {
  self.skipWaiting(); // Activate new SW immediately
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
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      )
    )
  );
});

// FETCH: Cache-first for same-origin requests, fallback to offline page if navigation fails
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.origin === location.origin) {
    // For requests from your own origin, use cache first
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) return cachedResponse;

        return fetch(event.request).then(networkResponse => {
          // Cache fetched response for future requests
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        }).catch(() => {
          // If fetch fails and this is a navigation request, show offline page
          if (event.request.mode === 'navigate') {
            return caches.match('offline.html');
          }
          // For other requests, respond with a simple offline message
          return new Response('You are offline. Content not available.', {
            status: 503,
            statusText: 'Offline',
            headers: new Headers({ 'Content-Type': 'text/plain' })
          });
        });
      })
    );
  } else {
    // For external requests (like APIs), try network only
    event.respondWith(fetch(event.request).catch(() => {
      return new Response('You are offline. Content not available.', {
        status: 503,
        statusText: 'Offline',
        headers: new Headers({ 'Content-Type': 'text/plain' })
      });
    }));
  }
});
