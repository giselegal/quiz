
import React from 'react';
import { EditableContent } from '@/types/editor';

interface BonusCarouselBlockProps {
  content: EditableContent;
  onClick: () => void;
}

export const BonusCarouselBlock: React.FC<BonusCarouselBlockProps> = ({ content, onClick }) => {
  return (
    <div className="p-4 border-2 border-dashed border-[#B89B7A]/40 rounded-lg cursor-pointer hover:bg-[#FAF9F7]" onClick={onClick}>
      {content.title && (
        <h2 className="text-xl font-semibold text-[#aa6b5d] mb-4">{content.title}</h2>
      )}
      <div className="grid md:grid-cols-3 gap-6">
        {(content.bonusImages || []).map((image, index) => (
          <div key={index} className="space-y-2">
            <img 
              src={image.url} 
              alt={image.alt} 
              className="rounded-lg shadow w-full"
            />
            {image.title && (
              <p className="text-sm text-center text-[#6b4e43]">{image.title}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
