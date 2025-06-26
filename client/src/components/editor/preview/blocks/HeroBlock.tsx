
import React from 'react';
import { EditableContent } from '@/types/editor';

interface HeroBlockProps {
  content: EditableContent;
  onClick: () => void;
}

export const HeroBlock: React.FC<HeroBlockProps> = ({ content, onClick }) => {
  return (
    <div className="p-4 border-2 border-dashed border-[#B89B7A]/40 rounded-lg cursor-pointer hover:bg-[#FAF9F7]" onClick={onClick}>
      <section className="grid md:grid-cols-2 gap-8 items-center">
        {content.heroImage && (
          <img 
            src={content.heroImage} 
            alt={content.heroImageAlt || ''} 
            className="rounded-lg shadow-lg"
          />
        )}
        <div>
          {content.quote && (
            <>
              <blockquote className="italic text-lg text-[#6b4e43]">
                "{content.quote}"
              </blockquote>
              {content.quoteAuthor && (
                <span className="not-italic font-medium block mt-2">
                  — {content.quoteAuthor}
                </span>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};
