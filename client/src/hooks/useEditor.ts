
import { useContext } from 'react';
import { EditorContext } from '@/contexts/EditorContext';
import { EditorState, EditorAction, Block } from '@/types/editor';

// Hook that provides the expected interface for editor components
export const useEditor = () => {
  const context = useContext(EditorContext);
  
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }

  const { state, dispatch } = context;

  // Create a config object that matches what components expect
  const config = {
    blocks: state.blocks || [],
    selectedBlockId: state.selectedBlockId,
    isPreviewing: state.isPreviewing || false,
    isGlobalStylesOpen: state.isGlobalStylesOpen || false,
    // Add missing properties with defaults
    isDirty: false,
    current: state.currentStepId || null
  };

  const addBlock = (type: Block['type']): string => {
    const newBlock: Block = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content: getDefaultContentForType(type),
      order: config.blocks.length
    };

    dispatch({
      type: 'ADD_BLOCK',
      payload: newBlock
    });

    return newBlock.id;
  };

  const updateBlock = (id: string, content: any) => {
    dispatch({
      type: 'UPDATE_BLOCK',
      payload: { id, content }
    });
  };

  const deleteBlock = (id: string) => {
    dispatch({
      type: 'DELETE_BLOCK',
      payload: { id }
    });
  };

  const reorderBlocks = (sourceIndex: number, destinationIndex: number) => {
    dispatch({
      type: 'REORDER_BLOCKS',
      payload: { sourceIndex, destinationIndex }
    });
  };

  return {
    config,
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    state,
    dispatch
  };
};

// Helper function to get default content for different block types
function getDefaultContentForType(type: Block['type']): any {
  switch (type) {
    case 'headline':
      return {
        title: 'Título Principal',
        subtitle: 'Subtítulo ou descrição'
      };
    case 'text':
      return {
        text: 'Digite seu texto aqui...'
      };
    case 'image':
      return {
        imageUrl: '',
        imageAlt: 'Imagem',
        caption: ''
      };
    case 'button':
      return {
        text: 'Clique aqui',
        action: 'next'
      };
    default:
      return {};
  }
}
