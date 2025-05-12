#!/bin/bash
# Script para corrigir erro 404 após deploy na Hostinger
# Uso: bash fix-404-error.sh

# Cores para mensagens
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

# Mensagem inicial
echo -e "${GREEN}=== CORREÇÃO DE ERRO 404 NO HOSTINGER ===${NC}"
echo -e "Este script tentará corrigir o erro 404 no site giselegalvao.com.br"

# Configurações do FTP
FTP_HOST="giselegalvao.com.br"
FTP_USER="u116045488"
FTP_PASS="GiseleG@l0809"

# 1. Verificar a estrutura do servidor e listar os arquivos na raiz
echo -e "\n${YELLOW}1. Verificando a estrutura no servidor FTP...${NC}"

# Criar arquivo temporário para comandos FTP
TMP_FTP_LIST=$(mktemp)

# Criar comando para listar arquivos
cat > "$TMP_FTP_LIST" << EOL
open $FTP_HOST
user $FTP_USER $FTP_PASS
ls -la
bye
EOL

echo -e "${YELLOW}Listando arquivos na raiz do servidor:${NC}"
ftp -n < "$TMP_FTP_LIST"
rm -f "$TMP_FTP_LIST"

# 2. Criar um .htaccess mais robusto
echo -e "\n${YELLOW}2. Criando um .htaccess mais robusto...${NC}"

# Arquivo .htaccess aprimorado
cat > "./improved-htaccess.txt" << EOL
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

# Configurações de tipo MIME
<IfModule mod_mime.c>
  AddType application/javascript .js
  AddType text/css .css
</IfModule>

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

# Enviar o .htaccess aprimorado para o servidor
echo -e "${YELLOW}Enviando .htaccess aprimorado para o servidor...${NC}"
curl -s -T "./improved-htaccess.txt" -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/.htaccess"

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ .htaccess enviado com sucesso${NC}"
else
  echo -e "${RED}✗ Erro ao enviar .htaccess${NC}"
fi

# 3. Verificar se index.html está na raiz e enviar uma cópia de backup
echo -e "\n${YELLOW}3. Verificando e enviando index.html...${NC}"

# Primeiro, vamos verificar se o arquivo existe na pasta dist
if [ -f "./dist/index.html" ]; then
  echo -e "${GREEN}✓ index.html encontrado na pasta dist${NC}"
  
  # Criar uma cópia de backup
  cp "./dist/index.html" "./index-backup.html"
  
  # Enviar para o servidor
  echo -e "${YELLOW}Enviando index.html para o servidor...${NC}"
  curl -s -T "./dist/index.html" -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/index.html"
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ index.html enviado com sucesso${NC}"
  else
    echo -e "${RED}✗ Erro ao enviar index.html${NC}"
  fi
else
  echo -e "${RED}✗ index.html não encontrado na pasta dist${NC}"
  
  # Procurar por index.html em outras pastas
  INDEX_PATH=$(find . -name "index.html" -type f | head -n 1)
  
  if [ -n "$INDEX_PATH" ]; then
    echo -e "${GREEN}✓ Encontrado index.html em: $INDEX_PATH${NC}"
    
    # Enviar para o servidor
    echo -e "${YELLOW}Enviando index.html encontrado para o servidor...${NC}"
    curl -s -T "$INDEX_PATH" -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/index.html"
    
    if [ $? -eq 0 ]; then
      echo -e "${GREEN}✓ index.html enviado com sucesso${NC}"
    else
      echo -e "${RED}✗ Erro ao enviar index.html${NC}"
    fi
  else
    echo -e "${RED}✗ Nenhum arquivo index.html encontrado no workspace${NC}"
  fi
fi

# 4. Verificar a presença dos assets corretos
echo -e "\n${YELLOW}4. Verificando se todos os assets foram enviados...${NC}"

# Listar arquivos na pasta assets do servidor
TMP_FTP_ASSETS=$(mktemp)

cat > "$TMP_FTP_ASSETS" << EOL
open $FTP_HOST
user $FTP_USER $FTP_PASS
cd assets
ls -la
bye
EOL

echo -e "${YELLOW}Listando arquivos na pasta assets:${NC}"
ftp -n < "$TMP_FTP_ASSETS"
rm -f "$TMP_FTP_ASSETS"

# 5. Verificar configuração do public_html
echo -e "\n${YELLOW}5. Verificando configuração do diretório público...${NC}"

TMP_FTP_PUBLIC=$(mktemp)

cat > "$TMP_FTP_PUBLIC" << EOL
open $FTP_HOST
user $FTP_USER $FTP_PASS
cd public_html
ls -la
bye
EOL

echo -e "${YELLOW}Tentando listar conteúdo de public_html (se existir):${NC}"
ftp -n < "$TMP_FTP_PUBLIC"
rm -f "$TMP_FTP_PUBLIC"

# 6. Crie um arquivo PHP para testar o acesso básico
echo -e "\n${YELLOW}6. Criando arquivo PHP de teste...${NC}"

cat > "./test.php" << EOL
<?php
echo "<html><body>";
echo "<h1>Teste de Acesso ao Servidor</h1>";
echo "<p>O servidor está funcionando corretamente se você conseguir ver esta mensagem.</p>";
echo "<p>Timestamp: " . date('Y-m-d H:i:s') . "</p>";
echo "<h2>Estrutura de diretórios:</h2>";
echo "<pre>";
system('ls -la');
echo "</pre>";
echo "</body></html>";
EOL

echo -e "${YELLOW}Enviando arquivo PHP de teste para o servidor...${NC}"
curl -s -T "./test.php" -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/test.php"

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Arquivo de teste enviado com sucesso${NC}"
  echo -e "${GREEN}Para verificar o acesso ao servidor, acesse:${NC}"
  echo -e "${YELLOW}https://giselegalvao.com.br/test.php${NC}"
else
  echo -e "${RED}✗ Erro ao enviar arquivo de teste${NC}"
fi

# Finalização
echo -e "\n${GREEN}=== CORREÇÕES CONCLUÍDAS ===${NC}"
echo -e "Tente acessar o site novamente:"
echo -e "${YELLOW}https://giselegalvao.com.br/${NC}"
echo -e "\nSe o erro 404 persistir, verifique:"
echo -e "1. O painel de controle da Hostinger para confirmar que o domínio está apontando para o diretório correto"
echo -e "2. Se há algum redirecionamento configurado no painel da Hostinger"
echo -e "3. Acesse https://giselegalvao.com.br/test.php para verificar se o servidor está funcionando"
echo -e "4. Se o problema persistir, pode ser necessário entrar em contato com o suporte da Hostinger"
exit 0
