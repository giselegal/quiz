#!/bin/bash
# Script para corrigir a situação onde o WordPress está aparecendo em vez do aplicativo
# Uso: bash corrigir-wordpress.sh

# Cores para mensagens
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

# Configurações do FTP
export FTP_HOST="147.93.39.155"  # IP direto para evitar problemas de DNS
export FTP_USER="u116045488"
export FTP_PASSWORD="GiseleG@l0809"
export FTP_DIR="/domains/giselegalvao.com.br/public_html"

echo -e "${GREEN}=== VERIFICAÇÃO E CORREÇÃO DO DOMÍNIO giselegalvao.com.br ===${NC}"

# 1. Verificar a estrutura do servidor
echo -e "\n${YELLOW}1. Verificando a estrutura no servidor FTP...${NC}"

# Instalar lftp se não estiver instalado
if ! command -v lftp &> /dev/null; then
    echo -e "${YELLOW}Instalando lftp para melhor manipulação do FTP...${NC}"
    apt-get update && apt-get install -y lftp
fi

# Listar o conteúdo do diretório raiz
echo -e "${YELLOW}Listando arquivos na raiz do domínio:${NC}"
lftp -c "
    set ssl:verify-certificate no;
    open -u $FTP_USER,$FTP_PASSWORD $FTP_HOST;
    cd $FTP_DIR;
    ls -la;
"

# 2. Verificar se há arquivos WordPress
echo -e "\n${YELLOW}2. Verificando arquivos WordPress...${NC}"
lftp -c "
    set ssl:verify-certificate no;
    open -u $FTP_USER,$FTP_PASSWORD $FTP_HOST;
    cd $FTP_DIR;
    find . -name wp-config.php -o -name index.php -o -name wp-login.php | sort;
"

# 3. Backup dos arquivos WordPress (se existirem)
echo -e "\n${YELLOW}3. Fazendo backup dos arquivos WordPress (se existirem)...${NC}"
lftp -c "
    set ssl:verify-certificate no;
    open -u $FTP_USER,$FTP_PASSWORD $FTP_HOST;
    cd $FTP_DIR;
    
    # Criar diretório de backup
    mkdir -p wordpress_backup;
    
    # Mover arquivos WordPress para o backup
    if [ -f wp-config.php ]; then
        mv wp-config.php wordpress_backup/;
        mv wp-*.php wordpress_backup/ 2>/dev/null;
        mv index.php wordpress_backup/ 2>/dev/null;
        mv wp-admin wordpress_backup/ 2>/dev/null;
        mv wp-content wordpress_backup/ 2>/dev/null;
        mv wp-includes wordpress_backup/ 2>/dev/null;
    fi
"

# 4. Construir o projeto localmente
echo -e "\n${YELLOW}4. Construindo o projeto localmente...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Erro ao construir o projeto. Verifique os erros acima.${NC}"
    exit 1
fi

# 5. Preparar o .htaccess para o aplicativo
echo -e "\n${YELLOW}5. Preparando .htaccess para o aplicativo...${NC}"
cat > ./dist/.htaccess << EOL
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

# 6. Fazer upload do projeto para o servidor
echo -e "\n${YELLOW}6. Enviando o projeto para o servidor...${NC}"
lftp -c "
    set ssl:verify-certificate no;
    open -u $FTP_USER,$FTP_PASSWORD $FTP_HOST;
    lcd ./dist;
    cd $FTP_DIR;
    mirror -R --parallel=5 --ignore-time --overwrite;
"

# 7. Verificar se o upload foi bem-sucedido
echo -e "\n${YELLOW}7. Verificando se o upload foi bem-sucedido...${NC}"
lftp -c "
    set ssl:verify-certificate no;
    open -u $FTP_USER,$FTP_PASSWORD $FTP_HOST;
    cd $FTP_DIR;
    ls -la;
"

# 8. Criar arquivo diagnóstico PHP
echo -e "\n${YELLOW}8. Criando arquivo diagnóstico PHP...${NC}"
cat > ./diagnostic.php << EOL
<?php
header('Content-Type: text/html; charset=utf-8');
echo "<html><head><title>Diagnóstico giselegalvao.com.br</title></head><body>";
echo "<h1>Diagnóstico do Servidor</h1>";
echo "<p>Data/hora atual: " . date('Y-m-d H:i:s') . "</p>";

echo "<h2>Informações do Servidor</h2>";
echo "<pre>";
echo "PHP Version: " . phpversion() . "\n";
echo "Server Software: " . \$_SERVER['SERVER_SOFTWARE'] . "\n";
echo "Document Root: " . \$_SERVER['DOCUMENT_ROOT'] . "\n";
echo "Script Filename: " . \$_SERVER['SCRIPT_FILENAME'] . "\n";
echo "</pre>";

echo "<h2>Estrutura de Diretórios</h2>";
echo "<pre>";
system('ls -la');
echo "</pre>";

echo "<h2>Conteúdo do .htaccess</h2>";
echo "<pre>";
if (file_exists('.htaccess')) {
    echo htmlspecialchars(file_get_contents('.htaccess'));
} else {
    echo "Arquivo .htaccess não encontrado";
}
echo "</pre>";

echo "<h2>Verificação de Arquivos Críticos</h2>";
echo "<ul>";
foreach (['index.html', 'index.php', 'wp-config.php'] as \$file) {
    echo "<li>";
    echo \$file . ": ";
    if (file_exists(\$file)) {
        echo "<span style='color:green'>Encontrado</span>";
    } else {
        echo "<span style='color:red'>Não encontrado</span>";
    }
    echo "</li>";
}
echo "</ul>";

echo "</body></html>";
EOL

echo -e "${YELLOW}Enviando arquivo diagnóstico para o servidor...${NC}"
lftp -c "
    set ssl:verify-certificate no;
    open -u $FTP_USER,$FTP_PASSWORD $FTP_HOST;
    cd $FTP_DIR;
    put -O . ./diagnostic.php;
"

# 9. Criar arquivo para verificar/corrigir permissões
echo -e "\n${YELLOW}9. Criando arquivo para verificar/corrigir permissões...${NC}"
cat > ./fix_permissions.php << EOL
<?php
header('Content-Type: text/html; charset=utf-8');
echo "<html><head><title>Correção de Permissões</title></head><body>";
echo "<h1>Correção de Permissões de Arquivos</h1>";

function fix_permissions(\$dir) {
    if (!is_dir(\$dir)) {
        echo "<p>Diretório não encontrado: " . htmlspecialchars(\$dir) . "</p>";
        return;
    }
    
    echo "<h2>Corrigindo permissões em: " . htmlspecialchars(\$dir) . "</h2>";
    
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
    
    echo "<p>Permissões corrigidas: diretórios para 755, arquivos para 644</p>";
}

fix_permissions('.');

echo "<p><a href='diagnostic.php'>Voltar ao diagnóstico</a></p>";
echo "</body></html>";
EOL

echo -e "${YELLOW}Enviando arquivo de correção de permissões para o servidor...${NC}"
lftp -c "
    set ssl:verify-certificate no;
    open -u $FTP_USER,$FTP_PASSWORD $FTP_HOST;
    cd $FTP_DIR;
    put -O . ./fix_permissions.php;
"

# Finalização
echo -e "\n${GREEN}=== PROCESSO CONCLUÍDO ===${NC}"
echo -e "Para verificar o diagnóstico do servidor, acesse:"
echo -e "${YELLOW}https://giselegalvao.com.br/diagnostic.php${NC}"
echo -e "\nPara corrigir permissões de arquivos, acesse:"
echo -e "${YELLOW}https://giselegalvao.com.br/fix_permissions.php${NC}"
echo -e "\nAgora o domínio deve estar exibindo seu aplicativo em vez do WordPress."
echo -e "Acesse o site em: ${YELLOW}https://giselegalvao.com.br/${NC}"
