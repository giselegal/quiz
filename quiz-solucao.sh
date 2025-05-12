#!/bin/bash
# quiz-solucao.sh - Script completo para correção do Quiz de Estilo

# Cores para mensagens
GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[1;33m"
NC="\033[0m"

echo -e "${GREEN}=== SCRIPT DE CORREÇÃO DO QUIZ DE ESTILO ===${NC}"

# 1. Criar pasta local
echo -e "${YELLOW}1. Criando pasta de trabalho local...${NC}"
rm -rf ./correcao-quiz 2>/dev/null
mkdir -p ./correcao-quiz

# 2. Copiar arquivos do build
echo -e "${YELLOW}2. Copiando arquivos do build...${NC}"
if [ -d "/workspaces/quiz-sell-genius-66/dist" ]; then
  cp -r /workspaces/quiz-sell-genius-66/dist/* ./correcao-quiz/
else
  echo -e "${RED}Pasta dist não encontrada! Precisa gerar o build antes.${NC}"
  exit 1
fi

# 3. Corrigir .htaccess
echo -e "${YELLOW}3. Corrigindo .htaccess...${NC}"
cat > ./correcao-quiz/.htaccess << 'EOF'
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

# 4. Corrigir o Service Worker
echo -e "${YELLOW}4. Corrigindo Service Worker...${NC}"
cat > ./correcao-quiz/sw.js << 'EOF'
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

# 5. Corrigir o registro do Service Worker no HTML
echo -e "${YELLOW}5. Corrigindo registro do Service Worker no HTML...${NC}"
sed -i 's|navigator.serviceWorker.register("/sw.js"|navigator.serviceWorker.register("/quiz-de-estilo/sw.js"|g' ./correcao-quiz/index.html
sed -i 's|scope: "/"|scope: "/quiz-de-estilo/"|g' ./correcao-quiz/index.html

# 6. Adicionar diagnóstico
echo -e "${YELLOW}6. Adicionando página de diagnóstico...${NC}"
cat > ./correcao-quiz/diagnostico.html << 'EOF'
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Diagnóstico - Quiz de Estilo</title>
    <style>
        body {
            font-family: sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .info-box {
            background-color: #f8f9fa;
            border: 1px solid #ddd;
            padding: 15px;
            margin: 15px 0;
            border-radius: 5px;
        }
        pre {
            background-color: #f1f1f1;
            padding: 10px;
            overflow-x: auto;
        }
        button {
            background-color: #b29670;
            color: white;
            border: none;
            padding: 10px 15px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <h1>Diagnóstico - Quiz de Estilo</h1>
    
    <div class="info-box">
        <h2>Informações do Navegador</h2>
        <pre id="browserInfo"></pre>
    </div>
    
    <div class="info-box">
        <h2>Service Worker</h2>
        <pre id="swInfo"></pre>
        <button id="registerSW">Registrar Service Worker</button>
        <button id="unregisterSW">Remover Service Worker</button>
    </div>
    
    <div class="info-box">
        <h2>Teste de Caminhos</h2>
        <pre id="pathTest"></pre>
        <button id="testPaths">Testar Caminhos</button>
    </div>
    
    <div class="info-box">
        <h2>Solução de Problemas</h2>
        <button id="clearCache">Limpar Cache</button>
        <button id="goToHome">Ir para Página Inicial</button>
    </div>
    
    <script>
        // Código JavaScript para diagnóstico
        function showBrowserInfo() {
            document.getElementById('browserInfo').textContent = 
                `URL Atual: ${window.location.href}\n` +
                `Pathname: ${window.location.pathname}\n` +
                `User Agent: ${navigator.userAgent}`;
        }
        
        document.getElementById('registerSW').addEventListener('click', async () => {
            try {
                const reg = await navigator.serviceWorker.register('/quiz-de-estilo/sw.js', {
                    scope: '/quiz-de-estilo/'
                });
                alert('Service Worker registrado com sucesso!');
            } catch (e) {
                alert('Erro: ' + e);
            }
        });
        
        document.getElementById('unregisterSW').addEventListener('click', async () => {
            const regs = await navigator.serviceWorker.getRegistrations();
            let count = 0;
            for (const reg of regs) {
                await reg.unregister();
                count++;
            }
            alert(`${count} Service Worker(s) removido(s)`);
        });
        
        document.getElementById('testPaths').addEventListener('click', async () => {
            const paths = [
                '/quiz-de-estilo/',
                '/quiz-de-estilo/index.html',
                '/quiz-de-estilo/sw.js'
            ];
            
            let results = '';
            for (const path of paths) {
                try {
                    const response = await fetch(path, { cache: 'no-store' });
                    results += `${path}: ${response.status} ${response.ok ? '✓' : '✗'}\n`;
                } catch (e) {
                    results += `${path}: Erro - ${e.message}\n`;
                }
            }
            
            document.getElementById('pathTest').textContent = results;
        });
        
        document.getElementById('clearCache').addEventListener('click', async () => {
            if ('caches' in window) {
                const keys = await caches.keys();
                for (const key of keys) {
                    await caches.delete(key);
                }
                alert('Cache limpo!');
                location.reload(true);
            }
        });
        
        document.getElementById('goToHome').addEventListener('click', () => {
            window.location.href = '/quiz-de-estilo/';
        });
        
        window.addEventListener('load', () => {
            showBrowserInfo();
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(regs => {
                    let info = '';
                    if (regs.length === 0) {
                        info = 'Nenhum Service Worker registrado';
                    } else {
                        regs.forEach(reg => {
                            info += `Scope: ${reg.scope}\n`;
                            info += `Ativo: ${!!reg.active}\n`;
                            if (reg.active) {
                                info += `URL: ${reg.active.scriptURL}\n`;
                            }
                        });
                    }
                    document.getElementById('swInfo').textContent = info;
                });
            }
        });
    </script>
</body>
</html>
EOF

# 7. Adicionar README com instruções
echo -e "${YELLOW}7. Adicionando README com instruções...${NC}"
cat > ./correcao-quiz/README.txt << 'EOF'
INSTRUÇÕES PARA DEPLOY MANUAL DO QUIZ DE ESTILO
==============================================

Esta é uma versão corrigida do Quiz de Estilo para upload manual via FTP.
Siga os comandos para fazer o deploy corretamente.

PASSO 1: LIMPAR A ESTRUTURA EXISTENTE NO SERVIDOR
------------------------------------------------
Na Hostinger (via FTP ou SSH):

$ cd public_html
$ rm -rf quiz-de-estilo/

PASSO 2: CRIAR ESTRUTURA CORRETA NO SERVIDOR
-------------------------------------------
$ mkdir -p public_html/quiz-de-estilo

PASSO 3: FAZER UPLOAD DOS ARQUIVOS
---------------------------------
Opção 1 - Via FTP:
- Conecte-se via FTP (FileZilla ou outro cliente)
- Envie todos os arquivos desta pasta para public_html/quiz-de-estilo/

Opção 2 - Via SSH com SCP:
$ scp -r * usuario@giselegalvao.com.br:public_html/quiz-de-estilo/

Opção 3 - Via LFTP:
$ lftp -u usuario,senha ftp.giselegalvao.com.br -e "mirror -R . /public_html/quiz-de-estilo; bye"

PASSO 4: VERIFICAR PERMISSÕES DOS ARQUIVOS
-----------------------------------------
$ chmod 644 public_html/quiz-de-estilo/.htaccess
$ chmod 644 public_html/quiz-de-estilo/*.js public_html/quiz-de-estilo/*.html
$ chmod 755 public_html/quiz-de-estilo/
$ chmod 755 public_html/quiz-de-estilo/assets/

PASSO 5: TESTAR O SITE
---------------------
Acesse: https://giselegalvao.com.br/quiz-de-estilo/

Se encontrar problemas, use a página de diagnóstico:
https://giselegalvao.com.br/quiz-de-estilo/diagnostico.html

SOLUÇÃO DE PROBLEMAS COMUNS
--------------------------
Problema: URL com "public_html"
Solução: $ find public_html -type d -name "*quiz*" | grep -v "quiz-de-estilo$"

Problema: Arquivo .htaccess não funciona
Solução: $ touch public_html/quiz-de-estilo/.htaccess

Problema: Permissões incorretas
Solução: $ find public_html/quiz-de-estilo -type f -exec chmod 644 {} \;
EOF

# 8. Comprimir para upload
echo -e "${YELLOW}8. Compactando para upload...${NC}"
zip -r correcao-quiz.zip correcao-quiz/

echo -e "${GREEN}✅ SOLUÇÃO COMPLETA CRIADA!${NC}"
echo -e "Arquivos preparados em: ${YELLOW}./correcao-quiz/${NC}"
echo -e "Arquivo ZIP para download: ${YELLOW}./correcao-quiz.zip${NC}"
echo 
echo -e "${GREEN}COMANDOS ÚTEIS PARA SERVIDOR:${NC}"
echo "# Remover estrutura antiga"
echo "rm -rf public_html/quiz-de-estilo/"
echo ""
echo "# Criar nova estrutura"
echo "mkdir -p public_html/quiz-de-estilo/"
echo ""
echo "# Verificar estrutura de pastas após upload"
echo "find public_html/quiz-de-estilo -type f | head -20"
echo ""
echo "# Testar acesso"
echo "curl -I https://giselegalvao.com.br/quiz-de-estilo/"
