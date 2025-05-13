#!/bin/bash
# Script para testar a conexão FTP com o servidor Hostinger

# Cores para mensagens
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

# Configurações do FTP
export FTP_SERVER="147.93.39.155"
export FTP_USER="u116045488"
export FTP_PASS="GiseleG@l0809"

# Para evitar problemas com caracteres especiais na senha, 
# vamos codificar a senha para URL
ENCODED_PASS=$(echo -n "$FTP_PASS" | sed 's/@/%40/g')

echo -e "${YELLOW}Testando conexão FTP básica...${NC}"

# Testar conexão básica (sem especificar diretório)
echo "Testando conexão direta ao servidor..."
curl -v --ftp-ssl ftp://$FTP_USER:$ENCODED_PASS@$FTP_SERVER/

echo -e "\n${GREEN}=== TESTE CONCLUÍDO ===\n${NC}"
echo "Se os testes falharam, verifique as credenciais FTP no painel da Hostinger."
echo "A estrutura de diretórios pode ser diferente da esperada."
echo "Considere usar o FTP ativo em vez de passivo (adicionar o argumento --disable-epsv)"
