#!/bin/bash
# Script para corrigir a estrutura de diretórios na Hostinger

# Define cores para saída
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

echo -e "${YELLOW}Iniciando configuração para corrigir estrutura de diretórios na Hostinger${NC}"
echo "Este script irá ajudar a corrigir o problema de caminhos duplicados no servidor."

# Corrige o arquivo .htaccess 
echo -e "${GREEN}1. Corrigindo arquivo .htaccess${NC}"
if [ -f "./dist/.htaccess" ]; then
  # Substitui o caminho no RewriteBase
  sed -i 's|RewriteBase /quiz-de-estilo/public_html/|RewriteBase /quiz-de-estilo/|g' ./dist/.htaccess
  echo "   ✓ RewriteBase corrigido no .htaccess"
else
  echo -e "${RED}   ✗ Arquivo .htaccess não encontrado na pasta dist${NC}"
fi

# Corrige o arquivo sw.js (Service Worker)
echo -e "${GREEN}2. Corrigindo Service Worker${NC}"
if [ -f "./dist/sw.js" ]; then
  # Modifica o caminho base no Service Worker
  sed -i 's|const BASE_PATH = .*;|const BASE_PATH = \'/quiz-de-estilo/\';|g' ./dist/sw.js
  
  # Verifica se o STATIC_ASSETS contém os caminhos corretos
  if grep -q "'/quiz-de-estilo/'" ./dist/sw.js; then
    echo "   ✓ Caminhos de recursos no Service Worker verificados"
  else
    # Se não encontrar, atualiza manualmente
    sed -i 's|const STATIC_ASSETS = \[.*\]|const STATIC_ASSETS = [\n  \'/quiz-de-estilo/\',\n  \'/quiz-de-estilo/index.html\'\n]|g' ./dist/sw.js
    echo "   ✓ Caminhos de recursos no Service Worker corrigidos"
  fi
else
  echo -e "${RED}   ✗ Arquivo de Service Worker não encontrado${NC}"
fi

# Verifica index.html para corrigir registro do Service Worker
echo -e "${GREEN}3. Verificando registro do Service Worker no HTML${NC}"
if [ -f "./dist/index.html" ]; then
  # Procura pelo código do service worker comentado
  if grep -q "navigator.serviceWorker.register('/sw.js'" ./dist/index.html; then
    # Substitui com o caminho correto
    sed -i 's|navigator.serviceWorker.register(\'/sw.js\'|navigator.serviceWorker.register(\'/quiz-de-estilo/sw.js\'|g' ./dist/index.html
    sed -i 's|{ scope: \'/|{ scope: \'/quiz-de-estilo/|g' ./dist/index.html
    echo "   ✓ Registro do Service Worker corrigido no HTML"
  elif grep -q "serviceWorker.register('/quiz-de-estilo/sw.js'" ./dist/index.html; then
    echo "   ✓ Registro do Service Worker já está correto"
  else
    echo -e "${YELLOW}   ⚠ Código de registro do Service Worker não encontrado${NC}"
  fi
else
  echo -e "${RED}   ✗ Arquivo index.html não encontrado${NC}"
fi

# Gera arquivos de explicação para usar na Hostinger
echo -e "${GREEN}4. Gerando instruções para ajuste no servidor${NC}"

cat > "./hostinger-fix-instructions.txt" << 'EOF'
INSTRUÇÕES PARA CORRIGIR A ESTRUTURA DE DIRETÓRIOS NA HOSTINGER

Problema: A URL está mostrando "public_html" no caminho, resultando em:
https://giselegalvao.com.br/public_html/quiz-de-estilo/ ou
https://giselegalvao.com.br/quiz-de-estilo/public_html/

Solução: O site deve ser acessado apenas em:
https://giselegalvao.com.br/quiz-de-estilo/

Passos para corrigir:

1. Acesse o Gerenciador de Arquivos da Hostinger
2. Verifique a estrutura dos diretórios:
   a. A estrutura correta deve ser: public_html/quiz-de-estilo/
   b. Os arquivos do site (index.html, .htaccess, etc.) devem estar diretamente
      dentro da pasta public_html/quiz-de-estilo/
   c. Não deve existir uma pasta adicional "public_html" dentro de quiz-de-estilo

3. Se encontrar a estrutura incorreta (por exemplo: public_html/quiz-de-estilo/public_html/):
   a. Selecione todos os arquivos da pasta public_html/quiz-de-estilo/public_html/
   b. Mova-os para public_html/quiz-de-estilo/
   c. Exclua a pasta public_html/quiz-de-estilo/public_html/ vazia

4. Importante: verifique se o arquivo .htaccess está na pasta public_html/quiz-de-estilo/ e 
   contém a linha "RewriteBase /quiz-de-estilo/" (sem public_html).

5. Se você tiver configurado um redirecionamento no painel da Hostinger, verifique se
   ele está apontando para /quiz-de-estilo/ e não para /quiz-de-estilo/public_html/

6. Após essas mudanças, acesse o site em https://giselegalvao.com.br/quiz-de-estilo/
   e verifique se está funcionando corretamente e sem "public_html" na URL.
EOF

echo "   ✓ Instruções criadas em hostinger-fix-instructions.txt"

# Verificando configuração do GitHub Actions para deploy
echo -e "${GREEN}5. Verificando configuração de deploy${NC}"
if [ -d "./.github/workflows" ]; then
  workflows=$(grep -l "server-dir.*quiz-de-estilo" ./.github/workflows/*.yml)
  
  if [ -n "$workflows" ]; then
    for workflow in $workflows; do
      if grep -q "server-dir:.*public_html/quiz-de-estilo/public_html" "$workflow"; then
        sed -i 's|server-dir:.*public_html/quiz-de-estilo/public_html|server-dir: /u116045488/domains/giselegalvao.com.br/public_html/quiz-de-estilo/|g' "$workflow"
        echo "   ✓ Caminho de deploy corrigido em $workflow"
      else
        echo "   ✓ Configuração de deploy parece correta em $workflow"
      fi
    done
  else
    echo -e "${YELLOW}   ⚠ Não encontrou configurações de deploy para quiz-de-estilo nos workflows${NC}"
  fi
else
  echo -e "${YELLOW}   ⚠ Pasta de workflows não encontrada${NC}"
fi

echo -e "${GREEN}====== VERIFICAÇÃO COMPLETA ======${NC}"
echo -e "As correções foram aplicadas. Você deve:"
echo -e "1. Seguir as instruções no arquivo ${YELLOW}hostinger-fix-instructions.txt${NC} para corrigir o diretório no servidor"
echo -e "2. Fazer um novo deploy usando o GitHub Actions ou fazendo upload manual dos arquivos"

echo -e "${YELLOW}Deseja fazer um novo build e preparar os arquivos para upload manual? (s/n)${NC}"
read resposta

if [[ "$resposta" == "s" || "$resposta" == "S" ]]; then
  echo -e "${GREEN}Iniciando build...${NC}"
  npm run build
  
  echo -e "${GREEN}Arquivos preparados em ./dist/${NC}"
  echo -e "Você pode enviar esses arquivos manualmente para o diretório correto na Hostinger."
fi
