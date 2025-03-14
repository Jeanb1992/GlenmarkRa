const CACHE_NAME = 'glenmark-ra-v2';
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';

// Lista de recursos a cachear
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  './src/img/Recurso (4).png',
  './src/img/Recurso (5).png',
  './src/img/Recurso (6).png',
  './src/img/Recurso (7).png',
  './src/img/Recurso (13).png',
  './src/img/Recurso (14).png',
  './src/img/Recurso (15).png',
  './src/img/Recurso (16).png',
  './src/img/Recurso (18).png',
  './src/img/Recurso (19).png',
  './src/img/Recurso (20).png',
  './src/img/Recurso (21).png',
  './src/img/Recurso (23).png',
  './src/img/Recurso (24).png',
  './src/img/Recurso (25).png',
  './src/img/Recurso (26).png',
  './src/img/Recurso (27).png',
  './src/img/Recurso (28).png',
  './src/img/Recurso (32).png',
  './src/img/Recurso (33).png',
  './src/img/Recurso (34).png',
  './src/img/Recurso (35).png',
  './src/img/Recurso (36).png',
  './src/img/Recurso (37).png',
  './src/img/Recurso (38).png',
  './src/img/Recurso (41).png',
  './src/img/boton 1.png',
  './src/img/boton 2.png',
  './src/img/fondo.png',
  './src/assets/3d/gltf/esfera-inicio.gltf',
  './src/assets/3d/gltf/esfera-inicial-estatica.gltf',
  './src/assets/3d/gltf/menu-inicial-animacion.gltf',
  './src/assets/3d/gltf/boton-glenmark-animacion.gltf',
  './src/assets/3d/gltf/boton-vision-animacion.gltf',
  './src/assets/3d/gltf/boton-biotecnologia-animacion.gltf',
  './src/assets/3d/gltf/boton-cadena-animacion.gltf',
  './src/assets/3d/gltf/boton-investigacion-animacion.gltf',
  './src/assets/3d/gltf/boton-operaciones-animacion.gltf',
  './src/assets/3d/gltf/mapa-animado.gltf',
  './src/assets/3d/gltf/menu2-animacion.gltf',
  './src/assets/3d/gltf/boton-esfera-plantas-animacion.gltf',
  './src/assets/3d/gltf/boton-esfera-investigacion-animacion.gltf',
  './src/assets/3d/gltf/boton-engranaje-investigacion-animacion.gltf',
  './src/assets/3d/gltf/boton-engranaje-pharma-animacion.gltf',
  './src/assets/3d/gltf/boton-engranaje-microscopio-animacion.gltf',
  './src/assets/3d/gltf/grafico-barras-animado.gltf',
  './src/assets/3d/gltf/cajas.gltf',
  // Windows 11 Icons
  './src/img/Icons/windows11/SmallTile.scale-100.png',
  './src/img/Icons/windows11/Square150x150Logo.scale-100.png',
  './src/img/Icons/windows11/Wide310x150Logo.scale-100.png',
  './src/img/Icons/windows11/LargeTile.scale-100.png',
  './src/img/Icons/windows11/Square44x44Logo.scale-100.png',
  './src/img/Icons/windows11/StoreLogo.scale-100.png',
  './src/img/Icons/windows11/SplashScreen.scale-100.png',
  // Android Icons
  './src/img/Icons/android/android-launchericon-512-512.png',
  './src/img/Icons/android/android-launchericon-192-192.png',
  './src/img/Icons/android/android-launchericon-144-144.png',
  './src/img/Icons/android/android-launchericon-96-96.png',
  './src/img/Icons/android/android-launchericon-72-72.png',
  './src/img/Icons/android/android-launchericon-48-48.png',
  // iOS Icons
  './src/img/Icons/ios/1024.png',
  './src/img/Icons/ios/180.png',
  './src/img/Icons/ios/152.png',
  './src/img/Icons/ios/120.png',
  './src/img/Icons/ios/87.png',
  './src/img/Icons/ios/80.png',
  './src/img/Icons/ios/76.png',
  './src/img/Icons/ios/60.png',
  // CDN Resources
  'https://unpkg.com/three@0.158.0/build/three.module.js',
  'https://unpkg.com/three@0.158.0/examples/jsm/loaders/GLTFLoader.js',
  'https://unpkg.com/three@0.158.0/examples/jsm/controls/OrbitControls.js'
];

// Instalar el Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      // Cachear recursos estáticos
      caches.open(STATIC_CACHE).then(cache => {
        console.log('Cacheando recursos estáticos');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Crear cache dinámico
      caches.open(DYNAMIC_CACHE)
    ])
    .then(() => self.skipWaiting()) // Forzar activación inmediata
  );
});

// Activar el Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      // Limpiar caches antiguos
      caches.keys().then(keys => {
        return Promise.all(
          keys.map(key => {
            if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
              console.log('Eliminando cache antiguo:', key);
              return caches.delete(key);
            }
          })
        );
      }),
      // Tomar control inmediatamente
      self.clients.claim()
    ])
  );
});

// Función para verificar si una URL es de un CDN permitido
const isAllowedCDN = (url) => {
  const allowedDomains = [
    'unpkg.com'
  ];
  return allowedDomains.some(domain => url.includes(domain));
};

// Interceptar peticiones
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Si encontramos una respuesta en cache, la devolvemos
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then(response => {
            // Si la respuesta no es válida, devolvemos el error
            if (!response || response.status !== 200 || response.type !== 'basic') {
              // Si es un recurso de CDN permitido, intentamos cachearlo
              if (isAllowedCDN(event.request.url)) {
                return caches.open(DYNAMIC_CACHE)
                  .then(cache => {
                    cache.put(event.request, response.clone());
                    return response;
                  });
              }
              return response;
            }

            // Clonar la respuesta antes de cachearla
            const responseToCache = response.clone();

            // Cachear la nueva respuesta
            caches.open(DYNAMIC_CACHE)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(error => {
            // Si falla la red, intentamos devolver una versión cacheada
            return caches.match(event.request);
          });
      })
  );
}); 