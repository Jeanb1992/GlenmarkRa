const CACHE_NAME = 'glenmark-ar-v1';
const urlsToCache = [
  './',
  './index.html',
  './assets/markers/targets.mind',
  './assets/3d/**/*',
  './img/**/*',
  'https://aframe.io/releases/1.5.0/aframe.min.js',
  'https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js',
  'https://cdn.jsdelivr.net/gh/donmccurdy/aframe-extras@v6.1.1/dist/aframe-extras.min.js',
  'https://code.jquery.com/jquery-3.6.0.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
}); 