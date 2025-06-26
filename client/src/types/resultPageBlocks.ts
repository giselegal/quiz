
export type ResultPageBlockType = 
  | 'header'
  | 'result-header'
  | 'styleResult'
  | 'transformation'
  | 'motivation'
  | 'bonus'
  | 'testimonials'
  | 'guarantee'
  | 'mentor'
  | 'transition'
  | 'cta'
  | 'final-cta'
  | 'footer';

export interface ResultPageBlock {
  id: string;
  type: ResultPageBlockType;
  content: any;
  order: number;
  visible: boolean;
}

export interface ResultHeaderBlockContent {
  userName?: string;
  primaryStyle: {
    category: string;
    percentage: number;
  };
  secondaryStyles: Array<{
    category: string;
    percentage: number;
  }>;
  showPersonalization: boolean;
  showSecondaryStyles: boolean;
}

export interface TransitionBlockContent {
  title: string;
  description: string;
  showDecorations: boolean;
  backgroundColor: string;
}

export interface FinalCtaBlockContent {
  products: Array<{
    id: string;
    name: string;
    description: string;
    originalPrice: number;
    salePrice: number;
    image?: string;
  }>;
  timer: {
    enabled: boolean;
    duration: number; // em minutos
    message: string;
  };
  discount: {
    percentage: number;
    message: string;
  };
  buttonText: string;
  buttonColor: string;
  hotmartUrl: string;
}

export interface ResultPageConfig {
  blocks: ResultPageBlock[];
  primaryStyle: any;
  secondaryStyles?: any[];
}
