#!/bin/bash

# Script para sobrescrever alterações feitas no Lovable na ramificação main
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
echo -e "${BLUE}   SOBRESCREVER ALTERAÇÕES DO LOVABLE NO MAIN     ${NC}"
echo -e "${BLUE}=================================================${NC}"

# 1. Verificar se há alterações pendentes
echo -e "\n${YELLOW}1. Verificando alterações pendentes...${NC}"
CHANGES_EXIST=$(git status --porcelain)
if [ ! -z "$CHANGES_EXIST" ]; then
    echo -e "${YELLOW}Há alterações não commitadas no repositório!${NC}"
    echo -e "Vamos fazer um stash das alterações locais para prosseguir."
    echo -e "Deseja continuar? (s/n)"
    read CONTINUE
    if [[ "$CONTINUE" != "s" && "$CONTINUE" != "S" ]]; then
        echo -e "${RED}Operação cancelada.${NC}"
        exit 1
    fi
    
    # Salvando alterações locais com stash
    echo -e "${YELLOW}Salvando alterações locais com stash...${NC}"
    git stash save "Alterações antes de sobrescrever Lovable - $(date)"
    echo -e "${GREEN}Alterações salvas com sucesso.${NC}"
fi

# 2. Atualizar a marcação dos componentes Lovable
echo -e "\n${YELLOW}2. Atualizando a marcação dos componentes Lovable...${NC}"
node mark-lovable-updated.cjs

# 3. Executar o script para corrigir a integração
echo -e "\n${YELLOW}3. Corrigindo a integração com o Lovable...${NC}"
bash fix-lovable-integration.sh

# 4. Verificar e atualizar a configuração do Lovable
echo -e "\n${YELLOW}4. Atualizando a configuração do Lovable...${NC}"
cat > lovable.config.js << EOL
module.exports = {
  componentsPath: 'src/components/lovable',
  assetsPath: 'public/lovable-uploads',
  outputPath: 'dist',
  buildCommand: 'npm run build',
  previewCommand: 'npm run preview',
  development: {
    port: 8080,
    startCommand: 'npm run dev'
  }
};
EOL
echo -e "${GREEN}Configuração do Lovable atualizada com sucesso!${NC}"

# 5. Sincronizar com o repositório remoto
echo -e "\n${YELLOW}5. Sincronizando com o repositório remoto...${NC}"
echo -e "Puxando as alterações mais recentes da branch main..."
git pull origin main

if [ $? -ne 0 ]; then
    echo -e "${RED}Erro ao sincronizar com o repositório remoto.${NC}"
    echo -e "Existem conflitos que precisam ser resolvidos manualmente."
    echo -e "Após resolver os conflitos, execute o script novamente."
    exit 1
fi

# 6. Adicionar todas as alterações
echo -e "\n${YELLOW}6. Adicionando alterações ao Git...${NC}"
git add src/components/lovable/*.tsx lovable.config.js lovable.ts public/lovable-uploads

# 7. Commitar as alterações
echo -e "\n${YELLOW}7. Commitando alterações...${NC}"
git commit -m "Sobrescrever alterações do Lovable"

# 8. Fazer push para o repositório remoto na branch main
echo -e "\n${YELLOW}8. Enviando alterações para o repositório remoto (branch main)...${NC}"
git push origin main

if [ $? -ne 0 ]; then
    echo -e "\n${RED}Erro ao enviar as alterações para o repositório remoto.${NC}"
    echo -e "Deseja fazer um push forçado? (CUIDADO: Isso irá sobrescrever o histórico remoto) (s/n)"
    read FORCE_PUSH
    
    if [[ "$FORCE_PUSH" == "s" || "$FORCE_PUSH" == "S" ]]; then
        echo -e "${YELLOW}Realizando push forçado...${NC}"
        git push -f origin main
        
        if [ $? -eq 0 ]; then
            echo -e "\n${GREEN}Push forçado realizado com sucesso!${NC}"
        else
            echo -e "\n${RED}Erro ao realizar push forçado. Verifique suas permissões no repositório.${NC}"
            exit 1
        fi
    else
        echo -e "${RED}Push forçado cancelado.${NC}"
        echo -e "Você precisará resolver os conflitos manualmente."
        exit 1
    fi
else
    echo -e "\n${GREEN}Alterações do Lovable sobrescritas com sucesso na branch main!${NC}"
    echo -e "As alterações foram enviadas para o repositório remoto."
    echo -e "O GitHub Actions irá iniciar o processo de deploy automaticamente."
fi

echo -e "\n${BLUE}=================================================${NC}"
echo -e "${BLUE}   PROCESSO FINALIZADO                            ${NC}"
echo -e "${BLUE}=================================================${NC}"

echo -e "\nPara verificar se o deploy foi concluído com sucesso:"
echo -e "1. Verifique o status no GitHub Actions"
echo -e "2. Acesse o site para confirmar que as alterações foram aplicadas"
