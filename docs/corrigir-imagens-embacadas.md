# Como corrigir imagens embaçadas no Quiz Sell Genius

Este guia mostra as diferentes formas de resolver o problema das imagens embaçadas na introdução do Quiz Sell Genius.

## Opção 1: Solução automática com `AutoFixedImages`

A forma mais simples de resolver o problema é envolver a seção de introdução com o componente `AutoFixedImages`:

```jsx
import AutoFixedImages from '../components/ui/AutoFixedImages';

// No seu componente QuizIntro.tsx
const QuizIntro = () => {
  return (
    <AutoFixedImages>
      <div className="quiz-intro">
        {/* Conteúdo existente */}
        <img src="..." />
        {/* Mais conteúdo */}
      </div>
    </AutoFixedImages>
  );
};
```

Este componente automaticamente:
1. Detecta todas as imagens dentro do contêiner
2. Substitui as URLs embaçadas por versões de alta qualidade
3. Remove filtros e classes que causam embaçamento

## Opção 2: Botão de correção rápida

Adicione um botão para correção sob demanda:

```jsx
import QuickFixButton from '../components/debug/QuickFixButton';

// Adicione ao final do seu componente
return (
  <>
    {/* Conteúdo normal da página */}
    <QuickFixButton />
  </>
);
```

## Opção 3: Ferramenta de diagnóstico completo (Desenvolvimento)

Para diagnóstico detalhado e correção manual:

```jsx
import ImageDiagnosticFixer from '../components/debug/ImageDiagnosticFixer';

// Adicione ao final do seu componente
return (
  <>
    {/* Conteúdo normal da página */}
    {process.env.NODE_ENV === 'development' && <ImageDiagnosticFixer />}
  </>
);
```

## Opção 4: Correção direta no código

Modifique diretamente o componente OptimizedImage para usar as funções de otimização:

```jsx
import { getHighQualityImageUrl } from '../utils/images/blurry-image-fixer';

// Em OptimizedImage.tsx, no método render ou return
const highQualitySrc = getHighQualityImageUrl(src);

return (
  <img 
    src={highQualitySrc} 
    alt={alt}
    {...props}
  />
);
```

## Opção 5: Ferramenta de linha de comando

No console do navegador, execute:

```javascript
// Importar o utilitário (copiar e colar no console)
const replaceBlurryIntroImages = () => {
  const allImages = document.querySelectorAll('.quiz-intro img, [data-section="intro"] img');
  let count = 0;
  
  allImages.forEach(img => {
    const src = img.src;
    if (src.includes('e_blur') || src.includes('q_50') || src.includes('q_35')) {
      const newSrc = src
        .replace(/,e_blur:\d+/, '')
        .replace(/q_\d+/, 'q_90')
        .replace('/upload/', '/upload/f_auto,');
      
      img.src = newSrc;
      img.style.filter = 'none';
      count++;
    }
  });
  
  console.log(`Corrigidas ${count} imagens de ${allImages.length} total`);
  return count;
};

// Executar a função
replaceBlurryIntroImages();
```

## Identificando problemas de embaçamento

O embaçamento de imagens pode ser causado por diversos fatores:

1. **URLs com parâmetros de blur no Cloudinary**
   - Exemplo: `e_blur:300` na URL

2. **Placeholders de baixa qualidade**
   - Exemplo: URLs com `q_35`, `q_50` ou `w_40`

3. **Filtros CSS aplicados às imagens**
   - Exemplo: `filter: blur(5px)` em CSS

4. **Classes que adicionam embaçamento**
   - Exemplos: `.blur`, `.placeholder`, `.blur-wrapper`

## Solução técnica implementada

As ferramentas implementadas resolvem o problema:

1. Detectando imagens problemáticas através de análise de URLs e CSS
2. Substituindo URLs de baixa qualidade por versões otimizadas
3. Removendo filtros CSS e classes que causam embaçamento
4. Pré-carregando as imagens de alta qualidade para transição suave

## Preferências de configuração

Para imagens críticas na introdução, recomendamos:
- Qualidade: `q_90` ou superior
- Formato: `f_auto` (Cloudinary seleciona o melhor formato)
- Nitidez: `e_sharpen:60` para compensar qualquer compressão
- Remover completamente parâmetros de blur: `e_blur:XXX`
