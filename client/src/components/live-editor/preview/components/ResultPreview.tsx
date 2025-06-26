
import React from 'react';
import { Card } from '@/components/ui/card';
import { EditorStage, EditorComponent } from '@/hooks/useLiveEditor';

interface ResultPreviewProps {
  stage: EditorStage;
  selectedComponentId: string | null;
  onSelectComponent: (componentId: string | null) => void;
  onUpdateComponent: (componentId: string, updates: Partial<EditorComponent>) => void;
  isPreviewMode: boolean;
}

export const ResultPreview: React.FC<ResultPreviewProps> = ({
  stage,
  selectedComponentId,
  onSelectComponent,
  onUpdateComponent,
  isPreviewMode
}) => {
  if (isPreviewMode) {
    return (
      <div className="h-full bg-[#FAF9F7] p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#432818] mb-4">
              Seu Estilo Predominante: Elegante
            </h1>
            <div className="w-32 h-32 bg-[#B89B7A] rounded-full mx-auto mb-4"></div>
            <p className="text-lg text-[#5D4A3A]">
              Você é uma mulher que irradia refinamento e classe
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#FAF9F7] relative">
      {/* Background da página de resultado */}
      <div className="absolute inset-0 opacity-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#432818] mb-4">
              Seu Estilo Predominante: Elegante
            </h1>
            <div className="w-32 h-32 bg-[#B89B7A] rounded-full mx-auto mb-4"></div>
            <p className="text-lg text-[#5D4A3A]">
              Você é uma mulher que irradia refinamento e classe
            </p>
          </div>
        </div>
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
    </div>
  );
};
