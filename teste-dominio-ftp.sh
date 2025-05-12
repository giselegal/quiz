#!/bin/bash
# Script para testar a conexão de domínio e upload via FTP
# Uso: bash teste-dominio-ftp.sh

# Cores para mensagens
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

echo -e "${GREEN}=== TESTE DE CONEXÃO DE DOMÍNIO ===${NC}"
echo -e "Este script irá testar a conexão FTP e a configuração do domínio"

# Configurações do FTP (ajuste conforme necessário)
FTP_HOST="giselegalvao.com.br"
FTP_USER="u116045488"
FTP_PASS="GiseleG@l0809"

# 1. Testar conexão FTP
echo -e "\n${YELLOW}1. Testando conexão FTP básica...${NC}"
echo "CONECTANDO A $FTP_HOST..."

# Testar conexão básica
TMP_FTP_TEST=$(mktemp)
cat > "$TMP_FTP_TEST" << EOL
open $FTP_HOST
user $FTP_USER $FTP_PASS
pwd
bye
EOL

echo -e "${YELLOW}Diretório atual no servidor:${NC}"
ftp -n < "$TMP_FTP_TEST"
rm -f "$TMP_FTP_TEST"

# 2. Testar diretórios no servidor
echo -e "\n${YELLOW}2. Verificando diretórios disponíveis...${NC}"

TMP_FTP_DIRS=$(mktemp)
cat > "$TMP_FTP_DIRS" << EOL
open $FTP_HOST
user $FTP_USER $FTP_PASS
ls -la
bye
EOL

echo -e "${YELLOW}Diretórios na raiz do FTP:${NC}"
ftp -n < "$TMP_FTP_DIRS"
rm -f "$TMP_FTP_DIRS"

# 3. Verificar public_html (se existir)
echo -e "\n${YELLOW}3. Verificando conteúdo do public_html (se existir)...${NC}"

TMP_FTP_PUBLIC=$(mktemp)
cat > "$TMP_FTP_PUBLIC" << EOL
open $FTP_HOST
user $FTP_USER $FTP_PASS
cd public_html
pwd
ls -la
bye
EOL

echo -e "${YELLOW}Conteúdo do public_html:${NC}"
ftp -n < "$TMP_FTP_PUBLIC"
rm -f "$TMP_FTP_PUBLIC"

# 4. Enviar arquivo de teste para raiz
echo -e "\n${YELLOW}4. Enviando arquivo de teste PHP para a raiz...${NC}"

# Criar arquivo de teste PHP
cat > "./dominio-teste.php" << EOL
<?php
echo "<html><head><title>Teste de Domínio Root</title></head>";
echo "<body style='font-family: Arial; margin: 40px;'>";
echo "<h1>Teste de Domínio - Raiz FTP</h1>";
echo "<p>Este arquivo está na raiz do FTP</p>";
echo "<p>Data/hora do teste: " . date('Y-m-d H:i:s') . "</p>";
echo "</body></html>";
EOL

# Enviar para a raiz
echo -e "${YELLOW}Enviando para raiz do FTP...${NC}"
curl -s -T "./dominio-teste.php" -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/dominio-teste.php"

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Arquivo enviado com sucesso para a raiz${NC}"
  echo -e "${YELLOW}Teste acessando: https://giselegalvao.com.br/dominio-teste.php${NC}"
else
  echo -e "${RED}✗ Erro ao enviar arquivo para a raiz${NC}"
fi

# 5. Enviar arquivo de teste para public_html
echo -e "\n${YELLOW}5. Enviando arquivo de teste PHP para public_html...${NC}"

# Criar arquivo de teste PHP para public_html
cat > "./public-html-teste.php" << EOL
<?php
echo "<html><head><title>Teste de Domínio - public_html</title></head>";
echo "<body style='font-family: Arial; margin: 40px;'>";
echo "<h1>Teste de Domínio - public_html</h1>";
echo "<p>Este arquivo está na pasta public_html</p>";
echo "<p>Data/hora do teste: " . date('Y-m-d H:i:s') . "</p>";
echo "</body></html>";
EOL

# Enviar para public_html
echo -e "${YELLOW}Enviando para pasta public_html...${NC}"
curl -s -T "./public-html-teste.php" -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/public_html/public-html-teste.php"

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Arquivo enviado com sucesso para public_html${NC}"
  echo -e "${YELLOW}Teste acessando: https://giselegalvao.com.br/public-html-teste.php${NC}"
else
  echo -e "${RED}✗ Erro ao enviar arquivo para public_html${NC}"
fi

# Finalização
echo -e "\n${GREEN}=== TESTES CONCLUÍDOS ===${NC}"
echo -e "Agora teste os seguintes URLs para determinar a configuração correta do domínio:"
echo -e "1. ${YELLOW}https://giselegalvao.com.br/dominio-teste.php${NC} (se funcionar, o domínio aponta para a raiz do FTP)"
echo -e "2. ${YELLOW}https://giselegalvao.com.br/public-html-teste.php${NC} (se funcionar, o domínio aponta para a pasta public_html)"
echo -e "\nApós determinar o caminho correto, faça o upload de todos os arquivos do seu site para esse local."
exit 0
