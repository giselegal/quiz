
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

// Add the missing interface for UserResponse
export interface UserResponse {
  questionId: string;
  selectedOptions: string[];
}

// Add the missing interface for QuizResult
export interface QuizResult {
  primaryStyle: StyleResult;
  secondaryStyles: StyleResult[];
  totalSelections?: number;
}

// Add BlockType for the SortableBlock component
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
