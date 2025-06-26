
import React from 'react';
import { EditorBlock } from '@/types/editor';
import { EditorBlockItem } from './EditorBlockItem';

interface BlockRendererProps {
  blocks: EditorBlock[];
  onUpdate: (id: string, content: any) => void;
  onDelete: (id: string) => void;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({
  blocks,
  onUpdate,
  onDelete
}) => {
  return (
    <div className="space-y-4">
      {blocks.map(block => (
        <EditorBlockItem 
          key={block.id}
          block={block}
          onUpdate={(content) => onUpdate(block.id, content)}
          onDelete={() => onDelete(block.id)}
        />
      ))}
    </div>
  );
};
