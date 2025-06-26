
import React from 'react';
import { EditableContent } from '@/types/editor';

interface TestimonialsBlockProps {
  content: EditableContent;
  onClick: () => void;
}

export const TestimonialsBlock: React.FC<TestimonialsBlockProps> = ({ content, onClick }) => {
  return (
    <div className="p-4 border-2 border-dashed border-[#B89B7A]/40 rounded-lg cursor-pointer hover:bg-[#FAF9F7]" onClick={onClick}>
      <h3 className="text-xl font-playfair text-[#B89B7A] mb-4">
        {content.title || 'Depoimentos'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map(num => (
          <div key={num} className="bg-white p-4 rounded-lg shadow-sm">
            <p className="italic text-[#432818]">"Este produto transformou meu estilo completamente!"</p>
            <p className="font-medium mt-2">Cliente {num}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
