import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '../ui/button';
import { ShoppingCart, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
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
  }
  // Camila removida
];

const preloadTransformationImages = () => {
  const imageUrls: string[] = [];
  transformations.slice(0, 2).forEach(item => { 
    imageUrls.push(item.beforeImage, item.afterImage);
  });
  
  preloadImagesByUrls(imageUrls, {
    quality: 80,
    batchSize: 2,
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
  const [showAfterImage, setShowAfterImage] = useState(false); // Novo estado para controlar a transição automática
  
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
    setShowAfterImage(false); // Começa mostrando a imagem "antes"
    
    const nextIndex = (activeIndex + 1) % transformations.length;
    if (nextIndex !== activeIndex && transformations[nextIndex]) {
      const nextTransformation = transformations[nextIndex];
      preloadImagesByUrls([
        nextTransformation.beforeImage,
        nextTransformation.afterImage
      ], {
        quality: 80,
        batchSize: 2
      });
    }

    // Lógica para transição automática de imagem
    const imageTransitionInterval = setInterval(() => {
      setShowAfterImage(prevShowAfter => !prevShowAfter);
    }, 4000); // Alterna a cada 4 segundos

    return () => {
      clearInterval(imageTransitionInterval); // Limpa o intervalo ao mudar de slide ou desmontar
    };
  }, [activeIndex]);
  
  useEffect(() => {
    if (imagesLoaded.before && imagesLoaded.after) {
      setIsLoading(false);
    }
  }, [imagesLoaded]);
  
  // Remover handleSliderChange ou comentar, pois o slider manual não será mais o principal
  // const handleSliderChange = (value: number[]) => {
  //   setSliderPosition(value[0]);
  // };

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
    return null; 
  }

  return (
    <div className="py-12 md:py-16 bg-gradient-to-b from-white to-[#fffaf7] dark:from-[#2c2520] dark:to-[#251f1a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-playfair text-[#aa6b5d] dark:text-[#D4B79F] mb-3">
            De Descoberta à <span className="text-brand-secondary">Expressão Autêntica</span>: Veja a Transformação
          </h2>
          <p className="text-lg text-[#432818] dark:text-[#d1c7b8] max-w-3xl mx-auto mt-4">
            Mulheres reais que redescobriram sua confiança e alinharam sua imagem aos seus sonhos através do poder do estilo pessoal.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-10 lg:gap-16">
          {/* Seção de Texto */}
          <div className="text-left lg:w-2/5 order-2 lg:order-1">
            <h3 className="text-2xl md:text-3xl font-semibold text-[#432818] dark:text-[#E0C9B1] mb-5 font-playfair">
              Transforme Sua Imagem, <span className="text-[#aa6b5d] dark:text-[#D4B79F]">Revele Sua Essência</span>
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              Seu estilo é uma ferramenta poderosa. Não se trata apenas de roupas, mas de comunicar quem você é e aspira ser. Com a orientação certa, você pode:
            </p>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300 mb-8">
              {[
                { text: "Construir looks com intenção e identidade visual." },
                { text: "Utilizar cores, modelagens e tecidos a seu favor." },
                { text: "Alinhar sua imagem aos seus objetivos pessoais e profissionais." },
                { text: "Desenvolver um guarda-roupa funcional e inteligente, evitando compras por impulso." }
              ].map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#B89B7A] dark:text-[#D4B79F] mr-3 mt-1 flex-shrink-0" />
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
                <span>Quero Transformar Minha Imagem</span>
              </span>
            </Button>
          </div>

          {/* Seção do Slider de Imagem */}
          <div className="lg:w-3/5 order-1 lg:order-2 w-full max-w-xl mx-auto">
            {isLoading ? (
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Carregando transformação...</p>
              </div>
            ) : (
              <Card className="overflow-hidden shadow-2xl rounded-xl border border-[#B89B7A]/20 dark:border-[#E0C9B1]/20 bg-white dark:bg-[#332820]">
                <div className="relative w-full aspect-[4/5] mx-auto">
                  {/* Imagem "Antes" - sempre visível no fundo */}
                  <ProgressiveImage
                    src={activeTransformation.beforeImage}
                    lowQualitySrc={getTinyPlaceholder(activeTransformation.beforeImage)}
                    alt={`${activeTransformation.name} - Antes`}
                    className="absolute top-0 left-0 w-full h-full object-cover rounded-t-xl transition-opacity duration-500"
                    style={{ opacity: imagesLoaded.before ? 1 : 0 }}
                    onLoad={() => setImagesLoaded(prev => ({ ...prev, before: true }))}
                    priority
                  />
                  {/* Imagem "Depois" - transição de opacidade */}
                  <ProgressiveImage
                    src={activeTransformation.afterImage}
                    lowQualitySrc={getTinyPlaceholder(activeTransformation.afterImage)}
                    alt={`${activeTransformation.name} - Depois`}
                    className="absolute top-0 left-0 w-full h-full object-cover rounded-t-xl transition-opacity duration-1000 ease-in-out" // Duração da transição
                    style={{ 
                      opacity: showAfterImage && imagesLoaded.after ? 1 : 0 // Controla a visibilidade com base no estado
                    }}
                    onLoad={() => setImagesLoaded(prev => ({ ...prev, after: true }))}
                    priority
                  />
                  {/* Remover o slider visual e o controle manual do slider, se desejado, ou apenas ocultá-lo */}
                  {/* 
                  <div 
                    className="absolute top-0 bottom-0 bg-[#B89B7A] dark:bg-[#D4B79F] w-1.5 cursor-ew-resize"
                    style={{ left: `calc(${sliderPosition}% - 3px)` }}
                  >
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-md flex items-center justify-center border-2 border-[#B89B7A] dark:border-[#D4B79F]">
                      <ChevronLeft className="w-4 h-4 text-[#B89B7A] dark:text-[#D4B79F]" />
                      <ChevronRight className="w-4 h-4 text-[#B89B7A] dark:text-[#D4B79F]" />
                    </div>
                  </div>
                  <Slider
                    value={[sliderPosition]}
                    onValueChange={handleSliderChange} // Comentado ou removido
                    min={0}
                    max={100}
                    step={0.1}
                    className="absolute inset-0 opacity-0 cursor-ew-resize" // Pode manter invisível para navegação por teclado se necessário
                  />
                  */}
                </div>
                <div className="p-4 bg-white dark:bg-[#332820] rounded-b-xl">
                  <p className="text-center text-xl font-medium text-[#432818] dark:text-[#E0C9B1] mb-2">{activeTransformation.name}</p>
                  <div className="flex justify-center space-x-2 mt-2">
                    {transformations.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          activeIndex === index ? 'bg-[#B89B7A] dark:bg-[#D4B79F]' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                        }`}
                        aria-label={`Ver transformação ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </Card>
            )}
             {transformations.length > 1 && (
                <div className="flex justify-between mt-4">
                    <Button variant="outline" onClick={handlePrevClick} className="text-[#432818] dark:text-[#d1c7b8] border-[#B89B7A] dark:border-[#E0C9B1]/50 hover:bg-[#B89B7A]/10 dark:hover:bg-[#E0C9B1]/10">
                        <ChevronLeft className="w-5 h-5 mr-1" /> Anterior
                    </Button>
                    <Button variant="outline" onClick={handleNextClick} className="text-[#432818] dark:text-[#d1c7b8] border-[#B89B7A] dark:border-[#E0C9B1]/50 hover:bg-[#B89B7A]/10 dark:hover:bg-[#E0C9B1]/10">
                        Próxima <ChevronRight className="w-5 h-5 ml-1" />
                    </Button>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterTransformation;
