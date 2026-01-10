const CACHE_NAME = 'athena-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './athena-icon.svg',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('SW: Start caching bestanden');
      return Promise.allSettled(
        urlsToCache.map(url => {
          return cache.add(url).catch(err => console.warn(`SW: Kon ${url} niet cachen:`, err));
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  // Alleen GET requests cachen
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});