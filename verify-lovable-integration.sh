#!/bin/bash

# Script para verificar a integração do Lovable
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
echo -e "${BLUE}   VERIFICAÇÃO DA INTEGRAÇÃO COM LOVABLE         ${NC}"
echo -e "${BLUE}=================================================${NC}"

# 1. Verificar se os componentes existem
echo -e "\n${YELLOW}1. Verificando componentes Lovable...${NC}"

COMPONENTS=(
  "src/components/lovable/QuizCover.lovable.tsx"
  "src/components/lovable/QuizQuestion.lovable.tsx"
  "src/components/lovable/QuizLogic.lovable.tsx"
  "src/components/lovable/ResultPageEditor.lovable.tsx"
)

MISSING_COMPONENTS=0

for component in "${COMPONENTS[@]}"; do
  if [ -f "$component" ]; then
    if grep -q "// @lovable" "$component"; then
      echo -e "✅ ${GREEN}$component${NC} - Existe e está marcado corretamente"
    else
      echo -e "⚠️ ${YELLOW}$component${NC} - Existe mas NÃO está marcado com // @lovable"
      MISSING_COMPONENTS=1
    fi
  else
    echo -e "❌ ${RED}$component${NC} - Não encontrado"
    MISSING_COMPONENTS=1
  fi
done

# 2. Verificar configuração do Lovable
echo -e "\n${YELLOW}2. Verificando configuração do Lovable...${NC}"

if [ -f "lovable.config.js" ]; then
  echo -e "✅ ${GREEN}lovable.config.js${NC} - Existe"
else
  echo -e "❌ ${RED}lovable.config.js${NC} - Não encontrado"
  MISSING_COMPONENTS=1
fi

if [ -f "lovable.ts" ]; then
  echo -e "✅ ${GREEN}lovable.ts${NC} - Existe"
else
  echo -e "❌ ${RED}lovable.ts${NC} - Não encontrado"
  MISSING_COMPONENTS=1
fi

# 3. Verificar configuração do Vite
echo -e "\n${YELLOW}3. Verificando configuração do Vite...${NC}"

if grep -q "a10d1b34-b5d4-426b-8c97-45f125d03ec1.lovableproject.com" "vite.config.ts"; then
  echo -e "✅ ${GREEN}vite.config.ts${NC} - Domínio Lovable configurado"
else
  echo -e "❌ ${RED}vite.config.ts${NC} - Domínio Lovable NÃO configurado"
  MISSING_COMPONENTS=1
fi

if grep -q "Access-Control-Allow-Origin" "vite.config.ts"; then
  echo -e "✅ ${GREEN}vite.config.ts${NC} - CORS configurado"
else
  echo -e "❌ ${RED}vite.config.ts${NC} - CORS NÃO configurado"
  MISSING_COMPONENTS=1
fi

# 4. Verificar estrutura de diretórios
echo -e "\n${YELLOW}4. Verificando estrutura de diretórios...${NC}"

if [ -d "src/components/lovable" ]; then
  echo -e "✅ ${GREEN}src/components/lovable/${NC} - Existe"
else
  echo -e "❌ ${RED}src/components/lovable/${NC} - Não encontrado"
  MISSING_COMPONENTS=1
fi

if [ -d "public/lovable-uploads" ]; then
  echo -e "✅ ${GREEN}public/lovable-uploads/${NC} - Existe"
else
  echo -e "❌ ${RED}public/lovable-uploads/${NC} - Não encontrado"
  MISSING_COMPONENTS=1
fi

# 5. Resumo
echo -e "\n${YELLOW}5. Resumo da verificação...${NC}"

if [ $MISSING_COMPONENTS -eq 0 ]; then
  echo -e "${GREEN}✅ Integração com o Lovable está CORRETA!${NC}"
  echo -e "${GREEN}Você pode acessar o Lovable Studio para editar os componentes.${NC}"
else
  echo -e "${RED}❌ Integração com o Lovable possui PROBLEMAS!${NC}"
  echo -e "${YELLOW}Execute o script de correção:${NC}"
  echo -e "${BLUE}bash fix-lovable-integration.sh${NC}"
fi

echo -e "\n${BLUE}=================================================${NC}"
