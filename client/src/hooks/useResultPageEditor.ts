
import { useState, useCallback, useEffect } from 'react';
import { Block } from '@/types/editor';
import { toast } from '@/components/ui/use-toast';
import { useResultPageConfig } from './useResultPageConfig';
import { getDefaultContentForType } from '@/utils/editorDefaults';
import { generateId } from '@/utils/idGenerator';

// Local interfaces for this hook
interface LocalEditorState {
  selectedBlockId: string | null;
  isPreviewing: boolean;
  blocks: Block[];
  isGlobalStylesOpen: boolean;
}

interface LocalBlockManipulationActions {
  handleAddBlock: (type: Block['type']) => string;
  handleUpdateBlock: (id: string, content: any) => void;
  handleDeleteBlock: (id: string) => void;
  handleReorderBlocks: (sourceIndex: number, destinationIndex: number) => void;
}

export const useResultPageEditor = (styleType: string) => {
  const [state, setState] = useState<LocalEditorState>({
    selectedBlockId: null,
    isPreviewing: false,
    blocks: [],
    isGlobalStylesOpen: false
  });

  const { 
    resultPageConfig, 
    updateSection, 
    saveConfig,
    resetConfig,
    importConfig,
    loading 
  } = useResultPageConfig(styleType);

  // Initialize blocks from config when it's loaded
  useEffect(() => {
    if (resultPageConfig?.blocks) {
      setState(prev => ({
        ...prev,
        blocks: resultPageConfig.blocks
      }));
    } else {
      // Initialize with empty blocks array if not present
      updateSection('blocks', []);
    }
  }, [resultPageConfig, updateSection]);

  const togglePreview = useCallback(() => {
    setState(prev => ({ ...prev, isPreviewing: !prev.isPreviewing }));
  }, []);

  const selectBlock = useCallback((blockId: string | null) => {
    setState(prev => ({ ...prev, selectedBlockId: blockId }));
  }, []);

  const handleAddBlock = useCallback((type: Block['type']) => {
    const newBlock: Block = {
      id: generateId(),
      type,
      content: getDefaultContentForType(type),
      order: state.blocks.length
    };
    
    const newBlocks = [...state.blocks, newBlock];
    
    setState(prev => ({
      ...prev,
      blocks: newBlocks,
      selectedBlockId: newBlock.id
    }));
    
    // Sync with resultPageConfig
    updateSection('blocks', newBlocks);
    
    return newBlock.id;
  }, [state.blocks, updateSection]);

  const handleUpdateBlock = useCallback((id: string, content: any) => {
    const updatedBlocks = state.blocks.map(block =>
      block.id === id ? { ...block, content: { ...block.content, ...content } } : block
    );
    
    setState(prev => ({
      ...prev,
      blocks: updatedBlocks
    }));
    
    // Sync with resultPageConfig
    updateSection('blocks', updatedBlocks);
  }, [state.blocks, updateSection]);

  const handleDeleteBlock = useCallback((id: string) => {
    const filteredBlocks = state.blocks
      .filter(block => block.id !== id)
      .map((block, index) => ({ ...block, order: index }));
    
    setState(prev => ({
      ...prev,
      blocks: filteredBlocks,
      selectedBlockId: null
    }));
    
    // Sync with resultPageConfig
    updateSection('blocks', filteredBlocks);
  }, [state.blocks, updateSection]);

  const handleReorderBlocks = useCallback((sourceIndex: number, destinationIndex: number) => {
    const result = Array.from(state.blocks);
    const [removed] = result.splice(sourceIndex, 1);
    result.splice(destinationIndex, 0, removed);
    
    const reorderedBlocks = result.map((block, index) => ({
      ...block,
      order: index
    }));
    
    setState(prev => ({
      ...prev,
      blocks: reorderedBlocks
    }));
    
    // Sync with resultPageConfig
    updateSection('blocks', reorderedBlocks);
  }, [state.blocks, updateSection]);

  const toggleGlobalStyles = useCallback(() => {
    setState(prev => ({
      ...prev,
      isGlobalStylesOpen: !prev.isGlobalStylesOpen
    }));
  }, []);

  // Improved import config with error handling
  const handleImportConfig = useCallback((config: any) => {
    if (!config) {
      console.warn('Tentativa de importar configuração nula ou indefinida');
      return false;
    }
    
    try {
      if (importConfig) {
        importConfig(config);
        
        // Se a configuração tiver blocos, atualizar o estado local também
        if (config.blocks) {
          setState(prev => ({
            ...prev,
            blocks: config.blocks
          }));
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao importar configuração:', error);
      return false;
    }
  }, [importConfig]);

  const actions: LocalBlockManipulationActions = {
    handleAddBlock,
    handleUpdateBlock,
    handleDeleteBlock,
    handleReorderBlocks
  };

  return {
    resultPageConfig,
    loading,
    blocks: state.blocks,
    selectedBlockId: state.selectedBlockId,
    isPreviewing: state.isPreviewing,
    isGlobalStylesOpen: state.isGlobalStylesOpen,
    selectBlock,
    actions: {
      handleSave: saveConfig,
      handleReset: () => resetConfig(styleType),
      toggleGlobalStyles,
      togglePreview,
      updateSection,
      importConfig: handleImportConfig,
      ...actions
    }
  };
};
