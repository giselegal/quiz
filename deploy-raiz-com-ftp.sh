#!/bin/bash
# Script para configurar variáveis de ambiente FTP e executar o deploy

# Cores para mensagens
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

# Configurar variáveis de ambiente FTP com os dados fornecidos
export FTP_SERVER="giselegalvao.com.br"  # Servidor FTP
export FTP_USERNAME="u116045488"
export FTP_PASSWORD="GiseleG@l0809"
export FTP_SERVER_DIR="/"  # Diretório raiz (o caminho público_html será adicionado pelo servidor)

echo -e "${GREEN}=== CONFIGURAÇÃO FTP ===${NC}"
echo -e "FTP_SERVER: $FTP_SERVER"
echo -e "FTP_USERNAME: $FTP_USERNAME"
echo -e "FTP_PASSWORD: ********"
echo -e "FTP_SERVER_DIR: $FTP_SERVER_DIR"

# Executar o script de deploy original
echo -e "\n${YELLOW}Executando script de deploy...${NC}"
bash deploy-raiz-dominio.sh
