
import React from 'react';
import { TransitionBlockContent } from '@/types/resultPageBlocks';

interface TransitionBlockProps {
  content: TransitionBlockContent;
  onClick: () => void;
}

export const TransitionBlock: React.FC<TransitionBlockProps> = ({
  content,
  onClick
}) => {
  return (
    <div
      className="border-2 border-dashed border-transparent hover:border-[#B89B7A] rounded-lg transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="relative text-center py-16 lg:py-20">
        <div 
          className="absolute inset-0 rounded-3xl"
          style={{
            backgroundColor: content.backgroundColor || '#f8f9fa'
          }}
        ></div>
        <div className="relative z-10">
          {content.showDecorations && (
            <div className="w-24 h-px mx-auto mb-8 bg-gradient-to-r from-transparent via-[#B89B7A] to-transparent"></div>
          )}
          <h3 className="text-3xl lg:text-4xl font-playfair font-bold mb-6 text-[#432818]">
            {content.title || 'Chegou o Momento de Agir'}
          </h3>
          <p className="text-xl font-medium max-w-2xl mx-auto leading-relaxed text-[#8F7A6A]">
            {content.description || 'Não deixe para depois a transformação que você pode começar agora!'}
          </p>
          {content.showDecorations && (
            <div className="w-24 h-px mx-auto mt-8 bg-gradient-to-r from-transparent via-[#B89B7A] to-transparent"></div>
          )}
        </div>
      </div>
    </div>
  );
};
