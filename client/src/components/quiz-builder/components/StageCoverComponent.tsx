
import React from 'react';
import { QuizComponentData } from '@/types/quizBuilder';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface StageCoverComponentProps {
  data: QuizComponentData['data'];
  style: QuizComponentData['style'];
  isSelected: boolean;
}

const StageCoverComponent: React.FC<StageCoverComponentProps> = ({ data, style, isSelected }) => {
  return (
    <div 
      className={cn(
        "w-full text-center py-8 px-4",
        isSelected && "ring-2 ring-inset ring-[#B89B7A]/20"
      )}
      style={{
        backgroundColor: style?.backgroundColor || data.backgroundColor || '#FFFAF0',
        color: style?.textColor || data.textColor || '#432818',
        borderRadius: style?.borderRadius ? `${style.borderRadius}px` : '0',
        padding: `${style?.paddingY || 16}px ${style?.paddingX || 16}px`,
      }}
    >
      {data.imageUrl && (
        <div className="mb-6">
          <img 
            src={data.imageUrl} 
            alt={data.title || 'Quiz cover'} 
            className="max-w-full mx-auto rounded-lg shadow-lg max-h-64 object-cover"
          />
        </div>
      )}
      
      <h1 className="text-3xl md:text-4xl font-playfair mb-3">
        {data.title || 'Quiz de Estilo Pessoal'}
      </h1>
      
      <p className="text-lg md:text-xl mb-8 text-[#432818]/80">
        {data.subtitle || 'Descubra seu estilo predominante'}
      </p>
      
      <Button 
        className="bg-[#B89B7A] hover:bg-[#A38A69] text-white px-8 py-3 rounded-md text-lg"
      >
        {data.buttonText || 'Iniciar Quiz'}
      </Button>
      
      <div className="mt-8 text-sm text-[#432818]/60">
        {data.stageTitle || 'Início'} • {data.stageNumber || 1} de {data.totalStages || 7}
      </div>
    </div>
  );
};

export default StageCoverComponent;
