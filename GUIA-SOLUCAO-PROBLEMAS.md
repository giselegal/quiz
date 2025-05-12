# Guia Completo de Solução de Problemas - Quiz de Estilo (Comandos)

## Problema
O deploy do Quiz de Estilo na Hostinger não está funcionando corretamente, apresentando problemas como:
- URL incorreta mostrando "public_html" no caminho
- Recursos do site não carregando
- Estrutura de pastas duplicada ou aninhada no servidor
- Problemas com Service Worker

## Solução por Comandos

Criamos uma solução completa baseada em comandos para resolver estes problemas. Siga os comandos abaixo no seu terminal local e na Hostinger.

### 1. Limpar a Estrutura Existente

Conecte-se ao FTP da Hostinger e execute no terminal da Hostinger:

```bash
# Fazer backup antes de remover (opcional)
cd public_html
zip -r quiz-backup-$(date +"%Y%m%d").zip quiz-de-estilo/

# Remover a pasta problematica
rm -rf public_html/quiz-de-estilo/
```

### 2. Criar a Estrutura Correta

No terminal da Hostinger:

```bash
# Criar a pasta correta
mkdir -p public_html/quiz-de-estilo
```

### 3. Preparação dos Arquivos Corrigidos (no seu computador local)

```bash
# Baixar o script de solução
curl -o solucao-quiz.sh https://raw.githubusercontent.com/usuario/quiz-de-estilo/main/solucao-quiz.sh
chmod +x solucao-quiz.sh

# OU use o script já criado na workspace
bash /workspaces/quiz-sell-genius-66/solucao-simples.sh

# OU copie os arquivos corrigidos manualmente
mkdir -p correcao-quiz/
cp -r /workspaces/quiz-sell-genius-66/dist/* correcao-quiz/

# Modificar o .htaccess para o subdiretório
cat > correcao-quiz/.htaccess << 'EOF'
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

# Outras configurações...
EOF

# Modificar o Service Worker
cat > correcao-quiz/sw.js << 'EOF'
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

// Resto do código do Service Worker...
EOF

# Corrigir o registro do Service Worker no HTML
sed -i 's|navigator.serviceWorker.register("/sw.js"|navigator.serviceWorker.register("/quiz-de-estilo/sw.js"|g' correcao-quiz/index.html
sed -i 's|scope: "/"|scope: "/quiz-de-estilo/"|g' correcao-quiz/index.html

# Comprimir para upload
zip -r correcao-quiz.zip correcao-quiz/
```

### 4. Upload dos Arquivos Corrigidos

Você pode usar o FTP via linha de comando:

```bash
# Usando lftp (instale-o primeiro se necessário: sudo apt install lftp)
lftp -u seu_usuario,sua_senha ftp.giselegalvao.com.br << EOF
cd public_html
mkdir -p quiz-de-estilo
cd quiz-de-estilo
mirror -R correcao-quiz/ .
bye
EOF

# OU usando o comando scp se tiver acesso SSH
scp -r correcao-quiz/* usuario@giselegalvao.com.br:public_html/quiz-de-estilo/

# OU usando o comando ftp clássico
ftp ftp.giselegalvao.com.br << EOF
user seu_usuario sua_senha
cd public_html/quiz-de-estilo
binary
prompt off
mput correcao-quiz/*
bye
EOF
```

### 5. Criar Página de Diagnóstico

```bash
# Criar a página de diagnóstico
cat > correcao-quiz/diagnostico.html << 'EOF'
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
```

### 6. Verificar a Instalação e Solucionar Problemas

Após o upload, execute estes comandos para verificar:

```bash
# Verificar estrutura de arquivos no servidor (via SSH se disponível)
ssh usuario@giselegalvao.com.br "find public_html/quiz-de-estilo -type f | sort"

# Verificar permissões dos arquivos
ssh usuario@giselegalvao.com.br "ls -la public_html/quiz-de-estilo"

# Verificar conteúdo do .htaccess
ssh usuario@giselegalvao.com.br "cat public_html/quiz-de-estilo/.htaccess"

# Ou via cURL, verificar resposta do servidor
curl -I https://giselegalvao.com.br/quiz-de-estilo/
```

### 7. Solução de Problemas Comuns (via Terminal)

```bash
# Problema: Página em branco - Limpar cache
curl -I -X PURGE https://giselegalvao.com.br/quiz-de-estilo/

# Problema: URL mostra "public_html" - Verificar estrutura
ssh usuario@giselegalvao.com.br "find public_html -name '*quiz*' | grep -v 'quiz-de-estilo$'"

# Problema: Arquivos ausentes - Verificar arquivos críticos
ssh usuario@giselegalvao.com.br "ls -la public_html/quiz-de-estilo/.htaccess public_html/quiz-de-estilo/sw.js"

# Problema: Permissões incorretas - Corrigir permissões
ssh usuario@giselegalvao.com.br "chmod 644 public_html/quiz-de-estilo/.htaccess public_html/quiz-de-estilo/*.js public_html/quiz-de-estilo/*.html"
ssh usuario@giselegalvao.com.br "chmod 755 public_html/quiz-de-estilo/ public_html/quiz-de-estilo/assets/"

# Problema: Apache não reconhece .htaccess - Forçar reload
ssh usuario@giselegalvao.com.br "touch public_html/quiz-de-estilo/.htaccess"

# Para restaurar backup se necessário
ssh usuario@giselegalvao.com.br "cd public_html && unzip quiz-backup-20250512.zip"
```

## Verificação Final via Comandos

Para verificar se a estrutura final está correta:

```bash
# Verificar estrutura completa
ssh usuario@giselegalvao.com.br "find public_html/quiz-de-estilo -type f | sort | grep -v 'node_modules\|\.git'"

# Verificar acessibilidade HTTP
curl -s -o /dev/null -w "%{http_code}" https://giselegalvao.com.br/quiz-de-estilo/

# Testar redirecionamento do .htaccess
curl -s -o /dev/null -w "%{http_code}" https://giselegalvao.com.br/quiz-de-estilo/pagina-nao-existe

# Verificar conteúdo do service worker
curl -s https://giselegalvao.com.br/quiz-de-estilo/sw.js | grep -i "const BASE_PATH"
```

## Recursos Adicionais (via Terminal)

```bash
# Acessar logs de erro do Apache
ssh usuario@giselegalvao.com.br "tail -n 50 /var/log/apache2/error.log"

# Testar configuração do Apache
ssh usuario@giselegalvao.com.br "apachectl -t"

# Verificar módulos do Apache habilitados
ssh usuario@giselegalvao.com.br "apachectl -M | grep -E 'rewrite|expires|headers'"

# Verificar conexões ativas ao site
ssh usuario@giselegalvao.com.br "netstat -tn | grep ':80'"

# Monitorar acesso em tempo real
ssh usuario@giselegalvao.com.br "tail -f /var/log/apache2/access.log | grep quiz-de-estilo"
```

Caso tenha acesso ao Docker, você pode simular o ambiente localmente:

```bash
# Criar container com Apache para simular a Hostinger
docker run -d --name apache-test -p 8080:80 -v ./correcao-quiz:/var/www/html/quiz-de-estilo httpd:2.4

# Copiar configuração do .htaccess para o Apache
docker exec apache-test bash -c "echo 'LoadModule rewrite_module modules/mod_rewrite.so' >> /usr/local/apache2/conf/httpd.conf"
docker exec apache-test bash -c "echo '<Directory /var/www/html/quiz-de-estilo>\n  AllowOverride All\n</Directory>' >> /usr/local/apache2/conf/httpd.conf"
docker exec apache-test apachectl restart

# Testar localmente
curl http://localhost:8080/quiz-de-estilo/
```
