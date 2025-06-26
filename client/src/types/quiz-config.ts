export interface QuizThemeConfig {
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  textSecondaryColor: string;
  fontFamily: string;
  fontSize: {
    title: string;
    subtitle: string;
    body: string;
    small: string;
  };
}

export interface QuizBehaviorConfig {
  autoAdvance: boolean;
  maxSelections: number;
  showProgress: boolean;
  enableNavigation: boolean;
  enableBackButton: boolean;
  strategicAutoAdvance: boolean;
  normalQuestionsAutoAdvance: boolean;
  selectionLimit: {
    normal: number;
    strategic: number;
  };
}

export interface QuizLayoutConfig {
  gridType: "auto" | "1-column" | "2-column" | "3-column";
  cardStyle: "modern" | "classic" | "minimal";
  spacing: "compact" | "normal" | "spacious";
  borderRadius: string;
  shadowStyle: "none" | "subtle" | "medium" | "strong";
  optionLayout: "stacked" | "grid" | "carousel";
}

export interface QuizContentConfig {
  introTitle: string;
  introSubtitle: string;
  introDescription: string;
  introButtonText: string;
  progressText: string;
  navigationLabels: {
    back: string;
    next: string;
    continue: string;
    finish: string;
  };
  loadingText: string;
  errorMessages: {
    general: string;
    network: string;
    validation: string;
  };
}

export interface QuizAnimationConfig {
  enableAnimations: boolean;
  transitionDuration: number;
  easing: string;
  staggerDelay: number;
  hoverEffects: boolean;
  entranceAnimation: "fade" | "slide" | "scale" | "none";
}

export interface QuizConfig {
  id: string;
  name: string;
  version: string;
  lastModified: string;
  theme: QuizThemeConfig;
  behavior: QuizBehaviorConfig;
  layout: QuizLayoutConfig;
  content: QuizContentConfig;
  animations: QuizAnimationConfig;
  metadata: {
    createdBy: string;
    description: string;
    tags: string[];
    status: "draft" | "published" | "archived";
  };
}

export interface QuizConfigState {
  current: QuizConfig;
  history: QuizConfig[];
  isDirty: boolean;
  isLoading: boolean;
  error: string | null;
}

// Configuração padrão
export const DEFAULT_QUIZ_CONFIG: QuizConfig = {
  id: "quiz-descubra-seu-estilo",
  name: "Quiz Descubra Seu Estilo",
  version: "1.0.0",
  lastModified: new Date().toISOString(),
  theme: {
    backgroundColor: "#FEFEFE",
    primaryColor: "#B89B7A",
    secondaryColor: "#432818",
    accentColor: "#D4C4A0",
    textColor: "#432818",
    textSecondaryColor: "#8F7A6A",
    fontFamily: "Playfair Display, serif",
    fontSize: {
      title: "1.5rem",
      subtitle: "1.25rem",
      body: "1rem",
      small: "0.875rem",
    },
  },
  behavior: {
    autoAdvance: true,
    maxSelections: 3,
    showProgress: true,
    enableNavigation: true,
    enableBackButton: true,
    strategicAutoAdvance: false,
    normalQuestionsAutoAdvance: true,
    selectionLimit: {
      normal: 3,
      strategic: 1,
    },
  },
  layout: {
    gridType: "auto",
    cardStyle: "modern",
    spacing: "normal",
    borderRadius: "0.75rem",
    shadowStyle: "subtle",
    optionLayout: "grid",
  },
  content: {
    introTitle: "Descubra Seu Estilo Autêntico",
    introSubtitle: "Um quiz personalizado para descobrir seu estilo único",
    introDescription:
      "Chega de um guarda-roupa lotado e da sensação de que nada combina com Você.",
    introButtonText: "Começar Quiz",
    progressText: "Pergunta {current} de {total}",
    navigationLabels: {
      back: "Voltar",
      next: "Avançar",
      continue: "Continuar",
      finish: "Finalizar",
    },
    loadingText: "Carregando quiz...",
    errorMessages: {
      general: "Ocorreu um erro. Tente novamente.",
      network: "Erro de conexão. Verifique sua internet.",
      validation: "Por favor, selecione uma opção.",
    },
  },
  animations: {
    enableAnimations: true,
    transitionDuration: 300,
    easing: "ease-in-out",
    staggerDelay: 100,
    hoverEffects: true,
    entranceAnimation: "fade",
  },
  metadata: {
    createdBy: "system",
    description: "Quiz para descoberta de estilo pessoal",
    tags: ["estilo", "moda", "personalidade"],
    status: "published",
  },
};
