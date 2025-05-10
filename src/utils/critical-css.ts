
/**
 * Utility para gerenciar CSS crítico injetado diretamente no head
 * para melhorar o First Contentful Paint
 */

/**
 * CSS crítico para renderização inicial da aplicação
 */
export const initialCriticalCSS = `
  * {margin:0;padding:0;box-sizing:border-box;}
  body {background:#FEFEFE;font-family:sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;}
  .loading-spinner{width:40px;height:40px;border:3px solid rgba(184,155,122,0.2);border-radius:50%;border-top-color:#B89B7A;animation:spin 0.8s linear infinite;}
  @keyframes spin{to{transform:rotate(360deg);}}
  .loading-fallback{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;background:#FAF9F7;}
  .quiz-intro-container{display:flex;flex-direction:column;align-items:center;padding:1rem;}
`;

/**
 * Injeta CSS diretamente no head da página para melhor performance
 * @param css Conteúdo CSS a ser injetado
 * @param id ID opcional do elemento style
 */
export const injectCriticalCSS = (css: string, id = 'critical-css') => {
  // Evitar duplicação se já existir
  if (document.getElementById(id)) {
    return;
  }
  
  try {
    const style = document.createElement('style');
    style.id = id;
    style.setAttribute('type', 'text/css');
    style.innerHTML = css;
    document.head.appendChild(style);
    console.log(`[Performance] CSS crítico injetado: ${id}`);
  } catch (error) {
    console.error('Erro ao injetar CSS crítico:', error);
  }
};

/**
 * Remove o CSS crítico quando não for mais necessário
 * @param id ID do elemento style a ser removido
 */
export const removeCriticalCSS = (id = 'critical-css') => {
  const styleElement = document.getElementById(id);
  if (styleElement && styleElement.parentNode) {
    styleElement.parentNode.removeChild(styleElement);
    console.log(`[Performance] CSS crítico removido: ${id}`);
  }
};

/**
 * Verifica se o CSS crítico foi aplicado corretamente
 * @param id ID do elemento style a verificar
 */
export const hasCriticalCSS = (id = 'critical-css') => {
  return !!document.getElementById(id);
};
