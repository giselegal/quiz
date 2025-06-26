
import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useQuizBuilder } from './useQuizBuilder';
import { useResultPageEditor } from './useResultPageEditor';
import { useSalesPageEditor } from './useSalesPageEditor';
import { StyleResult } from '@/types/quiz';
import { EditorTab } from '@/components/unified-editor/UnifiedVisualEditor';

export const useUnifiedEditor = (primaryStyle: StyleResult) => {
  const [activeMode, setActiveMode] = useState<EditorTab>('quiz');
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  
  // Initialize the individual editors
  const quizBuilder = useQuizBuilder();
  const resultPageEditor = useResultPageEditor(primaryStyle.category);
  const salesPageEditor = useSalesPageEditor(primaryStyle.category);
  
  // Initialization log
  useEffect(() => {
    console.info('useUnifiedEditor inicializado com estilo:', primaryStyle.category);
  }, [primaryStyle.category]);
  
  const togglePreview = useCallback(() => {
    setIsPreviewing(prev => !prev);
  }, []);
  
  const saveAll = useCallback(async () => {
    try {
      let success = true;
      
      if (activeMode === 'quiz' && quizBuilder) {
        // Save quiz state if implemented
        if (typeof quizBuilder.saveCurrentState === 'function') {
          success = quizBuilder.saveCurrentState();
          console.info('Quiz salvo:', success);
        } else {
          console.warn('Método saveCurrentState não encontrado no quizBuilder');
        }
      } else if (activeMode === 'result' && resultPageEditor) {
        // Save result page state
        if (resultPageEditor.actions?.handleSave) {
          success = await resultPageEditor.actions.handleSave();
          console.info('Página de resultado salva:', success);
        } else {
          console.warn('Método handleSave não encontrado no resultPageEditor');
        }
      } else if (activeMode === 'sales') {
        // Save sales page state if implemented
        success = await salesPageEditor.handleSave();
        console.info('Página de vendas salva:', success);
      }
      
      return success;
    } catch (error) {
      console.error('Error saving editor state:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as alterações.",
        variant: "destructive"
      });
      return false;
    }
  }, [activeMode, quizBuilder, resultPageEditor, salesPageEditor]);
  
  const openTemplateModal = useCallback(() => {
    setIsTemplateModalOpen(true);
  }, []);
  
  const closeTemplateModal = useCallback(() => {
    setIsTemplateModalOpen(false);
  }, []);

  const loadTemplateForCurrentEditor = useCallback((templateData: any) => {
    try {
      let success = false;
      
      if (activeMode === 'quiz' && quizBuilder) {
        // Load quiz template if implemented
        if (templateData.stages && Array.isArray(templateData.stages) &&
            typeof quizBuilder.initializeStages === 'function') {
          quizBuilder.initializeStages(templateData.stages);
          
          if (templateData.components && Array.isArray(templateData.components) && 
              typeof quizBuilder.initializeComponents === 'function') {
            quizBuilder.initializeComponents(templateData.components);
          } else {
            // Initialize with empty components if not provided in template
            quizBuilder.initializeComponents([]);
          }
          
          success = true;
          
          if (templateData.stages && templateData.stages.length > 0) {
            quizBuilder.setActiveStage(templateData.stages[0].id);
          }
        } else {
          console.warn('Formato de template inválido para o quiz');
        }
      } else if (activeMode === 'result' && resultPageEditor) {
        // Load result page template
        if (resultPageEditor.actions?.importConfig) {
          const configWithStyleType = {
            ...templateData,
            styleType: primaryStyle.category
          };
          resultPageEditor.actions.importConfig(configWithStyleType);
          success = true;
        } else {
          console.warn('Método importConfig não encontrado no resultPageEditor');
        }
      } else if (activeMode === 'sales') {
        // Load sales page template if implemented
        if (templateData.blocks && Array.isArray(templateData.blocks)) {
          success = salesPageEditor.loadTemplate(templateData.blocks);
        } else {
          console.warn('Template incompatível para a página de vendas');
        }
      }
      
      if (success) {
        toast({
          title: "Template aplicado",
          description: `Template aplicado com sucesso ao editor de ${activeMode === 'quiz' ? 'Quiz' : activeMode === 'result' ? 'Resultado' : 'Vendas'}.`,
        });
      } else {
        toast({
          title: "Aviso",
          description: `Formato de template incompatível com o editor de ${activeMode === 'quiz' ? 'Quiz' : activeMode === 'result' ? 'Resultado' : 'Vendas'}.`,
        });
      }
      
      return success;
    } catch (error) {
      console.error('Erro ao carregar template:', error);
      toast({
        title: "Erro ao carregar template",
        description: "Não foi possível aplicar o template selecionado.",
        variant: "destructive"
      });
      return false;
    }
  }, [activeMode, quizBuilder, resultPageEditor, salesPageEditor, primaryStyle.category]);
  
  return {
    activeMode,
    isPreviewing,
    isDragging,
    isTemplateModalOpen,
    quizBuilder,
    resultPageEditor,
    salesPageEditor,
    setActiveMode,
    togglePreview,
    setIsDragging,
    saveAll,
    openTemplateModal,
    closeTemplateModal,
    loadTemplateForCurrentEditor
  };
};
