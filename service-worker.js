
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('safar-cache-v1').then(cache => {
      return cache.addAll([
        'index.html',
        'SAFAR (10).png',
        'ChatGPT Image May 21, 2025, 10_07_56 PM.png',
        'Home.html',
        'About Banswara.html',
        'NearestAttract.html',
        'TOC5 - Copy (4).html',
        'TouristCircuits.html',
        '21.html',
        'Cont1.html',
        'privacy_policy_embedded.html',
        'C.html'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
