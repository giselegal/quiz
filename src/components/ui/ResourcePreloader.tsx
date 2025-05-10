import { useEffect } from 'react';

type ResourceType = 'image' | 'font' | 'script' | 'style';

interface Resource {
  url: string;
  type: ResourceType;
  crossOrigin?: boolean;
  as?: string;
  importance?: 'high' | 'low' | 'auto';
}

/**
 * Componente para pré-carregar recursos críticos como imagens, fontes e scripts
 * Melhora significativamente o LCP (Largest Contentful Paint) e FCP (First Contentful Paint)
 * 
 * @param resources Lista de recursos para pré-carregar
 */
export const ResourcePreloader: React.FC<{ resources: Resource[] }> = ({ resources }) => {
  useEffect(() => {
    // Filtrar recursos já pré-carregados
    const alreadyPreloaded = new Set(
      Array.from(document.querySelectorAll('link[rel="preload"]'))
        .map(link => (link as HTMLLinkElement).href)
    );

    // Criar e adicionar os links de preload para cada recurso
    resources
      .filter(resource => !alreadyPreloaded.has(resource.url))
      .forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.url;
        
        // Configurar atributos específicos por tipo de recurso
        switch (resource.type) {
          case 'image':
            link.as = 'image';
            break;
          case 'font':
            link.as = 'font';
            // Fontes sempre precisam de crossorigin
            link.crossOrigin = '';
            break;
          case 'script':
            link.as = 'script';
            break;
          case 'style':
            link.as = 'style';
            break;
        }
        
        // Configurar crossOrigin se necessário
        if (resource.crossOrigin) {
          link.crossOrigin = '';
        }
        
        // Configurar importância
        if (resource.importance) {
          link.setAttribute('importance', resource.importance);
        }
        
        // Configurar "as" personalizado se fornecido
        if (resource.as) {
          link.as = resource.as;
        }
        
        // Adicionar ao head do documento
        document.head.appendChild(link);
      });
      
    // Limpeza ao desmontar
    return () => {
      // Remover links de preload adicionados dinamicamente
      resources.forEach(resource => {
        const links = document.querySelectorAll(`link[rel="preload"][href="${resource.url}"]`);
        links.forEach(link => {
          if (link.parentNode) {
            link.parentNode.removeChild(link);
          }
        });
      });
    };
  }, [resources]);
  
  // Este componente não renderiza nada
  return null;
};

export default ResourcePreloader;
