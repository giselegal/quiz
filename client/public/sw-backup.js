const CACHE_NAME = 'quiz-sell-genius-v2';
const STATIC_CACHE_NAME = 'quiz-static-v2';
const DYNAMIC_CACHE_NAME = 'quiz-dynamic-v2';
const IMAGE_CACHE_NAME = 'quiz-images-v2';

// Recursos estáticos essenciais para cache inicial
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/assets/index.css',
  '/assets/index.js',
];

// Estratégias de cache por tipo de recurso
const CACHE_STRATEGIES = {
  static: [
    /\.js$/,
    /\.css$/,
    /\.woff2?$/,
    /\.ttf$/,
  ],
  image: [
    /\.png$/,
    /\.jpg$/,
    /\.jpeg$/,
    /\.svg$/,
    /\.webp$/,
    /\.avif$/,
  ],
  api: [
    /api\//,
    /supabase/,
  ],
};

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        return cache.addAll(STATIC_ASSETS).catch(err => {
          console.warn('Falha ao cachear alguns recursos estáticos:', err);
        });
      }),
      // Pre-cache de imagens críticas
      caches.open(IMAGE_CACHE_NAME).then((cache) => {
        return cache.addAll([
          '/assets/images/quiz-intro-bg.webp',
          '/assets/images/logo.webp',
        ]).catch(() => {
          // Ignorar erros de pre-cache de imagens
        });
      }),
    ])
  );
  self.skipWaiting();
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (![CACHE_NAME, STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME, IMAGE_CACHE_NAME].includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estratégias de fetch otimizadas
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requisições não-GET
  if (request.method !== 'GET') return;

  // Ignorar extensões do browser
  if (url.protocol === 'chrome-extension:') return;

  // Estratégia para imagens: Cache First com fallback
  if (CACHE_STRATEGIES.image.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Atualizar cache em background
          fetch(request).then((response) => {
            if (response && response.status === 200) {
              const responseClone = response.clone();
              caches.open(IMAGE_CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
          });
          return cachedResponse;
        }
        
        return fetch(request).then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          const responseToCache = response.clone();
          caches.open(IMAGE_CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          
          return response;
        }).catch(() => {
          // Retornar placeholder se imagem não estiver disponível
          return caches.match('/assets/images/placeholder.svg');
        });
      })
    );
    return;
  }

  // Estratégia para assets estáticos: Cache First
  if (CACHE_STRATEGIES.static.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request).then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          const responseToCache = response.clone();
          caches.open(STATIC_CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          
          return response;
        });
      })
    );
    return;
  }

  // Estratégia para API: Network First com cache fallback
  if (CACHE_STRATEGIES.api.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (!response || response.status !== 200) {
            throw new Error('Network response was not ok');
          }
          
          const responseToCache = response.clone();
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // Estratégia padrão: Network First
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});

// Sincronização em background (quando voltar online)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-analytics') {
    event.waitUntil(syncAnalytics());
  }
});

// Função para sincronizar analytics offline
async function syncAnalytics() {
  try {
    const cache = await caches.open('offline-analytics');
    const requests = await cache.keys();
    
    await Promise.all(
      requests.map(async (request) => {
        try {
          await fetch(request);
          await cache.delete(request);
        } catch (error) {
          console.error('Falha ao sincronizar analytics:', error);
        }
      })
    );
  } catch (error) {
    console.error('Erro na sincronização:', error);
  }
}
