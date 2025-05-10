// Cache versioning
const CACHE_VERSION = 'v1';
const CACHE_NAME = `quiz-sell-genius-${CACHE_VERSION}`;

// Lista de recursos para pré-cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/index.css'
];

// Lista de padrões de URL para cache de imagens
const IMAGE_CACHE_PATTERNS = [
  /res\.cloudinary\.com\/.*\/image\/upload/
];

// Evento de instalação: pré-cache de recursos estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Evento de ativação: limpeza de caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName.startsWith('quiz-sell-genius-') && cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Evento de busca: estratégia de cache para diferentes recursos
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Lidar com solicitações de imagens (cache primeiro, depois rede)
  if (IMAGE_CACHE_PATTERNS.some(pattern => pattern.test(event.request.url))) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Usar cache se disponível
          if (response) {
            return response;
          }
          
          // Caso contrário, buscar da rede e armazenar em cache
          return fetch(event.request)
            .then((networkResponse) => {
              // Somente cache respostas válidas
              if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                return networkResponse;
              }
              
              // Armazenar uma cópia em cache
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(event.request, responseToCache));
                
              return networkResponse;
            });
        })
    );
  } else {
    // Para outros recursos, usar estratégia "rede primeiro, depois cache"
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request)
            .then((cachedResponse) => {
              // Retornar do cache se a rede falhar
              if (cachedResponse) {
                return cachedResponse;
              }
              
              // Se não houver em cache e a rede falhar, retornar erro 
              return new Response('Network error occurred', {
                status: 408,
                headers: { 'Content-Type': 'text/plain' }
              });
            });
        })
    );
  }
});
