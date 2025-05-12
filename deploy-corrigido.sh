#!/bin/bash
# Script corrigido para deploy na raiz do domínio via FTP
# Uso: bash deploy-corrigido.sh

# Cores para mensagens
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

# Mensagem inicial
echo -e "${GREEN}=== DEPLOY CORRIGIDO PARA HOSTINGER (giselegalvao.com.br) ===${NC}"
echo -e "Este script irá construir o aplicativo e fazer upload via FTP para a raiz do domínio."

# Verificar vite.config.ts
echo -e "\n${YELLOW}1. Verificando configuração base no vite.config.ts${NC}"
if grep -q "base: '/quiz-de-estilo/" "./vite.config.ts"; then
    sed -i 's|base: .*|base: "/",|g' "./vite.config.ts"
    echo -e "   ${GREEN}✓ Configuração base atualizada para '/'${NC}"
else
    echo -e "   ${GREEN}✓ Configuração base já está correta ('/')${NC}"
fi

# Atualizar .htaccess
echo -e "\n${YELLOW}2. Verificando .htaccess${NC}"
mkdir -p "./public"
cat > "./public/.htaccess" <<EOL
# Configuração SPA - Redireciona todas as solicitações para index.html
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Não redirecionar para arquivos existentes ou diretórios
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d

  # Redirecionar todo o restante para index.html
  RewriteRule ^(.*)$ index.html [L,QSA]
</IfModule>
EOL

echo -e "   ${GREEN}✓ Regras de redirecionamento adicionadas ao .htaccess${NC}"

# Construir o projeto
echo -e "\n${YELLOW}3. Construindo o projeto${NC}"
npm run build

# Copiar .htaccess para a pasta dist
echo -e "\n${YELLOW}4. Copiando .htaccess para pasta dist${NC}"
cp "./public/.htaccess" "./dist/.htaccess"
echo -e "   ${GREEN}✓ .htaccess copiado com sucesso${NC}"

# Configurações do FTP
FTP_HOST="giselegalvao.com.br"
FTP_USER="u116045488"
FTP_PASS="GiseleG@l0809"
# NOTA: Não estamos usando um diretório específico, vamos fazer upload para o raiz "/"

# Fazer upload para o servidor FTP
echo -e "\n${YELLOW}5. Fazendo upload dos arquivos para o servidor FTP${NC}"

# Criar um arquivo temporário para listar todos os arquivos
FILE_LIST=$(mktemp)
find ./dist -type f | sort > "$FILE_LIST"
TOTAL_FILES=$(wc -l < "$FILE_LIST")

echo -e "   ${GREEN}Encontrados $TOTAL_FILES arquivos para enviar${NC}"
echo -e "   ${YELLOW}Iniciando upload...${NC}"

COUNT=0
while IFS= read -r FILE; do
    COUNT=$((COUNT+1))
    RELATIVE_PATH="${FILE#./dist/}"
    echo -e "   [$COUNT/$TOTAL_FILES] Enviando: $RELATIVE_PATH"
    
    # Usar curl para upload diretamente para a raiz
    curl -s -T "$FILE" --ftp-create-dirs -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$RELATIVE_PATH"
    
    if [ $? -eq 0 ]; then
        echo -e "   ${GREEN}✓ Enviado com sucesso: $RELATIVE_PATH${NC}"
    else
        echo -e "   ${RED}✗ Erro ao enviar: $RELATIVE_PATH${NC}"
    fi
done < "$FILE_LIST"

rm -f "$FILE_LIST"

# Finalização
echo -e "\n${GREEN}=== DEPLOY CONCLUÍDO ===${NC}"
echo -e "O projeto foi construído e enviado para o domínio:"
echo -e "${YELLOW}https://giselegalvao.com.br/${NC}"
echo -e "\n${GREEN}Importante:${NC} Certifique-se de que o arquivo index.html está corretamente configurado na raiz do seu domínio."
exit 0
