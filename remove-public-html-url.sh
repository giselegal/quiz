#!/bin/bash
# Script para remover "public_html" da URL do site

# Define cores para saída
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

echo -e "${YELLOW}Removendo 'public_html' da URL do site${NC}"
echo "Este script irá corrigir a estrutura para que 'public_html' não apareça na URL"

# Verifica configurações atuais
echo -e "${GREEN}1. Verificando configurações do site${NC}"

# Verifica o .htaccess para garantir que não há referências a public_html
echo "   Checando .htaccess..."
if [ -f "./dist/.htaccess" ]; then
  if grep -q "RewriteBase /quiz-de-estilo/public_html" "./dist/.htaccess"; then
    # Corrige o RewriteBase
    sed -i 's|RewriteBase /quiz-de-estilo/public_html/|RewriteBase /quiz-de-estilo/|g' "./dist/.htaccess"
    echo -e "   ${GREEN}✓ Corrigido RewriteBase no .htaccess${NC}"
  elif grep -q "RewriteBase /public_html/quiz-de-estilo" "./dist/.htaccess"; then
    # Corrige o RewriteBase
    sed -i 's|RewriteBase /public_html/quiz-de-estilo/|RewriteBase /quiz-de-estilo/|g' "./dist/.htaccess"
    echo -e "   ${GREEN}✓ Corrigido RewriteBase no .htaccess${NC}"
  else
    echo -e "   ${GREEN}✓ RewriteBase no .htaccess parece correto${NC}"
  fi
else
  echo -e "   ${RED}✗ Arquivo .htaccess não encontrado${NC}"
fi

# Verifica o arquivo vite.config.ts
echo "   Checando vite.config.ts..."
if [ -f "./vite.config.ts" ]; then
  if grep -q "base: '/public_html/quiz-de-estilo'" "./vite.config.ts" || grep -q "base: '/quiz-de-estilo/public_html'" "./vite.config.ts"; then
    # Corrige a base path
    sed -i 's|base: .*|base: \'/quiz-de-estilo/\',|g' "./vite.config.ts"
    echo -e "   ${GREEN}✓ Corrigido base path no vite.config.ts${NC}"
  else
    echo -e "   ${GREEN}✓ Base path no vite.config.ts parece correto${NC}"
  fi
else
  echo -e "   ${RED}✗ Arquivo vite.config.ts não encontrado${NC}"
fi

# Verifica o Service Worker
echo "   Checando Service Worker..."
if [ -f "./dist/sw.js" ]; then
  if grep -q "'/public_html/quiz-de-estilo/'" "./dist/sw.js" || grep -q "'/quiz-de-estilo/public_html/'" "./dist/sw.js"; then
    # Corrige os caminhos no Service Worker
    sed -i 's|/public_html/quiz-de-estilo/|/quiz-de-estilo/|g' "./dist/sw.js"
    sed -i 's|/quiz-de-estilo/public_html/|/quiz-de-estilo/|g' "./dist/sw.js"
    echo -e "   ${GREEN}✓ Corrigidos caminhos no Service Worker${NC}"
  else
    echo -e "   ${GREEN}✓ Caminhos no Service Worker parecem corretos${NC}"
  fi
else
  echo -e "   ${RED}✗ Arquivo sw.js não encontrado${NC}"
fi

# Verifica o registro do Service Worker no HTML
echo "   Checando registro do Service Worker no HTML..."
if [ -f "./dist/index.html" ]; then
  if grep -q "register('/public_html/quiz-de-estilo/" "./dist/index.html" || grep -q "register('/quiz-de-estilo/public_html/" "./dist/index.html"; then
    # Corrige o registro do Service Worker
    sed -i 's|register(\'/public_html/quiz-de-estilo/|register(\'/quiz-de-estilo/|g' "./dist/index.html"
    sed -i 's|register(\'/quiz-de-estilo/public_html/|register(\'/quiz-de-estilo/|g' "./dist/index.html"
    sed -i 's|scope: \'/public_html/quiz-de-estilo/|scope: \'/quiz-de-estilo/|g' "./dist/index.html"
    sed -i 's|scope: \'/quiz-de-estilo/public_html/|scope: \'/quiz-de-estilo/|g' "./dist/index.html"
    echo -e "   ${GREEN}✓ Corrigido registro do Service Worker no HTML${NC}"
  else
    echo -e "   ${GREEN}✓ Registro do Service Worker no HTML parece correto${NC}"
  fi
else
  echo -e "   ${RED}✗ Arquivo index.html não encontrado${NC}"
fi

# Instruções para o usuário
echo -e "\n${GREEN}INSTRUÇÕES PARA CORRIGIR A ESTRUTURA NO SERVIDOR HOSTINGER${NC}"
echo -e "${YELLOW}-------------------------------------------------------${NC}"
echo -e "1. Acesse o painel de controle da Hostinger (hPanel)"
echo -e "2. Vá para o gerenciador de arquivos"
echo -e "3. Navegue até public_html/quiz-de-estilo/"
echo -e "4. Verifique a estrutura dos arquivos:"
echo -e "   - Os arquivos do site (index.html, .htaccess, etc.) devem estar diretamente nesta pasta"
echo -e "   - Não deve existir uma pasta adicional 'public_html' dentro de quiz-de-estilo"
echo -e "5. Se encontrar uma pasta extra 'public_html':"
echo -e "   a. Selecione todos os arquivos dentro de public_html/quiz-de-estilo/public_html/"
echo -e "   b. Mova-os para public_html/quiz-de-estilo/"
echo -e "   c. Exclua a pasta vazia public_html/quiz-de-estilo/public_html/"
echo -e "6. Verifique se no Hostinger não há redirecionamentos configurados que incluam 'public_html'"
echo -e "7. Acesse o site em ${GREEN}https://giselegalvao.com.br/quiz-de-estilo/${NC} para verificar"

echo -e "\n${YELLOW}Deseja gerar um novo build com essas correções? (s/n)${NC}"
read resposta

if [[ "$resposta" == "s" || "$resposta" == "S" ]]; then
  echo -e "${GREEN}Gerando novo build...${NC}"
  npm run build
  
  # Reaplicar correções ao .htaccess e sw.js se necessário
  if [ -f "./dist/.htaccess" ]; then
    sed -i 's|RewriteBase /quiz-de-estilo/public_html/|RewriteBase /quiz-de-estilo/|g' "./dist/.htaccess"
    sed -i 's|RewriteBase /public_html/quiz-de-estilo/|RewriteBase /quiz-de-estilo/|g' "./dist/.htaccess"
  fi
  
  if [ -f "./dist/sw.js" ]; then
    sed -i 's|/public_html/quiz-de-estilo/|/quiz-de-estilo/|g' "./dist/sw.js"
    sed -i 's|/quiz-de-estilo/public_html/|/quiz-de-estilo/|g' "./dist/sw.js"
  fi
  
  echo -e "${GREEN}Build completo com correções aplicadas. Os arquivos estão na pasta ./dist/${NC}"
else
  echo -e "${YELLOW}Nenhum build foi gerado. Aplique as correções manualmente conforme necessário.${NC}"
fi
