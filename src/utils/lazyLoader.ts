/**
 * Carrega script externo de forma assíncrona e não-bloqueante
 */
export const loadExternalScript = (
  src: string,
  id?: string,
  defer = true,
  async = true,
  onLoad?: () => void
): Promise<HTMLScriptElement> => {
  return new Promise((resolve, reject) => {
    // Verificar se o script já existe
    if (id && document.getElementById(id)) {
      resolve(document.getElementById(id) as HTMLScriptElement);
      if (onLoad) onLoad();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.defer = defer;
    script.async = async;
    if (id) script.id = id;

    script.onload = () => {
      resolve(script);
      if (onLoad) onLoad();
    };

    script.onerror = () => {
      reject(new Error(`Failed to load script: ${src}`));
    };

    document.body.appendChild(script);
  });
};

/**
 * Carrega módulos JS apenas quando necessário
 */
export const lazyLoadModule = async <T>(importFn: () => Promise<T>): Promise<T> => {
  try {
    return await importFn();
  } catch (error) {
    console.error('Erro ao carregar módulo lazy:', error);
    throw error;
  }
};
