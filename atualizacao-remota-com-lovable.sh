#!/bin/bash

# Script de atualização remota com integração Lovable
# Autor: GitHub Copilot
# Data: 13/05/2025
# Versão: 1.0

# Cores para mensagens
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
BLUE="\033[0;34m"
NC="\033[0m" # No Color

echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}   SCRIPT DE ATUALIZAÇÃO REMOTA COM LOVABLE      ${NC}"
echo -e "${BLUE}=================================================${NC}"

# 1. Atualizar dependências
echo -e "\n${YELLOW}1. Atualizando dependências...${NC}"
npm install

# 2. Corrigir a integração com o Lovable
echo -e "\n${YELLOW}2. Corrigindo a integração com o Lovable...${NC}"
bash fix-lovable-integration.sh

# 3. Marcar os componentes Lovable
echo -e "\n${YELLOW}3. Marcando componentes Lovable...${NC}"
node mark-lovable-updated.cjs

# 4. Reiniciar a integração com o Lovable
echo -e "\n${YELLOW}4. Reiniciando a integração com o Lovable...${NC}"
bash restart-lovable.sh

# 5. Construir o projeto para produção
echo -e "\n${YELLOW}5. Construindo o projeto para produção...${NC}"
npm run build:hostinger

# 6. Otimizar o desempenho do site
echo -e "\n${YELLOW}6. Otimizando o desempenho do site...${NC}"
bash optimize-site-performance.sh

# 7. Deploy via GitHub (método recomendado)
echo -e "\n${YELLOW}7. Iniciando deploy via GitHub...${NC}"
echo -e "Este método irá fazer commit das alterações e enviar para o GitHub,"
echo -e "que iniciará automaticamente o processo de deploy para a Hostinger."

read -p "Deseja continuar com o deploy via GitHub? (s/n): " DEPLOY_CHOICE

if [[ "$DEPLOY_CHOICE" =~ ^[Ss]$ ]]; then
    bash deploy-github.sh
    echo -e "${GREEN}Deploy iniciado! Verifique o status no GitHub Actions.${NC}"
else
    echo -e "\n${YELLOW}Deploy pulado. Você pode executar manualmente:${NC}"
    echo -e "- ${GREEN}bash deploy-github.sh${NC} (para deploy via GitHub)"
    echo -e "- ${GREEN}bash deploy-ftp-simples.sh${NC} (para deploy direto via FTP)"
    echo -e "- ${GREEN}bash deploy-raiz-dominio.sh${NC} (para configurar e fazer deploy para a raiz do domínio)"
fi

echo -e "\n${GREEN}Processo de atualização remota concluído com sucesso!${NC}"
echo -e "Verifique se tudo está funcionando corretamente acessando o site."
