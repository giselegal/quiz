# Instruções para a Integração com o Lovable

O projeto Quiz Sell Genius foi atualizado para permitir a edição remota de componentes através do Lovable Studio. Abaixo estão as instruções para conectar e usar o Lovable.

## Configuração Concluída

✅ **Componentes Lovable**: Os seguintes componentes foram marcados com `// @lovable` e estão prontos para edição remota:

- `QuizCover.lovable.tsx` - Componente da capa do quiz
- `QuizQuestion.lovable.tsx` - Componente de perguntas do quiz
- `QuizLogic.lovable.tsx` - Componente com a lógica do quiz
- `ResultPageEditor.lovable.tsx` - Componente da página de resultados

✅ **Configuração do Vite**: O arquivo `vite.config.ts` foi configurado para permitir conexões do Lovable Studio através do domínio:
- `a10d1b34-b5d4-426b-8c97-45f125d03ec1.lovableproject.com`

✅ **Estrutura de Diretórios**: Os diretórios necessários foram criados:
- `src/components/lovable/` - Para os componentes editáveis
- `public/lovable-uploads/` - Para armazenar uploads de mídia

## Como Usar o Lovable

### 1. Iniciando o Servidor de Desenvolvimento

Para permitir a conexão do Lovable Studio, inicie o servidor de desenvolvimento:

```bash
npm run dev
```

### 2. Conectando ao Lovable Studio

Acesse o [Lovable Studio](https://studio.lovable.dev) e configure seu projeto para se conectar ao endereço:

```
http://localhost:8080
```

### 3. Editando Componentes

No Lovable Studio, você poderá:
- Editar textos, cores e imagens dos componentes
- Visualizar as alterações em tempo real
- Publicar as alterações para o seu repositório

### 4. Publicando Alterações

Para publicar suas alterações:
1. Clique no botão "Publish" no Lovable Studio
2. O Lovable fará push das mudanças para o repositório GitHub
3. O GitHub Actions será acionado para fazer deploy das alterações

## Solução de Problemas

Se encontrar problemas na conexão:

1. Verifique se o servidor de desenvolvimento está rodando (`npm run dev`)
2. Confirme se o firewall permite conexões nas portas usadas (porta 8080)
3. Verifique se as permissões CORS estão configuradas corretamente
4. Confirme que os componentes estão marcados com `// @lovable`

## Manutenção

Para garantir que a integração continue funcionando após atualizações:

1. Mantenha a tag `// @lovable` nos componentes que deseja editar remotamente
2. Não remova as configurações CORS do `vite.config.ts`
3. Execute `bash verify-lovable.sh` periodicamente para verificar a configuração
