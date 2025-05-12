#!/bin/bash
# Script para compilar o projeto e preparar arquivos para upload

echo "🔨 Iniciando preparação da solução para o Quiz de Estilo 🔨"

# Criar pasta solução
echo "1. Criando pasta para solução..."
rm -rf ./solucao-quiz-estilo 2>/dev/null
mkdir -p ./solucao-quiz-estilo

# Compilar o projeto (assumindo que o build já foi feito)
echo "2. Copiando arquivos do build..."
cp -r ./dist/* ./solucao-quiz-estilo/

# Copiar os arquivos corrigidos da solução simples
echo "3. Adicionando arquivos corrigidos..."
cp ./solucao-simples/.htaccess ./solucao-quiz-estilo/
cp ./solucao-simples/sw.js ./solucao-quiz-estilo/
cp ./solucao-simples/diagnostico.html ./solucao-quiz-estilo/
cp ./solucao-simples/README.txt ./solucao-quiz-estilo/

# Comprimir para download fácil
echo "4. Criando arquivo ZIP para download..."
zip -r solucao-quiz-estilo.zip solucao-quiz-estilo/

echo "✅ Solução completa criada com sucesso!"
echo "Arquivos disponíveis em: ./solucao-quiz-estilo/"
echo "Arquivo ZIP para download: ./solucao-quiz-estilo.zip"
echo ""
echo "INSTRUÇÕES PARA UPLOAD:"
echo "1. Baixe o arquivo solucao-quiz-estilo.zip"
echo "2. Extraia-o localmente"
echo "3. No servidor Hostinger, limpe a pasta public_html/quiz-de-estilo/"
echo "4. Faça upload de todos os arquivos para public_html/quiz-de-estilo/"
echo "5. Verifique o site em: https://giselegalvao.com.br/quiz-de-estilo/"
echo "6. Se necessário, use a página de diagnóstico: https://giselegalvao.com.br/quiz-de-estilo/diagnostico.html"
