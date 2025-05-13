# Instruções para Substituir WordPress por React/Vite no Domínio Raiz

Elaboramos uma solução completa para substituir a instalação WordPress atual pelo aplicativo React/Vite no domínio principal (giselegalvao.com.br). Este guia irá orientá-lo pelos passos do processo.

## Pré-requisitos

- Acesso ao painel de controle da Hostinger
- O arquivo `solucao-raiz-dominio.zip` que foi gerado pelo script

## Passos para Implementação

### 1. Baixar o Pacote de Solução

Faça o download do arquivo `solucao-raiz-dominio.zip` do ambiente de desenvolvimento para seu computador local.

### 2. Acessar o Gerenciador de Arquivos da Hostinger

1. Faça login no painel da Hostinger
2. Vá para "Gerenciador de Arquivos" ou "File Manager"
3. Navegue até a pasta `public_html/` (esta é a raiz do seu domínio)

### 3. Fazer Upload da Solução

1. **IMPORTANTE: Antes de começar, faça um backup do site atual**
   - No Gerenciador de Arquivos, você pode selecionar todos os arquivos e pastas
   - Use a função "Compactar" ou "Zip" para criar um backup
   - Faça o download desse arquivo para seu computador como segurança

2. **Fazer upload dos arquivos de diagnóstico primeiro:**
   - Faça upload apenas dos arquivos `diagnostico.php`, `backup-wordpress.php` e `fix-permissions.php` para a raiz
   - Isso permitirá que você use essas ferramentas para preparar a migração de forma segura

### 4. Remover WordPress e Preparar para o React

1. Acesse `https://giselegalvao.com.br/diagnostico.php` no seu navegador
2. Verifique as informações exibidas para confirmar que tudo está funcionando corretamente
3. Clique no link "Fazer backup dos arquivos WordPress"
4. Confirme a operação quando solicitado
   - Isso moverá todos os arquivos do WordPress para uma pasta de backup chamada `wordpress_backup`
   - Se algo der errado, os arquivos estarão seguros nessa pasta

### 5. Fazer Upload do Aplicativo React

1. Volte para o Gerenciador de Arquivos da Hostinger
2. Extraia o arquivo `solucao-raiz-dominio.zip` em seu computador
3. Faça upload de **todos** os arquivos e pastas da solução extraída para a raiz (`public_html/`)
   - Certifique-se de que o arquivo `.htaccess` também seja enviado (é um arquivo oculto)
   - Você pode selecionar todos os arquivos e fazer upload de uma vez

### 6. Verificar as Permissões de Arquivos

1. Acesse novamente `https://giselegalvao.com.br/diagnostico.php`
2. Se necessário, clique em "Corrigir permissões de arquivos"
   - Isso ajustará as permissões para os valores corretos: 755 para diretórios e 644 para arquivos

### 7. Testar o Site

1. Acesse `https://giselegalvao.com.br/` no navegador
2. Verifique se o aplicativo React está carregando corretamente
3. Teste a navegação e todas as funcionalidades para garantir que tudo está funcionando

## Solução de Problemas

### Se a página estiver em branco ou mostrando erro 404:
- Verifique se o arquivo `.htaccess` está presente na raiz
- Confirme que o arquivo `index.html` está na raiz (não em uma subpasta)
- Verifique o console do navegador (F12) para ver mensagens de erro

### Se os recursos (imagens, CSS, JS) não estiverem carregando:
- Verifique as permissões dos arquivos usando a ferramenta de diagnóstico
- Confira se a pasta `assets/` foi transferida corretamente

### Se precisar restaurar o WordPress:
1. Acesse o Gerenciador de Arquivos da Hostinger
2. Renomeie/remova os arquivos do React
3. Mova os arquivos da pasta `wordpress_backup/` de volta para a raiz

## Considerações Adicionais

- O subdiretório `/quiz-de-estilo/` deve continuar funcionando normalmente, pois não foi modificado
- Se você utiliza e-mails ou outros serviços associados ao domínio, eles não serão afetados por esta mudança
- Se encontrar qualquer problema que não consiga resolver, use o backup feito no início para restaurar o site

---

Esta solução foi projetada para ser à prova de falhas e permitir uma fácil reversão caso necessário. O script de backup do WordPress mantém uma cópia de todos os arquivos originais no servidor.
