# Guia de Integração e Atualização do Lovable

Este guia fornece instruções detalhadas para a atualização e integração do Lovable com o projeto Quiz Sell Genius.

## Passo 1: Compreender o Lovable

O Lovable é uma plataforma que permite a edição remota de componentes React diretamente pelo seu CMS. No nosso projeto, configuramos os seguintes componentes para serem editáveis:

- `QuizCover.lovable.tsx` - Componente da capa do quiz
- `QuizQuestion.lovable.tsx` - Componente de perguntas do quiz
- `QuizLogic.lovable.tsx` - Componente com a lógica do quiz
- `ResultPageEditor.lovable.tsx` - Componente da página de resultados

## Passo 2: Requisitos para o Lovable Funcionar Corretamente

1. **Marcação de Componentes**: Cada componente editável deve ter o comentário `// @lovable` na primeira linha.
2. **Arquivos de Configuração**:
   - `lovable.config.js` - Define caminhos e configurações para o Lovable
   - `lovable.ts` - Define interfaces e tipos para os componentes Lovable
3. **Configuração do Vite**: O arquivo `vite.config.ts` deve permitir conexões do Lovable Studio, incluindo CORS e domínios permitidos.
4. **Estrutura de Diretórios**:
   - `src/components/lovable/` - Para componentes editáveis
   - `public/lovable-uploads/` - Para armazenamento de mídia

## Passo 3: Processo de Atualização

Para atualizar o Lovable, execute o script de atualização remota:

```bash
bash atualizacao-remota-com-lovable.sh
```

Este script executará automaticamente:

1. Atualização das dependências
2. Correção da integração com o Lovable
3. Marcação dos componentes
4. Reinício da integração
5. Build do projeto
6. Otimização do desempenho
7. Deploy (via GitHub, opcional)

## Passo 4: Verificação da Integração

Após a atualização, verifique se:

1. Todos os componentes estão marcados com `// @lovable`
2. A configuração do Lovable está correta no `lovable.config.js`
3. O servidor Vite está configurado para permitir conexões do domínio Lovable
4. As pastas de componentes e uploads existem

## Passo 5: Acessando o Lovable Studio

1. Acesse o [Lovable Studio](https://studio.lovable.dev/)
2. Faça login com suas credenciais
3. Selecione o projeto "Quiz Sell Genius"
4. Você deve ver os componentes disponíveis para edição

## Solução de Problemas

Se encontrar problemas com a integração do Lovable:

1. **Componentes não aparecem no Studio**:
   - Verifique se eles estão marcados com `// @lovable`
   - Confirme se estão no diretório correto
   - Reinicie a integração: `bash restart-lovable.sh`

2. **Erros de CORS**:
   - Verifique a configuração CORS no `vite.config.ts`
   - Confirme se o domínio do Lovable está na lista de `allowedHosts`

3. **Mudanças não aparecem no site**:
   - Certifique-se de ter feito o deploy após as alterações
   - Verifique se o cache do navegador foi limpo

## Comandos Úteis

- `node mark-lovable-updated.cjs` - Marca os componentes com `// @lovable`
- `bash restart-lovable.sh` - Reinicia a integração com o Lovable
- `bash fix-lovable-integration.sh` - Corrige problemas comuns da integração
