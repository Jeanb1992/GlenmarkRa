const CACHE_NAME = 'glenmark-ra-v1';
const BASE_URL = 'https://jeanb1992.github.io/GlenmarkRa';
const ASSETS_TO_CACHE = [
  `${BASE_URL}/`,
  `${BASE_URL}/index.html`,
  `${BASE_URL}/src/manifest.json`,
  `${BASE_URL}/src/img/Recurso (4).png`,
  `${BASE_URL}/src/img/Recurso (5).png`,
  `${BASE_URL}/src/img/Recurso (6).png`,
  `${BASE_URL}/src/img/Recurso (7).png`,
  `${BASE_URL}/src/img/Recurso (13).png`,
  `${BASE_URL}/src/img/Recurso (14).png`,
  `${BASE_URL}/src/img/Recurso (15).png`,
  `${BASE_URL}/src/img/Recurso (16).png`,
  `${BASE_URL}/src/img/Recurso (18).png`,
  `${BASE_URL}/src/img/Recurso (19).png`,
  `${BASE_URL}/src/img/Recurso (20).png`,
  `${BASE_URL}/src/img/Recurso (21).png`,
  `${BASE_URL}/src/img/Recurso (23).png`,
  `${BASE_URL}/src/img/Recurso (24).png`,
  `${BASE_URL}/src/img/Recurso (25).png`,
  `${BASE_URL}/src/img/Recurso (26).png`,
  `${BASE_URL}/src/img/Recurso (27).png`,
  `${BASE_URL}/src/img/Recurso (28).png`,
  `${BASE_URL}/src/img/Recurso (32).png`,
  `${BASE_URL}/src/img/Recurso (33).png`,
  `${BASE_URL}/src/img/Recurso (34).png`,
  `${BASE_URL}/src/img/Recurso (35).png`,
  `${BASE_URL}/src/img/Recurso (36).png`,
  `${BASE_URL}/src/img/Recurso (37).png`,
  `${BASE_URL}/src/img/Recurso (38).png`,
  `${BASE_URL}/src/img/Recurso (41).png`,
  `${BASE_URL}/src/img/boton 1.png`,
  `${BASE_URL}/src/img/boton 2.png`,
  `${BASE_URL}/src/img/fondo.png`,
  `${BASE_URL}/src/assets/3d/gltf/esfera-inicio.gltf`,
  `${BASE_URL}/src/assets/3d/gltf/esfera-inicial-estatica.gltf`,
  `${BASE_URL}/src/assets/3d/gltf/menu-inicial-animacion.gltf`,
  `${BASE_URL}/src/assets/3d/gltf/boton-glenmark-animacion.gltf`,
  `${BASE_URL}/src/assets/3d/gltf/boton-vision-animacion.gltf`,
  `${BASE_URL}/src/assets/3d/gltf/boton-biotecnologia-animacion.gltf`,
  `${BASE_URL}/src/assets/3d/gltf/boton-cadena-animacion.gltf`,
  `${BASE_URL}/src/assets/3d/gltf/boton-investigacion-animacion.gltf`,
  `${BASE_URL}/src/assets/3d/gltf/boton-operaciones-animacion.gltf`,
  `${BASE_URL}/src/assets/3d/gltf/mapa-animado.gltf`,
  `${BASE_URL}/src/assets/3d/gltf/menu2-animacion.gltf`,
  `${BASE_URL}/src/assets/3d/gltf/boton-esfera-plantas-animacion.gltf`,
  `${BASE_URL}/src/assets/3d/gltf/boton-esfera-investigacion-animacion.gltf`,
  `${BASE_URL}/src/assets/3d/gltf/boton-engranaje-investigacion-animacion.gltf`,
  `${BASE_URL}/src/assets/3d/gltf/boton-engranaje-pharma-animacion.gltf`,
  `${BASE_URL}/src/assets/3d/gltf/boton-engranaje-microscopio-animacion.gltf`,
  `${BASE_URL}/src/assets/3d/gltf/grafico-barras-animado.gltf`,
  `${BASE_URL}/src/assets/3d/gltf/cajas.gltf`,
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
        console.log('Cache abierto');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch((error) => {
        console.error('Error en la instalación del cache:', error);
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Estrategia de cache: Cache First, luego Network
self.addEventListener('fetch', (event) => {
  // Ignorar las peticiones a CDNs externas
  if (!event.request.url.startsWith(BASE_URL)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response; // Si está en cache, lo servimos desde ahí
        }
        
        // Si no está en cache, lo pedimos a la red
        return fetch(event.request)
          .then((response) => {
            // Si la respuesta no es válida, retornamos la respuesta tal cual
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clonamos la respuesta porque se consume al leerla
            const responseToCache = response.clone();
            
            // Agregamos la respuesta al cache
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          });
      })
  );
}); 