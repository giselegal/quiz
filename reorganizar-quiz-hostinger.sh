#!/bin/bash
# reorganizar-quiz-hostinger.sh - Script executável para reorganizar o Quiz de Estilo na Hostinger

# Cores para mensagens
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m"

echo -e "${GREEN}=== REORGANIZAÇÃO DO QUIZ DE ESTILO NA HOSTINGER ===${NC}"
echo -e "Este script reorganizará a estrutura para: public_html/quiz-de-estilo/"

# Data para nomear o backup
DATA_BACKUP=$(date +"%Y%m%d_%H%M%S")

# 1. Criar backup
echo -e "\n${YELLOW}1. Criando backup de segurança...${NC}"
cd ~
mkdir -p backups
cd public_html
zip -r ~/backups/quiz_backup_${DATA_BACKUP}.zip quiz-de-estilo/ public_html/ 2>/dev/null
echo "Backup criado em ~/backups/quiz_backup_${DATA_BACKUP}.zip"

# 2. Verificar estrutura atual
echo -e "\n${YELLOW}2. Verificando estrutura atual...${NC}"
cd ~
find public_html -name "quiz-de-estilo" -type d 2>/dev/null
find public_html -path "*/public_html/*" -type d 2>/dev/null

# 3. Remover estruturas incorretas
echo -e "\n${YELLOW}3. Limpando estruturas incorretas...${NC}"
cd ~
# Remover pastas aninhadas incorretamente
rm -rf public_html/public_html 2>/dev/null
rm -rf public_html/quiz-de-estilo/public_html 2>/dev/null

# 4. Reorganizar estrutura se necessário
echo -e "\n${YELLOW}4. Reorganizando estrutura...${NC}"
cd ~

# Se quiz-de-estilo estiver aninhado incorretamente, corrija
if [ -d "public_html/quiz-de-estilo/quiz-de-estilo" ]; then
  echo "Encontrada estrutura aninhada, corrigindo..."
  cd public_html/quiz-de-estilo
  mv quiz-de-estilo/* . 2>/dev/null
  rm -rf quiz-de-estilo/
  echo "Estrutura aninhada corrigida."
  cd ~
fi

# 5. Verificar e corrigir o .htaccess
echo -e "\n${YELLOW}5. Verificando e corrigindo o .htaccess...${NC}"
cd ~
if [ -f "public_html/quiz-de-estilo/.htaccess" ]; then
  echo "Arquivo .htaccess encontrado, verificando conteúdo..."
  
  # Verificar se o RewriteBase está correto
  REWRITE_BASE=$(grep "RewriteBase" public_html/quiz-de-estilo/.htaccess 2>/dev/null)
  if [[ "$REWRITE_BASE" == *"/quiz-de-estilo/"* ]]; then
    echo "RewriteBase correto encontrado: $REWRITE_BASE"
  else
    echo "RewriteBase incorreto ou não encontrado. Criando .htaccess correto..."
    cat > public_html/quiz-de-estilo/.htaccess << 'EOF'
# Configurações otimizadas para React app em subdiretório na Hostinger
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /quiz-de-estilo/
    
    # Impedir acesso direto à pasta public_html
    RewriteCond %{THE_REQUEST} public_html [NC]
    RewriteRule .* - [F,L]
    
    # Se o arquivo/diretório não existir, redirecionar para index.html
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ index.html [L,QSA]
</IfModule>

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
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/json "access plus 0 seconds"
</IfModule>

# Compressão GZIP
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/css application/javascript application/json image/svg+xml
</IfModule>
EOF
    echo ".htaccess corrigido criado."
  fi
else
  echo "Arquivo .htaccess não encontrado. Criando..."
  cat > public_html/quiz-de-estilo/.htaccess << 'EOF'
# Configurações otimizadas para React app em subdiretório na Hostinger
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /quiz-de-estilo/
    
    # Impedir acesso direto à pasta public_html
    RewriteCond %{THE_REQUEST} public_html [NC]
    RewriteRule .* - [F,L]
    
    # Se o arquivo/diretório não existir, redirecionar para index.html
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ index.html [L,QSA]
</IfModule>

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
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/json "access plus 0 seconds"
</IfModule>

# Compressão GZIP
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/css application/javascript application/json image/svg+xml
</IfModule>
EOF
  echo ".htaccess criado."
fi

# 6. Verificar e corrigir o Service Worker
echo -e "\n${YELLOW}6. Verificando o Service Worker...${NC}"
cd ~
if [ -f "public_html/quiz-de-estilo/sw.js" ]; then
  echo "Arquivo sw.js encontrado, verificando conteúdo..."
  
  # Verificar se o BASE_PATH está correto
  BASE_PATH=$(grep "BASE_PATH" public_html/quiz-de-estilo/sw.js 2>/dev/null)
  if [[ "$BASE_PATH" == *"/quiz-de-estilo/"* ]]; then
    echo "BASE_PATH correto encontrado: $BASE_PATH"
  else
    echo "BASE_PATH incorreto ou não encontrado. Criando sw.js correto..."
    cat > public_html/quiz-de-estilo/sw.js << 'EOF'
// Service Worker corrigido para subdiretório
const CACHE_VERSION = 'v1';
const CACHE_NAME = `quiz-estilo-${CACHE_VERSION}`;
const BASE_PATH = '/quiz-de-estilo/';

// Lista de recursos essenciais para cache
const STATIC_ASSETS = [
  BASE_PATH,
  `${BASE_PATH}index.html`
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    clients.claim().then(() => {
      return caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      });
    })
  );
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  
  // Estratégia para HTML (navegação)
  if (url.pathname.endsWith('/') || 
      url.pathname.endsWith('.html') || 
      url.pathname === BASE_PATH.slice(0, -1)) {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(`${BASE_PATH}index.html`))
    );
    return;
  }
  
  // Estratégia para arquivos estáticos
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok) {
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clonedResponse);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.mode === 'navigate') {
            return caches.match(`${BASE_PATH}index.html`);
          }
          return new Response('Not found', { status: 404 });
        });
      })
  );
});
EOF
    echo "sw.js corrigido criado."
  fi
else
  echo "Arquivo sw.js não encontrado. Criando..."
  cat > public_html/quiz-de-estilo/sw.js << 'EOF'
// Service Worker corrigido para subdiretório
const CACHE_VERSION = 'v1';
const CACHE_NAME = `quiz-estilo-${CACHE_VERSION}`;
const BASE_PATH = '/quiz-de-estilo/';

// Lista de recursos essenciais para cache
const STATIC_ASSETS = [
  BASE_PATH,
  `${BASE_PATH}index.html`
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    clients.claim().then(() => {
      return caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      });
    })
  );
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  
  // Estratégia para HTML (navegação)
  if (url.pathname.endsWith('/') || 
      url.pathname.endsWith('.html') || 
      url.pathname === BASE_PATH.slice(0, -1)) {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(`${BASE_PATH}index.html`))
    );
    return;
  }
  
  // Estratégia para arquivos estáticos
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok) {
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clonedResponse);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.mode === 'navigate') {
            return caches.match(`${BASE_PATH}index.html`);
          }
          return new Response('Not found', { status: 404 });
        });
      })
  );
});
EOF
  echo "sw.js criado."
fi

# 7. Verificar e corrigir o registro do Service Worker no index.html
echo -e "\n${YELLOW}7. Verificando registro do Service Worker no index.html...${NC}"
cd ~
if [ -f "public_html/quiz-de-estilo/index.html" ]; then
  echo "Arquivo index.html encontrado, verificando registro do Service Worker..."
  
  # Verificar o registro do Service Worker
  REGISTER_SW=$(grep -A 2 "serviceWorker.register" public_html/quiz-de-estilo/index.html 2>/dev/null)
  if [[ "$REGISTER_SW" == *"/quiz-de-estilo/sw.js"* ]]; then
    echo "Registro do Service Worker correto encontrado: $REGISTER_SW"
  else
    echo "Registro do Service Worker incorreto ou não encontrado."
    echo "É necessário editar o arquivo index.html manualmente para corrigir o registro."
    echo "Busque por: navigator.serviceWorker.register('/sw.js'"
    echo "Substitua por: navigator.serviceWorker.register('/quiz-de-estilo/sw.js'"
    echo "E também verifique se o escopo está correto: scope: '/quiz-de-estilo/'"
  fi
else
  echo "Arquivo index.html não encontrado. Verifique se todos os arquivos foram enviados corretamente."
fi

# 8. Ajustar permissões
echo -e "\n${YELLOW}8. Ajustando permissões...${NC}"
cd ~
find public_html/quiz-de-estilo -type d -exec chmod 755 {} \; 2>/dev/null
find public_html/quiz-de-estilo -type f -exec chmod 644 {} \; 2>/dev/null
echo "Permissões ajustadas."

# 9. Forçar atualização do .htaccess
echo -e "\n${YELLOW}9. Forçando atualização do .htaccess...${NC}"
cd ~
touch public_html/quiz-de-estilo/.htaccess 2>/dev/null
echo ".htaccess atualizado."

# 10. Verificar estrutura final
echo -e "\n${YELLOW}10. Verificando estrutura final...${NC}"
cd ~
echo "Listando arquivos essenciais:"
ls -la public_html/quiz-de-estilo/.htaccess public_html/quiz-de-estilo/sw.js public_html/quiz-de-estilo/index.html 2>/dev/null

echo -e "\n${GREEN}=== VERIFICAÇÃO COMPLETA ===${NC}"
echo "Agora acesse: https://giselegalvao.com.br/quiz-de-estilo/"
echo "Se encontrar problemas, crie e acesse a página de diagnóstico:"
echo "https://giselegalvao.com.br/quiz-de-estilo/diagnostico.html"

echo -e "\n${RED}IMPORTANTE:${NC} Se precisar restaurar o backup:"
echo "cd ~"
echo "unzip backups/quiz_backup_${DATA_BACKUP}.zip -d restore/"
echo "# Em seguida, mova os arquivos conforme necessário"
