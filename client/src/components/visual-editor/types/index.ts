// === TIPOS COMPARTILHADOS DO QUIZ EDITOR ===

export interface OptionChoice {
  text: string;
  value: string;
  nextStepId?: string;
  nextPageType?: "resultPage" | "quizOfferPage" | "transitionPage";
  scoreValue?: number;
  image?: string;
}

export interface QuizComponentProps {
  // Propriedades Comuns
  text?: string;
  isHidden?: boolean;
  styles?: { [key: string]: string };

  // Propriedades de Imagem
  src?: string;
  alt?: string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";

  // Propriedades de Input
  label?: string;
  placeholder?: string;
  inputType?: "text" | "email" | "number" | "tel";
  required?: boolean;
  validationRegex?: string;
  errorMessage?: string;
  storeAsLeadField?: string;

  // Propriedades de Botão
  buttonText?: string;
  buttonStyle?: "primary" | "secondary" | "outline" | "ghost";
  actionType?: "goToNextStep" | "submitForm" | "redirectUrl" | "customFunction";
  actionTargetId?: string;
  actionUrl?: string;
  customFunctionName?: string;

  // Propriedades de Opções
  questionText?: string;
  choices?: OptionChoice[];
  selectionType?: "single" | "multiple";
  maxSelections?: number;
  minSelections?: number;
  conditionalLogic?: {
    rule: "allSelected" | "anySelected" | "scoreThreshold";
    threshold?: number;
    targetStepId?: string;
    fallbackStepId?: string;
  };

  // Propriedades de Alerta
  alertType?: "info" | "warning" | "error" | "success";
  alertMessage?: string;

  // Propriedades de Vídeo
  videoUrl?: string;
  autoplay?: boolean;
  loop?: boolean;
  controls?: boolean;

  // Propriedades de Carrossel
  images?: { src: string; alt: string; caption?: string }[];
  autoSlide?: boolean;
  slideInterval?: number;

  // Propriedades de Spacer
  height?: number;

  // Propriedades de Resultado/Oferta
  resultType?: "styleAnalysis" | "personalityProfile";
  offerHeadline?: string;
  offerDescription?: string;
  offerCtaButtonText?: string;
  offerCtaUrl?: string;
  resultMapping?: {
    scoreRange: [number, number];
    resultId: string;
    offerId: string;
  }[];
  offerProductSku?: string;

  // Índice flexível para propriedades customizadas
  [key: string]: unknown;
}

export interface QuizComponent {
  id: string;
  type: string;
  props: QuizComponentProps;
}

export interface Step {
  id: string;
  name: string;
  components: QuizComponent[];
}

// Tipos para hooks e utilitários
export interface EditorState {
  steps: Step[];
  currentStepId: string;
  selectedComponentId: string | null;
}

export interface EditorActions {
  addStep: () => void;
  deleteStep: (stepId: string) => void;
  duplicateStep: (stepId: string) => void;
  selectStep: (stepId: string) => void;
  selectComponent: (componentId: string) => void;
  updateComponent: (componentId: string, props: QuizComponentProps) => void;
  deleteComponent: (componentId: string) => void;
  addComponent: (type: string) => void;
}

// Tipos para eventos de drag & drop
export interface DragData {
  componentType: string;
  sourceId?: string;
}

// Tipos para validação
export interface ValidationError {
  componentId: string;
  field: string;
  message: string;
}

export interface EditorValidation {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}
