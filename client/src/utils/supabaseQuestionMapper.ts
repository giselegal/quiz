
import { useSupabaseQuestions } from '@/hooks/useSupabaseQuestions';

// Cache global para questões
let globalQuestionsCache: any[] = [];
let globalStrategicQuestionsCache: any[] = [];

// Função para obter questão específica por ID do step
export const getQuestionByStepId = (stepId: string, questions: any[], strategicQuestions: any[]) => {
  console.log(`🔍 Looking for question data for step: ${stepId}`);
  
  // Atualizar cache global se fornecido
  if (questions.length > 0) {
    globalQuestionsCache = questions;
  }
  if (strategicQuestions.length > 0) {
    globalStrategicQuestionsCache = strategicQuestions;
  }
  
  // Para questões regulares (step-question-1 a step-question-10)
  if (stepId.startsWith('step-question-')) {
    const questionNumber = stepId.replace('step-question-', '');
    
    // Tentar primeiro no cache fornecido
    let question = questions.find(q => q.id === questionNumber);
    
    // Se não encontrou, tentar no cache global
    if (!question && globalQuestionsCache.length > 0) {
      question = globalQuestionsCache.find(q => q.id === questionNumber);
    }
    
    if (question) {
      console.log(`✅ Found regular question for ${stepId}:`, question.title);
      return question;
    }
  }
  
  // Para questões estratégicas (step-strategic-strategic-1 a step-strategic-strategic-7)
  if (stepId.startsWith('step-strategic-')) {
    const strategicPart = stepId.replace('step-strategic-', '');
    
    // Tentar primeiro no cache fornecido
    let question = strategicQuestions.find(q => q.id === strategicPart);
    
    // Se não encontrou, tentar no cache global
    if (!question && globalStrategicQuestionsCache.length > 0) {
      question = globalStrategicQuestionsCache.find(q => q.id === strategicPart);
    }
    
    if (question) {
      console.log(`✅ Found strategic question for ${stepId}:`, question.title);
      return question;
    }
  }
  
  console.warn(`⚠️ No question found for step: ${stepId}`);
  return null;
};

// Função para normalizar ID de questão do stepId
export const normalizeQuestionId = (stepId: string): string | null => {
  if (stepId.startsWith('step-question-')) {
    return stepId.replace('step-question-', '');
  }
  if (stepId.startsWith('step-strategic-')) {
    return stepId.replace('step-strategic-', '');
  }
  return null;
};

// Função para criar stepId a partir do tipo e ID da questão
export const createStepId = (type: 'question' | 'strategic', questionId: string): string => {
  if (type === 'strategic') {
    return `step-strategic-${questionId}`;
  }
  return `step-question-${questionId}`;
};

// Hook para usar em componentes que precisam de dados de questões
export const useQuestionData = () => {
  const { questions, strategicQuestions, loading, error } = useSupabaseQuestions();
  
  const getQuestionForStep = (stepId: string) => {
    return getQuestionByStepId(stepId, questions, strategicQuestions);
  };
  
  const getAllQuestions = () => {
    return [...questions, ...strategicQuestions];
  };
  
  const getQuestionById = (questionId: string, isStrategic: boolean = false) => {
    const sourceQuestions = isStrategic ? strategicQuestions : questions;
    return sourceQuestions.find(q => q.id === questionId);
  };
  
  return {
    questions,
    strategicQuestions,
    loading,
    error,
    getQuestionForStep,
    getAllQuestions,
    getQuestionById
  };
};

// Função para validar integridade dos dados
export const validateQuestionData = (stepId: string, questionData: any): boolean => {
  if (!questionData) {
    console.error(`❌ No question data for step ${stepId}`);
    return false;
  }
  
  if (!questionData.title) {
    console.error(`❌ Question data missing title for step ${stepId}`);
    return false;
  }
  
  if (!questionData.options || questionData.options.length === 0) {
    console.warn(`⚠️ Question data missing options for step ${stepId}`);
    return false;
  }
  
  console.log(`✅ Question data validated for step ${stepId}`);
  return true;
};
