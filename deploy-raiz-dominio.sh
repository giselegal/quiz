#!/bin/bash
# Script para construir e preparar o site para deploy na raiz do domínio
# Uso: bash deploy-raiz-dominio.sh

# Cores para mensagens
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

echo -e "${GREEN}=== PREPARAÇÃO PARA DEPLOY NA RAIZ DO DOMÍNIO ===${NC}"
echo -e "Este script irá construir o aplicativo para ser hospedado em https://giselegalvao.com.br/"

# 1. Verificar vite.config.ts
echo -e "\n${YELLOW}1. Verificando configuração base no vite.config.ts${NC}"
if grep -q "base: '/quiz-de-estilo/" "./vite.config.ts"; then
    echo -e "   ${RED}✗ Configuração incorreta detectada (subdiretório)${NC}"
    echo -e "   Alterando configuração para raiz do domínio..."
    sed -i 's|base: .*|base: \'/\',|g' "./vite.config.ts"
    echo -e "   ${GREEN}✓ Configuração base atualizada para '/'${NC}"
elif grep -q "base: '/'" "./vite.config.ts"; then
    echo -e "   ${GREEN}✓ Configuração base já está correta ('/')${NC}"
else
    echo -e "   ${RED}✗ Não foi possível verificar a configuração base${NC}"
    echo -e "   Por favor, verifique manualmente o arquivo vite.config.ts"
fi

# 2. Atualizar .htaccess
echo -e "\n${YELLOW}2. Verificando .htaccess${NC}"
if grep -q "RewriteBase /quiz-de-estilo" "./public/.htaccess" 2>/dev/null; then
    echo -e "   ${RED}✗ RewriteBase incorreto detectado (subdiretório)${NC}"
    sed -i 's|RewriteBase /quiz-de-estilo/|RewriteBase /|g' "./public/.htaccess"
    echo -e "   ${GREEN}✓ RewriteBase atualizado para raiz ('/')${NC}"
elif ! grep -q "RewriteBase /" "./public/.htaccess" 2>/dev/null; then
    echo -e "   ${RED}✗ RewriteBase não encontrado${NC}"
    echo -e "   Adicionando regras de redirecionamento para SPA..."
    
    # Adicionar regras de redirecionamento se não existirem
    echo '
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

# Especificar tipos MIME corretos para arquivos JavaScript
<FilesMatch "\.(js|jsx|mjs)$">
  Header set Content-Type "application/javascript; charset=UTF-8"
</FilesMatch>' >> "./public/.htaccess"
    
    echo -e "   ${GREEN}✓ Regras de redirecionamento adicionadas ao .htaccess${NC}"
else
    echo -e "   ${GREEN}✓ RewriteBase já está configurado corretamente${NC}"
fi

# 3. Construir o projeto
echo -e "\n${YELLOW}3. Construindo o projeto${NC}"
echo -e "   Executando npm run build..."
npm run build

# 4. Copiar .htaccess para a pasta dist
echo -e "\n${YELLOW}4. Copiando .htaccess para pasta dist${NC}"
if [ -f "./public/.htaccess" ]; then
    cp "./public/.htaccess" "./dist/.htaccess"
    echo -e "   ${GREEN}✓ .htaccess copiado com sucesso${NC}"
else
    echo -e "   ${RED}✗ Arquivo .htaccess não encontrado em ./public/${NC}"
fi

# 5. Concluído
echo -e "\n${GREEN}=== BUILD CONCLUÍDO ===${NC}"
echo -e "O projeto foi construído para ser hospedado na raiz do domínio:"
echo -e "${YELLOW}https://giselegalvao.com.br/${NC}"
echo -e "\nPróximos passos:"
echo -e "1. Fazer upload do conteúdo da pasta ${YELLOW}dist/${NC} para a pasta ${YELLOW}public_html/${NC} na Hostinger"
echo -e "2. Verificar se o site está funcionando corretamente em ${YELLOW}https://giselegalvao.com.br/${NC}"
echo -e "3. Testar os redirecionamentos e rotas da SPA (por exemplo: ${YELLOW}https://giselegalvao.com.br/resultado${NC})"
