
import React, { useState } from 'react';
import { QuizStage } from '@/types/quizBuilder';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { BookOpen, FileQuestion, Award, PlusCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { StageSection } from './stages/StageSection';

interface StagesPanelProps {
  stages: QuizStage[];
  activeStageId: string | null;
  onStageSelect: (stageId: string) => void;
  onStageAdd: (type: QuizStage['type']) => void;
  onStageMove: (draggedId: string, targetId: string) => void;
  onStageUpdate: (id: string, updates: Partial<QuizStage>) => void;
  onStageDelete: (id: string) => void;
}

export const StagesPanel: React.FC<StagesPanelProps> = ({
  stages,
  activeStageId,
  onStageSelect,
  onStageAdd,
  onStageMove,
  onStageUpdate,
  onStageDelete
}) => {
  const [expandedTypes, setExpandedTypes] = useState({
    cover: true,
    question: true,
    result: true
  });
  
  const [popoverOpen, setPopoverOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      onStageMove(active.id, over.id);
    }
  };

  const handleAddStage = (type: QuizStage['type']) => {
    onStageAdd(type);
    setPopoverOpen(false);
  };

  const coverStages = stages.filter(stage => stage.type === 'cover');
  const questionStages = stages.filter(stage => stage.type === 'question');
  const resultStages = stages.filter(stage => stage.type === 'result');

  const toggleSection = (section: 'cover' | 'question' | 'result') => {
    setExpandedTypes(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const stageTypes = [
    { type: 'cover' as const, label: 'Capa', icon: BookOpen },
    { type: 'question' as const, label: 'Questão', icon: FileQuestion },
    { type: 'result' as const, label: 'Resultado', icon: Award },
  ];

  return (
    <div className="h-full flex flex-col border-r border-[#333333] text-white">
      <div className="p-4 border-b border-[#333333] flex items-center justify-between">
        <h2 className="font-semibold text-white">Etapas do Quiz</h2>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#333333]">
              <PlusCircle className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2 bg-[#333333] border-[#444444]" align="end">
            <div className="grid gap-1">
              {stageTypes.map((stageType) => (
                <Button
                  key={stageType.type}
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-[#444444]"
                  onClick={() => handleAddStage(stageType.type)}
                >
                  <stageType.icon className="w-4 h-4 mr-2" />
                  <span>Nova {stageType.label}</span>
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={stages.map(s => s.id)} strategy={verticalListSortingStrategy}>
              <StageSection
                title="Capas"
                isExpanded={expandedTypes.cover}
                stages={coverStages}
                activeStageId={activeStageId}
                onToggle={() => toggleSection('cover')}
                onStageSelect={onStageSelect}
                onStageEdit={(id) => {}}
                onStageDelete={onStageDelete}
              />
              
              <StageSection
                title="Questões"
                isExpanded={expandedTypes.question}
                stages={questionStages}
                activeStageId={activeStageId}
                onToggle={() => toggleSection('question')}
                onStageSelect={onStageSelect}
                onStageEdit={(id) => {}}
                onStageDelete={onStageDelete}
              />
              
              <StageSection
                title="Resultados"
                isExpanded={expandedTypes.result}
                stages={resultStages}
                activeStageId={activeStageId}
                onToggle={() => toggleSection('result')}
                onStageSelect={onStageSelect}
                onStageEdit={(id) => {}}
                onStageDelete={onStageDelete}
              />
            </SortableContext>
          </DndContext>
        </div>
      </ScrollArea>
    </div>
  );
};
