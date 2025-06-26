
import React from 'react';
import { EditableContent } from '@/types/editor';

interface GuaranteeBlockProps {
  content: EditableContent;
  onClick: () => void;
}

export const GuaranteeBlock: React.FC<GuaranteeBlockProps> = ({ content, onClick }) => {
  return (
    <div className="p-4 border-2 border-dashed border-[#B89B7A]/40 rounded-lg cursor-pointer hover:bg-[#FAF9F7]" onClick={onClick}>
      <h3 className="text-xl font-playfair text-[#B89B7A] mb-2">
        {content.title || 'Garantia'}
      </h3>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#B89B7A] flex items-center justify-center text-white text-2xl">
          7
        </div>
        <p className="text-[#432818]">
          {content.text || 'Satisfação garantida ou seu dinheiro de volta em até 7 dias.'}
        </p>
      </div>
    </div>
  );
};
