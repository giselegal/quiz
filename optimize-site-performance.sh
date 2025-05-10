#!/bin/bash

# Script para otimização profunda de desempenho em toda a aplicação
# Otimizações direcionadas para melhorar a pontuação acima de 80

echo "Iniciando otimização profunda de desempenho..."

# 1. Adicionar defer a todos os scripts em index.html para não bloquear o parser
sed -i 's/<script /<script defer /g' index.html
sed -i 's/<script type="module"/<script type="module" defer/g' index.html

# 2. Otimizar carregamento de fontes no index.html
# Substituir preload de fontes por preconnect + swap
sed -i 's/<link href="https:\/\/fonts.googleapis.com\/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap" media="print" onload="this.media='\''all'\''" rel="stylesheet">/<link rel="preconnect" href="https:\/\/fonts.googleapis.com">\n    <link rel="preconnect" href="https:\/\/fonts.gstatic.com" crossorigin>\n    <link href="https:\/\/fonts.googleapis.com\/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" media="print" onload="this.media='\''all'\''" \/>/' index.html

# 3. Injetar CSS crítico diretamente no head para evitar render blocking
cat > critical-inline.css << 'EOF'
body{margin:0;padding:0;font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;background:linear-gradient(180deg,#FFFFFF 0%,#FBF8F4 100%)}*{will-change:auto!important}img{transition:none!important}.loading-fallback{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;background-color:#f9fafb}.loading-spinner{width:3rem;height:3rem;border-radius:50%;border:2px solid #e5e7eb;border-top-color:#B89B7A;animation:spin 1s linear infinite;margin-bottom:1rem}.loading-message{color:#432818;font-family:'Inter',sans-serif;font-size:.9rem}@keyframes spin{to{transform:rotate(360deg)}}.font-playfair{font-family:'Playfair Display',serif;font-display:swap}.font-inter{font-family:'Inter',sans-serif;font-display:swap}
EOF

echo '<style>' > criticalcss.html
cat critical-inline.css >> criticalcss.html
echo '</style>' >> criticalcss.html

# Inserir CSS crítico no <head>
sed -i '/<\/head>/e cat criticalcss.html' index.html

# Limpar arquivos temporários
rm critical-inline.css criticalcss.html

# 4. Otimizar imagens no componente QuizIntro
# Atualizar parâmetros de placeholder para mais eficiência
sed -i 's/e_blur:100/e_blur:80/g' src/components/QuizIntro.tsx
sed -i 's/placeholder: `\${INTRO_IMAGE_BASE_URL}f_webp,q_5,w_30,c_limit,e_blur/placeholder: `\${INTRO_IMAGE_BASE_URL}f_webp,q_10,w_20,c_limit,e_blur/g' src/components/QuizIntro.tsx

# 5. Otimizar o módulo de analytics e o rastreamento do Facebook para não bloquear a renderização
sed -i 's/fbevents.js/fbevents.js" async defer/g' index.html

# 6. Adicionar configuração de cache no nível de aplicação (cabeçalhos específicos)
cat > public/.htaccess << 'EOF'
# Otimização de Cache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/avif "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/pdf "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/x-javascript "access plus 1 month"
  ExpiresByType application/x-font-woff "access plus 1 year"
  ExpiresByType application/font-woff2 "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType application/json "access plus 0 seconds"
</IfModule>

# Compressão GZIP
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/xml
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE application/xhtml+xml
  AddOutputFilterByType DEFLATE application/rss+xml
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/x-javascript
  AddOutputFilterByType DEFLATE application/json
</IfModule>
EOF

# 7. Otimizar carregamento de imagens em outras partes da aplicação

# Criar um hook otimizado para imagens
cat > src/hooks/useOptimizedImage.ts << 'EOF'
import { useState, useEffect } from 'react';

/**
 * Hook otimizado para carregamento de imagens com suporte a lazy loading,
 * cache em sessionStorage e fallback progressivo.
 */
export const useOptimizedImage = (
  imageUrl: string,
  placeholderUrl?: string,
  cacheKey?: string
) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [src, setSrc] = useState(placeholderUrl || '');
  const actualCacheKey = cacheKey || `img_cache_${imageUrl}`;

  useEffect(() => {
    // Verifica cache primeiro
    const cachedImage = sessionStorage.getItem(actualCacheKey);
    
    if (cachedImage) {
      setSrc(cachedImage);
      setIsLoaded(true);
      return;
    }

    // Se não estiver em cache, carrega normalmente
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      setSrc(imageUrl);
      setIsLoaded(true);
      
      // Guarda em cache para futuras visitas na mesma sessão
      try {
        sessionStorage.setItem(actualCacheKey, imageUrl);
      } catch (e) {
        // Ignora erros de storage (quota excedida, etc)
      }
    };
    
    // Cleanup
    return () => {
      img.onload = null;
    };
  }, [imageUrl, actualCacheKey]);

  return { src, isLoaded };
};
EOF

# 8. Diminuir o tamanho do JavaScript deferindo carregamentos não-críticos

# Criar um utilitário para carregamento lazy
cat > src/utils/lazyLoader.ts << 'EOF'
/**
 * Carrega script externo de forma assíncrona e não-bloqueante
 */
export const loadExternalScript = (
  src: string,
  id?: string,
  defer = true,
  async = true,
  onLoad?: () => void
): Promise<HTMLScriptElement> => {
  return new Promise((resolve, reject) => {
    // Verificar se o script já existe
    if (id && document.getElementById(id)) {
      resolve(document.getElementById(id) as HTMLScriptElement);
      if (onLoad) onLoad();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.defer = defer;
    script.async = async;
    if (id) script.id = id;

    script.onload = () => {
      resolve(script);
      if (onLoad) onLoad();
    };

    script.onerror = () => {
      reject(new Error(`Failed to load script: ${src}`));
    };

    document.body.appendChild(script);
  });
};

/**
 * Carrega módulos JS apenas quando necessário
 */
export const lazyLoadModule = async <T>(importFn: () => Promise<T>): Promise<T> => {
  try {
    return await importFn();
  } catch (error) {
    console.error('Erro ao carregar módulo lazy:', error);
    throw error;
  }
};
EOF

echo "Otimizações de desempenho concluídas!"
echo "Agora o site deve atingir uma pontuação maior de desempenho."
