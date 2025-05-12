INSTRUÇÕES PARA CORREÇÃO DO QUIZ DE ESTILO
==========================================

Este é um conjunto de arquivos para corrigir os problemas de deploy no Quiz de Estilo.

PASSO 1: LIMPAR A ESTRUTURA EXISTENTE
-------------------------------------
1. Acesse o painel da Hostinger e vá para o Gerenciador de Arquivos
2. Navegue até public_html/
3. IMPORTANTE: Faça backup do conteúdo atual se necessário
4. Exclua completamente a pasta quiz-de-estilo/ (para evitar estruturas aninhadas)

PASSO 2: CRIAR NOVA ESTRUTURA CORRETA
------------------------------------
1. Crie uma nova pasta vazia chamada quiz-de-estilo dentro de public_html/
2. A estrutura deve ser: public_html/quiz-de-estilo/

PASSO 3: UPLOAD DOS ARQUIVOS DO SITE
-----------------------------------
1. Faça upload do conteúdo da pasta dist/ para public_html/quiz-de-estilo/
2. Adicione o arquivo .htaccess deste pacote para substituir o existente
3. Certifique-se de que o Service Worker (sw.js) está na raiz da pasta quiz-de-estilo

PASSO 4: VERIFICAR ESTRUTURA FINAL
---------------------------------
A estrutura final deve ser:
- public_html/quiz-de-estilo/index.html
- public_html/quiz-de-estilo/.htaccess (o deste pacote)
- public_html/quiz-de-estilo/sw.js
- public_html/quiz-de-estilo/assets/...

PASSO 5: TESTAR O SITE
---------------------
Acesse: https://giselegalvao.com.br/quiz-de-estilo/

Se encontrar problemas:
1. Limpe o cache do navegador (Ctrl+F5 ou Cmd+Shift+R)
2. Verifique o console do navegador para identificar erros específicos
3. Verifique se todos os arquivos foram carregados corretamente
