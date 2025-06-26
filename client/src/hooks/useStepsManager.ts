import { useState, useCallback, useEffect } from 'react';
import { useSupabaseQuestions } from '@/hooks/useSupabaseQuestions';

export type StepType = 'quiz-intro' | 'quiz-question' | 'strategic-question' | 'quiz-transition' | 'quiz-result' | 'offer-page';

interface Step {
  id: string;
  title: string;
  type: StepType;
  order: number;
  subType?: string;
  questionData?: any;
  templateComponents?: string[];
  settings?: {
    questionType?: 'multiple-choice' | 'single-choice' | 'scale' | 'text';
    showProgress?: boolean;
    allowBack?: boolean;
    autoAdvance?: boolean;
  };
}

const generateStepsFromSupabase = (questions: any[], strategicQuestions: any[]): Step[] => {
  const steps: Step[] = [];
  let order = 0;

  console.log('🔄 Generating steps from Supabase data', { questions: questions.length, strategicQuestions: strategicQuestions.length });

  // 1. Capa do Quiz
  steps.push({
    id: 'step-intro',
    title: 'Capa do Quiz',
    type: 'quiz-intro',
    order: order++,
    templateComponents: [],
    settings: { showProgress: false, allowBack: false }
  });

  // 2. Questões Normais (1-10)
  questions.forEach((question, index) => {
    steps.push({
      id: `step-question-${question.id}`,
      title: `Questão ${index + 1}`,
      type: 'quiz-question',
      order: order++,
      questionData: question,
      templateComponents: [],
      settings: {
        questionType: 'multiple-choice',
        showProgress: true,
        allowBack: true
      }
    });
  });

  // 3. Transição 1
  steps.push({
    id: 'step-transition-1',
    title: 'Transição: Conhecendo Você Melhor',
    type: 'quiz-transition',
    order: order++,
    templateComponents: [],
    settings: { showProgress: true, allowBack: true }
  });

  // 4. Questões Estratégicas
  strategicQuestions.forEach((question, index) => {
    steps.push({
      id: `step-strategic-${question.id}`,
      title: `Questão Estratégica ${index + 1}`,
      type: 'strategic-question',
      order: order++,
      questionData: question,
      templateComponents: [],
      settings: {
        questionType: 'single-choice',
        showProgress: true,
        allowBack: true
      }
    });
  });

  // 5. Transição 2
  steps.push({
    id: 'step-transition-2',
    title: 'Transição: Preparando Resultado',
    type: 'quiz-transition',
    order: order++,
    templateComponents: [],
    settings: { showProgress: true, allowBack: true }
  });

  // 6. Resultado
  steps.push({
    id: 'step-result',
    title: 'Resultado do Quiz',
    type: 'quiz-result',
    order: order++,
    templateComponents: [],
    settings: { showProgress: false, allowBack: true }
  });

  // 7. Oferta
  steps.push({
    id: 'step-offer',
    title: 'Página de Oferta',
    type: 'offer-page',
    order: order++,
    templateComponents: [],
    settings: { showProgress: false, allowBack: true }
  });

  console.log('✅ Generated steps from Supabase:', steps.length);
  return steps;
};

export const useStepsManager = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [activeStepId, setActiveStepId] = useState<string>('step-intro');
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { questions, strategicQuestions, loading, error } = useSupabaseQuestions();

  // Gerar etapas quando os dados do Supabase estiverem disponíveis
  useEffect(() => {
    if (!loading && !error && (questions.length > 0 || strategicQuestions.length > 0) && !isInitialized) {
      console.log('🚀 Initializing steps with Supabase data');
      const generatedSteps = generateStepsFromSupabase(questions, strategicQuestions);
      setSteps(generatedSteps);
      setIsInitialized(true);
    }
  }, [questions, strategicQuestions, loading, error, isInitialized]);

  // Fallback para dados locais se Supabase falhar
  useEffect(() => {
    if (!loading && error && !isInitialized) {
      console.warn('⚠️ Supabase failed, using fallback empty steps');
      const fallbackSteps = generateStepsFromSupabase([], []);
      setSteps(fallbackSteps);
      setIsInitialized(true);
    }
  }, [loading, error, isInitialized]);

  const getStepTypeInfo = (type: StepType) => {
    switch (type) {
      case 'quiz-intro':
        return {
          icon: '📋',
          color: 'bg-blue-500',
          lightColor: 'bg-blue-100',
          textColor: 'text-blue-700',
          label: 'Capa do Quiz'
        };
      case 'quiz-question':
        return {
          icon: '🎯',
          color: 'bg-purple-500',
          lightColor: 'bg-purple-100',
          textColor: 'text-purple-700',
          label: 'Questão'
        };
      case 'strategic-question':
        return {
          icon: '💭',
          color: 'bg-indigo-500',
          lightColor: 'bg-indigo-100',
          textColor: 'text-indigo-700',
          label: 'Questão Estratégica'
        };
      case 'quiz-transition':
        return {
          icon: '⚡',
          color: 'bg-yellow-500',
          lightColor: 'bg-yellow-100',
          textColor: 'text-yellow-700',
          label: 'Transição'
        };
      case 'quiz-result':
        return {
          icon: '🎉',
          color: 'bg-green-500',
          lightColor: 'bg-green-100',
          textColor: 'text-green-700',
          label: 'Resultado'
        };
      case 'offer-page':
        return {
          icon: '💰',
          color: 'bg-orange-500',
          lightColor: 'bg-orange-100',
          textColor: 'text-orange-700',
          label: 'Página de Oferta'
        };
      default:
        return {
          icon: '📄',
          color: 'bg-gray-500',
          lightColor: 'bg-gray-100',
          textColor: 'text-gray-700',
          label: 'Etapa'
        };
    }
  };

  const addStep = useCallback((type: StepType = 'quiz-question', questionData?: any) => {
    const newStepNumber = steps.length + 1;
    const typeInfo = getStepTypeInfo(type);
    
    const newStep: Step = {
      id: `step-${Date.now()}`,
      title: `Nova ${typeInfo.label}`,
      type,
      order: newStepNumber,
      questionData,
      templateComponents: [],
      settings: {
        questionType: type === 'quiz-question' ? 'multiple-choice' : 'single-choice',
        showProgress: type !== 'quiz-intro',
        allowBack: type !== 'quiz-intro',
        autoAdvance: false
      }
    };
    
    setSteps(prev => [...prev, newStep]);
    setActiveStepId(newStep.id);
    
    return newStep.id;
  }, [steps]);

  const addQuizIntroStep = useCallback(() => addStep('quiz-intro'), [addStep]);
  const addQuizQuestionStep = useCallback(() => addStep('quiz-question'), [addStep]);
  const addStrategicQuestionStep = useCallback(() => addStep('strategic-question'), [addStep]);
  const addQuizTransitionStep = useCallback(() => addStep('quiz-transition'), [addStep]);
  const addQuizResultStep = useCallback(() => addStep('quiz-result'), [addStep]);
  const addOfferPageStep = useCallback(() => addStep('offer-page'), [addStep]);

  const deleteStep = useCallback((stepId: string) => {
    setSteps(prev => {
      const filteredSteps = prev.filter(step => step.id !== stepId);
      return filteredSteps.map((step, index) => ({
        ...step,
        order: index,
      }));
    });
    
    if (activeStepId === stepId && steps.length > 1) {
      const remainingSteps = steps.filter(step => step.id !== stepId);
      if (remainingSteps.length > 0) {
        setActiveStepId(remainingSteps[0].id);
      }
    }
  }, [activeStepId, steps]);

  const duplicateStep = useCallback((stepId: string) => {
    const stepToDuplicate = steps.find(step => step.id === stepId);
    if (!stepToDuplicate) return;

    const newStep: Step = {
      ...stepToDuplicate,
      id: `step-${Date.now()}`,
      title: `${stepToDuplicate.title} (Cópia)`,
      order: steps.length,
    };
    
    setSteps(prev => [...prev, newStep]);
    setActiveStepId(newStep.id);
    
    return newStep.id;
  }, [steps]);

  const updateStep = useCallback((stepId: string, updates: Partial<Step>) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    ));
  }, []);

  const editStep = useCallback((stepId: string) => {
    setActiveStepId(stepId);
  }, []);

  const reorderStep = useCallback((stepId: string, newOrder: number) => {
    setSteps(prev => {
      const step = prev.find(s => s.id === stepId);
      if (!step) return prev;

      const otherSteps = prev.filter(s => s.id !== stepId);
      const updatedStep = { ...step, order: newOrder };
      
      return [...otherSteps, updatedStep].sort((a, b) => a.order - b.order);
    });
  }, []);

  const selectStep = useCallback((stepId: string) => {
    setActiveStepId(stepId);
  }, []);

  const activeStep = steps.find(step => step.id === activeStepId);

  const resetToDefaultSteps = useCallback(() => {
    const defaultSteps = generateStepsFromSupabase(questions, strategicQuestions);
    setSteps(defaultSteps);
    setActiveStepId('step-intro');
  }, [questions, strategicQuestions]);

  return {
    steps,
    activeStepId,
    activeStep,
    isInitialized,
    addStep,
    addQuizIntroStep,
    addQuizQuestionStep,
    addStrategicQuestionStep,
    addQuizTransitionStep,
    addQuizResultStep,
    addOfferPageStep,
    deleteStep,
    duplicateStep,
    editStep,
    updateStep,
    reorderStep,
    selectStep,
    resetToDefaultSteps,
    getStepTypeInfo
  };
};
