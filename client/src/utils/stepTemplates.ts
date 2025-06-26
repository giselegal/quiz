import { EditorElement } from '@/hooks/useModernEditor';
import { getQuestionByStepId, validateQuestionData } from '@/utils/supabaseQuestionMapper';

export interface StepTemplate {
  components: Partial<EditorElement>[];
}

// Cache para questões carregadas do Supabase
let questionsCache: any[] = [];
let strategicQuestionsCache: any[] = [];

// Função para definir cache de questões
export const setQuestionsCache = (questions: any[], strategicQuestions: any[]) => {
  questionsCache = questions;
  strategicQuestionsCache = strategicQuestions;
  console.log(`📋 Questions cache updated: ${questions.length} regular, ${strategicQuestions.length} strategic`);
};

// Função para obter dados da questão de forma robusta
const getQuestionDataById = (stepId: string, stepType: string) => {
  console.log(`🎯 Getting question data for step ${stepId} of type ${stepType}`);
  
  // Usar cache se disponível
  if (questionsCache.length > 0 || strategicQuestionsCache.length > 0) {
    const question = getQuestionByStepId(stepId, questionsCache, strategicQuestionsCache);
    if (question && validateQuestionData(stepId, question)) {
      console.log(`✅ Found and validated cached question data for ${stepId}:`, question.title);
      return question;
    }
  }
  
  console.warn(`⚠️ No valid cached question data found for step ${stepId}`);
  return null;
};

// Função para gerar componente de progresso baseado no tipo de questão
const createProgressComponent = (stepId: string, currentStep: number, totalSteps: number): Partial<EditorElement> => {
  return {
    type: 'progress-bar',
    content: {
      current: currentStep,
      total: totalSteps,
      percentage: Math.round((currentStep / totalSteps) * 100)
    },
    order: 1,
    stepId
  };
};

// Função para gerar cabeçalho da questão
const createQuestionHeader = (stepId: string): Partial<EditorElement> => {
  return {
    type: 'question-header',
    content: {
      logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735479/57_whzmff.webp',
      showProgress: true
    },
    order: 0,
    stepId
  };
};

export const createQuizIntroTemplate = (stepId: string): StepTemplate => {
  return {
    components: [
      {
        type: 'brand-header',
        content: {
          logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735479/57_whzmff.webp',
          logoAlt: 'Gisele Galvão - Consultora de Imagem'
        },
        order: 0,
        stepId
      },
      {
        type: 'quiz-hero-title',
        content: {
          title: 'Descubra Seu Estilo Pessoal',
          subtitle: 'Um quiz completo para descobrir qual estilo combina mais com você'
        },
        order: 1,
        stepId
      },
      {
        type: 'quiz-hero-image',
        content: {
          imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746334754/ChatGPT_Image_4_de_mai._de_2025_00_30_44_naqom0.webp',
          alt: 'Mulher elegante descobrindo seu estilo'
        },
        order: 2,
        stepId
      },
      {
        type: 'quiz-description',
        content: {
          text: 'Responda às perguntas a seguir para descobrir qual estilo de vestuário mais combina com sua personalidade e estilo de vida.'
        },
        order: 3,
        stepId
      },
      {
        type: 'quiz-input',
        content: {
          placeholder: 'Digite seu primeiro nome',
          label: 'Seu nome:'
        },
        order: 4,
        stepId
      },
      {
        type: 'quiz-button',
        content: {
          text: 'Iniciar Quiz',
          variant: 'primary'
        },
        order: 5,
        stepId
      }
    ]
  };
};

export const createQuizQuestionTemplate = (stepId: string, questionData?: any): StepTemplate => {
  // Usar função robusta para obter dados da questão
  const question = questionData || getQuestionDataById(stepId, 'quiz-question');
  
  if (!question) {
    console.error(`❌ No question data available for quiz question step ${stepId}`);
    return { 
      components: [
        createQuestionHeader(stepId),
        {
          type: 'question-title',
          content: {
            title: 'Carregando questão...',
            questionNumber: 1
          },
          order: 2,
          stepId
        },
        {
          type: 'quiz-button',
          content: {
            text: 'Aguarde...',
            variant: 'primary',
            disabled: true
          },
          order: 3,
          stepId
        }
      ]
    };
  }
  
  const questionIndex = parseInt(question.id) - 1 || 0;
  const totalQuestions = questionsCache.length || 10;
  const currentStep = questionIndex + 1;
  
  return {
    components: [
      createQuestionHeader(stepId),
      createProgressComponent(stepId, currentStep, totalQuestions),
      {
        type: 'question-title',
        content: {
          title: question.title,
          questionNumber: currentStep
        },
        order: 2,
        stepId
      },
      {
        type: 'question-options-grid',
        content: {
          options: question.options || [],
          layout: question.type === 'image' ? 'grid' : 'list',
          multiSelect: question.multiSelect > 1,
          maxSelections: question.multiSelect || 3
        },
        order: 3,
        stepId
      },
      {
        type: 'quiz-button',
        content: {
          text: 'Continuar',
          variant: 'primary',
          disabled: true
        },
        order: 4,
        stepId
      }
    ]
  };
};

export const createStrategicQuestionTemplate = (stepId: string, questionData?: any): StepTemplate => {
  // Usar função robusta para obter dados da questão estratégica
  const question = questionData || getQuestionDataById(stepId, 'strategic-question');
  
  if (!question) {
    console.error(`❌ No question data available for strategic question step ${stepId}`);
    return { 
      components: [
        createQuestionHeader(stepId),
        {
          type: 'question-title',
          content: {
            title: 'Carregando questão estratégica...',
            questionNumber: 11,
            isStrategic: true
          },
          order: 2,
          stepId
        }
      ]
    };
  }
  
  // Para questões estratégicas, calcular posição no fluxo total
  const questionIdParts = question.id.split('-');
  const questionIndex = questionIdParts.length > 1 ? parseInt(questionIdParts[1]) - 1 : 0;
  const totalRegularQuestions = questionsCache.length || 10;
  const totalStrategicQuestions = strategicQuestionsCache.length || 7;
  const currentStep = totalRegularQuestions + questionIndex + 1;
  const totalSteps = totalRegularQuestions + totalStrategicQuestions;
  
  return {
    components: [
      createQuestionHeader(stepId),
      createProgressComponent(stepId, currentStep, totalSteps),
      {
        type: 'question-title',
        content: {
          title: question.title,
          questionNumber: currentStep,
          isStrategic: true
        },
        order: 2,
        stepId
      },
      {
        type: 'question-option-card',
        content: {
          options: question.options || [],
          layout: 'list',
          multiSelect: false,
          maxSelections: 1
        },
        order: 3,
        stepId
      },
      {
        type: 'quiz-button',
        content: {
          text: 'Continuar',
          variant: 'primary',
          disabled: true
        },
        order: 4,
        stepId
      }
    ]
  };
};

export const createQuizTransitionTemplate = (stepId: string): StepTemplate => {
  return {
    components: [
      {
        type: 'brand-header',
        content: {
          logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735479/57_whzmff.webp',
          logoAlt: 'Gisele Galvão - Consultora de Imagem'
        },
        order: 0,
        stepId
      },
      {
        type: 'transition-hero',
        content: {
          title: 'Agora vamos conhecer você melhor...',
          subtitle: 'Algumas perguntas estratégicas para personalizar ainda mais seu resultado',
          imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746334753/ChatGPT_Image_4_de_mai._de_2025_01_30_01_vbiysd.webp'
        },
        order: 1,
        stepId
      },
      {
        type: 'transition-continue',
        content: {
          text: 'Continuar',
          variant: 'primary'
        },
        order: 2,
        stepId
      }
    ]
  };
};

export const createQuizResultTemplate = (stepId: string): StepTemplate => {
  return {
    components: [
      {
        type: 'brand-header',
        content: {
          logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735479/57_whzmff.webp',
          logoAlt: 'Gisele Galvão - Consultora de Imagem'
        },
        order: 0,
        stepId
      },
      {
        type: 'result-hero',
        content: {
          title: 'Parabéns! Descobrimos seu estilo!',
          subtitle: 'Baseado nas suas respostas, identificamos seu perfil de estilo pessoal'
        },
        order: 1,
        stepId
      },
      {
        type: 'result-title',
        content: {
          dynamicTitle: true,
          placeholder: 'Seu estilo é: [ESTILO_DESCOBERTO]'
        },
        order: 2,
        stepId
      },
      {
        type: 'result-subtitle',
        content: {
          dynamicDescription: true,
          placeholder: 'Descrição personalizada do seu estilo...'
        },
        order: 3,
        stepId
      },
      {
        type: 'offer-section',
        content: {
          title: 'Quer saber mais sobre seu estilo?',
          description: 'Tenho algo especial preparado para você...',
          ctaText: 'Ver Oferta Especial',
          ctaVariant: 'primary'
        },
        order: 4,
        stepId
      }
    ]
  };
};

export const createOfferPageTemplate = (stepId: string): StepTemplate => {
  return {
    components: [
      {
        type: 'brand-header',
        content: {
          logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735479/57_whzmff.webp',
          logoAlt: 'Gisele Galvão - Consultora de Imagem'
        },
        order: 0,
        stepId
      },
      {
        type: 'offer-section',
        content: {
          title: 'Guia Completo do Seu Estilo Personal',
          subtitle: 'Transforme sua imagem com orientações personalizadas',
          features: [
            'Guia completo do seu estilo descoberto',
            'Paleta de cores personalizada',
            'Sugestões de looks para diferentes ocasiões',
            'Lista de compras estratégicas',
            'Acesso vitalício ao material'
          ]
        },
        order: 1,
        stepId
      },
      {
        type: 'price-highlight',
        content: {
          originalPrice: 'R$ 497',
          currentPrice: 'R$ 197',
          discount: '60% OFF',
          urgency: 'Oferta por tempo limitado'
        },
        order: 2,
        stepId
      },
      {
        type: 'cta-button',
        content: {
          text: 'Quero Meu Guia Personalizado',
          variant: 'primary',
          size: 'large'
        },
        order: 3,
        stepId
      }
    ]
  };
};

export const getStepTemplate = (stepType: string, stepId: string, questionData?: any): StepTemplate => {
  console.log(`🎯 Getting template for step ${stepId} of type ${stepType}`);
  
  switch (stepType) {
    case 'quiz-intro':
      return createQuizIntroTemplate(stepId);
    case 'quiz-question':
      return createQuizQuestionTemplate(stepId, questionData);
    case 'strategic-question':
      return createStrategicQuestionTemplate(stepId, questionData);
    case 'quiz-transition':
      return createQuizTransitionTemplate(stepId);
    case 'quiz-result':
      return createQuizResultTemplate(stepId);
    case 'offer-page':
      return createOfferPageTemplate(stepId);
    default:
      console.warn(`⚠️ Unknown step type: ${stepType}`);
      return { components: [] };
  }
};

// Função para debug e validação
export const debugStepTemplate = (stepType: string, stepId: string) => {
  const template = getStepTemplate(stepType, stepId);
  console.log(`🔍 Debug template for ${stepId}:`, {
    stepType,
    stepId,
    componentsCount: template.components.length,
    hasQuestionData: template.components.some(c => c.content?.options),
    cacheStatus: {
      questions: questionsCache.length,
      strategicQuestions: strategicQuestionsCache.length
    }
  });
  return template;
};
