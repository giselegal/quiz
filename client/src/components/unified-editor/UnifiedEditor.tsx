
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Save, Eye, EyeOff } from 'lucide-react';
import { UnifiedEditorState } from '@/types/unifiedEditor';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { UnifiedComponentsSidebar } from './sidebar/UnifiedComponentsSidebar';
import { EditorToolbar } from './toolbar/EditorToolbar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { toast } from '@/components/ui/use-toast';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import TypeformEditor from './TypeformEditor';

interface UnifiedEditorProps {
  initialData?: any;
}

const UnifiedEditor: React.FC<UnifiedEditorProps> = ({ initialData }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      setEditorState(prev => {
        const activeTab = prev.activeTab;
        const stateKey = `${activeTab}EditorState`;
        const items = prev[stateKey].components || prev[stateKey].blocks;
        
        if (!items) return prev;

        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return prev;

        const newItems = [...items];
        const [movedItem] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, movedItem);

        return {
          ...prev,
          [stateKey]: {
            ...prev[stateKey],
            [items === prev[stateKey].components ? 'components' : 'blocks']: newItems
          }
        };
      });
    }
  };
  const [editorState, setEditorState] = useState<UnifiedEditorState>({
    activeTab: 'quiz',
    isPreviewing: false,
    quizEditorState: {
      components: [],
      stages: [],
    },
    resultEditorState: {
      config: {
        styleType: '',
        header: {
          visible: true,
          content: {}
        },
        mainContent: {
          visible: true,
          content: {}
        },
        offer: {
          hero: {
            visible: true,
            content: {}
          },
          benefits: {
            visible: true,
            content: {}
          },
          products: {
            visible: true,
            content: {}
          },
          pricing: {
            visible: true,
            content: {}
          },
          testimonials: {
            visible: true,
            content: {}
          },
          guarantee: {
            visible: true,
            content: {}
          }
        }
      },
      blocks: [],
    },
    salesEditorState: {
      blocks: [],
    },
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Implementar lógica de salvamento aqui
    setTimeout(() => setIsSaving(false), 1000);
  };

  const togglePreview = () => {
    setEditorState(prev => ({
      ...prev,
      isPreviewing: !prev.isPreviewing
    }));
  };

  const openTemplateModal = () => {
    setIsTemplateModalOpen(true);
  };

  const closeTemplateModal = () => {
    setIsTemplateModalOpen(false);
  };

  // Helper function to handle component selection
  const handleComponentSelect = (type: string) => {
    console.log('Component selected:', type);
    // Implementation would go here
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <EditorToolbar
        isPreviewing={editorState.isPreviewing}
        onPreviewToggle={togglePreview}
        onSave={handleSave}
        onOpenTemplateModal={openTemplateModal}
        viewportSize="lg"
        onViewportSizeChange={() => {}}
      />

      <div className="flex-1 overflow-hidden">
        <Tabs
          defaultValue="quiz"
          className="h-full flex flex-col"
          onValueChange={(value) => setEditorState(prev => ({ ...prev, activeTab: value as 'quiz' | 'result' | 'sales' }))}
        >
          <TabsList className="w-full border-b bg-white px-4 pt-2">
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
            <TabsTrigger value="result">Página de Resultado</TabsTrigger>
            <TabsTrigger value="sales">Página de Vendas</TabsTrigger>
          </TabsList>

          <TabsContent value="quiz" className="flex-1 h-[calc(100%-40px)] overflow-hidden">
            <TooltipProvider>
              <ResizablePanelGroup direction="horizontal" className="h-full">
                <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                  <div className="h-full border-r bg-white overflow-y-auto">
                    <UnifiedComponentsSidebar 
                      onComponentSelect={handleComponentSelect}
                      activeTab="quiz" 
                      activeStageType={null}
                    />
                  </div>
                </ResizablePanel>
                
                <ResizableHandle withHandle />
                
                <ResizablePanel defaultSize={55}>
                  <div className="h-full bg-[#FAF9F7] p-4 overflow-y-auto">
                    {/* Área de Preview/Edição */}
                    <div className="bg-white rounded-lg shadow-sm min-h-full p-6">
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                        onDragEnd={handleDragEnd}
                      >
                        <TypeformEditor
                          editorState={editorState}
                          onStateChange={setEditorState}
                          isPreviewing={editorState.isPreviewing}
                        />
                      </DndContext>
                    </div>
                  </div>
                </ResizablePanel>
                
                <ResizableHandle withHandle />
                
                <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
                  <div className="h-full border-l bg-white overflow-y-auto p-4">
                    <h3 className="font-medium mb-4">Propriedades</h3>
                    {/* Painel de Propriedades */}
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </TooltipProvider>
          </TabsContent>

          <TabsContent value="result" className="flex-1 h-[calc(100%-40px)] overflow-hidden">
            <TooltipProvider>
              <ResizablePanelGroup direction="horizontal" className="h-full">
                <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                  <div className="h-full border-r bg-white overflow-y-auto">
                    <UnifiedComponentsSidebar 
                      onComponentSelect={handleComponentSelect}
                      activeTab="result"
                      activeStageType={null}
                    />
                  </div>
                </ResizablePanel>
                
                <ResizableHandle withHandle />
                
                <ResizablePanel defaultSize={55}>
                  <div className="h-full bg-[#FAF9F7] p-4 overflow-y-auto">
                    {/* Área de Preview/Edição */}
                    <div className="bg-white rounded-lg shadow-sm min-h-full p-6">
                      {editorState.isPreviewing ? (
                        <div>Preview da Página de Resultado</div>
                      ) : (
                        <div>Editor da Página de Resultado</div>
                      )}
                    </div>
                  </div>
                </ResizablePanel>
                
                <ResizableHandle withHandle />
                
                <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
                  <div className="h-full border-l bg-white overflow-y-auto p-4">
                    <h3 className="font-medium mb-4">Propriedades</h3>
                    {/* Painel de Propriedades */}
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </TooltipProvider>
          </TabsContent>

          <TabsContent value="sales" className="flex-1 h-[calc(100%-40px)] overflow-hidden">
            <TooltipProvider>
              <ResizablePanelGroup direction="horizontal" className="h-full">
                <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                  <div className="h-full border-r bg-white overflow-y-auto">
                    <UnifiedComponentsSidebar 
                      onComponentSelect={handleComponentSelect}
                      activeTab="sales"
                      activeStageType={null}
                    />
                  </div>
                </ResizablePanel>
                
                <ResizableHandle withHandle />
                
                <ResizablePanel defaultSize={55}>
                  <div className="h-full bg-[#FAF9F7] p-4 overflow-y-auto">
                    {/* Área de Preview/Edição */}
                    <div className="bg-white rounded-lg shadow-sm min-h-full p-6">
                      {editorState.isPreviewing ? (
                        <div>Preview da Página de Vendas</div>
                      ) : (
                        <div>Editor da Página de Vendas</div>
                      )}
                    </div>
                  </div>
                </ResizablePanel>
                
                <ResizableHandle withHandle />
                
                <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
                  <div className="h-full border-l bg-white overflow-y-auto p-4">
                    <h3 className="font-medium mb-4">Propriedades</h3>
                    {/* Painel de Propriedades */}
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </TooltipProvider>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UnifiedEditor;
