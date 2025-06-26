
import React from 'react';
import { EditableContent } from '@/types/editor';

interface HeaderBlockProps {
  content: EditableContent;
  onClick: () => void;
}

export const HeaderBlock: React.FC<HeaderBlockProps> = ({ content, onClick }) => {
  return (
    <div className="text-center p-4 border-2 border-dashed border-[#B89B7A]/40 rounded-lg cursor-pointer hover:bg-[#FAF9F7]" onClick={onClick}>
      {content.logo && (
        <img src={content.logo} alt={content.logoAlt || ''} className="mx-auto w-36 mb-6" />
      )}
      {content.title && (
        <h1 className="text-4xl md:text-5xl font-bold text-[#aa6b5d]">{content.title}</h1>
      )}
      {content.subtitle && (
        <p className="text-lg mt-4 max-w-2xl mx-auto">{content.subtitle}</p>
      )}
    </div>
  );
};
