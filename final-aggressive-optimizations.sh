#!/bin/bash

# Script para aplicar otimizações finais e agressivas para melhorar pontuação Lighthouse
echo "===== APLICANDO OTIMIZAÇÕES AGRESSIVAS DE PERFORMANCE ====="

# 1. Garantir que estamos usando a versão mais recente dos recursos
cd /workspaces/quiz-sell-genius-66

# 2. Otimizar imagens e preload
echo "Otimizando imagens e preload..."

# Otimizar preloads no index.html
cat > temp_index.html << 'EOL'
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Descubra Seu Estilo com Gisele Galvão | Vista-se de Você!</title>
    <meta name="description" content="Cansada do guarda-roupa lotado e nada combina? Faça o quiz da Gisele Galvão e descubra seu estilo com clareza e confiança. Resultado imediato!" />
    <meta name="author" content="Gisele Galvão" />
    <!-- Metadados básicos -->
    <meta property="og:title" content="Descubra Seu Estilo com Gisele Galvão | Vista-se de Você!" />
    <meta property="og:description" content="Cansada do guarda-roupa lotado e nada combina? Faça o quiz da Gisele Galvão e descubra seu estilo com clareza e confiança. Resultado imediato!" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://giselegalvao.com.br/" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Descubra Seu Estilo com Gisele Galvão | Vista-se de Você!" />
    <meta name="twitter:description" content="Cansada do guarda-roupa lotado e nada combina? Faça o quiz da Gisele Galvão e descubra seu estilo com clareza e confiança. Resultado imediato!" />
    <meta name="twitter:image" content="https://giselegalvao.com.br/" />
    
    <!-- Favicon embutido base64 para evitar requisição adicional -->
    <link rel="icon" href="data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJaWlgCWlpYWlpaWPJaWljyWlpY8lpaWPJaWljyWlpY8lpaWPJaWljyWlpY8lpaWPJaWljyWlpYWlpaWAAAAAADU1NQA1NTUM9vb27nl5eX/5eXl/+Xl5f/l5eX/5eXl/+Xl5f/l5eX/5eXl/+Xl5f/l5eX/29vbucPDwzPS0tIAAAAAANjY2APe3t7V5eXl/+Xl5f/l5eX/5eXl/+Xl5f/l5eX/5eXl/+Xl5f/l5eX/5eXl/+Xl5f/e3t7V1tbWAwAAAADc3NwA3d3dj+Xl5f/l5eX/5eXl/9ra2v+9vb3/s7Oz/7S0tP/BwcH/29vb/+Xl5f/l5eX/3d3dj9zc3AAAAAAAlpaWAJaWlkzl5eX/5eXl/7+/v/91dXX/VlZW/0hISP9JSUn/WVlZ/3t7e//Hx8f/5eXl/5aWlkyWlpYAAAAAAJaWlgCWlpYIl5eXg87Ozv+GhYb/jYyN/4yLjP9zcnP/dHN0/42MjP+NjIz/i4qL/87Ozv+Xl5eDlpaWCJaWlgAAAAAAlpaWAJaWlgCWlpYVlpaWiI2MjP+1tLX/srGy/4OCg/+Eg4P/srKy/7W0tf+MjIz/lpaWiJaWlhWWlpYAlpaWAAAAAACWlpYAlpaWAJaWlgCWlpYeioqK/8/Pz//Ozc7/n56f/6CfoP/Ozs7/z8/P/4qKiv+WlpYelpaWAJaWlgCWlpYAAAAAAAAAAAAAAAAAAAAAAAAAAPLy8v/y8vL/8vLy//Ly8v/y8vL/8vLy//Ly8v/y8vL/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJaWlgCWlpYO5eXl/+Xl5f/l5eX/5eXl/+Xl5f/l5eX/5eXl/+Xl5f+WlpYOlpaWAAAAAAAAAAAAAAAAAAAAAAAAAAAAlpaWCOXl5f/l5eX/5eXl/+Xl5f/l5eX/5eXl/+Xl5f/l5eX/lpaWCJaWlgAAAAAAAAAAAAAAAAAAAAAAAAAAANjY2APe3t7e5eXl/+Xl5f/l5eX/5eXl/+Xl5f/l5eX/3t7e3tjY2AMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADd3d0A3d3di+Xl5f/l5eX/5eXl/+Xl5f/l5eX/5eXl/93d3Yvd3d0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1dXVANXV1TDe3t7g5eXl/+Xl5f/l5eX/5eXl/97e3uDV1dUw1dXVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADR0dEA0dHRDtXV1YfZ2dnQ2dnZ0NXV1YfR0dEO0dHRAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAP9/AAD+PwAA8B8AAMAHAADgAwAA8AcAAPgPAAD8HwAA+A8AAOAHAADwDwAA/j8AAP9/AAD//wAA" type="image/x-icon">
    
    <!-- Preconnects para recursos externos -->
    <link rel="preconnect" href="https://res.cloudinary.com" crossorigin />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- Cache-Control agressivo -->
    <meta http-equiv="Cache-Control" content="max-age=604800, must-revalidate" />
    
    <!-- Preload do LCP principal (imagem principal) com máxima prioridade -->
    <link rel="preload" fetchpriority="high" as="image" href="https://res.cloudinary.com/dqljyf76t/image/upload/f_avif,q_80,w_450,c_limit,dpr_auto,e_sharpen:30/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.avif" type="image/avif" importance="high">
    
    <!-- Fallback para browsers que não suportam AVIF -->
    <link rel="preload" fetchpriority="high" as="image" href="https://res.cloudinary.com/dqljyf76t/image/upload/f_webp,q_90,w_450,c_limit,dpr_auto,e_sharpen:30/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.webp" type="image/webp">
    
    <!-- Preload do logo com menor prioridade -->
    <link rel="preload" as="image" href="https://res.cloudinary.com/dqljyf76t/image/upload/f_webp,q_100,w_140,h_60,c_fit,dpr_2.0,e_sharpen:100/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp" type="image/webp">
    
    <!-- Carregar fontes de forma otimizada -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Nunito:wght@400;500;600;700&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
    
    <!-- CSS crítico inline para renderização mais rápida -->
    <style>
      body{margin:0;padding:0;font-family:Inter,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility;background-color:#FEFEFE}#root{min-height:100vh;width:100%}.loading-fallback{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;background-color:#f9fafb}.loading-spinner{width:3rem;height:3rem;border-radius:50%;border:2px solid #e5e7eb;border-top-color:#b29670;animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}.loading-message{margin-top:1rem;color:#432818;font-family:Inter,sans-serif;font-size:.9rem}.font-playfair{font-family:'Playfair Display',serif}.quiz-intro-container{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:1rem;text-align:center;max-width:500px;margin:0 auto}.quiz-intro-image{max-width:450px;height:auto;object-fit:contain;image-rendering:high-quality}
    </style>
    
    <!-- Registrar Service Worker imediatamente -->
    <script>
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('ServiceWorker registration successful');
          })
          .catch(error => {
            console.error('ServiceWorker registration failed:', error);
          });
      }
    </script>
    
    <!-- Precarregar componente crítico QuizIntro -->
    <script type="module" src="./assets/quiz-intro-BnGHGiNF.js" preload></script>
  </head>
  <body>
    <div id="root">
      <!-- Fallback de carregamento para melhorar o LCP -->
      <div class="loading-fallback">
        <div class="loading-spinner"></div>
        <div class="loading-message">Carregando Quiz...</div>
      </div>
    </div>
    <script type="module" src="./src/main.jsx"></script>
  </body>
</html>
EOL

# Substituir o index.html
mv temp_index.html index.html

# 3. Otimizar o Service Worker
echo "Otimizando Service Worker..."

# Criar versão otimizada do Service Worker
cat > public/sw.js << 'EOL'
// Cache versioning
const CACHE_VERSION = 'v3';
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
  // Para outros recursos, usar network-first
  else {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request);
        })
    );
  }
});
EOL

# 4. Gerar Build com configuração agressiva
echo "Gerando build otimizado..."
npm run build

# 5. Copiar Service Worker para o diretório de build
echo "Copiando Service Worker para o diretório de build..."
cp public/sw.js dist/

echo "===== OTIMIZAÇÕES AGRESSIVAS CONCLUÍDAS ====="
echo "O site agora deve atingir uma pontuação de performance acima de 85!"
echo "Para testar, acesse: https://giselegalvao.com.br/"
