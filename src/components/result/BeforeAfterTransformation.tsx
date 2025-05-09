import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '../ui/button';
import { ShoppingCart, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'; // Adicionado CheckCircle
import { trackButtonClick } from '@/utils/analytics';
import { Slider } from '../ui/slider';
import ProgressiveImage from '../ui/ProgressiveImage';
import { preloadImagesByUrls, getLowQualityPlaceholder } from '@/utils/imageManager';

interface BeforeAfterTransformationProps {
  handleCTAClick?: () => void;
}

interface TransformationItem {
  beforeImage: string;
  afterImage: string;
  name: string;
  beforeId: string;
  afterId: string;
  width?: number;
  height?: number;
}

const transformations: TransformationItem[] = [
  {
    beforeImage: "https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_80,w_800/v1745519979/Captura_de_tela_2025-03-31_034324_pmdn8y.webp",
    afterImage: "https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_80,w_800/v1745519979/Captura_de_tela_2025-03-31_034324_pmdn8y.webp",
    name: "Adriana",
    beforeId: "transformation-adriana-before",
    afterId: "transformation-adriana-after",
    width: 800,
    height: 1000
  }, 
  {
    beforeImage: "https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_80,w_800/v1745522326/Captura_de_tela_2025-03-31_034324_cpugfj.webp",
    afterImage: "https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_80,w_800/v1745522326/Captura_de_tela_2025-03-31_034324_cpugfj.webp",
    name: "Mariangela",
    beforeId: "transformation-mariangela-before",
    afterId: "transformation-mariangela-after",
    width: 800,
    height: 1000
  },
  {
    beforeImage: "https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_80,w_800/v1745193439/2dd7e159-43a1-40b0-8075-ba6f591074c1_gpsauh.webp",
    afterImage: "https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_80,w_800/v1745193439/2dd7e159-43a1-40b0-8075-ba6f591074c1_gpsauh.webp",
    name: "Camila",
    beforeId: "transformation-camila-before",
    afterId: "transformation-camila-after",
    width: 800,
    height: 1000
  }
];

const preloadTransformationImages = () => {
  const imageUrls: string[] = [];
  transformations.slice(0, 2).forEach(item => {
    imageUrls.push(item.beforeImage, item.afterImage);
  });
  const secondaryUrls = transformations.slice(2).map(item => [
    item.beforeImage, item.afterImage
  ]).flat();
  
  preloadImagesByUrls(imageUrls, {
    quality: 80,
    batchSize: 2,
    onComplete: () => {
      if (secondaryUrls.length > 0) {
        preloadImagesByUrls(secondaryUrls, { 
          quality: 80, 
          batchSize: 1
        });
      }
    }
  });
};

const BeforeAfterTransformation: React.FC<BeforeAfterTransformationProps> = ({ handleCTAClick }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [imagesLoaded, setImagesLoaded] = useState({
    before: false,
    after: false
  });
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const activeTransformation = transformations[activeIndex];
  
  useEffect(() => {
    preloadTransformationImages();
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); 
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    setImagesLoaded({ before: false, after: false });
    setSliderPosition(50); // Reset slider position
    
    const nextIndex = (activeIndex + 1) % transformations.length;
    if (nextIndex !== activeIndex) {
      const nextTransformation = transformations[nextIndex];
      preloadImagesByUrls([
        nextTransformation.beforeImage,
        nextTransformation.afterImage
      ], {
        quality: 80,
        batchSize: 2
      });
    }
  }, [activeIndex]);
  
  useEffect(() => {
    if (imagesLoaded.before && imagesLoaded.after) {
      setIsLoading(false);
    }
  }, [imagesLoaded]);
  
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

  const getTinyPlaceholder = (url: string) => {
    const baseUrlParts = url.split('/upload/');
    if (baseUrlParts.length !== 2) return url;
    const tinyPlaceholder = `${baseUrlParts[0]}/upload/f_auto,q_20,w_20/${baseUrlParts[1].split('/').slice(1).join('/')}`;
    return tinyPlaceholder;
  };

  if (!activeTransformation) {
    return null; // Ou um loader genérico
  }

  return (
    <div className="py-12 md:py-16 bg-gradient-to-b from-white to-[#fffaf7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-playfair text-[#aa6b5d] mb-3">
            Descubra o Poder da Imagem Intencional
          </h2>
          <p className="text-lg text-[#432818] max-w-3xl mx-auto">
            Veja como a consultoria de imagem transformou a vida de mulheres reais, alinhando estilo pessoal com seus objetivos e revelando sua melhor versão.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-10 lg:gap-16">
          {/* Seção de Texto */}
          <div className="text-left lg:w-2/5 order-2 lg:order-1">
            <h3 className="text-2xl md:text-3xl font-semibold text-[#432818] mb-5 font-playfair">
              Transforme Sua Imagem, <span className="text-[#aa6b5d]">Revele Sua Essência</span>
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Seu estilo é uma ferramenta poderosa. Não se trata apenas de roupas, mas de comunicar quem você é e aspira ser. Com a orientação certa, você pode:
            </p>
            <ul className="space-y-3 text-gray-700 mb-8">
              {[
                { text: "Construir looks com intenção e identidade visual." },
                { text: "Utilizar cores, modelagens e tecidos a seu favor." },
                { text: "Alinhar sua imagem aos seus objetivos pessoais e profissionais." },
                { text: "Desenvolver um guarda-roupa funcional e inteligente, evitando compras por impulso." }
              ].map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#B89B7A] mr-3 mt-1 flex-shrink-0" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
            <Button 
              onClick={handleButtonClick} 
              className="text-white py-3.5 px-8 rounded-lg transition-all duration-300 w-full sm:w-auto text-base font-medium"
              style={{
                background: "linear-gradient(to right, #aa6b5d, #B89B7A)",
                boxShadow: "0 4px 14px rgba(184, 155, 122, 0.3)"
              }}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
            >
              <span className="flex items-center justify-center gap-2.5">
                <ShoppingCart className={`w-5 h-5 transition-transform duration-300 ${isButtonHovered ? 'scale-110' : ''}`} />
                Quero Minha Transformação Agora
              </span>
            </Button>
          </div>

          {/* Seção do Slider de Imagem */}
          <div className="lg:w-3/5 w-full order-1 lg:order-2">
            <Card className="p-4 sm:p-6 shadow-xl border-2 border-[#B89B7A]/30 rounded-xl bg-white overflow-hidden">
              <h4 className="text-2xl font-playfair text-center text-[#aa6b5d] mb-2">
                Transformação de {activeTransformation.name}
              </h4>
              <p className="text-center text-gray-600 mb-4">Arraste para ver a mudança</p>
              
              <div className="relative w-full max-w-lg mx-auto aspect-[4/5] overflow-hidden rounded-lg shadow-inner group bg-gray-100">
                {isLoading && !imagesLoaded.before && !imagesLoaded.after && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-md flex items-center justify-center">
                    <span className="text-gray-500">Carregando Imagens...</span>
                  </div>
                )}
                <ProgressiveImage
                  src={activeTransformation.afterImage}
                  lowQualitySrc={getTinyPlaceholder(activeTransformation.afterImage)}
                  alt={`Transformação de ${activeTransformation.name} - Depois`}
                  className="absolute inset-0 w-full h-full object-cover"
                  priority
                  width={activeTransformation.width}
                  height={activeTransformation.height}
                  onLoad={() => setImagesLoaded(prev => ({ ...prev, after: true }))}
                />
                <div
                  className="absolute inset-0 w-full h-full overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                  <ProgressiveImage
                    src={activeTransformation.beforeImage}
                    lowQualitySrc={getTinyPlaceholder(activeTransformation.beforeImage)}
                    alt={`Transformação de ${activeTransformation.name} - Antes`}
                    className="absolute inset-0 w-full h-full object-cover"
                    priority
                    width={activeTransformation.width}
                    height={activeTransformation.height}
                    onLoad={() => setImagesLoaded(prev => ({ ...prev, before: true }))}
                  />
                </div>
                <Slider
                  defaultValue={[50]}
                  max={100}
                  step={1}
                  value={[sliderPosition]}
                  onValueChange={handleSliderChange}
                  className="absolute bottom-5 left-1/2 -translate-x-1/2 w-11/12 z-10 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-300"
                  aria-label="Controle de antes e depois"
                />
              </div>
              
              {transformations.length > 1 && (
                <div className="flex items-center justify-center mt-6 space-x-3">
                  <Button onClick={handlePrevClick} variant="outline" size="icon" className="rounded-full border-[#B89B7A] text-[#B89B7A] hover:bg-[#B89B7A]/10 focus:ring-2 focus:ring-[#B89B7A]/50">
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  {transformations.map((item, index) => (
                    <button
                      key={item.name}
                      onClick={() => handleDotClick(index)}
                      className={`h-3 w-3 rounded-full transition-all duration-300 transform hover:scale-110 ${activeIndex === index ? 'bg-[#B89B7A] scale-110' : 'bg-gray-300 hover:bg-gray-400'}`}
                      aria-label={`Ver transformação de ${item.name}`}
                    />
                  ))}
                  <Button onClick={handleNextClick} variant="outline" size="icon" className="rounded-full border-[#B89B7A] text-[#B89B7A] hover:bg-[#B89B7A]/10 focus:ring-2 focus:ring-[#B89B7A]/50">
                    <ChevronRight className="h-5 w-5" />
                  </Button>
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
