#!/bin/bash
# Script para corrigir a situação onde o WordPress está aparecendo em vez do aplicativo
# Usa curl em vez de lftp
# Uso: bash corrigir-wordpress-com-curl.sh

# Cores para mensagens
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

# Configurações do FTP
export FTP_SERVER="147.93.39.155"
export FTP_USER="u116045488"
export FTP_PASS="GiseleG@l0809"
export FTP_DIR="/domains/giselegalvao.com.br/public_html"

# URL base para FTP
FTP_URL="ftp://$FTP_SERVER$FTP_DIR"

echo -e "${GREEN}=== CORREÇÃO DO DOMÍNIO giselegalvao.com.br COM CURL ===${NC}"

# 1. Criar um arquivo de diagnóstico PHP para verificar o estado atual
echo -e "\n${YELLOW}1. Criando arquivo diagnóstico PHP...${NC}"

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
        
        if (\$file == 'index.php') {
            echo " - ";
            \$content = file_get_contents(\$file);
            if (strpos(\$content, 'WordPress') !== false) {
                echo "<span style='color:red'>É um arquivo WordPress</span>";
            } else {
                echo "<span style='color:green'>Não parece ser WordPress</span>";
            }
        }
    } else {
        echo "<span style='color:red'>Não encontrado</span>";
    }
    echo "</li>";
}
echo "</ul>";

echo "<h2>Ações Disponíveis</h2>";
echo "<p><a href='backup-wordpress.php' style='color:blue;'>Fazer backup dos arquivos WordPress</a></p>";
echo "<p><a href='fix_permissions.php' style='color:blue;'>Corrigir permissões de arquivos</a></p>";

echo "</body></html>";
EOL

# 2. Criar um script PHP para fazer backup dos arquivos WordPress
echo -e "\n${YELLOW}2. Criando script para backup de WordPress...${NC}"

cat > ./backup-wordpress.php << EOL
<?php
header('Content-Type: text/html; charset=utf-8');
echo "<html><head><title>Backup WordPress</title></head><body>";
echo "<h1>Backup dos Arquivos WordPress</h1>";

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
    mkdir('wordpress_backup', 0755, true);
    echo "<p>Diretório de backup criado: wordpress_backup</p>";
}

echo "<h2>Movendo arquivos para backup:</h2><ul>";

foreach (\$wp_files as \$file) {
    if (file_exists(\$file)) {
        \$destination = 'wordpress_backup/' . basename(\$file);
        
        if (is_dir(\$file)) {
            // Mover diretório recursivamente
            if (rename(\$file, \$destination)) {
                echo "<li>Diretório movido: " . htmlspecialchars(\$file) . " → " . htmlspecialchars(\$destination) . "</li>";
            } else {
                echo "<li style='color:red;'>Falha ao mover diretório: " . htmlspecialchars(\$file) . "</li>";
            }
        } else {
            // Mover arquivo
            if (rename(\$file, \$destination)) {
                echo "<li>Arquivo movido: " . htmlspecialchars(\$file) . " → " . htmlspecialchars(\$destination) . "</li>";
            } else {
                echo "<li style='color:red;'>Falha ao mover arquivo: " . htmlspecialchars(\$file) . "</li>";
            }
        }
    } else {
        echo "<li>Arquivo/diretório não encontrado: " . htmlspecialchars(\$file) . "</li>";
    }
}

echo "</ul>";
echo "<p><a href='diagnostic.php'>Voltar ao diagnóstico</a></p>";
echo "</body></html>";
EOL

# 3. Criar um arquivo PHP para corrigir permissões
echo -e "\n${YELLOW}3. Criando script para correção de permissões...${NC}"

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

# 4. Criar um .htaccess otimizado para SPA
echo -e "\n${YELLOW}4. Criando .htaccess otimizado...${NC}"

cat > ./.htaccess << EOL
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

# 5. Fazer build do projeto
echo -e "\n${YELLOW}5. Construindo o projeto...${NC}"
npm run build

# 6. Fazer upload dos arquivos PHP de diagnóstico e do .htaccess
echo -e "\n${YELLOW}6. Enviando arquivos de diagnóstico e .htaccess para o servidor...${NC}"

# Enviar diagnostic.php
curl -T ./diagnostic.php -u "$FTP_USER:$FTP_PASS" "$FTP_URL/diagnostic.php"
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ diagnostic.php enviado com sucesso${NC}"
else
  echo -e "${RED}✗ Erro ao enviar diagnostic.php${NC}"
fi

# Enviar backup-wordpress.php
curl -T ./backup-wordpress.php -u "$FTP_USER:$FTP_PASS" "$FTP_URL/backup-wordpress.php"
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ backup-wordpress.php enviado com sucesso${NC}"
else
  echo -e "${RED}✗ Erro ao enviar backup-wordpress.php${NC}"
fi

# Enviar fix_permissions.php
curl -T ./fix_permissions.php -u "$FTP_USER:$FTP_PASS" "$FTP_URL/fix_permissions.php"
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ fix_permissions.php enviado com sucesso${NC}"
else
  echo -e "${RED}✗ Erro ao enviar fix_permissions.php${NC}"
fi

# Enviar .htaccess
curl -T ./.htaccess -u "$FTP_USER:$FTP_PASS" "$FTP_URL/.htaccess"
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ .htaccess enviado com sucesso${NC}"
else
  echo -e "${RED}✗ Erro ao enviar .htaccess${NC}"
fi

# 7. Enviar index.html e outros arquivos críticos
echo -e "\n${YELLOW}7. Enviando arquivos críticos da build...${NC}"

if [ -f "./dist/index.html" ]; then
  curl -T "./dist/index.html" -u "$FTP_USER:$FTP_PASS" "$FTP_URL/index.html"
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ index.html enviado com sucesso${NC}"
  else
    echo -e "${RED}✗ Erro ao enviar index.html${NC}"
  fi
else
  echo -e "${RED}✗ index.html não encontrado na pasta dist${NC}"
fi

# Instruções finais
echo -e "\n${GREEN}=== PROCESSO CONCLUÍDO ===${NC}"
echo -e "Para diagnosticar a situação no servidor, acesse:"
echo -e "${YELLOW}https://giselegalvao.com.br/diagnostic.php${NC}"
echo -e "\nPara fazer backup dos arquivos WordPress, acesse:"
echo -e "${YELLOW}https://giselegalvao.com.br/backup-wordpress.php${NC}"
echo -e "\nApós fazer o backup, você pode realizar o upload completo dos arquivos da sua aplicação."
echo -e "\nPara verificar o site, acesse:"
echo -e "${YELLOW}https://giselegalvao.com.br/${NC}"
