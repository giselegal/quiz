#!/bin/bash

# Script para gerar um build corrigido para o subdiretório /quiz-de-estilo/

echo "Iniciando build corrigido para subdiretório..."

# Verificar se vite.config.ts tem a configuração base correta
if grep -q "base: '/quiz-de-estilo/'" ./vite.config.ts; then
  echo "Configuração base de Vite está correta!"
else
  echo "Corrigindo configuração base de Vite..."
  sed -i "s|base: '.*'|base: '/quiz-de-estilo/'|g" ./vite.config.ts
fi

# Verificar registro do Service Worker
echo "Verificando arquivos de Service Worker..."

# Gerar build
echo "Gerando build..."
npm run build

echo "Build gerado. Aplicando correções finais..."

# Verificar e corrigir o .htaccess
echo "Verificando .htaccess..."
cat << 'EOF' > ./dist/.htaccess
# Configurações otimizadas para Hostinger (Apache)

# Habilitar reescrita de URL para SPA (crucial para React Router)
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /quiz-de-estilo/

    # Se o arquivo solicitado não existir fisicamente, redirecionar para index.html
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.html [L,QSA]
</IfModule>

# Definir tipos MIME corretos (crucial para resolver problemas de script loading)
<IfModule mod_mime.c>
    # JavaScript
    AddType application/javascript .js
    AddType application/javascript .jsx
    AddType application/javascript .mjs
    AddType application/javascript .ts
    AddType application/javascript .tsx
    
    # JSON
    AddType application/json .json
    
    # Imagens modernas
    AddType image/webp .webp
    AddType image/avif .avif
    AddType image/svg+xml .svg
    AddType image/png .png
    AddType image/jpeg .jpg .jpeg
</IfModule>

# Desabilitar sniffing de MIME types (resolver erro de import.meta)
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    
    # Cabeçalhos específicos para JavaScript
    <FilesMatch "\.(js|jsx|mjs|ts|tsx)$">
        Header set Content-Type "application/javascript; charset=UTF-8"
    </FilesMatch>
    
    # Cabeçalhos específicos para JSON
    <FilesMatch "\.json$">
        Header set Content-Type "application/json; charset=UTF-8"
    </FilesMatch>
    
    # Cabeçalhos específicos para CSS
    <FilesMatch "\.css$">
        Header set Content-Type "text/css; charset=UTF-8"
    </FilesMatch>
</IfModule>
EOF

# Verificar e corrigir o registro do Service Worker no HTML
echo "Corrigindo registro do Service Worker..."
if grep -q "serviceWorker.register('/sw.js'" ./dist/index.html; then
  echo "Corrigindo caminho do Service Worker..."
  sed -i 's|serviceWorker.register(\'/sw.js\', { scope: \'/|serviceWorker.register(\'/quiz-de-estilo/sw.js\', { scope: \'/quiz-de-estilo/|g' ./dist/index.html
fi

# Gerar uma versão corrigida do Service Worker
echo "Gerando Service Worker corrigido..."
cat << 'EOF' > ./dist/sw.js
// Service Worker para subdiretório quiz-de-estilo
const CACHE_VERSION = 'v4';
const CACHE_NAME = `quiz-sell-genius-${CACHE_VERSION}`;
const BASE_PATH = '/quiz-de-estilo/';

// Lista de recursos críticos para LCP
const CRITICAL_LCP_ASSETS = [
  'https://res.cloudinary.com/dqljyf76t/image/upload/f_avif,q_80,w_450,c_limit,dpr_auto,e_sharpen:30/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.avif',
  'https://res.cloudinary.com/dqljyf76t/image/upload/f_webp,q_90,w_450,c_limit,dpr_auto,e_sharpen:30/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.webp'
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
    
    // Estratégia Cache First para recursos estáticos
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(event.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }
          
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          
          return networkResponse;
        }).catch(() => {
          // Se não conseguir obter da rede e for uma navegação, retornar index.html
          if (event.request.mode === 'navigate') {
            return caches.match(`${BASE_PATH}index.html`);
          }
        });
      })
    );
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
          if (!networkResponse || networkResponse.status !== 200) {
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
EOF

echo "Build corrigido para subdiretório concluído!"
echo "Agora você pode enviar os arquivos para o servidor."
