#!/bin/bash
# Verifica e corrige rapidamente todos os caminhos para remover 'public_html' da URL

echo "Iniciando verificação rápida e correção de caminhos..."

# 1. Corrigir .htaccess
echo "1. Verificando .htaccess..."
if [ -f "./dist/.htaccess" ]; then
  if grep -q "RewriteBase /quiz-de-estilo/public_html" "./dist/.htaccess"; then
    echo "  - Corrigindo RewriteBase no .htaccess..."
    sed -i 's|RewriteBase /quiz-de-estilo/public_html/|RewriteBase /quiz-de-estilo/|g' "./dist/.htaccess"
  elif grep -q "RewriteBase /public_html/quiz-de-estilo" "./dist/.htaccess"; then
    echo "  - Corrigindo RewriteBase no .htaccess..."
    sed -i 's|RewriteBase /public_html/quiz-de-estilo/|RewriteBase /quiz-de-estilo/|g' "./dist/.htaccess"
  else
    echo "  - RewriteBase no .htaccess está correto!"
  fi
else
  echo "  - Arquivo .htaccess não encontrado!"
fi

# 2. Corrigir Service Worker
echo "2. Verificando Service Worker..."
if [ -f "./dist/sw.js" ]; then
  if grep -q "/public_html/quiz-de-estilo/" "./dist/sw.js" || grep -q "/quiz-de-estilo/public_html/" "./dist/sw.js"; then
    echo "  - Corrigindo caminhos no Service Worker..."
    sed -i 's|/public_html/quiz-de-estilo/|/quiz-de-estilo/|g' "./dist/sw.js"
    sed -i 's|/quiz-de-estilo/public_html/|/quiz-de-estilo/|g' "./dist/sw.js"
  else
    echo "  - Caminhos no Service Worker estão corretos!"
  fi
else
  echo "  - Arquivo Service Worker não encontrado!"
fi

# 3. Corrigir registro do Service Worker no HTML
echo "3. Verificando registro do Service Worker no HTML..."
if [ -f "./dist/index.html" ]; then
  if grep -q "register('/public_html/quiz-de-estilo/" "./dist/index.html" || grep -q "register('/quiz-de-estilo/public_html/" "./dist/index.html"; then
    echo "  - Corrigindo registro do Service Worker no HTML..."
    sed -i "s|register('/public_html/quiz-de-estilo/|register('/quiz-de-estilo/|g" "./dist/index.html"
    sed -i "s|register('/quiz-de-estilo/public_html/|register('/quiz-de-estilo/|g" "./dist/index.html"
    sed -i "s|scope: '/public_html/quiz-de-estilo/|scope: '/quiz-de-estilo/|g" "./dist/index.html"
    sed -i "s|scope: '/quiz-de-estilo/public_html/|scope: '/quiz-de-estilo/|g" "./dist/index.html"
  else
    echo "  - Registro do Service Worker no HTML está correto!"
  fi
else
  echo "  - Arquivo index.html não encontrado!"
fi

# 4. Gerar instruções para a Hostinger
echo "4. Gerando instruções para a Hostinger..."
cat > "hostinger-corrija-public-html.txt" << 'EOF'
INSTRUÇÕES PARA REMOVER "public_html" DA URL DO SITE

PROBLEMA:
- O site está mostrando "public_html" na URL, exemplo:
  https://giselegalvao.com.br/public_html/quiz-de-estilo/ ou
  https://giselegalvao.com.br/quiz-de-estilo/public_html/

SOLUÇÃO:
1. Acesse o Painel de Controle da Hostinger
2. Vá para o Gerenciador de Arquivos
3. Confirme que os arquivos estão na estrutura correta:
   public_html/quiz-de-estilo/    ← Aqui devem estar os arquivos do site
   
4. Se encontrar uma estrutura como esta:
   public_html/quiz-de-estilo/public_html/   ← Estrutura errada com pasta redundante
   
   Faça o seguinte:
   a. Selecione todos os arquivos de public_html/quiz-de-estilo/public_html/
   b. Mova-os para public_html/quiz-de-estilo/
   c. Exclua a pasta vazia public_html/quiz-de-estilo/public_html/
   
5. Verifique o arquivo .htaccess:
   - Deve estar na pasta public_html/quiz-de-estilo/
   - Deve conter a linha: RewriteBase /quiz-de-estilo/
   - NÃO deve conter: RewriteBase /quiz-de-estilo/public_html/ ou similar
   
6. Verifique as configurações de Redirecionamento:
   - Vá para Hospedagem > Extras > Redirecionamentos
   - Remova ou corrija qualquer redirecionamento que inclua "public_html"
   
7. Teste o site:
   - Acesse https://giselegalvao.com.br/quiz-de-estilo/
   - Navegue pelo site para confirmar que "public_html" não aparece mais na URL
EOF

echo "5. Verificação completa!"
echo "   As instruções para a Hostinger estão no arquivo: hostinger-corrija-public-html.txt"
