
import React from 'react';
import { Card } from '@/components/ui/card';
import { EditorStage, EditorComponent } from '@/hooks/useLiveEditor';
import QuizIntro from '@/components/QuizIntro';

interface QuizIntroPreviewProps {
  stage: EditorStage;
  selectedComponentId: string | null;
  onSelectComponent: (componentId: string | null) => void;
  onUpdateComponent: (componentId: string, updates: Partial<EditorComponent>) => void;
  isPreviewMode: boolean;
}

export const QuizIntroPreview: React.FC<QuizIntroPreviewProps> = ({
  stage,
  selectedComponentId,
  onSelectComponent,
  onUpdateComponent,
  isPreviewMode
}) => {
  const handleStartQuiz = (name: string) => {
    console.log('Quiz started with name:', name);
  };

  if (isPreviewMode) {
    // Renderizar o componente real do quiz
    return (
      <div className="h-full">
        <QuizIntro onStart={handleStartQuiz} />
      </div>
    );
  }

  // Modo de edição - renderizar componentes editáveis
  return (
    <div className="h-full bg-[#FAF9F7] relative">
      {/* Background do quiz atual */}
      <div className="absolute inset-0 opacity-50">
        <QuizIntro onStart={handleStartQuiz} />
      </div>
      
      {/* Overlay editável */}
      <div className="absolute inset-0 z-10">
        {stage.components.map((component) => (
          <div
            key={component.id}
            className={`absolute border-2 transition-all cursor-pointer ${
              selectedComponentId === component.id
                ? 'border-[#B89B7A] bg-[#B89B7A]/10'
                : 'border-transparent hover:border-[#B89B7A]/50'
            }`}
            style={{
              left: component.position.x,
              top: component.position.y,
              width: component.size.width,
              height: component.size.height,
            }}
            onClick={() => onSelectComponent(component.id)}
          >
            <div className="w-full h-full bg-white/80 rounded p-2 flex items-center justify-center">
              <span className="text-sm font-medium text-[#432818]">
                {component.type}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {stage.components.length === 0 && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <Card className="p-6 bg-white/90 backdrop-blur-sm">
            <div className="text-center text-gray-600">
              <div className="text-lg font-semibold mb-2">Nenhum componente adicionado</div>
              <div className="text-sm">Use a sidebar para adicionar componentes</div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
