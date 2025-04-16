
export interface QuizOption {
  id: string;
  text: string;
  imageUrl?: string;
  styleCategory: 'Natural' | 'Clássico' | 'Contemporâneo' | 'Elegante' | 'Romântico' | 'Sexy' | 'Dramático' | 'Criativo';
}

export interface QuizQuestion {
  id: string;
  title: string;
  type: 'text' | 'image' | 'both';
  multiSelect?: number;
  options: QuizOption[];
}

export interface QuizResult {
  primaryStyle: string;
  percentage: number;
  description: string;
  complementaryStyles: Array<{
    style: string;
    percentage: number;
  }>;
}

export interface UserResponse {
  questionId: string;
  selectedOptions: string[];
}
