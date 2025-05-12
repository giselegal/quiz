#!/bin/bash
# Script para download e configuração correta do site
# Este script é mais simples e foca apenas em preparar os arquivos para upload

# Criar pasta para solução
mkdir -p solucao-simples
cd solucao-simples

# Criar arquivo .htaccess corrigido
cat > .htaccess << 'EOF'
# Configurações otimizadas para React app em subdiretório na Hostinger
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /quiz-de-estilo/
    
    # Impedir acesso direto à pasta public_html se alguém tentar
    RewriteCond %{THE_REQUEST} public_html [NC]
    RewriteRule .* - [F,L]
    
    # Se o arquivo/diretório não existir, redirecionar para index.html
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ index.html [L,QSA]
</IfModule>

# Configurações de tipo MIME
<IfModule mod_mime.c>
    AddType application/javascript .js .jsx .mjs .ts .tsx
    AddType application/json .json
    AddType image/webp .webp
    AddType image/avif .avif
    AddType image/svg+xml .svg
</IfModule>

# Configurações de headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    
    # Permitir conexões de recursos em outros domínios
    Header set Access-Control-Allow-Origin "*"
    
    # Cache para recursos estáticos
    <FilesMatch "\.(js|css|jpg|jpeg|png|gif|webp|avif|svg|ico|woff|woff2)$">
        Header set Cache-Control "max-age=31536000, public"
    </FilesMatch>
    
    # Desabilitar cache para index.html
    <FilesMatch "index\.html$">
        Header set Cache-Control "no-cache, no-store, must-revalidate"
        Header set Pragma "no-cache"
        Header set Expires "0"
    </FilesMatch>
</IfModule>

# Compressão para melhorar performance
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/css application/javascript application/json image/svg+xml
</IfModule>
EOF

# Criar arquivo README com instruções
cat > README.txt << 'EOF'
INSTRUÇÕES PARA CORREÇÃO DO QUIZ DE ESTILO
==========================================

Este é um conjunto de arquivos para corrigir os problemas de deploy no Quiz de Estilo.

PASSO 1: LIMPAR A ESTRUTURA EXISTENTE
-------------------------------------
1. Acesse o painel da Hostinger e vá para o Gerenciador de Arquivos
2. Navegue até public_html/
3. IMPORTANTE: Faça backup do conteúdo atual se necessário
4. Exclua completamente a pasta quiz-de-estilo/ (para evitar estruturas aninhadas)

PASSO 2: CRIAR NOVA ESTRUTURA CORRETA
------------------------------------
1. Crie uma nova pasta vazia chamada quiz-de-estilo dentro de public_html/
2. A estrutura deve ser: public_html/quiz-de-estilo/

PASSO 3: UPLOAD DOS ARQUIVOS DO SITE
-----------------------------------
1. Faça upload do conteúdo da pasta dist/ para public_html/quiz-de-estilo/
2. Adicione o arquivo .htaccess deste pacote para substituir o existente
3. Certifique-se de que o Service Worker (sw.js) está na raiz da pasta quiz-de-estilo

PASSO 4: VERIFICAR ESTRUTURA FINAL
---------------------------------
A estrutura final deve ser:
- public_html/quiz-de-estilo/index.html
- public_html/quiz-de-estilo/.htaccess (o deste pacote)
- public_html/quiz-de-estilo/sw.js
- public_html/quiz-de-estilo/assets/...

PASSO 5: TESTAR O SITE
---------------------
Acesse: https://giselegalvao.com.br/quiz-de-estilo/

Se encontrar problemas:
1. Limpe o cache do navegador (Ctrl+F5 ou Cmd+Shift+R)
2. Verifique o console do navegador para identificar erros específicos
3. Verifique se todos os arquivos foram carregados corretamente
EOF

# Criar Service Worker corrigido
cat > sw.js << 'EOF'
// Service Worker corrigido para subdiretório
const CACHE_VERSION = 'v1';
const CACHE_NAME = `quiz-estilo-${CACHE_VERSION}`;
const BASE_PATH = '/quiz-de-estilo/';

// Lista de recursos essenciais para cache
const STATIC_ASSETS = [
  BASE_PATH,
  `${BASE_PATH}index.html`,
  // Arquivos essenciais são adicionados durante o evento fetch
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
  // Ignorar requisições não GET
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
  
  // Estratégia para arquivos estáticos (network first com fallback para cache)
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Se a resposta for válida, colocar no cache
        if (response.ok) {
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clonedResponse);
          });
        }
        return response;
      })
      .catch(() => {
        // Se falhar, tentar do cache
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Se não estiver no cache, tentar o fallback index.html
          if (event.request.mode === 'navigate') {
            return caches.match(`${BASE_PATH}index.html`);
          }
          return new Response('Not found', { status: 404 });
        });
      })
  );
});
EOF

# Criar página de diagnóstico
cat > diagnostico.html << 'EOF'
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Diagnóstico - Quiz de Estilo</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1 {
            color: #b29670;
            border-bottom: 2px solid #b29670;
            padding-bottom: 10px;
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
            border-radius: 4px;
            overflow-x: auto;
        }
        .success {
            color: #28a745;
            font-weight: bold;
        }
        .error {
            color: #dc3545;
            font-weight: bold;
        }
        .warning {
            color: #ffc107;
            font-weight: bold;
        }
        button {
            background-color: #b29670;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            margin: 5px 0;
        }
        button:hover {
            background-color: #a18660;
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
        <h2>Estrutura de Diretórios</h2>
        <p>A estrutura correta de diretórios para o site deve ser:</p>
        <pre>
public_html/
└── quiz-de-estilo/
    ├── index.html
    ├── .htaccess
    ├── sw.js
    ├── assets/
    │   ├── index-[hash].js
    │   ├── index-[hash].css
    │   └── ... (outros arquivos)
    └── ... (outros arquivos)
        </pre>
    </div>
    
    <div class="info-box">
        <h2>Solução de Problemas</h2>
        <p>Se o site não estiver carregando corretamente:</p>
        <ol>
            <li>Verifique se o arquivo <code>.htaccess</code> está na pasta correta</li>
            <li>Confirme que a estrutura de diretórios está correta (sem pastas aninhadas)</li>
            <li>Limpe o cache do navegador (Ctrl+F5 ou Cmd+Shift+R)</li>
            <li>Inspecione o console do navegador para ver erros específicos</li>
        </ol>
        <button id="goToHome">Ir para Página Inicial</button>
        <button id="clearCache">Limpar Cache</button>
    </div>
    
    <script>
        // Exibir informações do navegador
        function showBrowserInfo() {
            const info = document.getElementById('browserInfo');
            info.textContent = `
User Agent: ${navigator.userAgent}
Cookies Habilitados: ${navigator.cookieEnabled}
Linguagem: ${navigator.language}
Online: ${navigator.onLine}
URL Atual: ${window.location.href}
Pathname: ${window.location.pathname}
Base URL: ${document.baseURI}
`;
        }
        
        // Verificar Service Worker
        async function checkServiceWorker() {
            const info = document.getElementById('swInfo');
            try {
                if ('serviceWorker' in navigator) {
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    if (registrations.length === 0) {
                        info.innerHTML = '<span class="warning">Nenhum Service Worker registrado</span>';
                    } else {
                        let swInfo = '';
                        registrations.forEach(reg => {
                            swInfo += `
Scope: ${reg.scope}
Atualização pendente: ${!!reg.waiting}
Ativo: ${!!reg.active}
Estado: ${reg.active ? reg.active.state : 'N/A'}
URL: ${reg.active ? reg.active.scriptURL : 'N/A'}
`;
                        });
                        info.textContent = swInfo;
                    }
                } else {
                    info.innerHTML = '<span class="error">Service Worker não suportado neste navegador</span>';
                }
            } catch (error) {
                info.innerHTML = `<span class="error">Erro ao verificar Service Worker: ${error.message}</span>`;
            }
        }
        
        // Registrar Service Worker
        document.getElementById('registerSW').addEventListener('click', async () => {
            const info = document.getElementById('swInfo');
            try {
                if ('serviceWorker' in navigator) {
                    info.textContent = 'Registrando Service Worker...';
                    const registration = await navigator.serviceWorker.register('/quiz-de-estilo/sw.js', {
                        scope: '/quiz-de-estilo/'
                    });
                    info.innerHTML = `<span class="success">Service Worker registrado com sucesso!</span>\nScope: ${registration.scope}`;
                    setTimeout(checkServiceWorker, 1000);
                } else {
                    info.innerHTML = '<span class="error">Service Worker não suportado neste navegador</span>';
                }
            } catch (error) {
                info.innerHTML = `<span class="error">Erro ao registrar Service Worker: ${error.message}</span>`;
            }
        });
        
        // Remover Service Worker
        document.getElementById('unregisterSW').addEventListener('click', async () => {
            const info = document.getElementById('swInfo');
            try {
                if ('serviceWorker' in navigator) {
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    if (registrations.length === 0) {
                        info.innerHTML = '<span class="warning">Nenhum Service Worker para remover</span>';
                    } else {
                        let count = 0;
                        for (const registration of registrations) {
                            await registration.unregister();
                            count++;
                        }
                        info.innerHTML = `<span class="success">${count} Service Worker(s) removido(s)</span>`;
                        setTimeout(checkServiceWorker, 1000);
                    }
                } else {
                    info.innerHTML = '<span class="error">Service Worker não suportado neste navegador</span>';
                }
            } catch (error) {
                info.innerHTML = `<span class="error">Erro ao remover Service Worker: ${error.message}</span>`;
            }
        });
        
        // Testar caminhos
        document.getElementById('testPaths').addEventListener('click', async () => {
            const pathTest = document.getElementById('pathTest');
            pathTest.textContent = 'Testando caminhos...';
            
            const paths = [
                '/quiz-de-estilo/',
                '/quiz-de-estilo/index.html',
                '/quiz-de-estilo/sw.js'
            ];
            
            let results = '';
            for (const path of paths) {
                try {
                    const response = await fetch(path, { cache: 'no-store' });
                    results += `${path}: ${response.status} ${response.ok ? '✅' : '❌'}\n`;
                } catch (error) {
                    results += `${path}: Erro - ${error.message} ❌\n`;
                }
            }
            
            pathTest.textContent = results;
        });
        
        // Limpar cache
        document.getElementById('clearCache').addEventListener('click', async () => {
            try {
                if ('caches' in window) {
                    const cacheNames = await caches.keys();
                    for (const cacheName of cacheNames) {
                        await caches.delete(cacheName);
                    }
                    alert(`Cache limpo com sucesso! ${cacheNames.length} caches removidos.`);
                    location.reload(true);
                } else {
                    alert('API de Cache não suportada neste navegador');
                }
            } catch (error) {
                alert(`Erro ao limpar cache: ${error.message}`);
            }
        });
        
        // Ir para a página inicial
        document.getElementById('goToHome').addEventListener('click', () => {
            window.location.href = '/quiz-de-estilo/';
        });
        
        // Inicializar
        window.addEventListener('load', () => {
            showBrowserInfo();
            checkServiceWorker();
        });
    </script>
</body>
</html>
EOF

echo "Arquivos de correção criados com sucesso em 'solucao-simples/'"
echo "INSTRUÇÕES DE USO:"
echo "1. Copie os arquivos .htaccess, sw.js e diagnostico.html deste pacote"
echo "2. Acesse o gerenciador de arquivos da Hostinger"
echo "3. Limpe completamente a estrutura existente em public_html/quiz-de-estilo"
echo "4. Crie uma nova pasta quiz-de-estilo dentro de public_html"
echo "5. Faça upload da pasta dist/ para public_html/quiz-de-estilo/"
echo "6. Substitua o .htaccess pelo fornecido neste pacote"
echo "7. Adicione o sw.js e diagnostico.html à raiz public_html/quiz-de-estilo/"
echo "8. Teste a página em https://giselegalvao.com.br/quiz-de-estilo/"
echo "9. Se necessário, use https://giselegalvao.com.br/quiz-de-estilo/diagnostico.html para solucionar problemas"
