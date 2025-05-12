# Guia para o Deploy pelo GitHub

Este guia explica como configurar e usar o deploy automático para a Hostinger diretamente pelo GitHub.

## 1. Preparação inicial

Você deve ter:
- Uma conta no GitHub
- O projeto já hospedado no GitHub
- Acesso ao painel de controle da Hostinger

## 2. Configurar os segredos no GitHub

1. Vá até o repositório do seu projeto no GitHub
2. Clique em "Settings" (Configurações)
3. No menu lateral, clique em "Secrets and variables" e depois em "Actions"
4. Clique em "New repository secret" para adicionar um novo segredo

Adicione os seguintes segredos:

| Nome | Valor |
|------|-------|
| `FTP_SERVER` | Servidor FTP da Hostinger (geralmente `giselegalvao.com.br` ou outro nome fornecido pela Hostinger) |
| `FTP_USERNAME` | Nome de usuário FTP (geralmente começa com `u123456789` ou similar) |
| `FTP_PASSWORD` | Senha do seu FTP |

## 3. Como obter as credenciais FTP

1. Faça login no painel da Hostinger
2. Vá para "Hospedagem de Sites" > seu domínio
3. Na seção "Avançado", clique em "Acesso FTP"
4. Anote o "Servidor FTP", "Nome de usuário" e "Senha" (ou crie uma nova senha se necessário)

## 4. Como fazer um deploy

O deploy será feito automaticamente quando você enviar alterações para a branch principal do seu repositório. Siga estes passos:

1. Faça as alterações necessárias no código
2. Adicione os arquivos modificados: `git add .`
3. Faça um commit: `git commit -m "Sua mensagem aqui"`
4. Envie para o GitHub: `git push origin main`

O GitHub Actions começará automaticamente o processo de deploy. Você pode acompanhar o progresso na aba "Actions" do seu repositório.

## 5. Verificação após o deploy

Depois que o deploy for concluído:

1. Acesse https://giselegalvao.com.br/quiz-de-estilo/
2. Verifique se o site está funcionando corretamente
3. Se houver problemas, verifique a página de diagnóstico em https://giselegalvao.com.br/quiz-de-estilo/diagnostico.html

## 6. Solução de problemas

Se encontrar problemas durante o deploy:

1. Verifique os logs na aba "Actions" do GitHub
2. Certifique-se de que as credenciais FTP estão corretas
3. Confira se a estrutura de pastas no servidor está correta (deve ser `/public_html/quiz-de-estilo/`)

## 7. Deploy manual

Se precisar fazer um deploy manual:

1. No GitHub, vá para a aba "Actions"
2. No menu lateral, clique em "Deploy to Hostinger"
3. Clique no botão "Run workflow"
4. Selecione a branch e clique em "Run workflow"
