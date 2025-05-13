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

# Testando configurações alternativas para o diretório
echo -e "${YELLOW}Testando conexão FTP básica...${NC}"

# Testar conexão básica (sem especificar diretório)
echo "Testando conexão direta ao servidor..."
curl -v --disable-epsv --ftp-ssl ftp://$FTP_USER:$FTP_PASS@$FTP_SERVER/

echo -e "\n${YELLOW}Listando diretórios disponíveis na raiz...${NC}"
curl -v --disable-epsv --ftp-ssl -l ftp://$FTP_USER:$FTP_PASS@$FTP_SERVER/

# Verificar se existe o diretório domains
echo -e "\n${YELLOW}Verificando se existe o diretório domains...${NC}"
curl -v --disable-epsv --ftp-ssl -l ftp://$FTP_USER:$FTP_PASS@$FTP_SERVER/domains/

# Verificar se podemos listar o diretório do domínio
echo -e "\n${YELLOW}Tentando listar o diretório do domínio específico...${NC}"
curl -v --disable-epsv --ftp-ssl -l ftp://$FTP_USER:$FTP_PASS@$FTP_SERVER/domains/giselegalvao.com.br/

# Verificar public_html
echo -e "\n${YELLOW}Tentando acessar public_html...${NC}"
curl -v --disable-epsv --ftp-ssl -l ftp://$FTP_USER:$FTP_PASS@$FTP_SERVER/domains/giselegalvao.com.br/public_html/

echo -e "\n${GREEN}=== TESTE CONCLUÍDO ===\n${NC}"
echo "Se todos os testes falharam, verifique as credenciais FTP no painel da Hostinger."
echo "A estrutura de diretórios pode ser diferente da esperada."
echo "Considere usar uma ferramenta como o FileZilla para explorar a estrutura do servidor."
