import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { getStepTemplate } from '@/utils/stepTemplates';
import { useSupabaseQuestions } from '@/hooks/useSupabaseQuestions';
import { generateComponentId, extractQuestionIdFromStepId } from '@/utils/idGenerator';

export interface EditorElement {
  id: string;
  type: string;
  content: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
  order: number;
  stepId: string;
  style?: Record<string, any>;
}

interface EditorState {
  elements: EditorElement[];
  selectedElementId: string | null;
  isPreviewMode: boolean;
  history: EditorElement[][];
  historyIndex: number;
  populatedSteps: Set<string>;
  isInitializing: boolean;
  failedSteps: Set<string>;
}

export const useModernEditor = () => {
  const [state, setState] = useState<EditorState>({
    elements: [],
    selectedElementId: null,
    isPreviewMode: false,
    history: [[]],
    historyIndex: 0,
    populatedSteps: new Set(),
    isInitializing: false,
    failedSteps: new Set()
  });

  const isPopulatingRef = useRef(false);
  const initializationPromiseRef = useRef<Promise<void> | null>(null);
  
  // Usar dados do Supabase
  const { questions, strategicQuestions } = useSupabaseQuestions();

  // Função para buscar dados da questão baseado no stepId
  const getQuestionData = useCallback((stepId: string, stepType: string) => {
    const questionId = extractQuestionIdFromStepId(stepId);
    
    if (stepType === 'quiz-question' && questionId) {
      return questions.find(q => q.id === questionId);
    } else if (stepType === 'strategic-question' && questionId) {
      return strategicQuestions.find(q => q.id === questionId);
    }
    
    return undefined;
  }, [questions, strategicQuestions]);

  // Função melhorada para popular uma etapa específica
  const populateStepSafely = useCallback(async (stepId: string, stepType: string): Promise<boolean> => {
    if (state.populatedSteps.has(stepId)) {
      console.log(`Step ${stepId} already populated, skipping`);
      return true;
    }

    try {
      console.log(`🚀 Starting population for step: ${stepId} (${stepType})`);
      
      // Obter dados da questão se necessário
      const questionData = getQuestionData(stepId, stepType);
      
      if ((stepType === 'quiz-question' || stepType === 'strategic-question') && !questionData) {
        console.warn(`⚠️ No question data found for step ${stepId}`);
        setState(prev => ({ ...prev, failedSteps: new Set(prev.failedSteps).add(stepId) }));
        return false;
      }

      // Obter template da etapa
      const template = getStepTemplate(stepType, stepId, questionData);
      
      if (!template.components || template.components.length === 0) {
        console.warn(`⚠️ No template components for step ${stepId}`);
        setState(prev => ({ ...prev, failedSteps: new Set(prev.failedSteps).add(stepId) }));
        return false;
      }

      // Criar elementos do template
      const newElements: EditorElement[] = template.components.map((component, index) => ({
        id: generateComponentId(stepId, component.type || 'unknown', index),
        type: component.type || 'text',
        content: component.content || {},
        position: { x: 0, y: 0 },
        size: { width: 100, height: 50 },
        order: index,
        stepId,
        style: component.style || {}
      }));

      // Atualizar estado com novos elementos
      setState(prev => {
        const filteredElements = prev.elements.filter(el => el.stepId !== stepId);
        const updatedElements = [...filteredElements, ...newElements].sort((a, b) => {
          if (a.stepId === b.stepId) return a.order - b.order;
          return 0;
        });
        
        const newHistory = prev.history.slice(0, prev.historyIndex + 1);
        newHistory.push(updatedElements);
        
        const newPopulatedSteps = new Set(prev.populatedSteps);
        newPopulatedSteps.add(stepId);
        
        return {
          ...prev,
          elements: updatedElements,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          populatedSteps: newPopulatedSteps
        };
      });

      console.log(`✅ Successfully populated step ${stepId} with ${newElements.length} components`);
      return true;
      
    } catch (error) {
      console.error(`❌ Failed to populate step ${stepId}:`, error);
      setState(prev => ({ ...prev, failedSteps: new Set(prev.failedSteps).add(stepId) }));
      return false;
    }
  }, [state.populatedSteps, getQuestionData]);

  // Auto-populate com Promise.all para inicialização sequencial
  const autoPopulateStep = useCallback(async (stepId: string, stepType: string) => {
    if (isPopulatingRef.current) {
      console.log(`Population already in progress, queuing ${stepId}`);
      return;
    }

    isPopulatingRef.current = true;
    
    try {
      await populateStepSafely(stepId, stepType);
    } finally {
      isPopulatingRef.current = false;
    }
  }, [populateStepSafely]);

  // Inicialização em lote para múltiplas etapas
  const initializeSteps = useCallback(async (steps: Array<{ id: string; type: string }>) => {
    if (state.isInitializing || initializationPromiseRef.current) {
      await initializationPromiseRef.current;
      return;
    }

    setState(prev => ({ ...prev, isInitializing: true }));
    console.log(`🔄 Initializing ${steps.length} steps...`);

    const initPromise = Promise.resolve().then(async () => {
      const results = await Promise.allSettled(
        steps.map(async (step, index) => {
          // Pequeno delay entre etapas para evitar conflitos
          await new Promise(resolve => setTimeout(resolve, index * 100));
          return populateStepSafely(step.id, step.type);
        })
      );

      const succeeded = results.filter(r => r.status === 'fulfilled' && r.value).length;
      console.log(`✅ Initialization complete: ${succeeded}/${steps.length} steps populated successfully`);
    });

    initializationPromiseRef.current = initPromise;
    
    try {
      await initPromise;
    } finally {
      setState(prev => ({ ...prev, isInitializing: false }));
      initializationPromiseRef.current = null;
    }
  }, [state.isInitializing, populateStepSafely]);

  // Função para retry de etapas falhadas
  const retryFailedSteps = useCallback(async () => {
    const failedStepsArray = Array.from(state.failedSteps);
    if (failedStepsArray.length === 0) return;

    console.log(`🔄 Retrying ${failedStepsArray.length} failed steps...`);
    setState(prev => ({ ...prev, failedSteps: new Set() }));

    for (const stepId of failedStepsArray) {
      // Tentar determinar o tipo da etapa pelo ID
      let stepType = 'quiz-question';
      if (stepId.includes('intro')) stepType = 'quiz-intro';
      else if (stepId.includes('strategic')) stepType = 'strategic-question';
      else if (stepId.includes('transition')) stepType = 'quiz-transition';
      else if (stepId.includes('result')) stepType = 'quiz-result';
      else if (stepId.includes('offer')) stepType = 'offer-page';

      await populateStepSafely(stepId, stepType);
    }
  }, [state.failedSteps, populateStepSafely]);

  const addElement = useCallback((type: string, content: any = {}, stepId: string) => {
    const stepElements = state.elements.filter(el => el.stepId === stepId);
    const nextOrder = stepElements.length;

    const newElement: EditorElement = {
      id: generateComponentId(stepId, type, nextOrder),
      type,
      content,
      position: { x: 0, y: 0 },
      size: { width: 100, height: 50 },
      order: nextOrder,
      stepId,
      style: {}
    };

    setState(prev => {
      const newElements = [...prev.elements, newElement];
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(newElements);
      
      return {
        ...prev,
        elements: newElements,
        selectedElementId: newElement.id,
        history: newHistory,
        historyIndex: newHistory.length - 1
      };
    });

    return newElement.id;
  }, [state.elements]);

  const addStepTemplate = useCallback((stepType: string, stepId: string) => {
    autoPopulateStep(stepId, stepType);
  }, [autoPopulateStep]);

  const updateElement = useCallback((id: string, updates: Partial<EditorElement>) => {
    setState(prev => {
      const newElements = prev.elements.map(el => 
        el.id === id ? { ...el, ...updates } : el
      );
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(newElements);
      
      return {
        ...prev,
        elements: newElements,
        history: newHistory,
        historyIndex: newHistory.length - 1
      };
    });
  }, []);

  const duplicateElement = useCallback((id: string) => {
    const element = state.elements.find(el => el.id === id);
    if (!element) return;

    const stepElements = state.elements.filter(el => el.stepId === element.stepId);
    const nextOrder = stepElements.length;

    const newElement: EditorElement = {
      ...element,
      id: generateComponentId(element.stepId, element.type, nextOrder),
      position: { x: element.position.x + 20, y: element.position.y + 20 },
      order: nextOrder
    };

    setState(prev => {
      const newElements = [...prev.elements, newElement];
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(newElements);
      
      return {
        ...prev,
        elements: newElements,
        selectedElementId: newElement.id,
        history: newHistory,
        historyIndex: newHistory.length - 1
      };
    });
  }, [state.elements]);

  const deleteElement = useCallback((id: string) => {
    setState(prev => {
      const newElements = prev.elements.filter(el => el.id !== id);
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(newElements);
      
      return {
        ...prev,
        elements: newElements,
        selectedElementId: prev.selectedElementId === id ? null : prev.selectedElementId,
        history: newHistory,
        historyIndex: newHistory.length - 1
      };
    });
  }, []);

  const selectElement = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, selectedElementId: id }));
  }, []);

  const togglePreview = useCallback(() => {
    setState(prev => ({ ...prev, isPreviewMode: !prev.isPreviewMode }));
  }, []);

  const undo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex > 0) {
        return {
          ...prev,
          elements: prev.history[prev.historyIndex - 1],
          historyIndex: prev.historyIndex - 1,
          selectedElementId: null
        };
      }
      return prev;
    });
  }, []);

  const redo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex < prev.history.length - 1) {
        return {
          ...prev,
          elements: prev.history[prev.historyIndex + 1],
          historyIndex: prev.historyIndex + 1,
          selectedElementId: null
        };
      }
      return prev;
    });
  }, []);

  const save = useCallback(async () => {
    return {
      elements: state.elements,
      timestamp: new Date().toISOString()
    };
  }, [state.elements]);

  const getElementsByStep = useCallback((stepId: string) => {
    return state.elements
      .filter(el => el.stepId === stepId)
      .sort((a, b) => a.order - b.order);
  }, [state.elements]);

  const resetPopulatedSteps = useCallback(() => {
    setState(prev => ({
      ...prev,
      populatedSteps: new Set(),
      failedSteps: new Set(),
      elements: []
    }));
  }, []);

  const canUndo = useMemo(() => state.historyIndex > 0, [state.historyIndex]);
  const canRedo = useMemo(() => state.historyIndex < state.history.length - 1, [state.historyIndex, state.history.length]);

  return {
    elements: state.elements,
    selectedElementId: state.selectedElementId,
    isPreviewMode: state.isPreviewMode,
    isInitializing: state.isInitializing,
    failedSteps: state.failedSteps,
    canUndo,
    canRedo,
    addElement,
    addStepTemplate,
    updateElement,
    duplicateElement,
    deleteElement,
    selectElement,
    togglePreview,
    undo,
    redo,
    save,
    getElementsByStep,
    autoPopulateStep,
    initializeSteps,
    retryFailedSteps,
    resetPopulatedSteps
  };
};
