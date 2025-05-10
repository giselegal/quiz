// Cache versioning
const CACHE_VERSION = 'v5';
const CACHE_NAME = `quiz-sell-genius-${CACHE_VERSION}`;
const RUNTIME_CACHE = `quiz-sell-genius-runtime-${CACHE_VERSION}`;

// Lista de recursos críticos para LCP
const CRITICAL_LCP_ASSETS = [
  'https://res.cloudinary.com/dqljyf76t/image/upload/f_avif,q_80,w_450,c_limit,dpr_auto,e_sharpen:30/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.avif',
  'https://res.cloudinary.com/dqljyf76t/image/upload/f_webp,q_90,w_450,c_limit,dpr_auto,e_sharpen:30/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.webp',
  'https://res.cloudinary.com/dqljyf76t/image/upload/f_webp,q_100,w_140,h_60,c_fit,dpr_2.0,e_sharpen:100/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp'
];

// Lista de recursos para pré-cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/assets/vendor-react-*.js',
  '/assets/vendor-ui-*.js',
  '/assets/main-*.js',
  '/assets/index-*.css',
  '/favicon.ico',
  '/placeholder.svg'
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
      // Primeiro fazemos o cache dos recursos críticos LCP em paralelo para melhor desempenho
      caches.open(CACHE_NAME).then((cache) => {
        console.log('Caching LCP resources');
        const fetchPromises = CRITICAL_LCP_ASSETS.map(url => 
          fetch(url, { credentials: 'same-origin', priority: 'high' })
            .then(response => {
              if (!response.ok) {
                throw new Error(`Failed to fetch ${url}`);
              }
              return cache.put(url, response);
            })
            .catch(err => {
              console.warn(`Não foi possível cachear LCP asset ${url}: ${err.message}`);
            })
        );
        return Promise.all(fetchPromises);
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
            .filter((cacheName) => {
              return (cacheName.startsWith('quiz-sell-genius-') && 
                     cacheName !== CACHE_NAME && 
                     cacheName !== RUNTIME_CACHE);
            })
            .map((cacheName) => {
              console.log('Limpando cache antigo:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
  );
});

// Evento de busca: estratégia de cache first para LCP, network first para o resto
self.addEventListener('fetch', (event) => {
  // Ignorar requisições que não são GET
  if (event.request.method !== 'GET') return;
  
  // Ignorar requisições de analytics para não impactar métricas
  const url = new URL(event.request.url);
  if (url.pathname.includes('/analytics') || 
      url.pathname.includes('/gtm') || 
      url.hostname.includes('googletagmanager') || 
      url.hostname.includes('google-analytics')) {
    return;
  }
  
  // Verificar se é um recurso de LCP
  const isLCPResource = CRITICAL_LCP_ASSETS.includes(event.request.url);
  
  // Verificar se é uma imagem
  const isImage = IMAGE_CACHE_PATTERNS.some(pattern => pattern.test(event.request.url)) || 
                  event.request.destination === 'image';
  
  // Verificar se é um script ou estilo CSS
  const isAsset = event.request.destination === 'script' || 
                  event.request.destination === 'style';
  
  // Para recursos LCP, usar cache-first para carregamento muito rápido
  if (isLCPResource) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Usar cache se disponível
          if (response) {
            return response;
          }
          
          // Se não estiver em cache, buscar na rede
          return fetch(event.request, { priority: 'high' })
            .then((networkResponse) => {
              // Clonar a resposta para poder colocá-la no cache
              const responseToCache = networkResponse.clone();
              if (networkResponse.ok) {
                caches.open(CACHE_NAME)
                  .then((cache) => cache.put(event.request, responseToCache));
              }
              return networkResponse;
            })
            .catch(error => {
              console.error('Erro ao buscar recurso LCP:', error);
              // Nenhum fallback para recursos LCP críticos
            });
        })
    );
  }
  // Para imagens em geral, usar cache-first com fallback para placeholder
  else if (isImage) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Usar cache se disponível
          if (response) {
            return response;
          }
          
          // Se não estiver em cache, buscar na rede
          return fetch(event.request)
            .then((networkResponse) => {
              // Clonar a resposta para poder colocá-la no cache
              const responseToCache = networkResponse.clone();
              if (networkResponse.ok) {
                caches.open(RUNTIME_CACHE)
                  .then((cache) => cache.put(event.request, responseToCache));
              }
              return networkResponse;
            })
            .catch(error => {
              console.warn('Erro ao buscar imagem:', error);
              // Tentar retornar um placeholder se a imagem falhar
              return caches.match('/placeholder.svg');
            });
        })
    );
  }
  // Para scripts e estilos, usar stale-while-revalidate para equilibrar velocidade e atualização
  else if (isAsset) {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          // Iniciar busca na rede em paralelo
          const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
              // Se a resposta da rede for válida, atualizar o cache
              if (networkResponse.ok) {
                const responseToCache = networkResponse.clone();
                caches.open(RUNTIME_CACHE)
                  .then((cache) => cache.put(event.request, responseToCache));
              }
              return networkResponse;
            })
            .catch(error => {
              console.warn('Erro ao buscar asset:', error);
              // Em caso de falha, não temos como retornar nada aqui porque
              // o cachedResponse já será retornado se existir
              return null;
            });
          
          // Retornar do cache imediatamente se disponível, ou aguardar busca na rede
          return cachedResponse || fetchPromise;
        })
    );
  }
  // Para navegação (HTML) e outros recursos, usar network-first para conteúdo sempre atual
  else {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // Se a resposta da rede for válida, atualizar o cache e retornar
          if (networkResponse.ok) {
            const responseToCache = networkResponse.clone();
            caches.open(RUNTIME_CACHE)
              .then((cache) => cache.put(event.request, responseToCache));
          }
          return networkResponse;
        })
        .catch(error => {
          console.warn('Erro ao buscar recurso, tentando do cache:', error);
          // Em caso de falha na rede, buscar do cache
          return caches.match(event.request);
        })
    );
  }
});

// Evento de mensagem para controle do SW e limpeza periódica de cache
self.addEventListener('message', (event) => {
  if (event.data) {
    if (event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    } else if (event.data.type === 'CLEAN_CACHES') {
      // Limpar caches obsoletos periodicamente para economizar espaço
      caches.open(RUNTIME_CACHE).then(cache => {
        cache.keys().then(keys => {
          if (keys.length > 200) { // Limitar o número de entradas no cache
            // Remover os itens mais antigos, mantendo os 100 mais recentes
            keys.slice(0, keys.length - 100).forEach(key => {
              cache.delete(key);
            });
          }
        });
      });
    }
  }
});
