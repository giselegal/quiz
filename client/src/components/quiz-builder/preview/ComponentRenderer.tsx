
import React from 'react';
import { QuizComponentData } from '@/types/quizBuilder';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ComponentRendererProps {
  component: QuizComponentData;
  isSelected?: boolean;
  onSelect?: () => void;
  onMove?: (draggedId: string, targetId: string) => void;
  isPreviewing?: boolean;
}

const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  isSelected = false,
  onSelect,
  onMove,
  isPreviewing = false,
}) => {
  const renderComponentContent = () => {
    switch (component.type) {
      case 'headline':
        return (
          <div className="space-y-2">
            {component.data.title && (
              <h2 className="text-2xl font-bold">{component.data.title}</h2>
            )}
            {component.data.subtitle && (
              <p className="text-lg">{component.data.subtitle}</p>
            )}
          </div>
        );
      
      case 'text':
        return <div className="prose max-w-none">{component.data.text || 'Texto de exemplo'}</div>;
      
      case 'image':
        return component.data.imageUrl ? (
          <img 
            src={component.data.imageUrl}
            alt={component.data.alt || 'Imagem'}
            className="max-w-full h-auto rounded"
          />
        ) : (
          <div className="bg-gray-100 h-40 w-full flex items-center justify-center rounded">
            <p className="text-gray-500">Imagem não definida</p>
          </div>
        );
      
      case 'stageQuestion':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-medium">{component.data.question || 'Pergunta não definida'}</h3>
            {(component.data.options && component.data.options.length > 0) ? (
              <div className="space-y-2">
                {component.data.options.map((option, index) => (
                  <div key={index} className="p-3 border rounded hover:bg-gray-50 cursor-pointer">
                    {option}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 border rounded bg-gray-50 text-center">
                <p className="text-gray-500">Opções não definidas</p>
              </div>
            )}
          </div>
        );
        
      case 'multipleChoice':
        return (
          <div className="space-y-2">
            {(component.data.options && component.data.options.length > 0) ? (
              component.data.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input type="checkbox" id={`opt-${component.id}-${index}`} disabled={isPreviewing} />
                  <label htmlFor={`opt-${component.id}-${index}`}>{option}</label>
                </div>
              ))
            ) : (
              <div className="text-gray-500">Opções não definidas</div>
            )}
          </div>
        );
      
      case 'singleChoice':
        return (
          <div className="space-y-2">
            {(component.data.options && component.data.options.length > 0) ? (
              component.data.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input type="radio" name={`opt-${component.id}`} id={`opt-${component.id}-${index}`} disabled={isPreviewing} />
                  <label htmlFor={`opt-${component.id}-${index}`}>{option}</label>
                </div>
              ))
            ) : (
              <div className="text-gray-500">Opções não definidas</div>
            )}
          </div>
        );
        
      default:
        return <div>Componente de tipo desconhecido: {component.type}</div>;
    }
  };
  
  return (
    <Card 
      className={cn(
        "mb-4 p-4 transition-colors",
        isSelected && !isPreviewing ? "border-2 border-blue-400" : "",
        !isPreviewing && "hover:bg-gray-50 cursor-pointer"
      )}
      onClick={() => !isPreviewing && onSelect && onSelect()}
    >
      {renderComponentContent()}
    </Card>
  );
};

export default ComponentRenderer;
