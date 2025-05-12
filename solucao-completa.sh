#!/bin/bash
# Script para criar uma solução 100% funcional para deploy na Hostinger

# Cores para saída
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

echo -e "${YELLOW}🔨 CRIANDO SOLUÇÃO DEFINITIVA PARA O QUIZ DE ESTILO 🔨${NC}"
echo "Este script criará uma versão corrigida para upload manual via FTP"

# Criar pasta temporária para solução
echo -e "${GREEN}1. Preparando pasta para solução...${NC}"
rm -rf ./solucao-quiz-estilo 2>/dev/null
mkdir -p ./solucao-quiz-estilo

# Gerar build limpo do projeto
echo -e "${GREEN}2. Gerando build limpo do projeto...${NC}"
npm run build

# Copiar arquivos do build para pasta solução
echo -e "${GREEN}3. Copiando arquivos para pasta solução...${NC}"
cp -r ./dist/* ./solucao-quiz-estilo/

# Criar arquivo .htaccess corrigido
echo -e "${GREEN}4. Criando .htaccess definitivo...${NC}"
cat << 'EOF' > ./solucao-quiz-estilo/.htaccess
# Configurações otimizadas para React app em subdiretório na Hostinger
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /quiz-de-estilo/
    
    # Impedir acesso direto à pasta public_html se alguém tentar
    RewriteCond %{THE_REQUEST} public_html [NC]
    RewriteRule .* - [F,L]
    
    # Prevenir looping de redirecionamento
    RewriteCond %{ENV:REDIRECT_STATUS} 200
    RewriteRule .* - [L]
    
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

# Corrigir o Service Worker para funcionar em subdiretório
echo -e "${GREEN}5. Corrigindo Service Worker...${NC}"
cat << 'EOF' > ./solucao-quiz-estilo/sw.js
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

# Criar arquivo de verificação de navegador para mostrar informações úteis
echo -e "${GREEN}6. Criando página de diagnóstico...${NC}"
cat << 'EOF' > ./solucao-quiz-estilo/diagnostico.html
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
        <h2>Teste de Cache</h2>
        <pre id="cacheTest"></pre>
        <button id="clearCache">Limpar Cache</button>
    </div>
    
    <div class="info-box">
        <h2>Solução de Problemas</h2>
        <p>Se o site não estiver carregando corretamente:</p>
        <ol>
            <li>Verifique se a pasta <code>public_html/quiz-de-estilo/</code> contém todos os arquivos necessários</li>
            <li>Confirme que o arquivo <code>.htaccess</code> existe e está configurado corretamente</li>
            <li>Tente limpar o cache do navegador</li>
            <li>Verifique se os caminhos dos recursos estão corretos</li>
        </ol>
        <button id="goToHome">Ir para Página Inicial</button>
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
                '/quiz-de-estilo/assets/index-DbTyDhJ5.js',
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
            const cacheTest = document.getElementById('cacheTest');
            cacheTest.textContent = 'Limpando cache...';
            
            try {
                if ('caches' in window) {
                    const cacheNames = await caches.keys();
                    for (const cacheName of cacheNames) {
                        await caches.delete(cacheName);
                    }
                    cacheTest.innerHTML = `<span class="success">Cache limpo com sucesso!</span>\n${cacheNames.length} caches removidos.`;
                } else {
                    cacheTest.innerHTML = '<span class="error">API de Cache não suportada neste navegador</span>';
                }
            } catch (error) {
                cacheTest.innerHTML = `<span class="error">Erro ao limpar cache: ${error.message}</span>`;
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

# Criar um README com instruções
echo -e "${GREEN}7. Criando README com instruções...${NC}"
cat << 'EOF' > ./solucao-quiz-estilo/README.txt
INSTRUÇÕES PARA DEPLOY MANUAL DO QUIZ DE ESTILO
==============================================

Esta é uma versão corrigida do Quiz de Estilo para upload manual.
Siga as instruções abaixo para fazer o deploy corretamente.

PASSO 1: LIMPAR A ESTRUTURA EXISTENTE
-------------------------------------
1. Faça login no painel da Hostinger
2. Vá para o Gerenciador de Arquivos
3. Navegue até a pasta public_html/
4. **IMPORTANTE**: Faça backup de qualquer conteúdo importante
5. Se existir, exclua completamente a pasta quiz-de-estilo/
   (isso garantirá que não haverá estruturas aninhadas incorretas)

PASSO 2: CRIAR NOVA ESTRUTURA
----------------------------
1. Crie uma nova pasta vazia chamada quiz-de-estilo dentro de public_html/
2. A estrutura deve ser: public_html/quiz-de-estilo/

PASSO 3: FAZER UPLOAD DOS ARQUIVOS
---------------------------------
1. Faça upload de TODOS os arquivos desta pasta para public_html/quiz-de-estilo/
2. NÃO crie pastas adicionais durante o upload
3. Verifique se o arquivo .htaccess foi incluído (é um arquivo oculto)

PASSO 4: VERIFICAR A ESTRUTURA
-----------------------------
A estrutura final deve ser:
- public_html/quiz-de-estilo/index.html
- public_html/quiz-de-estilo/.htaccess
- public_html/quiz-de-estilo/sw.js
- public_html/quiz-de-estilo/assets/...
- etc.

PASSO 5: TESTAR O SITE
---------------------
1. Acesse: https://giselegalvao.com.br/quiz-de-estilo/
2. Verifique se o site carrega corretamente
3. Se encontrar problemas, acesse a página de diagnóstico:
   https://giselegalvao.com.br/quiz-de-estilo/diagnostico.html

PROBLEMAS COMUNS E SOLUÇÕES
--------------------------
- Erro 404: Verifique se todos os arquivos foram carregados corretamente
- Página em branco: Verifique se o .htaccess está configurado corretamente
- Falha no carregamento de recursos: Verifique os caminhos no console do navegador

CONTATO PARA SUPORTE
-------------------
Se precisar de ajuda adicional, entre em contato com o desenvolvedor.
EOF

# Comprimir solução para upload fácil
echo -e "${GREEN}8. Compactando solução para upload fácil...${NC}"
zip -r solucao-quiz-estilo.zip solucao-quiz-estilo/

echo -e "${GREEN}✅ SOLUÇÃO COMPLETA CRIADA COM SUCESSO!${NC}"
echo -e "Arquivos prontos para upload em: ${YELLOW}./solucao-quiz-estilo/${NC}"
echo -e "Versão compactada disponível em: ${YELLOW}./solucao-quiz-estilo.zip${NC}"
echo
echo -e "${YELLOW}INSTRUÇÕES:${NC}"
echo -e "1. Baixe o arquivo solucao-quiz-estilo.zip para o seu computador"
echo -e "2. Extraia o conteúdo localmente"
echo -e "3. Conecte-se ao FTP da Hostinger"
echo -e "4. Exclua a pasta quiz-de-estilo atual na Hostinger (faça backup se necessário)"
echo -e "5. Crie uma nova pasta quiz-de-estilo"
echo -e "6. Faça upload de TODOS os arquivos para a nova pasta"
echo -e "7. Teste o site em https://giselegalvao.com.br/quiz-de-estilo/"
echo -e "8. Se necessário, use a página de diagnóstico: https://giselegalvao.com.br/quiz-de-estilo/diagnostico.html"
echo
echo -e "${RED}LEMBRE-SE: Este é um upload manual. Não use o GitHub Actions até corrigir o workflow.${NC}"
