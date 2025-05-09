# Instruções para Implantação na Hostinger

Este documento contém instruções passo a passo para implantar corretamente o aplicativo quiz na Hostinger, garantindo que todos os problemas de MIME type, carregamento de scripts e imagens borradas sejam resolvidos.

## Domínios e Rotas

O site irá operar sob o domínio principal **giselegalvao.com.br** com as seguintes rotas importantes que formam o funil de vendas:

1. **Página Inicial e Quiz**: https://giselegalvao.com.br/
2. **Página de Resultados-Funil 1**: https://giselegalvao.com.br/resultado
3. **Página de Venda-Funil 2**: https://giselegalvao.com.br/quiz-descubra-seu-estilo

## Preparação para o Build

1. Antes de fazer o build, certifique-se de que está usando a versão mais recente do Node.js:
   ```bash
   node -v # Recomendado: v18.x ou superior
   ```

2. Instale todas as dependências:
   ```bash
   npm install
   ```

3. Execute o build específico para a Hostinger:
   ```bash
   npm run build:hostinger
   ```

## Implantação na Hostinger

### Método 1: Upload via Painel da Hostinger

1. Acesse o painel de controle da Hostinger
2. Navegue até o Gerenciador de Arquivos
3. Navegue até a pasta raiz do seu domínio (geralmente `public_html`)
4. Faça upload de todo o conteúdo da pasta `dist` (gerada pelo build)
5. Certifique-se de que o arquivo `.htaccess` foi transferido corretamente
   - Se não estiver presente, faça upload manual do arquivo `htaccess-final.txt` e renomeie para `.htaccess`

### Método 2: Upload via FTP/SFTP

1. Use um cliente FTP como FileZilla ou similar
2. Conecte ao seu servidor usando as credenciais fornecidas pela Hostinger
3. Navegue até a pasta raiz do seu domínio (`public_html`)
4. Faça upload de todo o conteúdo da pasta `dist`
5. Certifique-se de que o arquivo `.htaccess` foi transferido corretamente

## Verificações Pós-Implantação

Depois de concluir o upload, verifique se:

1. A página inicial carrega corretamente (sem tela branca)
2. As imagens aparecem nítidas (não borradas)
3. A navegação entre diferentes seções do quiz funciona
4. O Facebook Pixel está registrando eventos corretamente

## Solução de Problemas Comuns

### Problema 1: Tela Branca / JS não carrega

Se você enfrentar uma tela branca, verifique:

1. Abra o console do navegador (F12) e procure por erros
2. Verifique se o arquivo `.htaccess` está presente e tem as configurações corretas
3. Verifique se os caminhos nos scripts estão corretos (devem ser relativos, não absolutos)

### Problema 2: Imagens Borradas

Se as imagens continuarem borradas:

1. Teste manualmente a função `fixBlurryIntroQuizImages()` no console do navegador
2. Verifique se os parâmetros de qualidade do Cloudinary estão sendo aplicados corretamente

### Problema 3: Problemas de MIME Type

Se você vir erros de MIME type no console:

1. Verifique se o `.htaccess` está configurado corretamente
2. Tente adicionar explicitamente o cabeçalho Content-Type para arquivos JavaScript:
   ```apache
   <FilesMatch "\.(js|jsx|mjs)$">
       Header set Content-Type "application/javascript; charset=UTF-8"
   </FilesMatch>
   ```

## Observações Finais

- Sempre faça backup dos arquivos antes de substituí-los
- Considere implementar um ambiente de staging para testar antes de ir para produção
- Monitore os logs de erro do servidor após a implantação para identificar problemas
