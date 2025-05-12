#!/bin/bash
# Script para verificar o problema de caminhos duplicados no FTP

echo "Preparando para verificar e corrigir o problema de caminhos duplicados no FTP"

# Criar uma estrutura de teste simples
mkdir -p test_deploy
echo "Arquivo de teste para verificar caminho correto no FTP" > test_deploy/test.txt

# Instruções de uso para o comando FTP
cat > ftp_instructions.txt << 'EOF'
INSTRUÇÕES PARA VERIFICAR E CORRIGIR O CAMINHO NO FTP

Problema identificado:
O erro 550 assets/select-C8eWUhup.js: Temporary hidden file /giselegalvao.com.br/public_html/public_html/assets/assets/assets/assets/assets/.in.select-C8eWUhup.js
indica múltiplas pastas "public_html" e "assets" aninhadas.

Para verificar e corrigir manualmente via FTP:

1. Conecte-se ao FTP da Hostinger:
   - Use um cliente FTP como FileZilla
   - Host: ftp.giselegalvao.com.br
   - Usuário: u116045488.giselegalvao
   - Senha: [sua senha FTP]

2. Navegue para encontrar a estrutura real:
   - Verifique se existe: /public_html/public_html/quiz-de-estilo/
   - Ou: /public_html/quiz-de-estilo/public_html/
   - Ou: /public_html/quiz-de-estilo/assets/assets/assets/...

3. Corrija a estrutura:
   a. Todos os arquivos devem estar em: /public_html/quiz-de-estilo/
   b. Não deve haver pastas "public_html" ou "assets" aninhadas/duplicadas

4. Para futuros deploys:
   - Use o novo workflow "corrected-path-deploy.yml"
   - Este workflow tem o caminho correto para deploy:
     server-dir: /public_html/quiz-de-estilo/

5. Se não conseguir corrigir via FTP:
   - Pode ser necessário entrar em contato com o suporte da Hostinger
   - Solicite ajuda para remover pastas duplicadas ou recriar a estrutura
EOF

echo "Instruções de verificação do FTP criadas em: ftp_instructions.txt"
echo ""
echo "Recomendação:"
echo "Execute o deploy com o novo workflow 'corrected-path-deploy.yml'"
echo "Este workflow usa o caminho de servidor corrigido:"
echo "  server-dir: /public_html/quiz-de-estilo/"
echo ""
echo "Isso deve evitar a criação de caminhos duplicados como:"
echo "  /giselegalvao.com.br/public_html/public_html/assets/assets/..."
