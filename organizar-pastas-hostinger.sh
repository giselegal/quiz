#!/bin/bash
# Script para gerar instruções específicas sobre a organização de pastas na Hostinger

echo "Instruções para Organizar Corretamente as Pastas na Hostinger"
echo "-------------------------------------------------------"
echo
echo "ESTRUTURA CORRETA:"
echo "public_html/                        # Raiz do servidor da Hostinger"
echo "  └── quiz-de-estilo/               # Seu site (URL: giselegalvao.com.br/quiz-de-estilo/)"
echo "      ├── index.html                # Página inicial"
echo "      ├── .htaccess                 # Configurações do Apache"
echo "      ├── sw.js                     # Service Worker"
echo "      ├── assets/                   # Pasta de assets"
echo "      │   ├── index-[hash].js       # JavaScript principal"
echo "      │   └── index-[hash].css      # CSS principal"
echo "      └── ... (outros arquivos)     # Demais arquivos do site"
echo
echo "ESTRUTURAS INCORRETAS (PROBLEMAS):"
echo "1. public_html/public_html/quiz-de-estilo/           # public_html duplicado"
echo "2. public_html/quiz-de-estilo/public_html/           # public_html dentro do quiz"
echo "3. public_html/quiz-de-estilo/assets/assets/assets/  # assets duplicados"
echo
echo "COMO VERIFICAR E CORRIGIR:"
echo
echo "1. Verificar a estrutura atual:"
echo "   - Acesse o Gerenciador de Arquivos da Hostinger"
echo "   - Navegue até 'public_html/'"
echo "   - Confira se existem pastas duplicadas"
echo
echo "2. Corrigir manualmente:"
echo "   - Se encontrar estrutura incorreta:"
echo "     a. Faça backup dos arquivos importantes"
echo "     b. Mova todos os arquivos para 'public_html/quiz-de-estilo/'"
echo "     c. Exclua as pastas redundantes"
echo
echo "3. Corrigir via FTP (recomendado para limpeza completa):"
echo "   - Conecte-se via FTP (FileZilla ou similar)"
echo "   - Navegue até 'public_html/'"
echo "   - Se necessário, exclua completamente a pasta 'quiz-de-estilo'"
echo "   - Crie uma nova pasta 'quiz-de-estilo'"
echo "   - Faça upload dos arquivos da pasta 'dist/' para 'quiz-de-estilo/'"
echo
echo "4. Verificar o arquivo .htaccess:"
echo "   - Certifique-se que está em 'public_html/quiz-de-estilo/.htaccess'"
echo "   - Deve conter: RewriteBase /quiz-de-estilo/"
echo
echo "5. Testar o site:"
echo "   - Acesse: https://giselegalvao.com.br/quiz-de-estilo/"
echo "   - Navegue pelo site para verificar se está funcionando corretamente"
echo "   - Confirme que 'public_html' não aparece na URL"
echo 
echo "Se você precisar de um build pronto para upload, execute:"
echo "npm run build && echo 'Arquivos prontos na pasta dist/'"
