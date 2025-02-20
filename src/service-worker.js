const CACHE_NAME = 'glenmark-ra-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/main.js',
  // Agrega aquí todos tus recursos importantes
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        './',
        './index.html',
        './manifest.json',
        // ... otros recursos
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
}); 