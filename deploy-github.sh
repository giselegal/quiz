#!/bin/bash
# deploy-github.sh - Script para facilitar o deploy via GitHub

# Cores para mensagens
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m"

echo -e "${GREEN}=== DEPLOY VIA GITHUB ===${NC}"
echo -e "Este script irá commitar as alterações e enviar para o GitHub,"
echo -e "iniciando automaticamente o processo de deploy para a Hostinger."

# Verificar se estamos em um repositório git
if [ ! -d ".git" ]; then
    echo -e "${RED}ERRO: Não está em um repositório Git.${NC}"
    echo "Execute este script a partir da raiz do repositório."
    exit 1
fi

# Verificar se há arquivos para commit
CHANGES_EXIST=$(git status --porcelain)
if [ -z "$CHANGES_EXIST" ]; then
    echo -e "${YELLOW}Nenhuma alteração para commitar.${NC}"
    echo "Deseja continuar mesmo assim? (s/n)"
    read CONTINUE
    if [ "$CONTINUE" != "s" ]; then
        echo "Deploy cancelado."
        exit 0
    fi
fi

# Perguntar por uma mensagem de commit
echo -e "\n${YELLOW}Qual a mensagem para este commit?${NC}"
read COMMIT_MSG

if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="Deploy automático via script"
fi

# Adicionar arquivos, fazer commit e push
echo -e "\n${YELLOW}Adicionando arquivos...${NC}"
git add .

echo -e "\n${YELLOW}Fazendo commit...${NC}"
git commit -m "$COMMIT_MSG"

echo -e "\n${YELLOW}Enviando para o GitHub...${NC}"
git push origin main

echo -e "\n${GREEN}Processo iniciado com sucesso!${NC}"
echo -e "O GitHub Actions está agora realizando o deploy."
echo -e "Você pode acompanhar o progresso em:"
echo -e "https://github.com/SEU_USUARIO/SEU_REPOSITORIO/actions"

echo -e "\n${YELLOW}Após a conclusão do deploy:${NC}"
echo -e "1. Acesse: https://giselegalvao.com.br"
echo -e "2. Verifique se o site está funcionando corretamente"
echo -e "3. Se houver problemas, use a página de diagnóstico:"
echo -e "   https://giselegalvao.com.br/diagnostico.html"
