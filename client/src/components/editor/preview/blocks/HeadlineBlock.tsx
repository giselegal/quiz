
import React from 'react';
import { EditableContent } from '@/types/editor';
import { cn } from '@/lib/utils';

interface HeadlineBlockProps {
  content: EditableContent;
  onClick: () => void;
}

export const HeadlineBlock: React.FC<HeadlineBlockProps> = ({ content, onClick }) => {
  return (
    <div className="space-y-3 p-4 border-2 border-dashed border-[#B89B7A]/40 rounded-lg cursor-pointer hover:bg-[#FAF9F7]" onClick={onClick}>
      {content.title && (
        <h2 className={cn(
          "text-3xl font-playfair",
          content.textColor ? `text-[${content.textColor}]` : 'text-[#432818]',
          content.alignment === 'center' && 'text-center',
          content.alignment === 'right' && 'text-right'
        )}>
          {content.title}
        </h2>
      )}
      {content.subtitle && (
        <p className={cn(
          "text-xl text-[#8F7A6A]",
          content.alignment === 'center' && 'text-center',
          content.alignment === 'right' && 'text-right'
        )}>
          {content.subtitle}
        </p>
      )}
    </div>
  );
};
