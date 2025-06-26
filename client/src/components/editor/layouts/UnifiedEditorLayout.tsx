
import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResultPagePreview } from '../preview/ResultPagePreview';
import PropertiesPanel from '../properties/PropertiesPanel';
import { ComponentsSidebar } from '../sidebar/ComponentsSidebar';
import { EditorBlock } from '@/types/editor';
import { useEditor } from '@/hooks/useEditor';
import { useResultPageConfig } from '@/hooks/useResultPageConfig';
import { StyleResult } from '@/types/quiz';

interface UnifiedEditorLayoutProps {
  primaryStyle: StyleResult;
}

export const UnifiedEditorLayout: React.FC<UnifiedEditorLayoutProps> = ({ primaryStyle }) => {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const { config, addBlock, updateBlock, deleteBlock } = useEditor();
  const { resultPageConfig, updateSection } = useResultPageConfig(primaryStyle.category);

  const handleComponentSelect = (type: EditorBlock['type']) => {
    const newBlockId = addBlock(type);
    setSelectedBlock(newBlockId);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Tabs defaultValue="result" className="flex-1 flex flex-col">
        <div className="border-b bg-white px-4">
          <TabsList>
            <TabsTrigger value="result">Página de Resultado</TabsTrigger>
            <TabsTrigger value="sales">Página de Venda</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1">
          <TabsContent value="result" className="h-full mt-0">
            <ResizablePanelGroup direction="horizontal" className="h-full">
              {/* Left Sidebar - Components */}
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                <div className="h-full border-r border-[#B89B7A]/20 bg-white overflow-y-auto">
                  <ComponentsSidebar onComponentSelect={handleComponentSelect} />
                </div>
              </ResizablePanel>
              
              <ResizableHandle withHandle />
              
              {/* Central Area - Page Preview */}
              <ResizablePanel defaultSize={55}>
                <ResultPagePreview
                  primaryStyle={primaryStyle}
                  config={resultPageConfig}
                  onSectionSelect={setSelectedSection}
                  selectedSection={selectedSection}
                />
              </ResizablePanel>
              
              <ResizableHandle withHandle />
              
              {/* Right Sidebar - Properties */}
              <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
                <div className="h-full border-l border-[#B89B7A]/20 bg-white overflow-y-auto">
                  <PropertiesPanel
                    selectedComponentId={selectedSection || selectedBlock}
                    onClose={() => {
                      setSelectedSection(null);
                      setSelectedBlock(null);
                    }}
                    blocks={config.blocks}
                    onUpdate={(content) => {
                      if (selectedSection) {
                        updateSection(selectedSection, content);
                      } else if (selectedBlock) {
                        updateBlock(selectedBlock, content);
                      }
                    }}
                    onDelete={() => {
                      if (selectedBlock) {
                        deleteBlock(selectedBlock);
                        setSelectedBlock(null);
                      }
                    }}
                  />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </TabsContent>

          <TabsContent value="sales" className="h-full mt-0">
            <div className="h-full p-4 bg-[#FAF9F7]">
              {/* Sales page preview implementation */}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
