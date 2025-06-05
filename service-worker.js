const CACHE_NAME = 'safar-cache-v1';
const URLS_TO_CACHE = [
  'index.html',
  'Home.html',
  'About Banswara.html',
  'TouristCircuits.html',
  'NearestAttract.html',
  'C.html',
  'Cont1.html',
  'TOC5 - Copy (4).html',
  'privacy_policy_embedded.html',
  'ChatGPT Image May 21, 2025, 10_07_56 PM.png',
  'SAFAR (10).png',
  'manifest.json',
  'service-worker.js'
  // Add paths to CSS, JS, images if any
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});
