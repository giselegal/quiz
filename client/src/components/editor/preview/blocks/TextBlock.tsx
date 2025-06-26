
import React from 'react';
import { EditableContent } from '@/types/editor';

interface TextBlockProps {
  content: EditableContent;
  onClick: () => void;
}

export const TextBlock: React.FC<TextBlockProps> = ({ content, onClick }) => {
  return (
    <div className="p-4 border-2 border-dashed border-[#B89B7A]/40 rounded-lg cursor-pointer hover:bg-[#FAF9F7]" onClick={onClick}>
      {content.text && (
        <p className={content.textColor ? `text-[${content.textColor}]` : 'text-[#432818]'}>
          {content.text}
        </p>
      )}
    </div>
  );
};
