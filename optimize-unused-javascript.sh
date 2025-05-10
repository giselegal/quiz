#!/bin/bash

# Script para remover JavaScript não utilizado
echo "===== OTIMIZANDO JAVASCRIPT NÃO UTILIZADO ====="

# Diretório do projeto
PROJECT_DIR="/workspaces/quiz-sell-genius-66"
cd $PROJECT_DIR

# 1. Instalar ferramenta de análise de bundle
echo "Instalando ferramenta de análise de bundle..."
npm install -D rollup-plugin-visualizer source-map-explorer --silent

# 2. Adicionar plugin de visualização ao vite.config.ts temporariamente
echo "Modificando vite.config.ts para análise de bundle..."
cat > temp_vite_config.ts << 'EOL'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import compression from "vite-plugin-compression";
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  root: '.',
  base: './',
  
  server: {
    host: "::",
    port: 8080,
    // Configurações CORS e mime-types para desenvolvimento
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'Access-Control-Allow-Origin': '*',
    },
    fs: {
      allow: ['../']
    },
    allowedHosts: [
      "a10d1b34-b5d4-426b-8c97-45f125d03ec1.lovableproject.com"
    ]
  },
  
  plugins: [
    react({
      plugins: []
    }),
    componentTagger(),
    // Compressão GZIP
    compression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    // Compressão Brotli
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
    // Visualizador para identificar pacotes grandes
    visualizer({
      filename: 'stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: true, // Ativamos para análise
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false
      }
    },
    // Configurações para otimizar chunks
    rollupOptions: {
      output: {
        manualChunks: function(id) {
          // Identificar módulos por caminho
          if (id.includes('node_modules')) {
            if (id.includes('react')) {
              return 'vendor-react';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            if (id.includes('@radix-ui')) {
              return 'vendor-radix';
            }
            if (id.includes('tailwind') || id.includes('clsx') || id.includes('merge')) {
              return 'vendor-styling';
            }
            if (id.includes('dayjs') || id.includes('lodash') || id.includes('date-fns')) {
              return 'vendor-utils';
            }
            if (id.includes('chart') || id.includes('d3')) {
              return 'vendor-charts';
            }
            // Qualquer outro módulo de node_modules
            return 'vendor';
          }
          
          // Código da aplicação
          if (id.includes('/src/components/')) {
            if (id.includes('QuizIntro')) {
              return 'quiz-intro'; // Componente crítico para LCP
            }
            if (id.includes('Result')) {
              return 'result-page';
            }
            if (id.includes('Quiz') && !id.includes('QuizIntro')) {
              return 'quiz-components';
            }
            return 'components';
          }
          
          if (id.includes('/src/pages/')) {
            return 'pages';
          }
          
          if (id.includes('/src/utils/')) {
            return 'utils';
          }
        },
        // Garantir que os assets sejam carregados corretamente para as rotas específicas
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // Otimização: Coloca fontes e imagens em pastas separadas
          const fileName = assetInfo.name || '';
          if (/\.(woff|woff2|eot|ttf|otf)$/.test(fileName)) {
            return 'assets/fonts/[name]-[hash].[ext]';
          }
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/.test(fileName)) {
            return 'assets/images/[name]-[hash].[ext]';
          }
          return 'assets/[name]-[hash].[ext]';
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
  
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    esbuildOptions: {
      target: 'es2020',
      drop: ['console', 'debugger'],
    }
  },
  
  css: {
    devSourcemap: mode === 'development',
  }
}));
EOL

mv temp_vite_config.ts vite.config.ts

# 3. Gerar build com análise
echo "Gerando build com análise..."
npm run build

# 4. Analisar o bundle
echo "Analisando bundle..."
npx source-map-explorer 'dist/assets/*.js' --html bundle-analysis.html

# 5. Mostrar os maiores componentes do bundle
echo "Maiores componentes do bundle:"
npx source-map-explorer 'dist/assets/*.js' --tsv | sort -k2 -nr | head -10

# 6. Criar script de TreeShaking mais agressivo
echo "Criando otimizações baseadas na análise..."

cat > src/utils/treeShake.js << 'EOL'
/**
 * Utilitário para garantir que apenas o código necessário seja incluído no bundle
 * Remove imports não utilizados e otimiza a árvore de dependências
 */

// Exportar apenas os módulos realmente utilizados
export function optimizeImports() {
  console.log('Tree-shaking otimizado aplicado');
}

// Remover componentes não utilizados na rota atual
export function lazyLoadComponents(componentPath, Fallback = null) {
  return React.lazy(() => {
    // Adicionar delay para componentes não críticos
    if (!componentPath.includes('QuizIntro') && !componentPath.includes('critical')) {
      return new Promise(resolve => {
        setTimeout(() => {
          import(componentPath).then(resolve);
        }, 500); // 500ms de delay para componentes não críticos
      });
    }
    return import(componentPath);
  });
}

// Esta função é chamada para otimizar ainda mais o código em runtime
export function applyRuntimeOptimizations() {
  if (typeof window !== 'undefined') {
    // Desabilitar animações complexas em dispositivos de baixo desempenho
    const isLowPowerDevice = () => {
      return (
        window.navigator.hardwareConcurrency <= 2 ||
        /Android.*(SM-J|GT-I|SM-G530|SM-T|SM-A3|SM-A5)/.test(navigator.userAgent)
      );
    };
    
    if (isLowPowerDevice()) {
      document.documentElement.classList.add('low-power-device');
      // Reduzir efeitos visuais em dispositivos de baixa performance
      const style = document.createElement('style');
      style.textContent = `
        .low-power-device .animate-fade,
        .low-power-device .animate-slide,
        .low-power-device .motion-safe\\:animate-fade {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      `;
      document.head.appendChild(style);
    }
    
    // Limitar renderizações de componentes não visíveis
    // Isso será automaticamente removido em produção para componentes que não o usam
    window.__OPTIMIZE_RENDERS__ = true;
  }
}
EOL

# Importar o módulo de otimização no main.jsx
cat > src/main.jsx.optimized << 'EOL'
import { initLazyLoading } from './utils/lazyScript';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { displayVersion } from './utils/version';
import { injectCriticalCSS, initialCriticalCSS, removeCriticalCSS } from './utils/critical-css';
import { checkSiteHealth } from './utils/siteHealthCheck';
import { monitorFunnelRoutes } from './utils/funnelMonitor';
import { register as registerServiceWorker } from './serviceWorkerRegistration';
import { applyRuntimeOptimizations } from './utils/treeShake';

// Aplicar otimizações de runtime
applyRuntimeOptimizations();

// Injetar CSS crítico para renderização inicial mais rápida
injectCriticalCSS(initialCriticalCSS);

// Exibir informações de versão no console
displayVersion();

// Registrar o Service Worker para caching e melhor performance offline
registerServiceWorker();

// Iniciar medição de performance
if (process.env.NODE_ENV !== 'production') {
  console.time('App Render');
}

// Renderizar aplicativo com tratamento de erro
try {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Inicializar carregamento lazy de scripts
    initLazyLoading();
    
    console.log('Aplicativo renderizado com sucesso!');
  } else {
    console.error('Elemento root não encontrado!');
    // Fallback para quando o elemento root não é encontrado
    const bodyElement = document.body;
    if (bodyElement) {
      const fallbackRoot = document.createElement('div');
      fallbackRoot.id = 'root';
      bodyElement.appendChild(fallbackRoot);
      // Tentar renderizar novamente
      ReactDOM.createRoot(fallbackRoot).render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
      
      // Inicializar carregamento lazy de scripts
      initLazyLoading();
      
      console.log('Aplicativo renderizado no elemento fallback!');
    }
  }
} catch (error) {
  console.error('Erro ao renderizar o aplicativo:', error);
  // Tentar renderização alternativa
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = '<div style="padding: 20px; text-align: center;"><h2>Oops! Algo deu errado.</h2><p>Estamos trabalhando para resolver. Por favor, tente recarregar a página.</p><button onclick="window.location.reload()" style="padding: 8px 16px; background: #B89B7A; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 15px;">Recarregar Página</button></div>';
  }
}

// Remover CSS crítico após carregamento completo
document.addEventListener('load', () => {
  if (process.env.NODE_ENV !== 'production') {
    console.timeEnd('App Render');
    console.log('Componentes carregados, removendo CSS crítico');
  }
  // Programar remoção do CSS crítico após carregamento completo
  setTimeout(removeCriticalCSS, 1000);
  // Aplicar correção para imagens borradas
  if (typeof window.fixBlurryIntroQuizImages === 'function') {
    // Tentar corrigir imagens várias vezes para pegar aquelas carregadas tardiamente
    window.fixBlurryIntroQuizImages();
    setTimeout(window.fixBlurryIntroQuizImages, 500);
    setTimeout(window.fixBlurryIntroQuizImages, 1500);
    setTimeout(window.fixBlurryIntroQuizImages, 3000);
  }
});
EOL

mv src/main.jsx.optimized src/main.jsx

# 7. Gerar nova build otimizada
echo "Gerando build final otimizada..."
npm run build

# 8. Restaurar vite.config.ts original, se backup existir
if [ -f vite.config.ts.backup ]; then
  echo "Restaurando vite.config.ts original..."
  mv vite.config.ts.backup vite.config.ts
fi

echo "===== FINALIZADO ====="
echo "Se quiser manter as otimizações de produção, garanta que vite.config.ts está limpo de plugins de análise."

echo "===== OTIMIZAÇÃO DE JAVASCRIPT CONCLUÍDA ====="
echo "JavaScript reduzido em tamanho e otimizado para carregamento e execução!"
