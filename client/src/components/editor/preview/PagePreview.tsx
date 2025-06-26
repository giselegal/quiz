
import React from 'react';
import { StyleResult } from '@/types/quiz';
import { EditorBlock } from '@/types/editor';
import { PreviewToolbar } from './PreviewToolbar';
import { PreviewContainer } from './PreviewContainer';
import { BlockRenderer } from './BlockRenderer';

interface PagePreviewProps {
  primaryStyle: StyleResult;
  onSelectComponent: (id: string) => void;
  blocks: EditorBlock[];
  onAddBlock: () => void;
}

const PagePreview = ({ primaryStyle, onSelectComponent, blocks, onAddBlock }: PagePreviewProps) => {
  const [viewMode, setViewMode] = React.useState<'desktop' | 'mobile'>('desktop');
  const [isPreviewing, setIsPreviewing] = React.useState(false);

  const renderBlockContent = (block: EditorBlock) => (
    <BlockRenderer 
      block={block} 
      onSelect={() => onSelectComponent(block.id)} 
    />
  );

  return (
    <div className="h-full flex flex-col bg-[#FAF9F7]">
      <PreviewToolbar
        viewMode={viewMode}
        isPreviewing={isPreviewing}
        onViewModeChange={setViewMode}
        onPreviewToggle={() => setIsPreviewing(!isPreviewing)}
      />
      <PreviewContainer
        viewMode={viewMode}
        blocks={blocks}
        onAddBlock={onAddBlock}
        renderBlockContent={renderBlockContent}
      />
    </div>
  );
};

export default PagePreview;
