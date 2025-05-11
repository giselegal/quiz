#!/bin/bash

# Script para aplicar otimizações máximas de performance
# Foca em qualidade de imagem reduzida e optimizações de cache

echo "🚀 Iniciando aplicação de otimizações máximas de performance..."

# Verificando e estabelecendo variáveis de ambiente
NODE_ENV=production
export NODE_ENV

# Verificar configuração Vite
echo "✅ Verificando configuração do Vite..."
if grep -q "cloudinaryImageOptimizer" /workspaces/quiz-sell-genius-66/vite.config.ts; then
  echo "   Plugin de otimização do Cloudinary já configurado no Vite."
else
  echo "⚠️ Configuração do Vite não encontrada. Verifique manualmente."
fi

# Verificar arquivos otimizados
echo "✅ Verificando arquivos de otimização de imagens..."
if [ -f "/workspaces/quiz-sell-genius-66/src/utils/crispImageUtils.ts" ] && [ -f "/workspaces/quiz-sell-genius-66/src/components/ui/CrispIntroImage.tsx" ]; then
  echo "   Arquivos de otimização de imagens encontrados."
else
  echo "⚠️ Arquivos de otimização de imagens não encontrados. Verifique manualmente."
fi

# Executar novo build com qualidade reduzida
echo "🔨 Executando build com qualidade de imagem reduzida..."
npm run build:hostinger

# Verificar se o build foi bem sucedido
if [ -d "/workspaces/quiz-sell-genius-66/dist" ]; then
  echo "✅ Build concluído com sucesso!"
else
  echo "❌ Erro durante o build. Verifique os logs acima."
  exit 1
fi

# Substituir o .htaccess pelo arquivo otimizado
echo "📄 Aplicando configurações .htaccess otimizadas..."
cp /workspaces/quiz-sell-genius-66/htaccess-final.txt /workspaces/quiz-sell-genius-66/dist/.htaccess

echo "✨ Otimizações máximas de performance aplicadas com sucesso!"
echo "📊 A pontuação de performance deve melhorar significativamente após o deploy."
echo ""
echo "🔍 Próximos passos:"
echo "1. Faça upload do conteúdo da pasta 'dist/' para seu servidor Hostinger"
echo "2. Verifique a performance com o Lighthouse após o deploy"
echo "3. Se as imagens ainda estiverem com problemas, considere pré-comprimir todas as imagens"
