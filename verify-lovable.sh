#!/bin/bash

# Script para verificar se a integração com o Lovable está funcionando corretamente

echo "🧪 Iniciando verificação da integração com o Lovable..."

# 1. Verificar configuração do Lovable
echo "📝 Verificando configuração do Lovable..."
if [ -f "./lovable.config.js" ]; then
  echo "✅ Arquivo de configuração do Lovable encontrado."
else
  echo "❌ Arquivo de configuração do Lovable não encontrado!"
  exit 1
fi

# 2. Verificar existência dos componentes Lovable
echo "🧩 Verificando componentes Lovable..."
LOVABLE_COMPONENTS=(
  "src/components/lovable/QuizCover.lovable.tsx"
  "src/components/lovable/QuizQuestion.lovable.tsx"
  "src/components/lovable/QuizLogic.lovable.tsx"
  "src/components/lovable/ResultPageEditor.lovable.tsx"
)

for component in "${LOVABLE_COMPONENTS[@]}"; do
  if [ -f "$component" ]; then
    if grep -q "// @lovable" "$component"; then
      echo "✅ Componente $component está marcado corretamente com @lovable."
    else
      echo "⚠️ Componente $component existe, mas não está marcado com @lovable."
      echo "   Adicionando marcação..."
      sed -i '1s/^/\/\/ @lovable\n/' "$component"
      echo "✅ Marcação adicionada ao componente $component."
    fi
  else
    echo "❌ Componente $component não encontrado!"
    exit 1
  fi
done

# 3. Verificar configuração do vite.config.ts
echo "🔧 Verificando configuração do vite.config.ts..."
if grep -q "a10d1b34-b5d4-426b-8c97-45f125d03ec1.lovableproject.com" "vite.config.ts"; then
  echo "✅ vite.config.ts está configurado para permitir conexões do Lovable."
else
  echo "❌ vite.config.ts não está configurado para permitir conexões do Lovable!"
  exit 1
fi

# 4. Verificar se a pasta de uploads do Lovable existe
echo "📁 Verificando pasta de uploads do Lovable..."
if [ -d "./public/lovable-uploads" ]; then
  echo "✅ Pasta de uploads do Lovable encontrada."
else
  echo "⚠️ Pasta de uploads do Lovable não encontrada. Criando..."
  mkdir -p "./public/lovable-uploads"
  echo "✅ Pasta de uploads do Lovable criada com sucesso."
fi

echo "🎉 Verificação concluída! A integração com o Lovable está pronta para uso."
echo ""
echo "Para conectar ao Lovable Studio:"
echo "1. Execute 'npm run dev' para iniciar o servidor de desenvolvimento"
echo "2. Acesse o Lovable Studio em https://studio.lovable.dev"
echo "3. Configure seu projeto para apontar para http://localhost:8080"
echo "4. Edite seus componentes e publique as alterações"
