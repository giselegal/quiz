
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EditorStage, EditorComponent } from '@/hooks/useLiveEditor';

interface OfferPreviewProps {
  stage: EditorStage;
  selectedComponentId: string | null;
  onSelectComponent: (componentId: string | null) => void;
  onUpdateComponent: (componentId: string, updates: Partial<EditorComponent>) => void;
  isPreviewMode: boolean;
}

export const OfferPreview: React.FC<OfferPreviewProps> = ({
  stage,
  selectedComponentId,
  onSelectComponent,
  onUpdateComponent,
  isPreviewMode
}) => {
  if (isPreviewMode) {
    return (
      <div className="h-full bg-[#FAF9F7] p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-[#432818] mb-8">
            Transforme Seu Estilo Agora!
          </h1>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 border border-[#B89B7A]/20">
                <div className="w-full h-32 bg-[#B89B7A]/20 rounded mb-4"></div>
                <h3 className="font-bold text-[#432818] mb-2">Produto {i}</h3>
                <p className="text-[#5D4A3A] text-sm mb-4">Descrição do produto</p>
                <p className="text-lg font-bold text-[#B89B7A]">R$ 39,90</p>
              </Card>
            ))}
          </div>
          
          <Button className="bg-[#4CAF50] hover:bg-[#43a047] text-white px-12 py-6 text-xl">
            Quero Transformar Meu Estilo Agora!
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#FAF9F7] relative">
      {/* Background da página de oferta */}
      <div className="absolute inset-0 opacity-50 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-[#432818] mb-8">
            Transforme Seu Estilo Agora!
          </h1>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 border border-[#B89B7A]/20">
                <div className="w-full h-32 bg-[#B89B7A]/20 rounded mb-4"></div>
                <h3 className="font-bold text-[#432818] mb-2">Produto {i}</h3>
                <p className="text-[#5D4A3A] text-sm mb-4">Descrição do produto</p>
                <p className="text-lg font-bold text-[#B89B7A]">R$ 39,90</p>
              </Card>
            ))}
          </div>
          
          <Button className="bg-[#4CAF50] hover:bg-[#43a047] text-white px-12 py-6 text-xl">
            Quero Transformar Meu Estilo Agora!
          </Button>
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
