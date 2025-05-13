#!/bin/bash

# Script para reiniciar a integração com o Lovable

echo "🔄 Reiniciando a integração com o Lovable..."

# 1. Parar qualquer servidor em execução na porta 8080
echo "🛑 Parando servidores ativos..."
fuser -k 8080/tcp 2>/dev/null || echo "Nenhum servidor ativo na porta 8080"

# 2. Verificar e corrigir a configuração do Lovable
echo "🔧 Atualizando configuração do Lovable..."
cat > lovable.config.js << EOL
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

# 3. Garantir que os componentes estejam marcados com @lovable
echo "🏷️ Verificando tags @lovable nos componentes..."
node mark-lovable-fixed.cjs

# 4. Configurar CORS no vite.config.ts
echo "🌐 Verificando configuração CORS no vite.config.ts..."
# Essa etapa é apenas uma verificação visual
grep -A 5 "Access-Control-Allow-Origin" vite.config.ts

# 5. Iniciar o servidor com configurações específicas
echo "🚀 Iniciando servidor na porta 8080 com acesso externo..."
echo "Para conectar ao Lovable Studio:"
echo "1. Acesse https://studio.lovable.dev"
echo "2. Configure a URL do projeto para http://localhost:8080 ou a URL do Codespace"
echo "3. Se estiver usando Codespace, use a URL pública do Codespace que pode ser encontrada na aba PORTS"
echo ""
echo "Pressione Ctrl+C para encerrar o servidor quando terminar de usar o Lovable Studio"
echo ""

npm run dev -- --host --port 8080
