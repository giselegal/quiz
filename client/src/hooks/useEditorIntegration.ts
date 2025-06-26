
import { useState, useCallback, useEffect } from 'react';
import { StyleResult } from '@/types/quiz';
import { toast } from '@/components/ui/use-toast';

interface EditorData {
  quiz: any;
  result: any;
  sales: any;
}

interface FunnelConfig {
  id: string;
  name: string;
  primaryStyle: StyleResult;
  data: EditorData;
  lastModified: Date;
}

export const useEditorIntegration = () => {
  const [currentFunnel, setCurrentFunnel] = useState<FunnelConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Carregar funil ativo do localStorage
  useEffect(() => {
    const savedFunnel = localStorage.getItem('active_funnel');
    if (savedFunnel) {
      try {
        const parsedFunnel = JSON.parse(savedFunnel);
        setCurrentFunnel(parsedFunnel);
      } catch (error) {
        console.error('Erro ao carregar funil ativo:', error);
      }
    }
  }, []);

  // Salvar dados do editor específico
  const saveEditorData = useCallback((editorType: 'quiz' | 'result' | 'sales', data: any) => {
    if (!currentFunnel) return false;

    try {
      const updatedFunnel = {
        ...currentFunnel,
        data: {
          ...currentFunnel.data,
          [editorType]: data
        },
        lastModified: new Date()
      };

      setCurrentFunnel(updatedFunnel);
      localStorage.setItem('active_funnel', JSON.stringify(updatedFunnel));
      
      toast({
        title: "Dados salvos",
        description: `Editor de ${editorType} salvo com sucesso.`,
      });
      
      return true;
    } catch (error) {
      console.error(`Erro ao salvar dados do editor ${editorType}:`, error);
      toast({
        title: "Erro ao salvar",
        description: `Não foi possível salvar os dados do editor de ${editorType}.`,
        variant: "destructive"
      });
      return false;
    }
  }, [currentFunnel]);

  // Criar novo funil
  const createNewFunnel = useCallback((name: string, primaryStyle: StyleResult) => {
    const newFunnel: FunnelConfig = {
      id: `funnel-${Date.now()}`,
      name,
      primaryStyle,
      data: {
        quiz: null,
        result: null,
        sales: null
      },
      lastModified: new Date()
    };

    setCurrentFunnel(newFunnel);
    localStorage.setItem('active_funnel', JSON.stringify(newFunnel));
    
    toast({
      title: "Novo funil criado",
      description: `Funil "${name}" criado com sucesso.`,
    });

    return newFunnel;
  }, []);

  // Exportar configuração completa do funil
  const exportFunnelConfig = useCallback(() => {
    if (!currentFunnel) return null;

    return {
      ...currentFunnel,
      exportedAt: new Date()
    };
  }, [currentFunnel]);

  // Importar configuração do funil
  const importFunnelConfig = useCallback((config: FunnelConfig) => {
    try {
      setCurrentFunnel(config);
      localStorage.setItem('active_funnel', JSON.stringify(config));
      
      toast({
        title: "Funil importado",
        description: `Funil "${config.name}" importado com sucesso.`,
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao importar funil:', error);
      toast({
        title: "Erro ao importar",
        description: "Não foi possível importar a configuração do funil.",
        variant: "destructive"
      });
      return false;
    }
  }, []);

  // Obter dados de um editor específico
  const getEditorData = useCallback((editorType: 'quiz' | 'result' | 'sales') => {
    return currentFunnel?.data[editorType] || null;
  }, [currentFunnel]);

  // Sincronizar dados entre editores
  const syncBetweenEditors = useCallback(async () => {
    if (!currentFunnel) return false;

    setIsLoading(true);
    
    try {
      // Lógica para sincronizar dados entre quiz, resultado e vendas
      // Por exemplo, passar resultados do quiz para a página de resultado
      
      const quizData = currentFunnel.data.quiz;
      if (quizData) {
        // Aplicar dados do quiz na página de resultado
        const resultData = {
          ...currentFunnel.data.result,
          primaryStyle: currentFunnel.primaryStyle,
          quizResults: quizData.results
        };
        
        await saveEditorData('result', resultData);
      }
      
      toast({
        title: "Sincronização concluída",
        description: "Dados sincronizados entre todos os editores.",
      });
      
      return true;
    } catch (error) {
      console.error('Erro na sincronização:', error);
      toast({
        title: "Erro na sincronização",
        description: "Não foi possível sincronizar os dados.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentFunnel, saveEditorData]);

  return {
    currentFunnel,
    isLoading,
    saveEditorData,
    createNewFunnel,
    exportFunnelConfig,
    importFunnelConfig,
    getEditorData,
    syncBetweenEditors
  };
};
