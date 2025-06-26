
import React from 'react';
import { Block } from '@/types/editor';
import { cn } from '@/lib/utils';
import { StyleResult } from '@/types/quiz';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BlockPreviewRenderer } from './BlockPreviewRenderer';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface PreviewPanelProps {
  blocks: Block[];
  selectedBlockId: string | null;
  onBlockSelect: (id: string) => void;
  onBlockDelete: (id: string) => void;
  isPreviewing: boolean;
  previewDevice: 'mobile' | 'tablet' | 'desktop';
  primaryStyle?: StyleResult;
  onBlocksReorder?: (blocks: Block[]) => void;
}

const viewportWidths = {
  mobile: 375,
  tablet: 768,
  desktop: 1024,
};

export function PreviewPanel({
  blocks,
  selectedBlockId,
  onBlockSelect,
  onBlockDelete,
  isPreviewing,
  previewDevice,
  primaryStyle,
  onBlocksReorder
}: PreviewPanelProps) {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id || !onBlocksReorder) return;
    
    const oldIndex = blocks.findIndex(block => block.id === active.id);
    const newIndex = blocks.findIndex(block => block.id === over.id);
    
    if (oldIndex !== -1 && newIndex !== -1) {
      const newBlocks = [...blocks];
      const [reorderedItem] = newBlocks.splice(oldIndex, 1);
      newBlocks.splice(newIndex, 0, reorderedItem);
      onBlocksReorder(newBlocks);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#FAF9F7] overflow-hidden">
      <div className="flex-1 overflow-hidden p-4">
        <div className="h-full flex justify-center">
          <div 
            className={cn(
              "bg-white rounded-md shadow overflow-hidden transition-all duration-200 h-full",
              isPreviewing ? "shadow-md" : "shadow-sm"
            )}
            style={{ 
              width: `${viewportWidths[previewDevice]}px`,
              maxWidth: '100%'
            }}
          >
            <ScrollArea className="h-full">
              <div className="p-4">
                <DndContext
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={blocks.map(block => block.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {blocks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-[#B89B7A]/30 rounded-lg p-6 text-center">
                        <p className="text-[#8F7A6A]">Adicione componentes do painel esquerdo para começar</p>
                      </div>
                    ) : (
                      blocks.map(block => (
                        <BlockPreviewRenderer
                          key={block.id}
                          block={block}
                          isSelected={block.id === selectedBlockId}
                          isPreviewing={isPreviewing}
                          onSelect={() => onBlockSelect(block.id)}
                          onDelete={() => onBlockDelete(block.id)}
                          primaryStyle={primaryStyle}
                        />
                      ))
                    )}
                  </SortableContext>
                </DndContext>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
