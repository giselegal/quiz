
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '../ui/button';
import { ShoppingCart, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { trackButtonClick } from '@/utils/analytics';
import { Slider } from '../ui/slider';
import OptimizedImage from '../ui/OptimizedImage';
import { preloadImagesByUrls, preloadCriticalImages } from '@/utils/imageManager';

interface BeforeAfterTransformationProps {
  handleCTAClick?: () => void;
}

interface TransformationItem {
  beforeImage: string;
  afterImage: string;
  name: string;
  beforeId: string;
  afterId: string;
  lowQualityBefore?: string;
  lowQualityAfter?: string;
}

// Correct image URLs for before/after transformations with low quality placeholders
const transformations: TransformationItem[] = [
  {
    beforeImage: "https://res.cloudinary.com/dqljyf76t/image/upload/v1745519979/antes_adriana_pmdn8y.webp",
    afterImage: "https://res.cloudinary.com/dqljyf76t/image/upload/v1745519979/depois_adriana_pmdn8y.webp",
    name: "Adriana",
    beforeId: "transformation-adriana-before",
    afterId: "transformation-adriana-after",
    lowQualityBefore: "https://res.cloudinary.com/dqljyf76t/image/upload/q_10,f_auto,w_100/v1745519979/antes_adriana_pmdn8y.webp",
    lowQualityAfter: "https://res.cloudinary.com/dqljyf76t/image/upload/q_10,f_auto,w_100/v1745519979/depois_adriana_pmdn8y.webp"
  }, 
  {
    beforeImage: "https://res.cloudinary.com/dqljyf76t/image/upload/v1745522326/antes_mariangela_cpugfj.webp", 
    afterImage: "https://res.cloudinary.com/dqljyf76t/image/upload/v1745522326/depois_mariangela_cpugfj.webp",
    name: "Mariangela",
    beforeId: "transformation-mariangela-before",
    afterId: "transformation-mariangela-after",
    lowQualityBefore: "https://res.cloudinary.com/dqljyf76t/image/upload/q_10,f_auto,w_100/v1745522326/antes_mariangela_cpugfj.webp",
    lowQualityAfter: "https://res.cloudinary.com/dqljyf76t/image/upload/q_10,f_auto,w_100/v1745522326/depois_mariangela_cpugfj.webp"
  }
];

// Preload all transformation images immediately when this module is loaded
(() => {
  // Collect all image URLs
  const allUrls = transformations.flatMap(item => [
    item.beforeImage, 
    item.afterImage, 
    item.lowQualityBefore || '', 
    item.lowQualityAfter || ''
  ]).filter(Boolean);
  
  // Preload them with high priority
  preloadImagesByUrls(allUrls, {
    quality: 90,
    batchSize: 4
  });
})();

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
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  
  const activeTransformation = transformations[activeIndex];
  const beforeImageRef = useRef<HTMLImageElement>(null);
  const afterImageRef = useRef<HTMLImageElement>(null);
  
  // Start preloading images as soon as component mounts
  useEffect(() => {
    const highQualityUrls = [
      activeTransformation.beforeImage,
      activeTransformation.afterImage
    ];
    
    // Preload high-quality versions
    preloadImagesByUrls(highQualityUrls, {
      quality: 90,
      batchSize: 2,
      onComplete: () => {
        setImagesLoaded({
          before: true,
          after: true
        });
      }
    });
    
    // Also preload the next transformation if available
    const nextIndex = (activeIndex + 1) % transformations.length;
    if (nextIndex !== activeIndex) {
      const nextTransformation = transformations[nextIndex];
      preloadImagesByUrls([
        nextTransformation.beforeImage,
        nextTransformation.afterImage
      ], {
        quality: 70, // Lower quality for next slide preloading
        batchSize: 2
      });
    }
  }, [activeIndex]);
  
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
    trackButtonClick('checkout_button', 'Iniciar Checkout', 'transformation_section');
    
    if (handleCTAClick) {
      handleCTAClick();
    } else {
      window.location.href = 'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912';
    }
  };

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
              {/* Always show something - either low quality placeholders or high quality images */}
              <div className="relative h-[400px] md:h-[500px] w-full mb-4">
                {/* Before image - Show low quality first, then high quality when loaded */}
                <div className="absolute inset-0 overflow-hidden">
                  {!imagesLoaded.before && activeTransformation.lowQualityBefore && (
                    <img 
                      src={activeTransformation.lowQualityBefore}
                      alt={`Carregando - ${activeTransformation.name}`} 
                      className="w-full h-full object-cover rounded-lg blur-sm"
                      style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                    />
                  )}
                  <img 
                    ref={beforeImageRef}
                    src={activeTransformation.beforeImage}
                    alt={`Antes - ${activeTransformation.name}`} 
                    className={`w-full h-full object-cover rounded-lg transition-opacity duration-500 ${imagesLoaded.before ? 'opacity-100' : 'opacity-0'}`}
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                    onLoad={() => setImagesLoaded(prev => ({ ...prev, before: true }))}
                  />
                </div>
                
                {/* After image */}
                <div className="absolute inset-0 overflow-hidden">
                  {!imagesLoaded.after && activeTransformation.lowQualityAfter && (
                    <img 
                      src={activeTransformation.lowQualityAfter}
                      alt={`Carregando - ${activeTransformation.name}`} 
                      className="w-full h-full object-cover rounded-lg blur-sm"
                      style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
                    />
                  )}
                  <img
                    ref={afterImageRef}
                    src={activeTransformation.afterImage}
                    alt={`Depois - ${activeTransformation.name}`} 
                    className={`w-full h-full object-cover rounded-lg transition-opacity duration-500 ${imagesLoaded.after ? 'opacity-100' : 'opacity-0'}`}
                    style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
                    onLoad={() => setImagesLoaded(prev => ({ ...prev, after: true }))}
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
