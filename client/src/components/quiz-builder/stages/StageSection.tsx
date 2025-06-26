
import React from 'react';
import { QuizStage } from '@/types/quizBuilder';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface StageSectionProps {
  title: string;
  isExpanded: boolean;
  stages: QuizStage[];
  activeStageId: string | null;
  onToggle: () => void;
  onStageSelect: (id: string) => void;
  onStageEdit: (id: string) => void;
  onStageDelete: (id: string) => void;
}

const StageItem = ({ stage, isActive, onSelect, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: stage.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const getStageIcon = () => {
    switch (stage.type) {
      case 'cover':
        return '📖';
      case 'question':
        return '❓';
      case 'result':
        return '🏆';
      case 'strategic':
        return '🎯';
      default:
        return '📄';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'flex items-center gap-2 p-2 rounded-md cursor-pointer',
        isActive ? 'bg-[#9b87f5] text-white' : 'hover:bg-[#333333]'
      )}
      onClick={() => onSelect(stage.id)}
    >
      <span className="text-base">{getStageIcon()}</span>
      <span className="flex-1 truncate">
        {stage.title || `Etapa ${stage.order + 1}`}
      </span>
    </div>
  );
};

export const StageSection: React.FC<StageSectionProps> = ({
  title,
  isExpanded,
  stages,
  activeStageId,
  onToggle,
  onStageSelect,
  onStageEdit,
  onStageDelete
}) => {
  return (
    <div className="mb-4">
      <Button
        variant="ghost"
        className="w-full flex items-center justify-between p-2 text-white hover:bg-[#333333]"
        onClick={onToggle}
      >
        <span className="font-medium">{title}</span>
        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </Button>

      {isExpanded && (
        <div className="ml-2 mt-1 space-y-1">
          {stages.length === 0 ? (
            <p className="text-sm text-gray-400 p-2">Nenhuma etapa criada</p>
          ) : (
            stages.map((stage) => (
              <StageItem
                key={stage.id}
                stage={stage}
                isActive={stage.id === activeStageId}
                onSelect={onStageSelect}
                onEdit={onStageEdit}
                onDelete={onStageDelete}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};
