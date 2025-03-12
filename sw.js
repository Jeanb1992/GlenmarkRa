const CACHE_NAME = 'glenmark-ra-v1';
const BASE_URL = 'https://jeanb1992.github.io/GlenmarkRa';

// Lista de recursos a cachear
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/sw.js',
  '/src/img/Recurso (4).png',
  '/src/img/Recurso (5).png',
  '/src/img/Recurso (6).png',
  '/src/img/Recurso (7).png',
  '/src/img/Recurso (13).png',
  '/src/img/Recurso (14).png',
  '/src/img/Recurso (15).png',
  '/src/img/Recurso (16).png',
  '/src/img/Recurso (18).png',
  '/src/img/Recurso (19).png',
  '/src/img/Recurso (20).png',
  '/src/img/Recurso (21).png',
  '/src/img/Recurso (23).png',
  '/src/img/Recurso (24).png',
  '/src/img/Recurso (25).png',
  '/src/img/Recurso (26).png',
  '/src/img/Recurso (27).png',
  '/src/img/Recurso (28).png',
  '/src/img/Recurso (32).png',
  '/src/img/Recurso (33).png',
  '/src/img/Recurso (34).png',
  '/src/img/Recurso (35).png',
  '/src/img/Recurso (36).png',
  '/src/img/Recurso (37).png',
  '/src/img/Recurso (38).png',
  '/src/img/Recurso (41).png',
  '/src/img/boton 1.png',
  '/src/img/boton 2.png',
  '/src/img/fondo.png',
  '/src/assets/3d/gltf/esfera-inicio.gltf',
  '/src/assets/3d/gltf/esfera-inicial-estatica.gltf',
  '/src/assets/3d/gltf/menu-inicial-animacion.gltf',
  '/src/assets/3d/gltf/boton-glenmark-animacion.gltf',
  '/src/assets/3d/gltf/boton-vision-animacion.gltf',
  '/src/assets/3d/gltf/boton-biotecnologia-animacion.gltf',
  '/src/assets/3d/gltf/boton-cadena-animacion.gltf',
  '/src/assets/3d/gltf/boton-investigacion-animacion.gltf',
  '/src/assets/3d/gltf/boton-operaciones-animacion.gltf',
  '/src/assets/3d/gltf/mapa-animado.gltf',
  '/src/assets/3d/gltf/menu2-animacion.gltf',
  '/src/assets/3d/gltf/boton-esfera-plantas-animacion.gltf',
  '/src/assets/3d/gltf/boton-esfera-investigacion-animacion.gltf',
  '/src/assets/3d/gltf/boton-engranaje-investigacion-animacion.gltf',
  '/src/assets/3d/gltf/boton-engranaje-pharma-animacion.gltf',
  '/src/assets/3d/gltf/boton-engranaje-microscopio-animacion.gltf',
  '/src/assets/3d/gltf/grafico-barras-animado.gltf',
  '/src/assets/3d/gltf/cajas.gltf',
  // Iconos
  '/src/img/Icons/android/72x72.png',
  '/src/img/Icons/android/96x96.png',
  '/src/img/Icons/android/144x144.png',
  '/src/img/Icons/android/192x192.png',
  '/src/img/Icons/android/512x512.png',
  '/src/img/Icons/ios/180x180.png',
  // CDN Resources
  'https://unpkg.com/three@0.158.0/build/three.module.js',
  'https://unpkg.com/three@0.158.0/examples/jsm/loaders/GLTFLoader.js',
  'https://unpkg.com/three@0.158.0/examples/jsm/controls/OrbitControls.js',
  'https://cdnjs.cloudflare.com/ajax/libs/tracking.js/1.1.3/tracking-min.js'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cacheando recursos iniciales');
        return cache.addAll(ASSETS_TO_CACHE.map(url => {
          // Si la URL es absoluta, la usamos tal cual
          if (url.startsWith('http')) {
            return url;
          }
          // Si no, la combinamos con la URL base
          return `${BASE_URL}${url}`;
        }));
      })
      .catch((error) => {
        console.error('Error en la instalación del cache:', error);
      })
  );
  // Forzar la activación inmediata
  self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Tomar el control inmediatamente
      clients.claim(),
      // Limpiar caches antiguos
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Eliminando cache antiguo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

// Estrategia de cache: Cache First, luego Network
self.addEventListener('fetch', (event) => {
  // No interceptar peticiones a otros dominios excepto las CDN específicas
  const allowedDomains = [
    'unpkg.com',
    'cdnjs.cloudflare.com',
    'jeanb1992.github.io'
  ];
  
  const url = new URL(event.request.url);
  const isAllowedDomain = allowedDomains.some(domain => url.hostname.includes(domain));
  
  if (!isAllowedDomain) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Si está en cache, lo servimos desde ahí
          return cachedResponse;
        }

        // Si no está en cache, lo pedimos a la red
        return fetch(event.request)
          .then((networkResponse) => {
            // Si la respuesta no es válida, la retornamos tal cual
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }

            // Clonamos la respuesta porque se consume al leerla
            const responseToCache = networkResponse.clone();

            // Guardamos en cache
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          })
          .catch(() => {
            // Si falla la red y es una petición de imagen o modelo 3D,
            // devolvemos una imagen/modelo por defecto
            if (event.request.destination === 'image') {
              return caches.match('/src/img/offline.png');
            }
            // Para otros recursos, mostramos un error
            return new Response('Error de red. Por favor, verifica tu conexión.');
          });
      })
  );
}); 