
// Editor Types Compatibility Layer
// This file ensures type compatibility across different editor components

import { CanvasElement, BlockType } from './visualEditor';
import { Block } from './editor';

// Re-export the unified types to ensure consistency
export type { CanvasElement };
export type { BlockType };
export type { Block };

// Legacy compatibility - if needed
export interface LegacyCanvasElement {
  id: string;
  type: 'button' | 'form' | 'image' | 'text' | 'headline';
  stageId: string;
  order: number;
  content: any;
  style: any;
  visible: boolean;
  locked: boolean;
}

// Type converter function for legacy support
export function convertToModernCanvasElement(legacy: LegacyCanvasElement): CanvasElement {
  return {
    ...legacy,
    type: legacy.type as BlockType, // Type assertion since we know it's compatible
    content: legacy.content || {},
    style: legacy.style || {}
  };
}

// Editor state interface
export interface EditorState {
  selectedBlockId: string | null;
  isPreviewing: boolean;
  blocks: Block[];
  isGlobalStylesOpen: boolean;
}

// Block manipulation actions interface
export interface BlockManipulationActions {
  handleAddBlock: (type: Block['type']) => string;
  handleUpdateBlock: (id: string, content: any) => void;
  handleDeleteBlock: (id: string) => void;
  handleReorderBlocks: (sourceIndex: number, destinationIndex: number) => void;
}

// Modern editor props interface
export interface EditorProps {
  selectedStyle: {
    category: string;
    score: number;
    percentage: number;
  };
  onShowTemplates?: () => void;
  initialConfig?: any;
}
