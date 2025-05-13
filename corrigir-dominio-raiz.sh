#!/bin/bash
# Script para substituir o WordPress no domínio raiz da Hostinger
# com uma aplicação React/Vite

# Cores para mensagens
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

echo -e "${GREEN}=== PREPARANDO SOLUÇÃO PARA DOMÍNIO RAIZ ===\n${NC}"

# 1. Fazer build da aplicação
echo -e "${YELLOW}1. Construindo a aplicação otimizada...${NC}"
npm run build

# 2. Criar pasta para a solução
echo -e "\n${YELLOW}2. Criando pasta para solução do domínio raiz...${NC}"
rm -rf ./solucao-raiz-dominio 2>/dev/null
mkdir -p ./solucao-raiz-dominio

# 3. Copiar arquivos da build para a pasta de solução
echo -e "\n${YELLOW}3. Copiando arquivos para pasta de solução...${NC}"
cp -r ./dist/* ./solucao-raiz-dominio/

# 4. Criar arquivo .htaccess otimizado para domínio raiz
echo -e "\n${YELLOW}4. Criando .htaccess para domínio raiz...${NC}"
cat > ./solucao-raiz-dominio/.htaccess << EOL
# Configuração otimizada para SPA React/Vite no domínio raiz
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Não aplicar regras a arquivos ou diretórios existentes
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Redirecionar tudo para index.html
  RewriteRule ^(.*)$ index.html [L,QSA]
</IfModule>

# Permitir acesso ao diretório
<IfModule mod_autoindex.c>
  Options -Indexes
</IfModule>

# Definir index.html como arquivo padrão
DirectoryIndex index.html

# Cache para arquivos estáticos
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Compressão de arquivos
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/css application/javascript application/json
</IfModule>
EOL

# 5. Criar scripts de diagnóstico e backup do WordPress
echo -e "\n${YELLOW}5. Criando scripts de diagnóstico e backup...${NC}"

# Script de diagnóstico
cat > ./solucao-raiz-dominio/diagnostico.php << EOL
<?php
header('Content-Type: text/html; charset=utf-8');
echo "<html><head><title>Diagnóstico - giselegalvao.com.br</title>
<style>
body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
h1 { color: #b29670; border-bottom: 1px solid #b29670; padding-bottom: 10px; }
.info-box { background-color: #f8f9fa; border: 1px solid #ddd; padding: 15px; margin: 15px 0; border-radius: 5px; }
pre { background-color: #f1f1f1; padding: 10px; border-radius: 4px; overflow-x: auto; }
.success { color: #28a745; font-weight: bold; }
.error { color: #dc3545; font-weight: bold; }
.warning { color: #ffc107; font-weight: bold; }
</style>
</head><body>";
echo "<h1>Diagnóstico do Domínio Principal</h1>";
echo "<p>Data/hora atual: " . date('Y-m-d H:i:s') . "</p>";

echo "<div class='info-box'>";
echo "<h2>Informações do Servidor</h2>";
echo "<pre>";
echo "PHP Version: " . phpversion() . "\n";
echo "Server Software: " . \$_SERVER['SERVER_SOFTWARE'] . "\n";
echo "Document Root: " . \$_SERVER['DOCUMENT_ROOT'] . "\n";
echo "Script Filename: " . \$_SERVER['SCRIPT_FILENAME'] . "\n";
echo "Remote Addr: " . \$_SERVER['REMOTE_ADDR'] . "\n";
echo "HTTP Host: " . \$_SERVER['HTTP_HOST'] . "\n";
echo "URI: " . \$_SERVER['REQUEST_URI'] . "\n";
echo "</pre>";
echo "</div>";

echo "<div class='info-box'>";
echo "<h2>Estrutura de Diretórios</h2>";
echo "<pre>";
system('ls -la');
echo "</pre>";
echo "</div>";

echo "<div class='info-box'>";
echo "<h2>Conteúdo do .htaccess</h2>";
echo "<pre>";
if (file_exists('.htaccess')) {
    echo htmlspecialchars(file_get_contents('.htaccess'));
} else {
    echo "<span class='error'>Arquivo .htaccess não encontrado</span>";
}
echo "</pre>";
echo "</div>";

echo "<div class='info-box'>";
echo "<h2>Verificação de Arquivos Críticos</h2>";
echo "<ul>";
foreach (['index.html', 'index.php', 'wp-config.php'] as \$file) {
    echo "<li>";
    echo \$file . ": ";
    if (file_exists(\$file)) {
        echo "<span class='success'>Encontrado</span>";
        
        if (\$file == 'index.php') {
            echo " - ";
            \$content = file_get_contents(\$file);
            if (strpos(\$content, 'WordPress') !== false) {
                echo "<span class='error'>É um arquivo WordPress</span>";
            } else {
                echo "<span class='success'>Não parece ser WordPress</span>";
            }
        }
    } else {
        echo "<span class='error'>Não encontrado</span>";
    }
    echo "</li>";
}
echo "</ul>";
echo "</div>";

echo "<div class='info-box'>";
echo "<h2>Ações Disponíveis</h2>";
echo "<p><a href='backup-wordpress.php' style='color: #b29670; font-weight: bold;'>Fazer backup dos arquivos WordPress</a></p>";
echo "<p><a href='fix-permissions.php' style='color: #b29670; font-weight: bold;'>Corrigir permissões de arquivos</a></p>";
echo "<p><a href='https://giselegalvao.com.br/' style='color: #b29670; font-weight: bold;'>Ir para a página inicial</a></p>";
echo "</div>";

echo "</body></html>";
EOL

# Script de backup do WordPress
cat > ./solucao-raiz-dominio/backup-wordpress.php << EOL
<?php
header('Content-Type: text/html; charset=utf-8');
echo "<html><head><title>Backup WordPress</title>
<style>
body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
h1 { color: #b29670; border-bottom: 1px solid #b29670; padding-bottom: 10px; }
.info-box { background-color: #f8f9fa; border: 1px solid #ddd; padding: 15px; margin: 15px 0; border-radius: 5px; }
pre { background-color: #f1f1f1; padding: 10px; border-radius: 4px; overflow-x: auto; }
.success { color: #28a745; font-weight: bold; }
.error { color: #dc3545; font-weight: bold; }
.warning { color: #ffc107; font-weight: bold; }
</style>
</head><body>";
echo "<h1>Backup dos Arquivos WordPress</h1>";

// Verificar se o backup já foi confirmado
if (isset(\$_GET['confirm']) && \$_GET['confirm'] === 'yes') {
    // Arquivos típicos do WordPress
    \$wp_files = array(
        'wp-config.php',
        'wp-login.php',
        'wp-admin',
        'wp-content',
        'wp-includes',
        'index.php'
    );

    // Criar diretório de backup
    if (!is_dir('wordpress_backup')) {
        if (mkdir('wordpress_backup', 0755, true)) {
            echo "<p class='success'>Diretório de backup criado: wordpress_backup</p>";
        } else {
            echo "<p class='error'>Falha ao criar diretório de backup</p>";
        }
    }

    echo "<div class='info-box'>";
    echo "<h2>Movendo arquivos para backup:</h2><ul>";

    foreach (\$wp_files as \$file) {
        if (file_exists(\$file)) {
            \$destination = 'wordpress_backup/' . basename(\$file);
            
            if (is_dir(\$file)) {
                // Mover diretório recursivamente
                if (rename(\$file, \$destination)) {
                    echo "<li class='success'>Diretório movido: " . htmlspecialchars(\$file) . " → " . htmlspecialchars(\$destination) . "</li>";
                } else {
                    echo "<li class='error'>Falha ao mover diretório: " . htmlspecialchars(\$file) . "</li>";
                }
            } else {
                // Mover arquivo
                if (rename(\$file, \$destination)) {
                    echo "<li class='success'>Arquivo movido: " . htmlspecialchars(\$file) . " → " . htmlspecialchars(\$destination) . "</li>";
                } else {
                    echo "<li class='error'>Falha ao mover arquivo: " . htmlspecialchars(\$file) . "</li>";
                }
            }
        } else {
            echo "<li class='warning'>Arquivo/diretório não encontrado: " . htmlspecialchars(\$file) . "</li>";
        }
    }

    echo "</ul>";
    echo "</div>";
    
    echo "<div class='info-box'>";
    echo "<h2>Próximos Passos</h2>";
    echo "<p>Agora você pode fazer upload dos arquivos da sua aplicação React/Vite.</p>";
    echo "<p><a href='diagnostico.php' style='color: #b29670; font-weight: bold;'>Verificar diagnóstico</a></p>";
    echo "</div>";
} else {
    // Mostrar confirmação
    echo "<div class='info-box'>";
    echo "<h2>⚠️ Atenção ⚠️</h2>";
    echo "<p>Esta ação irá mover todos os arquivos do WordPress para uma pasta de backup.</p>";
    echo "<p>Você tem certeza que deseja prosseguir?</p>";
    echo "<p><a href='?confirm=yes' style='color: #dc3545; font-weight: bold;'>Sim, fazer backup e remover WordPress</a></p>";
    echo "<p><a href='diagnostico.php' style='color: #b29670;'>Cancelar e voltar ao diagnóstico</a></p>";
    echo "</div>";
}

echo "</body></html>";
EOL

# Script para corrigir permissões
cat > ./solucao-raiz-dominio/fix-permissions.php << EOL
<?php
header('Content-Type: text/html; charset=utf-8');
echo "<html><head><title>Correção de Permissões</title>
<style>
body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
h1 { color: #b29670; border-bottom: 1px solid #b29670; padding-bottom: 10px; }
.info-box { background-color: #f8f9fa; border: 1px solid #ddd; padding: 15px; margin: 15px 0; border-radius: 5px; }
pre { background-color: #f1f1f1; padding: 10px; border-radius: 4px; overflow-x: auto; }
.success { color: #28a745; font-weight: bold; }
.error { color: #dc3545; font-weight: bold; }
.warning { color: #ffc107; font-weight: bold; }
</style>
</head><body>";
echo "<h1>Correção de Permissões de Arquivos</h1>";

// Verificar confirmação
if (isset(\$_GET['confirm']) && \$_GET['confirm'] === 'yes') {
    function fix_permissions(\$dir) {
        if (!is_dir(\$dir)) {
            echo "<p class='error'>Diretório não encontrado: " . htmlspecialchars(\$dir) . "</p>";
            return;
        }
        
        echo "<div class='info-box'>";
        echo "<h2>Corrigindo permissões em: " . htmlspecialchars(\$dir) . "</h2>";
        
        try {
            \$iterator = new RecursiveIteratorIterator(
                new RecursiveDirectoryIterator(\$dir, RecursiveDirectoryIterator::SKIP_DOTS),
                RecursiveIteratorIterator::SELF_FIRST
            );
            
            echo "<ul>";
            foreach (\$iterator as \$path) {
                \$isDir = \$path->isDir();
                \$oldPerms = substr(sprintf('%o', \$path->getPerms()), -4);
                
                if (\$isDir) {
                    chmod(\$path->getPathname(), 0755);
                } else {
                    chmod(\$path->getPathname(), 0644);
                }
                
                \$newPerms = substr(sprintf('%o', \$path->getPerms()), -4);
                
                echo "<li>";
                echo htmlspecialchars(\$path->getPathname()) . " ";
                echo "[" . (\$isDir ? "Diretório" : "Arquivo") . "]: ";
                echo \$oldPerms . " → " . \$newPerms;
                echo "</li>";
            }
            echo "</ul>";
            
            echo "<p class='success'>Permissões corrigidas: diretórios para 755, arquivos para 644</p>";
        } catch (Exception \$e) {
            echo "<p class='error'>Erro ao corrigir permissões: " . \$e->getMessage() . "</p>";
        }
        
        echo "</div>";
    }

    // Corrigir permissões na pasta atual
    fix_permissions('.');
    
    echo "<div class='info-box'>";
    echo "<h2>Próximos Passos</h2>";
    echo "<p><a href='diagnostico.php' style='color: #b29670; font-weight: bold;'>Voltar ao diagnóstico</a></p>";
    echo "</div>";
} else {
    // Mostrar confirmação
    echo "<div class='info-box'>";
    echo "<h2>⚠️ Atenção ⚠️</h2>";
    echo "<p>Esta ação irá corrigir as permissões de todos os arquivos e diretórios.</p>";
    echo "<p>Diretórios serão definidos como 755 (drwxr-xr-x).</p>";
    echo "<p>Arquivos serão definidos como 644 (rw-r--r--).</p>";
    echo "<p>Você tem certeza que deseja prosseguir?</p>";
    echo "<p><a href='?confirm=yes' style='color: #b29670; font-weight: bold;'>Sim, corrigir permissões</a></p>";
    echo "<p><a href='diagnostico.php' style='color: #b29670;'>Cancelar e voltar ao diagnóstico</a></p>";
    echo "</div>";
}

echo "</body></html>";
EOL

# 6. Criar README com instruções
echo -e "\n${YELLOW}6. Criando README com instruções...${NC}"
cat > ./solucao-raiz-dominio/README.txt << EOL
INSTRUÇÕES PARA SUBSTITUIR WORDPRESS POR APLICAÇÃO REACT/VITE
============================================================

Esta pasta contém todos os arquivos necessários para substituir
uma instalação do WordPress pelo seu aplicativo React/Vite no
domínio principal giselegalvao.com.br.

PASSO 1: FAZER BACKUP DO WORDPRESS
---------------------------------
1. Faça upload de todos os arquivos desta pasta para a raiz do seu domínio
   (normalmente é a pasta public_html/ no painel da Hostinger)
2. Acesse: https://giselegalvao.com.br/diagnostico.php
3. Clique em "Fazer backup dos arquivos WordPress"
4. Confirme a operação - isso moverá todos os arquivos do WordPress para
   uma pasta de backup

PASSO 2: VERIFICAR ARQUIVOS CRÍTICOS
----------------------------------
1. Verifique se o arquivo .htaccess está presente na raiz
2. Verifique se o index.html está presente na raiz
3. Verifique se a pasta assets/ está presente com todos os arquivos necessários
4. Se necessário, ajuste as permissões usando a ferramenta "Corrigir permissões de arquivos"

PASSO 3: TESTAR O SITE
---------------------
1. Acesse: https://giselegalvao.com.br/
2. Verifique se a aplicação React/Vite carrega corretamente
3. Teste a navegação e funcionalidades

SOLUÇÃO DE PROBLEMAS
-------------------
- Página 404: Verifique se o .htaccess está presente e configurado corretamente
- Página em branco: Verifique o console do navegador por erros
- Recursos não carregam: Verifique os caminhos dos arquivos
- Problemas de permissão: Use a ferramenta de correção de permissões

RECUPERAÇÃO DE EMERGÊNCIA
------------------------
Se algo der errado e você precisar restaurar o WordPress:
1. Acesse seu gerenciador de arquivos da Hostinger
2. Mova os arquivos da pasta wordpress_backup/ de volta para a raiz
EOL

# 7. Comprimir para fácil download e upload
echo -e "\n${YELLOW}7. Comprimindo para download e upload...${NC}"
zip -r solucao-raiz-dominio.zip ./solucao-raiz-dominio

echo -e "\n${GREEN}=== SOLUÇÃO COMPLETA CRIADA! ===\n${NC}"
echo "O pacote foi criado como: solucao-raiz-dominio.zip"
echo "Arquivos prontos para upload em: ./solucao-raiz-dominio/"
echo ""
echo "INSTRUÇÕES RÁPIDAS:"
echo "1. Baixe solucao-raiz-dominio.zip para seu computador"
echo "2. Faça login no painel da Hostinger e acesse o Gerenciador de Arquivos"
echo "3. Navegue até public_html/"
echo "4. Faça upload de todos os arquivos da pasta solucao-raiz-dominio"
echo "5. Acesse https://giselegalvao.com.br/diagnostico.php e siga as instruções"
echo ""
echo "Isso substituirá o WordPress pela sua aplicação React/Vite!"
