
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { EditorBlock } from '@/types/editor';

interface PreviewContainerProps {
  viewMode: 'desktop' | 'mobile';
  blocks: EditorBlock[];
  onAddBlock: () => void;
  renderBlockContent: (block: EditorBlock) => React.ReactNode;
}

export const PreviewContainer: React.FC<PreviewContainerProps> = ({
  viewMode,
  blocks,
  onAddBlock,
  renderBlockContent
}) => {
  return (
    <div className={cn(
      "flex-1 overflow-y-auto p-8",
      viewMode === 'mobile' ? 'max-w-md mx-auto' : ''
    )}>
      <div className="min-h-full bg-white rounded-lg shadow-sm border border-[#B89B7A]/20 p-6">
        {blocks.length > 0 ? (
          <div className="space-y-6">
            {blocks.map((block) => (
              <div key={block.id} className="relative">
                {renderBlockContent(block)}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-[#8F7A6A] text-sm border-2 border-dashed border-[#B89B7A]/40 rounded-lg">
            <p className="mb-4">Arraste componentes para esta área ou clique no botão abaixo</p>
            <Button 
              variant="outline"
              onClick={onAddBlock}
              className="border-[#B89B7A] text-[#B89B7A]"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Adicionar Componente
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
