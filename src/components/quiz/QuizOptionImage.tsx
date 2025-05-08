
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { AspectRatio } from '../ui/aspect-ratio';
import { getFallbackStyle } from '@/utils/styleUtils';

interface QuizOptionImageProps {
  imageUrl: string;
  altText: string;
  styleCategory: string;
  isSelected: boolean;
  is3DQuestion: boolean;
  questionId: string;
}

export const QuizOptionImage: React.FC<QuizOptionImageProps> = ({
  imageUrl,
  altText,
  styleCategory,
  isSelected,
  is3DQuestion,
  questionId
}) => {
  const isMobile = useIsMobile();
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div className="w-full h-full" style={getFallbackStyle(styleCategory)}>
        <span>{styleCategory}</span>
      </div>
    );
  }

  return (
    <div className={cn(
      "w-full relative flex-grow overflow-hidden",
      "md:mx-auto", // Center on desktop
      !isMobile && "md:max-w-[40%]" // Reduced from 50% to 40% on desktop
    )}>
      <AspectRatio 
        ratio={imageUrl.includes('sapatos') ? 1 : 3/4} 
        className="w-full h-full"
      >
        <div className={cn(
          "w-full h-full flex items-center justify-center overflow-hidden transform-3d",
          isSelected && "scale-[1.02]"
        )}>
          <img
            src={imageUrl}
            alt={altText}
            className={cn(
              "object-cover w-full h-full transition-all duration-300",
              isSelected 
                ? "shadow-lg" 
                : "shadow-sm hover:shadow-md",
              // Removendo a borda e adicionando efeito 3D
              isSelected && is3DQuestion && "transform rotate-y-12"
            )}
            onError={() => setImageError(true)}
          />
        </div>
      </AspectRatio>
    </div>
  );
};
