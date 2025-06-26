
import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ComponentsSidebar } from '../sidebar/ComponentsSidebar';
import { EditPreview } from '../preview/EditPreview';
import PropertiesPanel from '../properties/PropertiesPanel';
import { cn } from '@/lib/utils';
import { useEditor } from '@/hooks/useEditor';

interface EditorWorkspaceProps {
  className?: string;
}

export function EditorWorkspace({ className }: EditorWorkspaceProps) {
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const { config, addBlock, updateBlock, deleteBlock } = useEditor();

  return (
    <div className={cn("h-screen flex flex-col bg-[#FAF9F7]", className)}>
      <ResizablePanelGroup direction="horizontal">
        {/* Components Sidebar */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <ComponentsSidebar 
            onComponentSelect={(type) => {
              const id = addBlock(type);
              setSelectedComponentId(id);
            }} 
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Preview Area */}
        <ResizablePanel defaultSize={55}>
          <EditPreview 
            isPreviewing={isPreviewing}
            onPreviewToggle={() => setIsPreviewing(!isPreviewing)}
            onSelectComponent={setSelectedComponentId}
            selectedComponentId={selectedComponentId}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Properties Panel */}
        <ResizablePanel defaultSize={25}>
          <PropertiesPanel
            selectedComponentId={selectedComponentId}
            onClose={() => setSelectedComponentId(null)}
            blocks={config.blocks}
            onUpdate={(content) => {
              if (selectedComponentId) {
                updateBlock(selectedComponentId, content);
              }
            }}
            onDelete={() => {
              if (selectedComponentId) {
                deleteBlock(selectedComponentId);
                setSelectedComponentId(null);
              }
            }}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
