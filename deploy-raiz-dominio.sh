#!/bin/bash
# Script para construir e preparar o site para deploy na raiz do domínio
# Uso: bash deploy-raiz-dominio.sh

# Cores para mensagens
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

# Mensagem inicial
echo -e "${GREEN}=== PREPARAÇÃO PARA DEPLOY NA RAIZ DO DOMÍNIO ===${NC}"
echo -e "Este script irá construir o aplicativo para ser hospedado em https://giselegalvao.com.br/"

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

# Finalização
echo -e "\n${GREEN}=== BUILD CONCLUÍDO ===${NC}"
echo -e "O projeto foi construído para ser hospedado na raiz do domínio:"
echo -e "${YELLOW}https://giselegalvao.com.br/${NC}"
exit 0
