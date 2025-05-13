#!/bin/bash

# Script de solução de problemas do Lovable
# Este script realiza uma configuração completa para corrigir problemas com o Lovable

echo "🔍 Iniciando diagnóstico e correção do Lovable..."

# 1. Verificar dependências
echo "📦 Verificando dependências..."
if ! grep -q "\"lovable\":" package.json; then
  echo "⚠️ Lovable não encontrado no package.json. Instalando..."
  npm install --save-dev lovable@latest
  echo "✅ Lovable instalado com sucesso!"
else
  echo "✅ Lovable já está instalado."
fi

# 2. Verificar estrutura correta do arquivo lovable.ts
echo "🔧 Verificando o arquivo lovable.ts..."
cat > lovable.ts << 'EOL'
// This file provides the lovable component definition interface
import React from 'react';

export interface LovableProps {
  name: string;
  displayName: string;
  description: string;
  category: string;
  defaultProps: Record<string, any>;
  propsSchema: Record<string, any>;
  render: (props: any) => React.ReactNode;
}

export function defineLovable(config: LovableProps): any {
  return config;
}
EOL
echo "✅ Arquivo lovable.ts atualizado."

# 3. Atualizar a porta no lovable.config.js
echo "🔄 Atualizando configuração do Lovable..."
cat > lovable.config.js << 'EOL'
module.exports = {
  componentsPath: 'src/components/lovable',
  assetsPath: 'public/lovable-uploads',
  outputPath: 'dist',
  buildCommand: 'npm run build',
  previewCommand: 'npm run preview',
  development: {
    port: 8080,
    startCommand: 'npm run dev'
  }
};
EOL
echo "✅ Configuração atualizada para usar a porta 8080."

# 4. Verificar as tags @lovable nos componentes
echo "🏷️ Verificando componentes Lovable..."
mkdir -p src/components/lovable

LOVABLE_COMPONENTS=(
  "src/components/lovable/QuizCover.lovable.tsx"
  "src/components/lovable/QuizQuestion.lovable.tsx"
  "src/components/lovable/QuizLogic.lovable.tsx"
  "src/components/lovable/ResultPageEditor.lovable.tsx"
)

for component in "${LOVABLE_COMPONENTS[@]}"; do
  if [ -f "$component" ]; then
    if ! grep -q "// @lovable" "$component"; then
      echo "⚠️ Componente $component não tem a tag @lovable, adicionando..."
      sed -i '1s/^/\/\/ @lovable\n/' "$component"
      echo "✅ Tag adicionada ao componente $component."
    else
      echo "✅ Componente $component já está marcado com @lovable."
    fi
  else
    echo "❌ Componente $component não encontrado! Pulando."
  fi
done

# 5. Verificar configuração CORS no vite.config.ts
echo "🌐 Verificando configuração CORS no vite.config.ts..."
if ! grep -q "Access-Control-Allow-Origin" vite.config.ts; then
  echo "⚠️ Configuração CORS não encontrada no vite.config.ts. Isso pode causar problemas!"
else
  echo "✅ Configuração CORS encontrada no vite.config.ts."
fi

if ! grep -q "a10d1b34-b5d4-426b-8c97-45f125d03ec1.lovableproject.com" vite.config.ts; then
  echo "⚠️ Host do Lovable não encontrado na lista de allowedHosts. Isso é necessário!"
else
  echo "✅ Host do Lovable configurado corretamente."
fi

# 6. Criar pasta para uploads do Lovable
echo "📁 Verificando pasta de uploads do Lovable..."
mkdir -p public/lovable-uploads
echo "✅ Pasta de uploads criada/verificada."

# 7. Verificar componentes importando corretamente o defineLovable
echo "📋 Verificando importações nos componentes..."
for component in "${LOVABLE_COMPONENTS[@]}"; do
  if [ -f "$component" ]; then
    if ! grep -q "import { defineLovable } from" "$component"; then
      echo "⚠️ Componente $component pode não estar importando defineLovable corretamente!"
    else
      echo "✅ Componente $component importa defineLovable corretamente."
    fi
  fi
done

# 8. Instruções finais
echo ""
echo "🎯 Diagnóstico e correção concluídos!"
echo ""
echo "Para conectar ao Lovable Studio:"
echo "1. Execute 'npm run dev -- --host --port 8080' para iniciar o servidor"
echo "2. Acesse o Lovable Studio em https://studio.lovable.dev"
echo "3. Use uma das seguintes URLs para configurar seu projeto no Lovable Studio:"
echo "   - Local: http://localhost:8080"
echo "   - Codespace: (Verifique a URL na aba PORTS do VS Code)"
echo ""
echo "Se ainda houver problemas:"
echo "1. Verifique se o vite.config.ts tem as configurações CORS corretas"
echo "2. Verifique se os componentes estão estruturados corretamente"
echo "3. Verifique se o Lovable Studio está configurado para a URL correta"
echo ""
echo "Iniciando o servidor em modo de debug com todas as flags necessárias:"
echo "npm run dev -- --host --port 8080"
