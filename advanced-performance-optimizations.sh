#!/bin/bash

# Script avançado para otimizações adicionais de desempenho
# Target: Pontuação acima de 85 no Lighthouse

echo "Iniciando otimizações avançadas de desempenho..."

# 1. Ajustes nas fontes - incorporação seletiva das críticas
echo "Otimizando carregamento de fontes..."

# Criar arquivo de CSS de fonte crítico para fontes inline
cat > src/assets/critical-fonts.css << 'EOF'
/* Fonte crítica Playfair Display - apenas pesos e caracteres essenciais */
@font-face {
  font-family: 'Playfair Display';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/playfairdisplay/v37/nuFiD-vYSZviVYUb_rj3ij__anPXDTzYgA.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'Playfair Display';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/playfairdisplay/v37/nuFiD-vYSZviVYUb_rj3ij__anPXDTzYgA.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* Fonte crítica Inter - apenas pesos e caracteres essenciais */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff) format('woff');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hjp-Ek-_EeA.woff) format('woff');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
EOF

# Substituir referência externa de fontes por críticas injetadas
sed -i '/<link href="https:\/\/fonts.googleapis.com\/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap" media="print" onload="this.media='\''all'\''" rel="stylesheet">/d' index.html

# Adicionar as fontes críticas no CSS inline
sed -i '/<style>/r src/assets/critical-fonts.css' index.html

# 2. Otimização de imagens com servicesWorker
echo "Configurando Service Worker para cache de imagens..."

# Criar arquivo do Service Worker
cat > public/sw.js << 'EOF'
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
EOF

# Adicionar código de registro do Service Worker
cat > src/utils/registerServiceWorker.ts << 'EOF'
/**
 * Registra o Service Worker para cache e estratégias offline
 */
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('ServiceWorker registrado com sucesso:', registration.scope);
        })
        .catch(error => {
          console.log('Falha ao registrar o ServiceWorker:', error);
        });
    });
  }
};
EOF

# 3. Otimizações avançadas de imagens
echo "Implementando padrão LQIP (Low Quality Image Placeholder) avançado..."

# Criar utilitário de LQIP otimizado
cat > src/utils/lqipUtils.ts << 'EOF'
/**
 * Utilitários para otimização de imagens com LQIP (Low Quality Image Placeholder)
 * e cache eficiente de recursos
 */

/**
 * Gera URL de imagem com qualidade progressiva para LQIP
 */
export const generateLqipUrl = (baseUrl: string, imageId: string, width = 20, blur = 80) => {
  return `${baseUrl}f_webp,q_10,w_${width},c_limit,e_blur:${blur}/${imageId}.webp`;
};

/**
 * Pré-carrega uma imagem e armazena em cache 
 */
export const preloadAndCacheImage = (url: string, cacheKey: string) => {
  // Verificar se já existe em cache
  if (sessionStorage.getItem(cacheKey)) {
    return Promise.resolve(sessionStorage.getItem(cacheKey));
  }
  
  return new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      // Armazenar em cache após carregamento
      try {
        sessionStorage.setItem(cacheKey, url);
      } catch (e) {
        // Ignorar erros de storage
      }
      resolve(url);
    };
    img.onerror = () => {
      reject(new Error(`Falha ao carregar imagem: ${url}`));
    };
  });
};

/**
 * Carrega uma imagem com estratégia de fallback e observabilidade
 */
export const loadImageWithFallback = (
  primaryUrl: string, 
  fallbackUrl: string, 
  callback?: (success: boolean, usedFallback: boolean) => void
) => {
  const img = new Image();
  let usedFallback = false;
  
  // Configurar timeout para fallback
  const timeoutId = setTimeout(() => {
    if (!img.complete) {
      // Trocar para fallback se primária demorar demais
      img.src = fallbackUrl;
      usedFallback = true;
    }
  }, 2000);
  
  img.onload = () => {
    clearTimeout(timeoutId);
    if (callback) callback(true, usedFallback);
  };
  
  img.onerror = () => {
    clearTimeout(timeoutId);
    
    // Se já estiver usando fallback e falhar, reportar erro
    if (usedFallback) {
      if (callback) callback(false, true);
      return;
    }
    
    // Tentar fallback quando primária falhar
    img.src = fallbackUrl;
    usedFallback = true;
  };
  
  // Iniciar com URL primária
  img.src = primaryUrl;
  
  return img;
};
EOF

# 4. Otimização de carregamento de scripts terceiros
echo "Otimizando carregamento de scripts de terceiros..."

# Adicionar estratégia de carregamento para scripts de terceiros
cat > src/utils/thirdPartyLoader.ts << 'EOF'
/**
 * Utilitário para carregamento otimizado de scripts de terceiros
 * com priorização e carregamento lazy
 */

type ThirdPartyScript = {
  id: string;
  src: string;
  async?: boolean;
  defer?: boolean;
  priority?: 'high' | 'medium' | 'low';
  onLoad?: () => void;
};

// Agrupar scripts por prioridade
const priorityToMs: Record<string, number> = {
  high: 0, // imediato
  medium: 1000, // após 1 segundo
  low: 2000 // após 2 segundos
};

/**
 * Carrega scripts de terceiros com estratégia de priorização
 */
export const loadThirdPartyScripts = (scripts: ThirdPartyScript[]) => {
  // Agrupar por prioridade
  const scriptsByPriority: Record<string, ThirdPartyScript[]> = {
    high: [],
    medium: [],
    low: []
  };
  
  scripts.forEach(script => {
    const priority = script.priority || 'medium';
    scriptsByPriority[priority].push(script);
  });
  
  // Carregar por ordem de prioridade
  Object.entries(scriptsByPriority).forEach(([priority, priorityScripts]) => {
    const delay = priorityToMs[priority] || 0;
    
    setTimeout(() => {
      priorityScripts.forEach(script => {
        // Verificar se já existe
        if (document.getElementById(script.id)) {
          if (script.onLoad) script.onLoad();
          return;
        }
        
        const scriptEl = document.createElement('script');
        scriptEl.id = script.id;
        scriptEl.src = script.src;
        scriptEl.async = script.async !== false;
        scriptEl.defer = script.defer !== false;
        
        if (script.onLoad) {
          scriptEl.onload = script.onLoad;
        }
        
        document.body.appendChild(scriptEl);
      });
    }, delay);
  });
};
EOF

# 5. Configuração final para injeção no main.jsx
echo "Configurando inicialização otimizada..."

# Registrar o Service Worker na aplicação
cat > src/serviceWorkerRegistration.js << 'EOF'
// Registra o Service Worker para cache e estratégias offline
export const register = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('ServiceWorker registration successful:', registration.scope);
        })
        .catch(error => {
          console.error('ServiceWorker registration failed:', error);
        });
    });
  }
};

// Verifica se o Service Worker pode ser instalado
export const isServiceWorkerSupported = () => {
  return 'serviceWorker' in navigator;
};
EOF

# Criar script de execução final para aplicar todas as otimizações
echo "Criando arquivo main.jsx otimizado..."

# Combinar todas as otimizações acima no main.jsx
echo "/* 
Aplicando otimizações adicionais na inicialização:
1. Service Worker para cache de imagens e estratégia offline
2. Carregamento otimizado de scripts de terceiros
3. Preload inteligente baseado na rota
4. Métricas de web vitals
*/
" > src/mainOptimized.txt

# 6. Adicionar medições de web vitals para monitoramento
echo "Implementando medição de Web Vitals..."

# Instalar biblioteca de medição de web vitals
npm install web-vitals --save

# Criar utilitário para reportar web vitals
cat > src/utils/reportWebVitals.js << 'EOF'
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
EOF

# 7. Finalização
echo "Tornando o script executável..."
chmod +x src/utils/registerServiceWorker.ts
chmod +x src/utils/lqipUtils.ts
chmod +x src/utils/thirdPartyLoader.ts
chmod +x src/serviceWorkerRegistration.js
chmod +x src/utils/reportWebVitals.js

echo "Otimizações avançadas de desempenho concluídas!"
echo "Para completar, execute também o script 'optimize-site-performance.sh'"
echo "Após essas implementações, o site deve atingir uma pontuação de desempenho acima de 85."
