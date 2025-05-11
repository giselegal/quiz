// Service Worker corrigido para o subdiretório quiz-de-estilo
// Cache versioning
const CACHE_VERSION = 'v4';
const CACHE_NAME = `quiz-sell-genius-${CACHE_VERSION}`;
const BASE_PATH = '/quiz-de-estilo/';

// Lista de recursos críticos para LCP
const CRITICAL_LCP_ASSETS = [
  'https://res.cloudinary.com/dqljyf76t/image/upload/f_avif,q_80,w_450,c_limit,dpr_auto,e_sharpen:30/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.avif',
  'https://res.cloudinary.com/dqljyf76t/image/upload/f_webp,q_90,w_450,c_limit,dpr_auto,e_sharpen:30/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.webp',
  'https://res.cloudinary.com/dqljyf76t/image/upload/f_webp,q_100,w_140,h_60,c_fit,dpr_2.0,e_sharpen:100/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp'
];

// Lista de recursos para pré-cache
const STATIC_ASSETS = [
  BASE_PATH,
  `${BASE_PATH}index.html`,
  `${BASE_PATH}assets/`
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

// Evento de ativação: limpar caches antigos
self.addEventListener('activate', (event) => {
  // Tomar controle de todas as páginas imediatamente
  event.waitUntil(
    clients.claim().then(() => {
      // Limpar caches antigos
      return caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      });
    })
  );
});

// Estratégia de cache e rede para recursos estáticos com fallback offline
self.addEventListener('fetch', (event) => {
  // Apenas interceptar requisições GET
  if (event.request.method !== 'GET') return;
  
  // URL da requisição
  const url = new URL(event.request.url);
  
  // Ignorar requisições para análise ou recursos externos não críticos
  if (url.pathname.includes('/api/') || 
      url.pathname.includes('/analytics/') ||
      url.host.includes('google-analytics.com') ||
      url.host.includes('facebook.net')) {
    return;
  }
  
  // Estratégia para recursos estáticos (CSS, JS, HTML, etc.)
  if (url.pathname.endsWith('.js') || 
      url.pathname.endsWith('.css') || 
      url.pathname.endsWith('.html') ||
      url.pathname.endsWith('/') ||
      url.pathname === BASE_PATH.slice(0, -1)) {
    
    // Network First, então cache, com timeout
    const networkFirstWithTimeout = async () => {
      try {
        // Tentar rede com timeout de 1.5s
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Network timeout')), 1500);
        });
        
        const networkResponse = await Promise.race([
          fetch(event.request),
          timeoutPromise
        ]);
        
        // Se a resposta é válida, colocá-la no cache
        if (networkResponse.ok) {
          const clonedResponse = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clonedResponse);
          });
          return networkResponse;
        }
        throw new Error('Network response not ok');
      } catch (error) {
        // Em caso de erro de rede ou timeout, usar cache
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) return cachedResponse;
        
        // Caso seja uma navegação e não tenhamos cache, retornar página offline
        if (event.request.mode === 'navigate') {
          return caches.match(`${BASE_PATH}index.html`);
        }
        
        // Último recurso: offline fallback
        return new Response('Network error happened', {
          status: 408,
          headers: { 'Content-Type': 'text/plain' },
        });
      }
    };
    
    event.respondWith(networkFirstWithTimeout());
    return;
  }
  
  // Estratégia para imagens: Cache First, então Network
  if (
    url.pathname.endsWith('.png') || 
    url.pathname.endsWith('.jpg') || 
    url.pathname.endsWith('.jpeg') || 
    url.pathname.endsWith('.svg') || 
    url.pathname.endsWith('.gif') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.avif') ||
    IMAGE_CACHE_PATTERNS.some(pattern => pattern.test(url.href))
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        // Retornar do cache se existir
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Caso contrário, buscar da rede
        return fetch(event.request).then((networkResponse) => {
          // Verificar se é uma resposta válida
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          
          // Colocar no cache
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          
          return networkResponse;
        });
      })
    );
    return;
  }
  
  // Para outros recursos, usar estratégia padrão de rede, com fallback para cache
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
