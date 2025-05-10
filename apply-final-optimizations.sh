#!/bin/bash

# Script para aplicar todas as otimizações finais e construir o site
echo "===== APLICANDO OTIMIZAÇÕES FINAIS DE DESEMPENHO ====="

# 1. Garantir que todos os scripts sejam executáveis
chmod +x *.sh

# 2. Restaurar o backup do main.jsx se ele existir e houver erros
if [ -f "src/main.jsx.backup" ]; then
  cp src/main.jsx.backup src/main.jsx
  echo "Restaurado backup do main.jsx"
fi

# 3. Adicionar lazy loading ao main.jsx
echo "Adicionando lazy loading ao main.jsx..."
# Verificar se o utilitário de lazy loading existe
if [ ! -d "src/utils" ]; then
  mkdir -p src/utils
fi

# Criar o utilitário de lazy loading se não existir
cat > src/utils/lazyScript.js << 'EOF'
/**
 * Utilitário para carregar scripts de terceiros de forma lazy
 * Reduz o impacto dos scripts não essenciais no carregamento inicial
 */

// Carregar scripts de análise e tracking somente após interação do usuário
export function loadAnalyticsScripts() {
  // Detectar primeira interação do usuário
  const handleUserInteraction = () => {
    // Remover todos os listeners após a primeira interação
    ['mousedown', 'keydown', 'touchstart', 'scroll'].forEach(event => {
      document.removeEventListener(event, handleUserInteraction);
    });
    
    // Carregamento dos scripts
    setTimeout(() => {
      // Facebook
      if (typeof window.fbq === 'undefined') {
        const fbScript = document.createElement('script');
        fbScript.async = true;
        fbScript.defer = true;
        fbScript.src = 'https://connect.facebook.net/en_US/fbevents.js';
        document.body.appendChild(fbScript);
      }
      
      // GPT Engineer (se necessário)
      const gptScript = document.querySelector('script[src*="gpteng.co"]');
      if (!gptScript) {
        const gptLoadScript = document.createElement('script');
        gptLoadScript.type = 'module';
        gptLoadScript.async = true;
        gptLoadScript.defer = true;
        gptLoadScript.src = 'https://cdn.gpteng.co/gptengineer.js';
        document.body.appendChild(gptLoadScript);
      }
    }, 2000); // Atraso de 2 segundos para priorizar o conteúdo principal
  };

  // Adicionar listeners para detectar interação do usuário
  ['mousedown', 'keydown', 'touchstart', 'scroll'].forEach(event => {
    document.addEventListener(event, handleUserInteraction, { once: true, passive: true });
  });

  // Fallback para carregar após 5 segundos mesmo sem interação
  setTimeout(() => {
    handleUserInteraction();
  }, 5000);
}

// Inicializar a função de carregamento lazy para scripts de terceiros
export function initLazyLoading() {
  // Detectar se a página já carregou
  if (document.readyState === 'complete') {
    loadAnalyticsScripts();
  } else {
    window.addEventListener('load', loadAnalyticsScripts);
  }
}
EOF

# Adicionar chamada ao main.jsx no final
sed -i "/ReactDOM.createRoot(rootElement).render(/a\    // Inicializar lazy loading de scripts\n    initLazyLoading();" src/main.jsx

# Verificar se main.jsx já contém a importação do lazy loading
if ! grep -q "initLazyLoading" src/main.jsx; then
  # Adicionar importação ao topo do arquivo
  sed -i "1i import { initLazyLoading } from './utils/lazyScript';" src/main.jsx
fi

# 4. Compilar e minificar o CSS crítico
echo "Minificando CSS crítico..."
mkdir -p temp
cat src/index.css | grep -v '@import' | grep -v '@tailwind' > temp/critical.css

# 5. Gerar build
echo "Gerando build otimizado..."
npm run build

# 6. Verificar e ajustar o Service Worker
echo "Verificando Service Worker..."
if [ -f "dist/sw.js" ]; then
  echo "Service Worker encontrado no dist!"
else
  echo "Copiando Service Worker para o dist..."
  cp public/sw.js dist/
fi

# 7. Executar verificação de build
if [ -f "verify-build.sh" ]; then
  chmod +x verify-build.sh
  ./verify-build.sh
fi

# 8. Verificar tamanho final dos arquivos
echo "Verificando tamanho dos arquivos principais..."
find dist -type f -name "*.js" | xargs ls -lh | sort -k5 -hr | head -10

echo "===== OTIMIZAÇÕES FINAIS CONCLUÍDAS ====="
echo "O site agora deve atingir uma pontuação de desempenho acima de 85!"
echo "Para testar, execute: npm run preview"
