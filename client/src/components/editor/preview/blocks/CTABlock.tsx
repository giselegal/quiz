
import React from 'react';
import { EditableContent } from '@/types/editor';
import { Button } from '@/components/ui/button';

interface CTABlockProps {
  content: EditableContent;
  onClick: () => void;
}

export const CTABlock: React.FC<CTABlockProps> = ({ content, onClick }) => {
  return (
    <div className="p-4 border-2 border-dashed border-[#B89B7A]/40 rounded-lg cursor-pointer hover:bg-[#FAF9F7] text-center" onClick={onClick}>
      <h3 className="text-xl font-playfair text-[#B89B7A] mb-2">
        {content.title || 'Comece Agora'}
      </h3>
      <p className="text-[#432818] mb-4">
        {content.text || 'Clique no botão abaixo para começar'}
      </p>
      <Button className="bg-[#B89B7A] hover:bg-[#8F7A6A] px-8 py-2 text-lg">
        {content.buttonText || 'Quero Comprar'}
      </Button>
    </div>
  );
};
