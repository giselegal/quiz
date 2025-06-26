
import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Block, BlockType } from '@/types/editor';
import { v4 as uuidv4 } from 'uuid';

export const useSalesPageEditor = (styleType: string) => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);

  // Add a new block of the specified type
  const addBlock = useCallback((type: BlockType) => {
    const newBlock: Block = {
      id: `block-${uuidv4()}`,
      type,
      content: {},
      order: blocks.length
    };
    
    setBlocks(prev => [...prev, newBlock]);
    setSelectedBlockId(newBlock.id);
    
    toast({
      title: "Bloco adicionado",
      description: `Um novo bloco do tipo ${type} foi adicionado.`
    });
    
    return newBlock.id;
  }, [blocks.length]);

  // Update an existing block's content
  const updateBlock = useCallback((blockId: string, content: any) => {
    setBlocks(prevBlocks => 
      prevBlocks.map(block => 
        block.id === blockId ? { ...block, content: { ...block.content, ...content } } : block
      )
    );
  }, []);

  // Delete a block by ID
  const deleteBlock = useCallback((blockId: string) => {
    setBlocks(prevBlocks => prevBlocks.filter(block => block.id !== blockId));
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
    
    toast({
      title: "Bloco removido",
      description: "O bloco foi removido com sucesso."
    });
  }, [selectedBlockId]);

  // Move a block to a new position
  const moveBlock = useCallback((blockId: string, direction: 'up' | 'down') => {
    setBlocks(prevBlocks => {
      const blockIndex = prevBlocks.findIndex(block => block.id === blockId);
      if (blockIndex === -1) return prevBlocks;
      
      const newBlocks = [...prevBlocks];
      const newIndex = direction === 'up' ? Math.max(0, blockIndex - 1) : Math.min(blockIndex + 1, prevBlocks.length - 1);
      
      if (newIndex === blockIndex) return prevBlocks;
      
      const [movedBlock] = newBlocks.splice(blockIndex, 1);
      newBlocks.splice(newIndex, 0, movedBlock);
      
      return newBlocks.map((block, index) => ({
        ...block,
        order: index
      }));
    });
  }, []);

  const handleSave = useCallback(async () => {
    // Placeholder for actual saving functionality
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "O salvamento de páginas de venda estará disponível em breve."
    });
    return true;
  }, []);

  const loadTemplate = useCallback((templateBlocks: Block[]) => {
    // Placeholder for template loading functionality
    setBlocks(templateBlocks);
    toast({
      title: "Template carregado",
      description: "O template foi carregado com sucesso."
    });
    return true;
  }, []);

  return {
    blocks,
    selectedBlockId,
    isPreviewing,
    setSelectedBlockId,
    setIsPreviewing,
    addBlock,
    updateBlock,
    deleteBlock,
    moveBlock,
    handleSave,
    loadTemplate
  };
};
