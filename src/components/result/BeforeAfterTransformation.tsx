
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '../ui/button';
import { ShoppingCart, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { trackButtonClick } from '@/utils/analytics';
import { Slider } from '../ui/slider';
import { optimizeCloudinaryUrl, preloadImages } from '@/utils/imageUtils';
import OptimizedImage from '../ui/OptimizedImage';

interface BeforeAfterTransformationProps {
  handleCTAClick?: () => void;
}

interface TransformationItem {
  beforeImage: string;
  afterImage: string;
  name: string;
}

// Correct image URLs for before/after transformations
const transformations: TransformationItem[] = [
  {
    beforeImage: "https://res.cloudinary.com/dqljyf76t/image/upload/v1745519979/antes_adriana_pmdn8y.webp",
    afterImage: "https://res.cloudinary.com/dqljyf76t/image/upload/v1745519979/depois_adriana_pmdn8y.webp",
    name: "Adriana"
  }, 
  {
    beforeImage: "https://res.cloudinary.com/dqljyf76t/image/upload/v1745522326/antes_mariangela_cpugfj.webp", 
    afterImage: "https://res.cloudinary.com/dqljyf76t/image/upload/v1745522326/depois_mariangela_cpugfj.webp",
    name: "Mariangela"
  }
];

const BeforeAfterTransformation: React.FC<BeforeAfterTransformationProps> = ({ handleCTAClick }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [imagesLoaded, setImagesLoaded] = useState<{
    before: boolean;
    after: boolean;
  }>({
    before: false,
    after: false
  });
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  
  const activeTransformation = transformations[activeIndex];
  
  // Preload all transformation images on component mount
  useEffect(() => {
    const allImagesToPreload = transformations.flatMap(item => [
      { url: item.beforeImage, priority: item === activeTransformation ? 2 : 1 },
      { url: item.afterImage, priority: item === activeTransformation ? 2 : 1 }
    ]);
    
    preloadImages(allImagesToPreload, {
      batchSize: 2,
      quality: 95,
      onComplete: () => setImagesPreloaded(true)
    });
  }, []);
  
  // Track loading state for active transformation
  useEffect(() => {
    // Reset image loaded state when changing transformation
    setImagesLoaded({
      before: false,
      after: false
    });
    
    // Create URLs with optimized parameters
    const beforeImgUrl = optimizeCloudinaryUrl(activeTransformation.beforeImage, { 
      quality: 95, 
      format: 'auto',
      width: 800 
    });
    
    const afterImgUrl = optimizeCloudinaryUrl(activeTransformation.afterImage, { 
      quality: 95, 
      format: 'auto',
      width: 800 
    });
    
    // Preload the active transformation images with high priority
    const beforeImg = new Image();
    const afterImg = new Image();
    
    beforeImg.src = beforeImgUrl;
    afterImg.src = afterImgUrl;
    
    beforeImg.onload = () => setImagesLoaded(prev => ({
      ...prev,
      before: true
    }));
    
    afterImg.onload = () => setImagesLoaded(prev => ({
      ...prev,
      after: true
    }));
    
    // If we're not on first mount, preload the next set
    if (imagesPreloaded && transformations.length > 1) {
      const nextIndex = (activeIndex + 1) % transformations.length;
      const nextTransformation = transformations[nextIndex];
      
      // Preload next transformation images with lower priority
      preloadImages([
        { url: nextTransformation.beforeImage, priority: 1 },
        { url: nextTransformation.afterImage, priority: 1 }
      ], { quality: 95 });
    }
    
    return () => {
      // Cleanup
      beforeImg.onload = null;
      afterImg.onload = null;
    };
  }, [activeIndex, activeTransformation, imagesPreloaded]);

  const handleSliderChange = (value: number[]) => {
    setSliderPosition(value[0]);
  };

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
  };
  
  const handlePrevClick = () => {
    setActiveIndex(prev => (prev === 0 ? transformations.length - 1 : prev - 1));
  };
  
  const handleNextClick = () => {
    setActiveIndex(prev => (prev === transformations.length - 1 ? 0 : prev + 1));
  };
  
  const handleButtonClick = () => {
    // Track checkout initiation
    trackButtonClick('checkout_button', 'Iniciar Checkout', 'transformation_section');
    
    // Se uma função de clique foi fornecida como prop, use-a
    if (handleCTAClick) {
      handleCTAClick();
    } else {
      // Caso contrário, use o comportamento padrão
      window.location.href = 'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912';
    }
  };

  const areImagesReady = imagesLoaded.before && imagesLoaded.after;

  return (
    <div className="py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-left md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-playfair text-[#aa6b5d] mb-2">
              Descubra o poder da imagem intencional
            </h2>
            <p className="text-[#3a3a3a] mb-4">
              Seu estilo não é apenas sobre roupas — é sobre comunicar quem você é e onde quer chegar.
            </p>
            <ul className="list-disc pl-5 text-[#3a3a3a] mb-6">
              <li>Looks com intenção e identidade</li>
              <li>Cores, modelagens e tecidos a seu favor</li>
              <li>Imagem alinhada aos seus objetivos</li>
              <li>Guarda-roupa funcional, sem compras por impulso</li>
            </ul>
            <Button 
              onClick={handleButtonClick} 
              className="text-white py-4 px-6 rounded-md transition-all duration-300 w-full md:w-auto"
              style={{
                background: "linear-gradient(to right, #aa6b5d, #B89B7A)",
                boxShadow: "0 4px 14px rgba(184, 155, 122, 0.4)"
              }}
              onMouseEnter={() => setIsButtonHovered(true)} 
              onMouseLeave={() => setIsButtonHovered(false)}
              aria-label="Quero Descobrir Meu Guia Completo"
            >
              <span className="flex items-center justify-center gap-2">
                <ShoppingCart className={`w-5 h-5 transition-transform duration-300 ${isButtonHovered ? 'scale-110' : ''}`} />
                Quero Descobrir Meu Guia Completo
              </span>
            </Button>
            <p className="text-sm text-[#aa6b5d] mt-2 flex items-center gap-1">
              Oferta por tempo limitado - Acesso imediato
            </p>
          </div>
          <div className="md:w-1/2 w-full">
            <Card className="p-6 card-elegant overflow-hidden">
              {/* Loading state */}
              {!areImagesReady && (
                <div className="h-[400px] md:h-[500px] w-full flex items-center justify-center bg-[#f9f4ef]">
                  <div className="w-12 h-12 border-4 border-[#aa6b5d] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
              {/* Before/After image comparison with slider */}
              <div className={`relative h-[400px] md:h-[500px] w-full mb-4 ${areImagesReady ? '' : 'hidden'}`}>
                {/* Before image - fixed path and optimized */}
                <div className="absolute inset-0 overflow-hidden">
                  <img 
                    src={optimizeCloudinaryUrl(activeTransformation.beforeImage, { 
                      quality: 95, 
                      format: 'auto', 
                      width: 800 
                    })}
                    alt={`Antes - ${activeTransformation.name}`} 
                    className="w-full h-full object-cover rounded-lg"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                  />
                </div>
                
                {/* After image - fixed path and optimized */}
                <div className="absolute inset-0 overflow-hidden">
                  <img 
                    src={optimizeCloudinaryUrl(activeTransformation.afterImage, { 
                      quality: 95, 
                      format: 'auto', 
                      width: 800 
                    })} 
                    alt={`Depois - ${activeTransformation.name}`} 
                    className="w-full h-full object-cover rounded-lg"
                    style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
                  />
                </div>
                
                {/* Slider control */}
                <div className="absolute left-0 right-0 bottom-16 px-8 z-10">
                  <Slider
                    value={[sliderPosition]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={handleSliderChange}
                    className="z-10"
                  />
                </div>
                
                {/* Slider divider line */}
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-md z-20"
                  style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-grab">
                    <div className="w-3 h-3 bg-[#aa6b5d] rounded-full"></div>
                  </div>
                </div>
                
                {/* Labels */}
                <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm py-1 px-3 rounded text-sm z-10">
                  Antes
                </div>
                <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm py-1 px-3 rounded text-sm z-10">
                  Depois
                </div>
                
                <div className="absolute bottom-28 left-0 right-0 mx-auto bg-white/80 backdrop-blur-sm py-2 px-4 text-center rounded-lg max-w-xs z-10">
                  <p className="font-medium">{activeTransformation.name}</p>
                </div>
                
                {/* Navigation arrows */}
                {transformations.length > 1 && (
                  <>
                    <button 
                      onClick={handlePrevClick}
                      className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md z-10 hover:bg-white transition-colors"
                      aria-label="Transformação anterior"
                    >
                      <ChevronLeft className="w-6 h-6 text-[#aa6b5d]" />
                    </button>
                    <button 
                      onClick={handleNextClick}
                      className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md z-10 hover:bg-white transition-colors"
                      aria-label="Próxima transformação"
                    >
                      <ChevronRight className="w-6 h-6 text-[#aa6b5d]" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Navigation dots */}
              {transformations.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {transformations.map((_, index) => (
                    <button 
                      key={index} 
                      className={`w-3 h-3 rounded-full ${index === activeIndex ? 'bg-[#aa6b5d]' : 'bg-[#aa6b5d]/30'}`} 
                      onClick={() => handleDotClick(index)} 
                      aria-label={`Transformação ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterTransformation;
