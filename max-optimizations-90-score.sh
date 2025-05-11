#!/bin/bash

# Script para realizar otimizações agressivas extremas para resolver oscilações
# Reduz qualidade de imagem para 70% para garantir carregamento rápido e consistente

echo "🚀 Iniciando otimizações extremas para resolver oscilações e aumentar pontuação..."

# Configurações
QUALITY=70
SHARPEN=40
AUTO_FORMAT="f_auto"
DPR="dpr_1.0"
STRIP="fl_strip_profile"

# 1. Modificar utilitários de imagem
echo "Otimizando crispImageUtils.ts..."
sed -i "s/q_[0-9]\+/q_$QUALITY/g" /workspaces/quiz-sell-genius-66/src/utils/crispImageUtils.ts
sed -i "s/e_sharpen:[0-9]\+/e_sharpen:$SHARPEN/g" /workspaces/quiz-sell-genius-66/src/utils/crispImageUtils.ts
sed -i "s/dpr_auto/$DPR/g" /workspaces/quiz-sell-genius-66/src/utils/crispImageUtils.ts

echo "Otimizando CrispIntroImage.tsx..."
sed -i "s/q_[0-9]\+/q_$QUALITY/g" /workspaces/quiz-sell-genius-66/src/components/ui/CrispIntroImage.tsx
sed -i "s/e_sharpen:[0-9]\+/e_sharpen:$SHARPEN/g" /workspaces/quiz-sell-genius-66/src/components/ui/CrispIntroImage.tsx
sed -i "s/dpr_auto/$DPR/g" /workspaces/quiz-sell-genius-66/src/components/ui/CrispIntroImage.tsx

echo "Otimizando cloudinaryImageOptimizer.ts..."
sed -i "s/q_[0-9]\+/q_$QUALITY/g" /workspaces/quiz-sell-genius-66/src/plugins/cloudinaryImageOptimizer.ts
sed -i "s/e_sharpen:[0-9]\+/e_sharpen:$SHARPEN/g" /workspaces/quiz-sell-genius-66/src/plugins/cloudinaryImageOptimizer.ts
sed -i "s/dpr_auto/$DPR/g" /workspaces/quiz-sell-genius-66/src/plugins/cloudinaryImageOptimizer.ts

# 2. Criar CSS extremamente otimizado
echo "Criando CSS super otimizado..."
cat > /workspaces/quiz-sell-genius-66/src/styles/extreme-optimizations.css << 'EOF'
/* Otimizações extremas para evitar qualquer oscilação no carregamento de imagens */
img {
  image-rendering: auto !important;
  filter: none !important;
  transform: none !important;
  transition: none !important;
  backface-visibility: visible !important;
  -webkit-backface-visibility: visible !important;
  content-visibility: auto;
  will-change: contents;
  display: block;
  opacity: 1 !important;
}

/* Força carregamento imediato de imagens críticas */
img.quiz-intro-image, 
.quiz-intro img {
  filter: none !important;
  image-rendering: auto !important;
  transform: none !important;
  transition: none !important;
  -webkit-font-smoothing: subpixel-antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
  will-change: auto !important;
  content-visibility: visible !important;
  display: block !important;
  
  /* Desabilita qualquer animação/efeito */
  animation: none !important;
  opacity: 1 !important;
  visibility: visible !important;
}

/* Remove qualquer efeito de fade/blur durante carregamento */
img[loading],
img[loading="lazy"],
img.lazy-load,
img.lazyload {
  opacity: 1 !important;
  filter: none !important;
  transition: none !important;
}

/* Evita problemas com imagens de fundo */
[style*="background-image"] {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000;
  -webkit-font-smoothing: subpixel-antialiased;
}

/* Hack para forçar renderização de imagens sem oscilação */
body::after {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
  z-index: -1;
  content: url(https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_70,dpr_1.0,e_sharpen:40,fl_strip_profile/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up);
}
EOF

# 3. Criar script JavaScript para forçar otimização agressiva de imagens
echo "Criando script de otimização agressiva..."
cat > /workspaces/quiz-sell-genius-66/src/utils/extremeImageOptimizer.js << 'EOF'
/**
 * Otimizador extremo de imagens - elimina oscilações, força qualidade consistente
 */

(function() {
  // Configurações fixas que funcionam melhor para evitar oscilações
  const QUALITY = 70;
  const SHARPEN = 40;
  const DPR = "1.0";
  const STRIP = "fl_strip_profile";
  
  // Aplicar imediatamente
  applyExtremeOptimizations();
  
  // Aplicar após carregamento completo e em diferentes momentos
  window.addEventListener('load', function() {
    setTimeout(applyExtremeOptimizations, 100);
    setTimeout(applyExtremeOptimizations, 500);
    setTimeout(applyExtremeOptimizations, 1000);
  });
  
  // Observer para detectar mudanças na DOM (SPAs)
  const observer = new MutationObserver(function() {
    applyExtremeOptimizations();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src']
  });
  
  function applyExtremeOptimizations() {
    // Encontrar todas as imagens Cloudinary
    const images = document.querySelectorAll('img[src*="cloudinary.com"]');
    
    images.forEach(img => {
      if (img.src.includes('cloudinary.com')) {
        const originalSrc = img.src;
        const optimizedSrc = optimizeCloudinaryUrl(originalSrc);
        
        if (originalSrc !== optimizedSrc) {
          // Pré-carregar a imagem otimizada
          const preloadImage = new Image();
          preloadImage.src = optimizedSrc;
          
          // Depois de pré-carregada, aplicar na imagem real
          preloadImage.onload = function() {
            img.src = optimizedSrc;
            
            // Aplicar estilos diretos para garantir renderização
            img.style.imageRendering = 'auto';
            img.style.filter = 'none';
            img.style.transform = 'none';
            img.style.transition = 'none';
            img.style.opacity = '1';
            img.style.display = 'block';
          };
        }
      }
    });
    
    // Forçar reflow para garantir renderização
    document.body.offsetHeight;
  }
  
  function optimizeCloudinaryUrl(url) {
    if (!url || !url.includes('cloudinary.com')) return url;
    
    // Extrair partes da URL
    const urlParts = url.split('/upload/');
    if (urlParts.length !== 2) return url;
    
    const baseUrl = urlParts[0];
    let pathPart = urlParts[1];
    
    // Remover qualquer parâmetro existente e aplicar os novos
    pathPart = pathPart
      .replace(/,e_blur:[0-9]+/g, '')
      .replace(/e_blur:[0-9]+,/g, '')
      .replace(/e_blur:[0-9]+/g, '')
      .replace(/q_[0-9]+/g, `q_${QUALITY}`)
      .replace(/dpr_[0-9.]+/g, `dpr_${DPR}`)
      .replace(/e_sharpen:[0-9]+/g, `e_sharpen:${SHARPEN}`);
    
    // Montar URL otimizada
    return `${baseUrl}/upload/f_auto,q_${QUALITY},dpr_${DPR},e_sharpen:${SHARPEN},${STRIP}/${pathPart}`;
  }
})();
EOF

# 4. Modificar main.jsx/tsx para incluir novos recursos
echo "Atualizando arquivo main para incluir otimizações..."

# Verificar se o arquivo é .jsx ou .tsx
MAIN_FILE=""
if [ -f "/workspaces/quiz-sell-genius-66/src/main.jsx" ]; then
  MAIN_FILE="/workspaces/quiz-sell-genius-66/src/main.jsx"
elif [ -f "/workspaces/quiz-sell-genius-66/src/main.tsx" ]; then
  MAIN_FILE="/workspaces/quiz-sell-genius-66/src/main.tsx"
fi

if [ -n "$MAIN_FILE" ]; then
  # Verificar se os imports já existem
  if ! grep -q "extreme-optimizations.css" "$MAIN_FILE"; then
    # Encontrar a última linha de import
    LAST_IMPORT_LINE=$(grep -n "import" "$MAIN_FILE" | tail -1 | cut -d: -f1)
    
    # Adicionar novos imports após a última linha de import existente
    sed -i "${LAST_IMPORT_LINE}a import './styles/extreme-optimizations.css';" "$MAIN_FILE"
    sed -i "${LAST_IMPORT_LINE}a import './utils/extremeImageOptimizer.js';" "$MAIN_FILE"
  fi
fi

# 5. Atualizar .htaccess com regras ainda mais otimizadas
echo "Criando .htaccess extremamente otimizado..."
cat > /workspaces/quiz-sell-genius-66/temp-htaccess << 'EOF'
# Configurações ultra-otimizadas para Hostinger (Apache)

# Habilitar reescrita de URL para SPA (crucial para React Router)
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    
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

# Ativar compressão para melhorar performance
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/css text/javascript application/javascript application/json image/svg+xml application/font-woff application/font-woff2 application/x-font-ttf font/opentype
    
    # Comprimir recursos adicionais
    AddOutputFilterByType DEFLATE application/xml text/xml application/xhtml+xml
    
    # Configuração de nível de compressão (9 = máximo)
    DeflateCompressionLevel 9
</IfModule>

# Configurar cache para recursos estáticos
<IfModule mod_expires.c>
    ExpiresActive On
    
    # Cache para imagens e mídia (estendido para 6 meses)
    ExpiresByType image/jpeg "access plus 6 months"
    ExpiresByType image/png "access plus 6 months"
    ExpiresByType image/webp "access plus 6 months"
    ExpiresByType image/avif "access plus 6 months"
    ExpiresByType image/svg+xml "access plus 6 months"
    
    # Cache para arquivos de código
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType application/json "access plus 1 day"
    
    # Cache para fontes
    ExpiresByType font/ttf "access plus 6 months"
    ExpiresByType font/woff "access plus 6 months"
    ExpiresByType font/woff2 "access plus 6 months"
</IfModule>

# Permitir Cross-Origin para fontes e outros recursos
<IfModule mod_headers.c>
    <FilesMatch "\.(ttf|ttc|otf|eot|woff|woff2|font\.css)$">
        Header set Access-Control-Allow-Origin "*"
    </FilesMatch>
</IfModule>

# Configurações de segurança e performance adicionais
<IfModule mod_headers.c>
    # Segurança básica
    Header always set X-XSS-Protection "1; mode=block"
    Header always set X-Frame-Options "SAMEORIGIN"
    
    # Permitir conexões de terceiros para Cloudinary
    Header always set Access-Control-Allow-Origin "https://res.cloudinary.com"
</IfModule>

# Cabeçalhos de segurança para proteger contra ataques comuns
<IfModule mod_headers.c>
    # Desabilitar cache para index.html para garantir atualizações
    <FilesMatch "index\.html$">
        Header set Cache-Control "no-cache, no-store, must-revalidate"
        Header set Pragma "no-cache"
        Header set Expires "0"
    </FilesMatch>
    
    # Habilitar cache para arquivos estáticos (cache estendido para 1 ano)
    <FilesMatch "\.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$">
        Header set Cache-Control "public, max-age=31536000, immutable, stale-while-revalidate=86400"
    </FilesMatch>
</IfModule>

# Priorização de imagens críticas para otimizar o LCP
<IfModule mod_headers.c>
    # Imagens críticas para LCP
    <FilesMatch "\.(jpe?g|png|webp|avif|svg)$">
        Header set Priority "high"
        Header set Importance "high"
        Header add Link "</assets/images/ce883c46-80e0-4171-9c2d-9288f44f88eb-BSVDW0DB.png>; rel=preload; as=image; fetchpriority=high"
    </FilesMatch>
</IfModule>

# Carregamento síncrono para imagens críticas
<IfModule mod_headers.c>
    <FilesMatch "ce883c46-80e0-4171-9c2d-9288f44f88eb-BSVDW0DB\.png$">
        Header set Fetch-Mode "no-cors"
        Header set Fetch-Dest "image"
        Header set Loading-Strategy "eager"
    </FilesMatch>
</IfModule>

# Forçar recarga do navegador para índice principal
<IfModule mod_headers.c>
    <FilesMatch "^(index\.html)?$">
        Header set Clear-Site-Data "\"cache\""
    </FilesMatch>
</IfModule>

# Aumentar performance geral
<IfModule mod_headers.c>
    Header set Connection "keep-alive"
    Header set Keep-Alive "timeout=15, max=100"
</IfModule>
EOF

# 6. Executar build
echo "Executando build com otimizações extremas..."
npm run build:hostinger

# 7. Copiar .htaccess otimizado
echo "Substituindo .htaccess por versão extremamente otimizada..."
cp /workspaces/quiz-sell-genius-66/temp-htaccess /workspaces/quiz-sell-genius-66/dist/.htaccess

echo "✅ Otimizações extremas aplicadas com sucesso!"
echo "🚀 A qualidade das imagens foi reduzida para $QUALITY%, mas o ganho de performance e eliminação das oscilações compensará!"
echo ""
echo "🔍 Próximos passos:"
echo "1. Faça upload do conteúdo da pasta 'dist/' para seu servidor Hostinger"
echo "2. Verifique a performance com o Lighthouse após o deploy (meta: pontuação 90+)"
echo "3. Monitore o carregamento das imagens: não devem mais oscilar"
