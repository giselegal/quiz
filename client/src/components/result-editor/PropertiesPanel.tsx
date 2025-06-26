
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EditorBlock } from '@/types/editor';
import { ResultHeaderBlockEditor } from './block-editors/ResultHeaderBlockEditor';
import { TransitionBlockEditor } from './block-editors/TransitionBlockEditor';
import { FinalCtaBlockEditor } from './block-editors/FinalCtaBlockEditor';
import { ResultHeaderBlockContent, TransitionBlockContent, FinalCtaBlockContent } from '@/types/resultPageBlocks';

interface PropertiesPanelProps {
  selectedBlockId: string | null;
  blocks: EditorBlock[];
  onClose: () => void;
  onUpdate: (id: string, content: any) => void;
  onDelete: (id: string) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedBlockId,
  blocks,
  onClose,
  onUpdate,
  onDelete
}) => {
  const selectedBlock = blocks.find(block => block.id === selectedBlockId);

  if (!selectedBlock) {
    return (
      <div className="h-full flex flex-col bg-white border-l">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-[#432818]">Propriedades</h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <div>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#B89B7A]/10 flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <h4 className="font-medium text-[#432818] mb-2">Nenhum componente selecionado</h4>
            <p className="text-sm text-[#8F7A6A]">
              Clique em um componente no canvas para editar suas propriedades
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleUpdate = (updates: any) => {
    onUpdate(selectedBlock.id, { ...selectedBlock.content, ...updates });
  };

  const renderEditor = () => {
    switch (selectedBlock.type) {
      case 'result-header':
        return (
          <ResultHeaderBlockEditor
            content={selectedBlock.content as ResultHeaderBlockContent}
            onUpdate={handleUpdate}
          />
        );
      case 'transition':
        return (
          <TransitionBlockEditor
            content={selectedBlock.content as TransitionBlockContent}
            onUpdate={handleUpdate}
          />
        );
      case 'final-cta':
        return (
          <FinalCtaBlockEditor
            content={selectedBlock.content as FinalCtaBlockContent}
            onUpdate={handleUpdate}
          />
        );
      default:
        return (
          <div className="p-4">
            <p className="text-sm text-[#8F7A6A]">
              Editor para o componente "{selectedBlock.type}" ainda não implementado.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-l">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-[#432818]">Propriedades</h3>
          <p className="text-xs text-[#8F7A6A] capitalize">{selectedBlock.type}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(selectedBlock.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {renderEditor()}
        </div>
      </ScrollArea>
    </div>
  );
};
