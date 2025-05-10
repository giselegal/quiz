# Padrões de Carregamento no Projeto

Este documento estabelece os padrões de carregamento usados em todo o projeto para garantir consistência visual e experiência de usuário.

## Componentes Principais

Temos três componentes principais para indicar estados de carregamento:

### 1. `LoadingSpinner`

O componente base para indicar carregamento, com várias opções de personalização:

```tsx
<LoadingSpinner 
  size="md"                 // xs, sm, md, lg, xl
  color="#B89B7A"           // Cor padrão (dourado)
  thickness="normal"        // thin, normal, thick
  showText={true}           // Exibir texto
  text="Carregando..."      // Texto personalizado
/>
```

### 2. `LoadingState`

Um componente de tela cheia para indicar carregamento de páginas inteiras:

```tsx
<LoadingState 
  message="Carregando quiz..."    // Mensagem personalizada
  showLogo={true}                 // Exibir logo
  spinnerSize="lg"                // Tamanho do spinner
  spinnerColor="#B89B7A"          // Cor do spinner
/>
```

### 3. `QuizIntroLoading`

Um componente especializado para o carregamento da introdução do quiz:

```tsx
<QuizIntroLoading />
```

## `LoadingManager`

O componente gerenciador que pode usar qualquer um dos estados de carregamento:

```tsx
<LoadingManager 
  isLoading={isLoading}
  useQuizIntroLoading={true}      // Para usar o QuizIntroLoading
  message="Preparando sua experiência..."
>
  {children}
</LoadingManager>
```

## Práticas Recomendadas

1. **Evite implementar spinners personalizados**. Sempre use `LoadingSpinner` ou `LoadingState`.

2. **Evite duplicar indicadores de carregamento**. Um único spinner é suficiente para indicar carregamento, não use múltiplos indicadores em sequência.

3. **Para botões com carregamento**, use o spinner dentro do botão:
   ```tsx
   <Button disabled={isLoading}>
      {isLoading ? (
         <> 
           <LoadingSpinner size="xs" color="#FFFFFF" />
           <span className="ml-2">Processando...</span>
         </>
      ) : "Enviar"}
   </Button>
   ```

4. **Para carregamento assíncrono**, use o `Suspense` com o LoadingSpinner:
   ```tsx
   <Suspense fallback={<LoadingSpinner size="md" />}>
      <AsyncComponent />
   </Suspense>
   ```

5. **Para páginas com muitos conteúdos**, considere usar o `ResultSkeleton` ao invés de um spinner simples:
   ```tsx
   {isLoading ? <ResultSkeleton primaryStyle={primaryStyle} /> : <ActualContent />}
   ```

## Cores Padronizadas

- Spinner padrão: `#B89B7A` (dourado)
- Spinner em fundos escuros: `#FFFFFF` (branco)
- Spinner em contextos específicos: cores contextuais (ex: `#3b82f6` para azul)

## Tamanhos Padronizados

- Botões: `xs` ou `sm`
- Componentes: `md`
- Páginas inteiras: `lg`
- Elementos de destaque: `xl`
