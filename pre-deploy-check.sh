#!/bin/bash
# Script de verificação pré-deploy para o Quiz

echo "🔍 Iniciando verificações pré-deploy para o Quiz da Gisele Galvão..."

# 1. Verificar se o Node.js está instalado e é compatível
NODE_VERSION=$(node -v)
echo "✅ Node.js: $NODE_VERSION"

# 2. Verificar existência de arquivos essenciais
ESSENTIALS=("index.html" "vite.config.ts" "public/.htaccess" "src/main.jsx")
for file in "${ESSENTIALS[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ Arquivo encontrado: $file"
  else
    echo "❌ ERRO: Arquivo não encontrado: $file"
    HAS_ERRORS=true
  fi
done

# 3. Verificar configurações de MIME type no .htaccess
if grep -q "application/javascript" public/.htaccess; then
  echo "✅ Configurações de MIME type encontradas no .htaccess"
else
  echo "❌ AVISO: Não foram encontradas configurações de MIME type no .htaccess"
  HAS_WARNINGS=true
fi

# 4. Verificar se caminhos de scripts são relativos
if grep -q "./src/main.jsx" index.html; then
  echo "✅ Caminhos de scripts relativos encontrados em index.html"
else
  echo "❌ AVISO: Caminhos de scripts podem não ser relativos em index.html"
  HAS_WARNINGS=true
fi

# 5. Verificar se o Facebook Pixel está configurado
if grep -q "Facebook Pixel" -r src/; then
  echo "✅ Configurações do Facebook Pixel encontradas"
else
  echo "⚠️ AVISO: Configurações do Facebook Pixel podem estar ausentes"
  HAS_WARNINGS=true
fi

# 6. Criar build de teste
echo "🔨 Criando build de teste..."
npm run build

if [ -d "dist" ]; then
  echo "✅ Build criado com sucesso na pasta 'dist'"
  
  # Verificar se .htaccess foi copiado para a pasta dist
  if [ -f "dist/.htaccess" ]; then
    echo "✅ Arquivo .htaccess copiado para a pasta dist"
  else
    echo "❌ AVISO: Arquivo .htaccess não foi copiado para a pasta dist"
    # Copiar o arquivo
    cp public/.htaccess dist/.htaccess
    echo "✅ Arquivo .htaccess foi copiado manualmente para a pasta dist"
  fi
else
  echo "❌ ERRO: Falha ao criar build"
  HAS_ERRORS=true
fi

# 7. Verificar tamanho do build
if [ -d "dist" ]; then
  BUILD_SIZE=$(du -sh dist | cut -f1)
  echo "📦 Tamanho do build: $BUILD_SIZE"
fi

# 8. Exibir resumo
echo ""
echo "📋 RESUMO DAS VERIFICAÇÕES:"
if [ "$HAS_ERRORS" = true ]; then
  echo "❌ Foram encontrados ERROS que precisam ser corrigidos antes do deploy!"
elif [ "$HAS_WARNINGS" = true ]; then
  echo "⚠️ Foram encontrados AVISOS que podem precisar de atenção!"
else
  echo "✅ Todas as verificações passaram com sucesso! O projeto está pronto para deploy."
fi
echo ""
echo "📝 Lembre-se de consultar o arquivo HOSTINGER-DEPLOY.md para instruções detalhadas sobre como implantar na Hostinger."
