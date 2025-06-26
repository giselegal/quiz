
import React from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { StagesPanel } from '../StagesPanel';
import { PropertiesPanel } from '../PropertiesPanel';
import { ComponentPreviewPanel } from '../preview/ComponentPreviewPanel';
import { ComponentToolbar } from './ComponentToolbar';
import { QuizComponentData, QuizStage } from '@/types/quizBuilder';

interface BuilderLayoutProps {
  components: QuizComponentData[];
  stages: QuizStage[];
  activeStageId: string | null;
  selectedComponentId: string | null;
  activeStage: QuizStage | null;
  isPreviewing: boolean;
  onComponentSelect: (type: string) => void;
  onStageAdd: (type: QuizStage['type']) => void;
  onStageSelect: (id: string) => void;
  onComponentMove: (draggedId: string, targetId: string) => void;
  onStageMove: (draggedId: string, targetId: string) => void;
  onStageUpdate: (id: string, updates: Partial<QuizStage>) => void;
  onStageDelete: (id: string) => void;
  onComponentUpdate: (id: string, updates: Partial<QuizComponentData>) => void;
  onComponentDelete: (id: string) => void;
  onSelectComponent: (id: string) => void;
}

const BuilderLayout: React.FC<BuilderLayoutProps> = ({
  components,
  stages,
  activeStageId,
  selectedComponentId,
  activeStage,
  isPreviewing,
  onComponentSelect,
  onStageAdd,
  onStageSelect,
  onComponentMove,
  onStageMove,
  onStageUpdate,
  onStageDelete,
  onComponentUpdate,
  onComponentDelete,
  onSelectComponent
}) => {
  const activeStageComponents = activeStageId 
    ? components.filter(c => c.stageId === activeStageId)
    : [];

  const selectedComponent = selectedComponentId 
    ? components.find(c => c.id === selectedComponentId) 
    : null;

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      {/* Left Panel - Stages Sidebar */}
      <ResizablePanel defaultSize={18} minSize={15} maxSize={25} className="bg-[#F9F6F2]">
        <StagesPanel 
          stages={stages} 
          activeStageId={activeStageId}
          onStageSelect={onStageSelect}
          onStageAdd={onStageAdd}
          onStageMove={onStageMove}
          onStageUpdate={onStageUpdate}
          onStageDelete={onStageDelete}
        />
      </ResizablePanel>
      
      <ResizableHandle withHandle />
      
      {/* Center Panel - Preview */}
      <ResizablePanel defaultSize={57}>
        <div className="h-full flex flex-col">
          <ComponentToolbar
            activeStage={activeStage} 
            onComponentSelect={onComponentSelect}
            isPreviewing={isPreviewing}
          />
          <div className="flex-1 bg-[#FAF9F7]">
            <ComponentPreviewPanel 
              components={activeStageComponents}
              selectedComponentId={selectedComponentId}
              onSelectComponent={onSelectComponent}
              onMoveComponent={onComponentMove}
              activeStage={activeStage}
              isPreviewing={isPreviewing}
            />
          </div>
        </div>
      </ResizablePanel>
      
      <ResizableHandle withHandle />
      
      {/* Right Panel - Properties */}
      <ResizablePanel defaultSize={25} className="bg-[#F9F6F2]">
        <PropertiesPanel 
          component={selectedComponent}
          stage={activeStage}
          onClose={() => onSelectComponent('')}
          onUpdate={onComponentUpdate}
          onUpdateStage={onStageUpdate}
          onDelete={onComponentDelete}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default BuilderLayout;
