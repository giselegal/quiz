
import React from 'react';
import { EditableContent } from '@/types/editor';

interface BenefitsBlockProps {
  content: EditableContent;
  onClick: () => void;
}

export const BenefitsBlock: React.FC<BenefitsBlockProps> = ({ content, onClick }) => {
  return (
    <div className="p-4 border-2 border-dashed border-[#B89B7A]/40 rounded-lg cursor-pointer hover:bg-[#FAF9F7]" onClick={onClick}>
      <h3 className="text-xl font-playfair text-[#B89B7A] mb-4">
        {content.title || 'Benefícios'}
      </h3>
      <div className="space-y-2">
        {(content.items || ['Benefício 1', 'Benefício 2', 'Benefício 3']).map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-[#B89B7A] flex-shrink-0 mt-1" />
            <p>{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
