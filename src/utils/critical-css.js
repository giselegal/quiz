/**
 * Utilitário para injetar CSS crítico antes do carregamento completo
 * Isso melhora significativamente o FCP (First Contentful Paint)
 */

// CSS crítico para renderização inicial - apenas o essencial para o LCP
export const initialCriticalCSS = `
body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #FEFEFE;
}
#root {
  min-height: 100vh;
  width: 100%;
}
.quiz-intro-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
}
.quiz-intro-image {
  max-width: 450px;
  height: auto;
  object-fit: contain;
  image-rendering: high-quality;
}
`;

// Injetar CSS crítico no head
export function injectCriticalCSS(css) {
  if (typeof document !== 'undefined') {
    const styleEl = document.createElement('style');
    styleEl.setAttribute('id', 'critical-css');
    styleEl.setAttribute('type', 'text/css');
    styleEl.appendChild(document.createTextNode(css));
    document.head.appendChild(styleEl);
  }
}

// Remover CSS crítico após carregamento completo
export function removeCriticalCSS() {
  if (typeof document !== 'undefined') {
    const styleEl = document.getElementById('critical-css');
    if (styleEl) {
      styleEl.parentNode.removeChild(styleEl);
    }
  }
}
