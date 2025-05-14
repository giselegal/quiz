
import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { AspectRatio } from '../ui/aspect-ratio';
import { getFallbackStyle } from '@/utils/styleUtils';
import { isImagePreloaded, optimizeImageUrl } from '@/utils/preloadUtils';
import OptimizedImage from '../ui/OptimizedImage';

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
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Check if image is already preloaded on mount
  useEffect(() => {
    if (isImagePreloaded(imageUrl)) {
      setImageLoaded(true);
    }
  }, [imageUrl]);
  
  // Use memoization to avoid recalculating the URL on each render
  const optimizedImageUrl = useMemo(() => 
    optimizeImageUrl(imageUrl, {
      quality: 95,
      width: imageUrl.includes('sapatos') ? 400 : 500
    }),
    [imageUrl]
  );

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
          "w-full h-full flex items-center justify-center overflow-hidden transform-gpu",
          isSelected && "scale-[1.03] transition-all duration-200"
        )}>
          {/* Use OptimizedImage component for better loading experience */}
          <OptimizedImage 
            src={optimizedImageUrl}
            alt={altText}
            className={cn(
              "object-cover w-full h-full",
              isSelected 
                ? "shadow-3d" 
                : "shadow-sm hover:shadow-md",
              // Enhanced 3D effect
              isSelected && is3DQuestion && "transform-3d rotate-y-12"
            )}
            onLoad={() => setImageLoaded(true)}
            priority={true}
          />
        </div>
      </AspectRatio>
    </div>
  );
};
