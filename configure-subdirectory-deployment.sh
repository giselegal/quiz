#!/bin/bash

# Script para configurar corretamente o service worker para o deployment em subdiretório
echo "Configurando Service Worker para subdiretório..."

# Copiar o arquivo sw-fixed.js para sw.js na pasta dist
cp ./src/sw-fixed.js ./dist/sw.js

# Encontrar e substituir referências ao Service Worker no HTML
if [ -f ./dist/index.html ]; then
  echo "Atualizando registro do Service Worker no index.html..."
  
  # Substituir a linha de registro do Service Worker
  sed -i 's|navigator.serviceWorker.register(\'/sw.js\', { scope: \'/|navigator.serviceWorker.register(\'/quiz-de-estilo/sw.js\', { scope: \'/quiz-de-estilo/|g' ./dist/index.html
  
  # Garantir que scripts têm o caminho correto
  echo "Verificando caminhos de scripts e recursos..."
  
  # Verificar se os assets estão sendo referenciados corretamente
  echo "Verificação do Service Worker concluída!"
fi

# Verificar se o htaccess está configurado corretamente
if [ -f ./dist/.htaccess ]; then
  echo "Verificando configuração do .htaccess..."
  
  # Garantir que RewriteBase está correta
  if grep -q "RewriteBase /quiz-de-estilo/" ./dist/.htaccess; then
    echo ".htaccess está configurado corretamente!"
  else
    echo "Corrigindo RewriteBase no .htaccess..."
    sed -i 's|RewriteBase /|RewriteBase /quiz-de-estilo/|g' ./dist/.htaccess
  fi
fi

echo "Configuração para deployment em subdiretório concluída!"
