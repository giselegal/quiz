INSTRUÇÕES PARA SUBSTITUIR WORDPRESS POR APLICAÇÃO REACT/VITE
============================================================

Esta pasta contém todos os arquivos necessários para substituir
uma instalação do WordPress pelo seu aplicativo React/Vite no
domínio principal giselegalvao.com.br.

PASSO 1: FAZER BACKUP DO WORDPRESS
---------------------------------
1. Faça upload de todos os arquivos desta pasta para a raiz do seu domínio
   (normalmente é a pasta public_html/ no painel da Hostinger)
2. Acesse: https://giselegalvao.com.br/diagnostico.php
3. Clique em "Fazer backup dos arquivos WordPress"
4. Confirme a operação - isso moverá todos os arquivos do WordPress para
   uma pasta de backup

PASSO 2: VERIFICAR ARQUIVOS CRÍTICOS
----------------------------------
1. Verifique se o arquivo .htaccess está presente na raiz
2. Verifique se o index.html está presente na raiz
3. Verifique se a pasta assets/ está presente com todos os arquivos necessários
4. Se necessário, ajuste as permissões usando a ferramenta "Corrigir permissões de arquivos"

PASSO 3: TESTAR O SITE
---------------------
1. Acesse: https://giselegalvao.com.br/
2. Verifique se a aplicação React/Vite carrega corretamente
3. Teste a navegação e funcionalidades

SOLUÇÃO DE PROBLEMAS
-------------------
- Página 404: Verifique se o .htaccess está presente e configurado corretamente
- Página em branco: Verifique o console do navegador por erros
- Recursos não carregam: Verifique os caminhos dos arquivos
- Problemas de permissão: Use a ferramenta de correção de permissões

RECUPERAÇÃO DE EMERGÊNCIA
------------------------
Se algo der errado e você precisar restaurar o WordPress:
1. Acesse seu gerenciador de arquivos da Hostinger
2. Mova os arquivos da pasta wordpress_backup/ de volta para a raiz
