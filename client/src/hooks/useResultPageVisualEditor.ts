
import { useState, useCallback } from 'react';
import { ResultPageBlock, ResultPageBlockType } from '@/types/resultPageBlocks';
import { StyleResult } from '@/types/quiz';
import { v4 as uuidv4 } from 'uuid';

export const useResultPageVisualEditor = (
  primaryStyle: StyleResult, 
  secondaryStyles?: StyleResult[]
) => {
  const [blocks, setBlocks] = useState<ResultPageBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const addBlock = useCallback((type: ResultPageBlockType) => {
    const newBlock: ResultPageBlock = {
      id: uuidv4(),
      type,
      content: {
        [type]: {} // Initialize with empty content for the specific type
      },
      order: blocks.length,
      visible: true
    };

    setBlocks(prev => [...prev, newBlock]);
    setSelectedBlockId(newBlock.id);
    return newBlock.id;
  }, [blocks.length]);

  const updateBlock = useCallback((blockId: string, updates: Partial<ResultPageBlock>) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId 
        ? { ...block, ...updates }
        : block
    ));
  }, []);

  const deleteBlock = useCallback((blockId: string) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId));
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  }, [selectedBlockId]);

  const reorderBlocks = useCallback((fromIndex: number, toIndex: number) => {
    setBlocks(prev => {
      const newBlocks = [...prev];
      const [removed] = newBlocks.splice(fromIndex, 1);
      newBlocks.splice(toIndex, 0, removed);
      
      // Update order property
      return newBlocks.map((block, index) => ({
        ...block,
        order: index
      }));
    });
  }, []);

  const saveProject = useCallback(async () => {
    try {
      // Here you would save to your backend or localStorage
      const projectData = {
        blocks,
        primaryStyle,
        secondaryStyles,
        lastModified: new Date().toISOString()
      };
      
      localStorage.setItem('resultPageProject', JSON.stringify(projectData));
      console.log('Project saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving project:', error);
      return false;
    }
  }, [blocks, primaryStyle, secondaryStyles]);

  const loadProject = useCallback(() => {
    try {
      const saved = localStorage.getItem('resultPageProject');
      if (saved) {
        const projectData = JSON.parse(saved);
        setBlocks(projectData.blocks || []);
        return true;
      }
    } catch (error) {
      console.error('Error loading project:', error);
    }
    return false;
  }, []);

  return {
    blocks,
    selectedBlockId,
    isPreviewMode,
    setSelectedBlockId,
    setIsPreviewMode,
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    saveProject,
    loadProject
  };
};
