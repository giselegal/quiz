# Guia de Resolução de Problemas - Hostinger

Este guia fornece soluções para problemas comuns que podem ocorrer ao hospedar o Quiz da Gisele Galvão na Hostinger.

## Rotas Principais do Site

O site utiliza as seguintes rotas principais que formam o funil de vendas:

1. **Página Inicial e Quiz**: https://giselegalvao.com.br/
2. **Página de Resultados-Funil 1**: https://giselegalvao.com.br/resultado
3. **Página de Venda-Funil 2**: https://giselegalvao.com.br/quiz-descubra-seu-estilo

Caso alguma dessas rotas não esteja funcionando, veja as soluções abaixo.

## Problema 1: Tela Branca / Aplicativo Não Carrega

### Sintomas:
- Tela completamente branca
- Console do navegador mostra erros relacionados ao carregamento de scripts
- Erros de MIME type ("Refused to execute script... because its MIME type...")

### Soluções:

#### Solução 1: Verificar o arquivo .htaccess
1. Acesse o Gerenciador de Arquivos da Hostinger
2. Certifique-se de que existe um arquivo `.htaccess` na raiz do site
3. Se não existir, crie um novo arquivo com o conteúdo do `htaccess-final.txt`
4. Se existir, verifique se ele contém as configurações de MIME type:

```apache
# Definir tipos MIME corretos
<IfModule mod_mime.c>
    AddType application/javascript .js
    AddType application/javascript .jsx
    AddType application/javascript .mjs
</IfModule>

# Cabeçalhos específicos para JavaScript
<FilesMatch "\.(js|jsx|mjs)$">
    Header set Content-Type "application/javascript; charset=UTF-8"
</FilesMatch>
```

#### Solução 2: Verificar os caminhos dos scripts no index.html
1. Abra o arquivo `index.html`
2. Certifique-se de que o caminho do script usa caminho relativo com `./`:

```html
<script src="./src/main.jsx" defer></script>
```

#### Solução 3: Rebuild e redeploy
1. Execute `npm run build:hostinger` na sua máquina local
2. Faça upload novamente dos arquivos gerados na pasta `dist`

## Problema 2: Imagens Borradas

### Sintomas:
- Imagens parecem pixeladas ou de baixa qualidade
- Imagens demoram para carregar na melhor qualidade

### Soluções:

#### Solução 1: Forçar otimização manual
1. Abra o console do navegador (F12) na página do site
2. Execute o comando: `window.fixBlurryIntroQuizImages()`
3. Verifique se as imagens foram corrigidas

#### Solução 2: Verificar parâmetros do Cloudinary
1. Abra as imagens problemáticas no navegador
2. Verifique se a URL contém os parâmetros de alta qualidade (`q_99`, `e_sharpen:80`)
3. Se não contiverem, modifique manualmente as URLs das imagens no código

## Problema 3: Problemas de Roteamento / Erro 404

### Sintomas:
- As páginas funcionam ao acessar diretamente a página inicial
- Ao atualizar ou acessar uma rota diretamente, aparece erro 404

### Soluções:

#### Solução 1: Verificar regras de reescrita no .htaccess
1. Certifique-se de que o arquivo `.htaccess` contém as regras de reescrita para SPA:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.html [L,QSA]
</IfModule>
```

#### Solução 2: Verificar configurações do servidor na Hostinger
1. Acesse o painel da Hostinger
2. Verifique se o modo de reescrita (mod_rewrite) está habilitado
3. Se possível, verifique os logs de erro do Apache para diagnóstico adicional

## Problema 4: Erros de JavaScript no Console

### Sintomas:
- O console mostra erros JavaScript
- Funcionalidades específicas não funcionam corretamente

### Soluções:

#### Solução 1: Verificar compatibilidade do navegador
1. Teste o site em diferentes navegadores (Chrome, Firefox, Edge)
2. Verifique se o erro ocorre em todos os navegadores ou apenas em alguns

#### Solução 2: Diagnosticar problemas específicos
1. Abra o console do navegador e execute: `window.checkSiteHealth()`
2. Analise o relatório de saúde para identificar áreas problemáticas

## Problema 5: Lentidão no Carregamento

### Sintomas:
- O site demora muito para carregar inicialmente
- Elementos visuais aparecem com atraso

### Soluções:

#### Solução 1: Ativar compressão GZIP/Brotli
1. Verifique se o arquivo `.htaccess` contém as configurações de compressão:

```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/css application/javascript application/json image/svg+xml
</IfModule>
```

#### Solução 2: Verificar configurações de cache
1. Verifique se o arquivo `.htaccess` contém as configurações de cache:

```apache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType text/css "access plus 1 week"
    ExpiresByType application/javascript "access plus 1 week"
</IfModule>
```

## Executar Verificação de Saúde do Site

Para uma verificação completa da saúde do site:

1. Acesse o site no navegador
2. Abra o console do desenvolvedor (F12)
3. Execute o comando: `window.checkSiteHealth()`
4. Analise os resultados para identificar problemas específicos

## Contato para Suporte Técnico

Se nenhuma das soluções acima resolver o problema, entre em contato com:

- Email: suporte@giselegalvao.com.br
- Desenvolvedor: suporte@lovabletech.com
