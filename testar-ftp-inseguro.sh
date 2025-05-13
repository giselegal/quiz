#!/bin/bash
# Script para testar a conexão FTP com o servidor Hostinger

# Cores para mensagens
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

# Configurações do FTP
FTP_HOST="giselegalvao.com.br"
FTP_SERVER="147.93.39.155"
FTP_USER="u116045488"
FTP_PASS="GiseleG@l0809"

echo -e "${YELLOW}Testando conexão FTP com domínio como hostname...${NC}"
curl -v --insecure --ftp-ssl ftp://$FTP_USER:$FTP_PASS@$FTP_HOST/

echo -e "\n${YELLOW}Testando conexão FTP com IP...${NC}"
curl -v --insecure --ftp-ssl ftp://$FTP_USER:$FTP_PASS@$FTP_SERVER/

echo -e "\n${GREEN}=== TESTE CONCLUÍDO ===\n${NC}"
echo "Se os testes continuarem falhando, você pode tentar:"
echo "1. Verificar credenciais no painel da Hostinger"
echo "2. Usar o IP em vez do nome de domínio"
echo "3. Utilizar o painel de controle da Hostinger para gerenciar arquivos"
echo "4. Contatar o suporte da Hostinger para obter ajuda específica"
