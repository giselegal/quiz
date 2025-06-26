
import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ComponentsSidebar } from './sidebar/ComponentsSidebar';
import { StyleResult } from '@/types/quiz';
import PropertiesPanel from './properties/PropertiesPanel';
import { EditorToolbar } from './toolbar/EditorToolbar';
import { useUnifiedEditor } from '@/hooks/useUnifiedEditor';
import ResultEditorPanel from '@/components/unified-editor/panels/ResultEditorPanel';

interface UnifiedEditorLayoutProps {
  primaryStyle: StyleResult;
}

export const UnifiedEditorLayout: React.FC<UnifiedEditorLayoutProps> = ({
  primaryStyle
}) => {
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [viewportSize, setViewportSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');

  const {
    resultPageEditor,
    saveAll
  } = useUnifiedEditor(primaryStyle);

  const handleTogglePreview = () => {
    setIsPreviewing(prev => !prev);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <EditorToolbar
        isPreviewing={isPreviewing}
        viewportSize={viewportSize}
        onViewportSizeChange={setViewportSize}
        onTogglePreview={handleTogglePreview}
        onSave={saveAll}
      />
      
      <div className="flex-1 overflow-hidden">
        <ResultEditorPanel 
          isPreviewing={isPreviewing} 
          primaryStyle={primaryStyle}
        />
      </div>
    </div>
  );
};
