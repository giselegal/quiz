#!/bin/bash

# Script para aplicar todas as otimizações de imagens e performance

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Iniciando otimizações de imagens e performance...${NC}"

# 1. Verificar arquivos necessários
echo -e "${GREEN}[1/6]${NC} Verificando arquivos necessários..."

FILES=(
  "src/components/ui/CrispIntroImage.tsx"
  "src/utils/crispImageUtils.ts"
  "src/utils/imagePerformanceOptimizer.js"
  "src/styles/image-optimizations.css"
  "src/plugins/cloudinaryImageOptimizer.ts"
)

for file in "${FILES[@]}"; do
  if [ ! -f "$file" ]; then
    echo -e "${RED}ERROR: Arquivo $file não encontrado!${NC}"
    exit 1
  fi
done

# 2. Verificar se os imports estão corretos
echo -e "${GREEN}[2/6]${NC} Verificando imports..."

grep -q "import './styles/image-optimizations.css'" src/main.jsx
if [ $? -ne 0 ]; then
  echo -e "${YELLOW}Adicionando import de CSS em main.jsx${NC}"
  sed -i "s/import '.\/index.css';/import '.\/index.css';\nimport '.\/styles\/image-optimizations.css';/" src/main.jsx
fi

grep -q "import './utils/imagePerformanceOptimizer.js'" src/main.jsx
if [ $? -ne 0 ]; then
  echo -e "${YELLOW}Adicionando import de script otimizador em main.jsx${NC}"
  sed -i "s/import '.\/styles\/image-optimizations.css';/import '.\/styles\/image-optimizations.css';\nimport '.\/utils\/imagePerformanceOptimizer.js';/" src/main.jsx
fi

# 3. Verificar plugin no vite.config.ts
echo -e "${GREEN}[3/6]${NC} Verificando configuração do Vite..."

grep -q "import cloudinaryImageOptimizer from" vite.config.ts
if [ $? -ne 0 ]; then
  echo -e "${YELLOW}Adicionando import do plugin no vite.config.ts${NC}"
  sed -i "s/import compression from \"vite-plugin-compression\";/import compression from \"vite-plugin-compression\";\nimport cloudinaryImageOptimizer from \".\/src\/plugins\/cloudinaryImageOptimizer\";/" vite.config.ts
fi

grep -q "cloudinaryImageOptimizer()" vite.config.ts
if [ $? -ne 0 ]; then
  echo -e "${YELLOW}Configurando plugin no vite.config.ts${NC}"
  sed -i "s/react(),/react(),\n    cloudinaryImageOptimizer(),/" vite.config.ts
fi

# 4. Verificar/aplicar configurações de CSS
echo -e "${GREEN}[4/6]${NC} Verificando configurações CSS..."

grep -q "image-rendering: crisp-edges" src/index.css
if [ $? -ne 0 ]; then
  echo -e "${YELLOW}Adicionando regras CSS para imagens nítidas${NC}"
  sed -i "/img {/,/}/c\img {\n  transition: none !important;\n  transform: none !important;\n  filter: none !important;\n  image-rendering: crisp-edges;\n}" src/index.css
fi

# 5. Build para verificar se não há erros
echo -e "${GREEN}[5/6]${NC} Executando build para verificar integridade..."

npm run build
if [ $? -ne 0 ]; then
  echo -e "${RED}Build falhou! Por favor, corrija os erros antes de continuar.${NC}"
  exit 1
fi

# 6. Abrir relatório do Lighthouse
echo -e "${GREEN}[6/6]${NC} Otimizações aplicadas com sucesso!"
echo -e "${YELLOW}Próximos passos:${NC}"
echo -e "1. Execute 'npm run preview' para visualizar o site otimizado"
echo -e "2. Abra o Lighthouse no navegador para verificar as métricas de performance"
echo -e "3. Verifique que as imagens não estão mais embaçadas"

echo -e "\n${GREEN}Processo de otimização concluído com sucesso!${NC}"
