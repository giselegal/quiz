/**
 * Utilitário para carregamento otimizado de scripts de terceiros
 * com priorização e carregamento lazy
 */

type ThirdPartyScript = {
  id: string;
  src: string;
  async?: boolean;
  defer?: boolean;
  priority?: 'high' | 'medium' | 'low';
  onLoad?: () => void;
};

// Agrupar scripts por prioridade
const priorityToMs: Record<string, number> = {
  high: 0, // imediato
  medium: 1000, // após 1 segundo
  low: 2000 // após 2 segundos
};

/**
 * Carrega scripts de terceiros com estratégia de priorização
 */
export const loadThirdPartyScripts = (scripts: ThirdPartyScript[]) => {
  // Agrupar por prioridade
  const scriptsByPriority: Record<string, ThirdPartyScript[]> = {
    high: [],
    medium: [],
    low: []
  };
  
  scripts.forEach(script => {
    const priority = script.priority || 'medium';
    scriptsByPriority[priority].push(script);
  });
  
  // Carregar por ordem de prioridade
  Object.entries(scriptsByPriority).forEach(([priority, priorityScripts]) => {
    const delay = priorityToMs[priority] || 0;
    
    setTimeout(() => {
      priorityScripts.forEach(script => {
        // Verificar se já existe
        if (document.getElementById(script.id)) {
          if (script.onLoad) script.onLoad();
          return;
        }
        
        const scriptEl = document.createElement('script');
        scriptEl.id = script.id;
        scriptEl.src = script.src;
        scriptEl.async = script.async !== false;
        scriptEl.defer = script.defer !== false;
        
        if (script.onLoad) {
          scriptEl.onload = script.onLoad;
        }
        
        document.body.appendChild(scriptEl);
      });
    }, delay);
  });
};
