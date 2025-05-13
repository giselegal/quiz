// Cache versioning
const CACHE_VERSION = 'v4';
const CACHE_NAME = `quiz-sell-genius-${CACHE_VERSION}`;

// Lista de recursos críticos para LCP
const CRITICAL_LCP_ASSETS = [
  'https://res.cloudinary.com/dqljyf76t/image/upload/f_avif,q_80,w_450,c_limit,dpr_auto,e_sharpen:30/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.avif',
  'https://res.cloudinary.com/dqljyf76t/image/upload/f_webp,q_90,w_450,c_limit,dpr_auto,e_sharpen:30/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.webp',
  'https://res.cloudinary.com/dqljyf76t/image/upload/f_webp,q_100,w_140,h_60,c_fit,dpr_2.0,e_sharpen:100/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp'
];

// Lista de recursos para pré-cache
const STATIC_ASSETS = [
  '/',
  '/index.html'
];

// Lista de padrões de URL para cache de imagens
const IMAGE_CACHE_PATTERNS = [
  /res\.cloudinary\.com\/.*\/image\/upload/
];

// Evento de instalação: pré-cache de recursos estáticos priorizado para LCP
self.addEventListener('install', (event) => {
  // Skip waiting para ativar imediatamente
  self.skipWaiting();
  
  event.waitUntil(
    Promise.all([
      // Primeiro fazemos o cache dos recursos críticos LCP
      caches.open(CACHE_NAME).then((cache) => {
        console.log('Caching LCP resources');
        return cache.addAll(CRITICAL_LCP_ASSETS);
      }),
      // Depois fazemos o cache dos recursos estáticos
      caches.open(CACHE_NAME).then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
    ])
  );
});

// Evento de ativação: claim clients para controle imediato e limpeza de caches antigos
self.addEventListener('activate', (event) => {
  // Claim clients para controle imediato
  event.waitUntil(clients.claim());
  
  // Limpar caches antigos
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName.startsWith('quiz-sell-genius-') && cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName))
        );
      })
  );
});

// Evento de busca: estratégia de cache first para LCP, network first para o resto
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Verificar se é um recurso de LCP
  const isLCPResource = CRITICAL_LCP_ASSETS.includes(event.request.url);
  
  // Verificar se é uma imagem
  const isImage = IMAGE_CACHE_PATTERNS.some(pattern => pattern.test(event.request.url));
  
  // Para recursos LCP, usar cache-first para carregamento muito rápido
  if (isLCPResource) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request)
            .then((networkResponse) => {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(event.request, responseToCache));
              return networkResponse;
            });
        })
    );
  }
  // Para imagens em geral, usar cache-first também
  else if (isImage) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request)
            .then((networkResponse) => {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(event.request, responseToCache));
              return networkResponse;
            });
        })
    );
  }
  // Para outros recursos, usar stale-while-revalidate para melhor desempenho
  else {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          // Retorna imediatamente o cache se existir
          // E inicia uma busca na rede em segundo plano para atualizar o cache
          const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
              // Atualiza o cache com a resposta da rede
              if (networkResponse.ok) {
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => cache.put(event.request, responseToCache));
              }
              return networkResponse;
            });
          
          return cachedResponse || fetchPromise;
        })
    );
  }
});

// Evento de mensagem para controle do SW
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
