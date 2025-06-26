
export interface StyleResult {
  category: 'Natural' | 'Clássico' | 'Contemporâneo' | 'Elegante' | 'Romântico' | 'Sexy' | 'Dramático' | 'Criativo';
  score: number;
  percentage: number;
}

export interface QuizResult {
  primaryStyle: StyleResult;
  secondaryStyles: StyleResult[];
  totalSelections: number;
  userName?: string;
}

export interface QuizComponentData {
  id: string;
  type: string;
  content: any;
  position: number;
  data?: any;
}

export type BlockType =
  | "hero"
  | "image"
  | "text"
  | "video"
  | "button"
  | "divider"
  | "spacer"
  | "code"
  | "list"
  | "table"
  | "form"
  | "social"
  | "map"
  | "raw-html"
  | "raw-js"
  | "transformation"
  | "pricing"
  | "testimonials"
  | "guarantee"
  | "faq"
  | "bonus"
  | "scarcity-timer"
  | "dynamic-content"
  | "integrations"
  | "legal"
  | "custom-code"
  | "heading"
  | "paragraph";

export interface UserResponse {
  questionId: string;
  selectedOptions: string[];
}

export interface QuizQuestion {
  id: string;
  title: string;
  type: 'image' | 'text' | 'both';
  options: QuizOption[];
  multiSelect: number;
  imageUrl?: string;
}

export interface QuizOption {
  id: string;
  text: string;
  styleCategory: string;
  imageUrl?: string;
  points?: number;
}

// Comprehensive Editor Block types - includes all block types used across the system
export type EditorBlockType = 
  | 'header'
  | 'hero-section'
  | 'bonus-carousel'
  | 'headline'
  | 'text'
  | 'image'
  | 'benefits'
  | 'testimonials'
  | 'pricing'
  | 'guarantee'
  | 'cta'
  | 'style-result'
  | 'secondary-styles'
  | 'products'
  | 'bonus'
  | 'result-header'
  | 'transition'
  | 'final-cta'
  | 'button'
  | 'video'
  | 'spacer'
  | 'form'
  | 'two-column'
  | 'icon'
  | 'faq'
  | 'carousel'
  | 'custom-code'
  | 'animation-block'
  | 'transformation'
  | 'footer';

// Unified Block interface - this replaces the separate Block and EditorBlock
export interface Block {
  id: string;
  type: EditorBlockType;
  content: any;
  order: number;
}

// Alias for backwards compatibility
export type EditorBlock = Block;

// Editable content type for legacy compatibility
export interface EditableContent {
  [key: string]: any;
}

// Editor step settings
export interface EditorStepSettings {
  allowReturn?: boolean;
  showLogo?: boolean;
  showProgress?: boolean;
}

export interface EditorState {
  steps: EditorStep[];
  currentStepId: string;
  blocks: Block[];
  selectedBlockId: string | null;
  selectedElementId?: string | null;
  isPreviewing: boolean;
  isGlobalStylesOpen: boolean;
  isDirty: boolean;
  isLoading?: boolean;
  current: string | null;
  version?: string;
}

export interface EditorStep {
  id: string;
  name: string;
  elements: EditorElement[];
  settings?: EditorStepSettings;
}

export interface EditorElement {
  id: string;
  type: string;
  content: any;
  styles: any;
}

// Updated Editor actions to include all the actions being used
export type EditorAction = 
  | { type: 'ADD_BLOCK'; payload: Block }
  | { type: 'UPDATE_BLOCK'; payload: { id: string; content: any } }
  | { type: 'DELETE_BLOCK'; payload: { id: string } }
  | { type: 'REORDER_BLOCKS'; payload: { sourceIndex: number; destinationIndex: number } }
  | { type: 'SELECT_ELEMENT'; payload: string }
  | { type: 'SET_BLOCKS'; payload: Block[] }
  | { type: 'ADD_STEP'; payload: EditorStep }
  | { type: 'UPDATE_STEP'; payload: { id: string; updates: Partial<EditorStep> } }
  | { type: 'DELETE_STEP'; payload: { id: string } }
  | { type: 'SET_CURRENT_STEP'; payload: string }
  | { type: 'ADD_ELEMENT'; payload: { stepId: string; element: EditorElement } }
  | { type: 'UPDATE_ELEMENT'; payload: { stepId: string; elementId: string; updates: Partial<EditorElement> } }
  | { type: 'DELETE_ELEMENT'; payload: { stepId: string; elementId: string } }
  | { type: 'REORDER_ELEMENTS'; payload: { stepId: string; elementIds: string[] } };
