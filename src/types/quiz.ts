
export type StyleCategory = 
  | 'Natural' 
  | 'Clássico' 
  | 'Contemporâneo' 
  | 'Elegante' 
  | 'Romântico' 
  | 'Sexy' 
  | 'Dramático' 
  | 'Criativo' 
  | string; // Allow any string to handle dynamic values

export interface QuizOption {
  id: string;
  text: string;
  styleCategory: StyleCategory;
  imageUrl?: string;
  points?: number;
  isSelected?: boolean;
}

export interface StyleResult {
  category: StyleCategory;
  score: number;
  percentage: number;
}

export interface QuizAnswers {
  [questionId: string]: string[];
}

export interface QuizQuestion {
  id: string;
  title: string;
  options: QuizOption[];
  type: 'text' | 'image' | 'both';
  multiSelect: number; // 0 = single select, n = select up to n options
  imageUrl?: string;
}

export interface QuizStage {
  id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
}

export interface QuizState {
  currentStageIndex: number;
  currentQuestionIndex: number;
  answers: QuizAnswers;
  stages: QuizStage[];
}

export interface QuizComponentData {
  id: string;
  type: string;
  title?: string;
  options?: QuizOption[];
  [key: string]: any;
}

export interface QuizConfig {
  title: string;
  stages: QuizStage[];
  settings: {
    showProgressBar: boolean;
    allowSkip: boolean;
    showResultsImmediately: boolean;
    theme: string;
  };
}

// Interface for UserResponse
export interface UserResponse {
  questionId: string;
  selectedOptions: string[];
}

// Interface for QuizResult
export interface QuizResult {
  primaryStyle: StyleResult;
  secondaryStyles: StyleResult[];
  totalSelections?: number;
}

// BlockType for the SortableBlock component
export type BlockType = 
  | 'title' 
  | 'subtitle' 
  | 'styleResult' 
  | 'image' 
  | 'text' 
  | 'cta' 
  | 'testimonial' 
  | 'bonus' 
  | 'guarantee' 
  | 'carousel'
  | 'heading'
  | 'paragraph'
  | string; // Allow any string to handle dynamic values

// Add interface for the result page configuration
export interface ResultPageConfig {
  styleType: string;
  header: {
    content: { 
      title: string; 
      subtitle: string;
    };
    style: {
      paddingY: string;
      paddingX: string;
      backgroundColor: string;
      textColor: string;
      borderRadius: string;
    };
    visible: boolean;
  };
  mainContent: {
    content: {
      description: string;
      mainImage: string;
      tabletImage: string;
      showSecondaryStyles: boolean;
      showOffer: boolean;
    };
    style: {
      paddingY: string;
      paddingX: string;
      backgroundColor: string;
      textColor: string;
      borderRadius: string;
    };
    visible: boolean;
  };
  offer: {
    content: {
      title: string;
      description: string;
      buttonText: string;
      buttonUrl: string;
      showPrice: boolean;
      regularPrice: string;
      salePrice: string;
      showInstallments: boolean;
      installmentCount: number;
      installmentPrice: string;
    };
    style: {
      paddingY: string;
      paddingX: string;
      backgroundColor: string;
      textColor: string;
      borderRadius: string;
      buttonColor: string;
      buttonTextColor: string;
    };
    visible: boolean;
  };
  globalStyles?: Record<string, any>;
  blocks?: Array<{
    id: string;
    type: BlockType;
    content: Record<string, any>;
    style?: Record<string, any>;
  }>;
}
