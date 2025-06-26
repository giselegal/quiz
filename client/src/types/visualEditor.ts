
export type BlockType = 
  | 'text' 
  | 'title' 
  | 'image' 
  | 'video' 
  | 'audio' 
  | 'button' 
  | 'input' 
  | 'email' 
  | 'phone' 
  | 'checkbox' 
  | 'radio' 
  | 'option' 
  | 'testimonial' 
  | 'price' 
  | 'alert' 
  | 'arguments' 
  | 'carousel' 
  | 'chart' 
  | 'progress' 
  | 'script' 
  | 'spacer' 
  | 'terms'
  | 'loading'
  | 'level'
  | 'calendar'
  | 'headline'
  | 'form'
  | 'question-title'
  | 'question-options';

export interface ElementContent {
  text?: string;
  html?: string;
  src?: string;
  alt?: string;
  href?: string;
  placeholder?: string;
  options?: string[];
  value?: any;
  level?: string;
  type?: string;
  [key: string]: any;
}

export interface ElementStyle {
  width?: string;
  height?: string;
  padding?: string;
  margin?: string;
  backgroundColor?: string;
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  borderRadius?: string;
  border?: string;
  display?: string;
  [key: string]: any;
}

// Primary CanvasElement definition - this is the single source of truth
export interface CanvasElement {
  id: string;
  type: BlockType;
  stageId: string;
  order: number;
  content: ElementContent;
  style: ElementStyle;
  visible: boolean;
  locked: boolean;
}

// Ensure VisualElement is just an alias to CanvasElement for backward compatibility
export type VisualElement = CanvasElement;

export interface VisualStage {
  id: string;
  title: string;
  order: number;
  type: 'intro' | 'quiz' | 'strategic' | 'transition' | 'result' | 'offer';
  settings: {
    showHeader: boolean;
    showProgress: boolean;
    allowBack: boolean;
    backgroundColor?: string;
    [key: string]: any;
  };
}

export interface GlobalStyles {
  backgroundColor: string;
  fontFamily: string;
  primaryColor: string;
  secondaryColor: string;
  containerMaxWidth: string;
  customCSS: string;
}

export interface EditorSettings {
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  showRulers: boolean;
  showBoundingBoxes: boolean;
  autoSave: boolean;
  autoSaveInterval: number;
}

export interface VisualEditorState {
  elements: VisualElement[];
  stages: VisualStage[];
  activeStageId: string | null;
  history: VisualEditorState[];
  historyIndex: number;
  globalStyles?: GlobalStyles;
  selectedElementId?: string | null;
  hoveredElementId?: string | null;
  viewport?: 'desktop' | 'tablet' | 'mobile';
  zoomLevel?: number;
  isPreviewMode?: boolean;
  settings?: EditorSettings;
}

export interface ElementUpdate {
  content?: Partial<ElementContent>;
  style?: Partial<ElementStyle>;
  visible?: boolean;
  locked?: boolean;
}

export interface VisualEditorData {
  editorState: VisualEditorState;
  pageInfo: {
    title: string;
    description: string;
    slug: string;
    published: boolean;
  };
}
