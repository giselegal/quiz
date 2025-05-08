
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { AspectRatio } from '../ui/aspect-ratio';
import { getFallbackStyle } from '@/utils/styleUtils';
import { optimizeCloudinaryUrl, isImagePreloaded } from '@/utils/imageUtils';

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
  const [placeholderVisible, setPlaceholderVisible] = useState(true);
  
  // Use memoization to avoid recalculating the URL on each render
  const optimizedImageUrl = React.useMemo(() => 
    optimizeCloudinaryUrl(imageUrl, {
      quality: 95,
      format: 'auto',
      width: imageUrl.includes('sapatos') ? 400 : 500
    }),
    [imageUrl]
  );
  
  // Check if image is already preloaded on mount
  useEffect(() => {
    if (isImagePreloaded(imageUrl)) {
      setImageLoaded(true);
      setPlaceholderVisible(false);
    }
  }, [imageUrl]);

  // Handle image load completion
  const handleImageLoad = () => {
    setImageLoaded(true);
    // Small delay before hiding placeholder for smooth transition
    setTimeout(() => setPlaceholderVisible(false), 100);
  };

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
          isSelected && "scale-[1.03] transition-all duration-300"
        )}>
          {/* Low quality placeholder for smoother loading */}
          {placeholderVisible && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse">
              {/* Only show spinner if truly loading (not preloaded) */}
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-8 border-2 border-[#B89B7A] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          )}
          
          <img
            src={optimizedImageUrl}
            alt={altText}
            className={cn(
              "object-cover w-full h-full transition-all duration-300",
              !imageLoaded && "opacity-0",
              imageLoaded && "opacity-100",
              isSelected 
                ? "shadow-3d" 
                : "shadow-sm hover:shadow-md",
              // Enhanced 3D effect
              isSelected && is3DQuestion && "transform-3d rotate-y-12"
            )}
            onLoad={handleImageLoad}
            onError={() => setImageError(true)}
            loading="lazy" // Let the browser decide, we're managing preloading ourselves
          />
        </div>
      </AspectRatio>
    </div>
  );
};
