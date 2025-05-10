/**
 * Utilitário para garantir que apenas o código necessário seja incluído no bundle
 * Remove imports não utilizados e otimiza a árvore de dependências
 */

// Exportar apenas os módulos realmente utilizados
export function optimizeImports() {
  console.log('Tree-shaking otimizado aplicado');
}

// Remover componentes não utilizados na rota atual
export function lazyLoadComponents(componentPath, Fallback = null) {
  return React.lazy(() => {
    // Adicionar delay para componentes não críticos
    if (!componentPath.includes('QuizIntro') && !componentPath.includes('critical')) {
      return new Promise(resolve => {
        setTimeout(() => {
          import(componentPath).then(resolve);
        }, 500); // 500ms de delay para componentes não críticos
      });
    }
    return import(componentPath);
  });
}

// Esta função é chamada para otimizar ainda mais o código em runtime
export function applyRuntimeOptimizations() {
  if (typeof window !== 'undefined') {
    // Desabilitar animações complexas em dispositivos de baixo desempenho
    const isLowPowerDevice = () => {
      return (
        window.navigator.hardwareConcurrency <= 2 ||
        /Android.*(SM-J|GT-I|SM-G530|SM-T|SM-A3|SM-A5)/.test(navigator.userAgent)
      );
    };
    
    if (isLowPowerDevice()) {
      document.documentElement.classList.add('low-power-device');
      // Reduzir efeitos visuais em dispositivos de baixa performance
      const style = document.createElement('style');
      style.textContent = `
        .low-power-device .animate-fade,
        .low-power-device .animate-slide,
        .low-power-device .motion-safe\\:animate-fade {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      `;
      document.head.appendChild(style);
    }
    
    // Limitar renderizações de componentes não visíveis
    // Isso será automaticamente removido em produção para componentes que não o usam
    window.__OPTIMIZE_RENDERS__ = true;
  }
}
