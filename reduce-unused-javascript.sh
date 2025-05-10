#!/bin/bash

# Script para reduzir o JavaScript não utilizado e implementar carregamento lazy
echo "Reduzindo JavaScript não utilizado..."

# 1. Primeiro vamos criar um novo componente para lazy loading
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

# 2. Agora vamos modificar o main.jsx para usar o lazy loading
if [ -f src/main.jsx ]; then
  # Backup do arquivo original
  cp src/main.jsx src/main.jsx.backup
  
  # Procurar pelo final do arquivo (antes do último fechamento de tag React.StrictMode)
  INSERTION_POINT=$(grep -n "</React.StrictMode>" src/main.jsx | tail -1 | cut -d':' -f1)
  
  if [ -n "$INSERTION_POINT" ]; then
    # Adicionar importação do utilitário de lazy loading
    sed -i "1s/^/import { initLazyLoading } from '.\/utils\/lazyScript';\n/" src/main.jsx
    
    # Adicionar inicialização de lazy loading após o ReactDOM.render
    sed -i "$((INSERTION_POINT-1))i // Inicializar carregamento lazy de scripts\ninitLazyLoading();" src/main.jsx
    
    echo "Lazy loading adicionado ao main.jsx com sucesso!"
  else
    echo "Não foi possível encontrar o ponto de inserção no main.jsx"
  fi
else
  echo "Arquivo main.jsx não encontrado!"
fi

# 3. Remover scripts de terceiros do index.html para carregá-los via lazy loading
if [ -f index.html ]; then
  # Backup do arquivo original
  cp index.html index.html.backup
  
  # Remover scripts de terceiros
  sed -i '/<script type="module" src="https:\/\/cdn.gpteng.co\/gptengineer.js"><\/script>/d' index.html
  sed -i '/fbevents.js/d' index.html
  
  echo "Scripts de terceiros removidos do index.html com sucesso!"
else
  echo "Arquivo index.html não encontrado!"
fi

# 4. Configurar Splitting de código no vite.config.ts
if [ -f vite.config.ts ]; then
  # Backup do arquivo original
  cp vite.config.ts vite.config.ts.backup
  
  # Adicionar configuração de splitting de código
  sed -i "/build: {/a \    rollupOptions: {\n      output: {\n        manualChunks: {\n          'vendor-react': ['react', 'react-dom'],\n          'vendor-ui': ['framer-motion', 'tailwindcss'],\n          'vendor-utils': ['lodash', 'dayjs'],\n        }\n      }\n    }," vite.config.ts
  
  echo "Configuração de splitting de código adicionada ao vite.config.ts com sucesso!"
else
  echo "Arquivo vite.config.ts não encontrado!"
fi

echo "Otimização de JavaScript concluída!"
echo "Reduções de JavaScript não utilizado aplicadas com sucesso."
