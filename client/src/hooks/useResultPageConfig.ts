import { useState, useEffect, useCallback } from 'react';
import { ResultPageConfig } from '@/types/resultPageConfig';
import { toast } from '@/components/ui/use-toast';
import { set } from 'lodash';
import { createDefaultConfig as createFullDefaultConfig } from '@/utils/resultPageDefaults';

// Default configurations based on style type
const createDefaultConfig = (styleType: string): ResultPageConfig => {
  // Use the full default config utility to ensure all required fields are present
  return createFullDefaultConfig(styleType);
};

// Storage key based on style type
const getStorageKey = (styleType: string) => `result_page_config_${styleType}`;

export const useResultPageConfig = (styleType: string) => {
  const [resultPageConfig, setResultPageConfig] = useState<ResultPageConfig>(createDefaultConfig(styleType));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      setLoading(true);
      try {
        // Get config from localStorage
        const key = getStorageKey(styleType);
        const savedConfigStr = localStorage.getItem(key);
        
        if (savedConfigStr) {
          try {
            const savedConfig = JSON.parse(savedConfigStr);
            console.info(`Configuração carregada para ${styleType}`);
            setResultPageConfig(savedConfig);
          } catch (error) {
            console.error(`Erro ao analisar configuração salva para ${styleType}:`, error);
            const defaultConfig = createDefaultConfig(styleType);
            setResultPageConfig(defaultConfig);
            localStorage.setItem(key, JSON.stringify(defaultConfig));
            console.info(`Nova configuração padrão criada para ${styleType}`);
          }
        } else {
          console.info(`Nenhuma configuração encontrada para ${styleType}`);
          const defaultConfig = createDefaultConfig(styleType);
          setResultPageConfig(defaultConfig);
          localStorage.setItem(key, JSON.stringify(defaultConfig));
          console.info(`Nova configuração padrão criada para ${styleType}`);
        }
      } catch (error) {
        console.error('Error loading result page config:', error);
        toast({
          title: 'Erro ao carregar configuração',
          description: 'Usando configuração padrão',
          variant: 'default'
        });
        setResultPageConfig(createDefaultConfig(styleType));
      } finally {
        setLoading(false);
      }
    };
    
    loadConfig();
  }, [styleType]);

  const updateSection = useCallback((path: string, newContent: any) => {
    setResultPageConfig(prevConfig => {
      const newConfig = { ...prevConfig };
      set(newConfig, path, newContent);
      return newConfig;
    });
  }, []);

  const resetConfig = useCallback((styleType: string) => {
    const defaultConfig = createDefaultConfig(styleType);
    setResultPageConfig(defaultConfig);
    return true;
  }, []);

  const saveConfig = useCallback(async () => {
    try {
      const key = getStorageKey(resultPageConfig.styleType || styleType);
      localStorage.setItem(key, JSON.stringify(resultPageConfig));
      console.info(`Configuração salva para ${resultPageConfig.styleType || styleType}`);
      return true;
    } catch (error) {
      console.error('Error saving config:', error);
      toast({
        title: 'Erro ao salvar configuração',
        description: 'Não foi possível salvar a configuração da página de resultados',
        variant: 'destructive'
      });
      return false;
    }
  }, [resultPageConfig, styleType]);

  const importConfig = useCallback((importedConfig: any) => {
    try {
      if (!importedConfig) {
        console.warn("Tentativa de importar configuração nula ou indefinida");
        return false;
      }
      
      // Ensure the imported config has the correct styleType
      const configToImport = {
        ...importedConfig,
        styleType: styleType
      };
      
      setResultPageConfig(configToImport);
      return true;
    } catch (error) {
      console.error('Error importing config:', error);
      toast({
        title: 'Erro ao importar configuração',
        description: 'O formato da configuração importada não é válido',
        variant: 'destructive'
      });
      return false;
    }
  }, [styleType]);

  return {
    resultPageConfig,
    updateSection,
    resetConfig,
    saveConfig,
    importConfig,
    loading
  };
};
