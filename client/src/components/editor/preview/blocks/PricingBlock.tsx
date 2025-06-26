
import React from 'react';
import { EditableContent } from '@/types/editor';
import { Button } from '@/components/ui/button';

interface PricingBlockProps {
  content: EditableContent;
  onClick: () => void;
}

export const PricingBlock: React.FC<PricingBlockProps> = ({ content, onClick }) => {
  return (
    <div className="p-4 border-2 border-dashed border-[#B89B7A]/40 rounded-lg cursor-pointer hover:bg-[#FAF9F7]" onClick={onClick}>
      <h3 className="text-xl font-playfair text-[#B89B7A] mb-2">
        {content.title || 'Preço Especial'}
      </h3>
      <p className="text-[#432818] mb-4">
        {content.text || 'Aproveite nossa oferta exclusiva'}
      </p>
      <div className="bg-[#FAF9F7] p-4 rounded-lg border border-[#B89B7A]/20 text-center">
        <p className="text-2xl font-bold text-[#B89B7A]">R$ {content.salePrice || '197,00'}</p>
        <Button className="mt-4 bg-[#B89B7A] hover:bg-[#8F7A6A]">
          {content.buttonText || 'Comprar Agora'}
        </Button>
      </div>
    </div>
  );
};
