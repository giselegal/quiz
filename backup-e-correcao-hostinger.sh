#!/bin/bash
# backup-e-correcao-hostinger.sh - Script para backup e reorganização no servidor Hostinger

# Cores para mensagens
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m"

echo -e "${GREEN}=== SCRIPT DE BACKUP E CORREÇÃO DA ESTRUTURA NA HOSTINGER ===${NC}"
echo -e "Este script irá reorganizar a estrutura de pastas na Hostinger,"
echo -e "deixando apenas a pasta quiz-de-estilo diretamente dentro de public_html."

# Data para nomear o backup
DATA_BACKUP=$(date +"%Y%m%d_%H%M%S")

echo -e "\n${YELLOW}1. Criando backup de segurança...${NC}"
echo -e "cd public_html"
echo -e "zip -r ~/backup_quiz_${DATA_BACKUP}.zip quiz-de-estilo/ public_html/"
echo -e "# Isso criará um arquivo backup_quiz_AAAAMMDD_HHMMSS.zip na sua pasta home"

echo -e "\n${YELLOW}2. Verificando estrutura atual...${NC}"
echo -e "find public_html -name 'quiz-de-estilo' -type d | sort"
echo -e "# Isso mostrará todas as pastas 'quiz-de-estilo' aninhadas no servidor"

echo -e "\n${YELLOW}3. Removendo estruturas aninhadas problemáticas...${NC}"
echo -e "rm -rf public_html/public_html"
echo -e "rm -rf public_html/quiz-de-estilo/public_html"
echo -e "# Isso remove pastas aninhadas incorretamente"

echo -e "\n${YELLOW}4. Movendo conteúdo para a estrutura correta (se necessário)...${NC}"
echo -e "if [ -d \"public_html/quiz-de-estilo/quiz-de-estilo\" ]; then"
echo -e "  # Se existir uma pasta aninhada incorretamente, move seu conteúdo"
echo -e "  mv public_html/quiz-de-estilo/quiz-de-estilo/* public_html/quiz-de-estilo/"
echo -e "  rm -rf public_html/quiz-de-estilo/quiz-de-estilo"
echo -e "  echo \"Estrutura aninhada corrigida!\""
echo -e "fi"

echo -e "\n${YELLOW}5. Verificando estrutura final...${NC}"
echo -e "ls -la public_html/quiz-de-estilo/"
echo -e "# Confira se os arquivos essenciais (.htaccess, index.html, sw.js) estão presentes"

echo -e "\n${YELLOW}6. Verificando permissões...${NC}"
echo -e "find public_html/quiz-de-estilo -type d -exec chmod 755 {} \\;"
echo -e "find public_html/quiz-de-estilo -type f -exec chmod 644 {} \\;"
echo -e "# Isso garante permissões corretas para pastas (755) e arquivos (644)"

echo -e "\n${YELLOW}7. Limpando o cache do servidor (se possível)...${NC}"
echo -e "touch public_html/quiz-de-estilo/.htaccess"
echo -e "# Isso 'atualiza' o .htaccess para forçar o Apache a recarregá-lo"

echo -e "\n${GREEN}=== TESTE FINAL ===${NC}"
echo -e "Após executar esses comandos, acesse:"
echo -e "https://giselegalvao.com.br/quiz-de-estilo/"
echo -e "Se ainda houver problemas, use a página de diagnóstico:"
echo -e "https://giselegalvao.com.br/quiz-de-estilo/diagnostico.html"

echo -e "\n${RED}IMPORTANTE:${NC} Se precisar restaurar o backup:"
echo -e "cd ~"
echo -e "unzip backup_quiz_${DATA_BACKUP}.zip -d restore_temp/"
echo -e "# Em seguida, mova os arquivos manualmente da pasta restore_temp/ para public_html/"
