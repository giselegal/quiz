
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '../ui/button';
import { ShoppingCart, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { trackButtonClick } from '@/utils/analytics';
import { OptimizedImage } from '../ui/optimized-image';
import { preloadImagesByUrls, getLowQualityPlaceholder } from '@/utils/imageManager';

interface BeforeAfterTransformationProps {
  handleCTAClick?: () => void;
}

interface TransformationItem {
  image: string; 
  name: string;
  id: string; 
  width?: number;
  height?: number;
}

const transformations: TransformationItem[] = [
  {
    image: "https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_80,w_800/v1745519979/Captura_de_tela_2025-03-31_034324_pmdn8y.webp",
    name: "Adriana",
    id: "transformation-adriana",
    width: 800,
    height: 1000
  }, 
  {
    image: "https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_80,w_800/v1745522326/Captura_de_tela_2025-03-31_034324_cpugfj.webp",
    name: "Mariangela",
    id: "transformation-mariangela",
    width: 800,
    height: 1000
  }
];

const preloadInitialTransformationImages = () => {
  const imageUrls: string[] = [];
  transformations.slice(0, 1).forEach(item => { 
    imageUrls.push(item.image);
  });
  
  if (imageUrls.length > 0) {
    preloadImagesByUrls(imageUrls, {
      quality: 90, 
      batchSize: 1,
    });
  }
};

const BeforeAfterTransformation: React.FC<BeforeAfterTransformationProps> = ({ handleCTAClick }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const activeTransformation = transformations[activeIndex];
  const autoSlideInterval = 5000; // Intervalo em milissegundos (5 segundos)

  useEffect(() => {
    preloadInitialTransformationImages(); 
    const fallbackLoadingTimer = setTimeout(() => {
      if (isLoading) { // Só desativa se ainda estiver carregando
        setIsLoading(false);
      }
    }, 2500); 

    return () => clearTimeout(fallbackLoadingTimer);
  }, []); // Executa apenas uma vez na montagem
  
  useEffect(() => {
    setImageLoaded(false); 
    setIsLoading(true);    

    const currentImage = activeTransformation?.image;
    if (currentImage) {
      console.log("Attempting to load image:", currentImage); // Log para depuração

      // Precarrega a imagem atual
      const img = new Image();
      img.src = currentImage;
      img.onload = () => {
        setImageLoaded(true);
        setIsLoading(false);
        console.log("Image loaded successfully:", currentImage);
      };
      img.onerror = (err) => {
        console.error("Failed to load image:", currentImage, err);
        setIsLoading(false);
      };

      // Precarrega a próxima imagem (se houver mais de uma)
      const nextIndex = (activeIndex + 1) % transformations.length;
      if (transformations.length > 1 && transformations[nextIndex] && nextIndex !== activeIndex) {
        const nextTransformationImage = transformations[nextIndex].image;
        const nextImg = new Image();
        nextImg.src = nextTransformationImage;
      }

      const timer = setTimeout(() => {
        if (!imageLoaded) { 
          console.warn("Image loading timed out for:", currentImage);
          setIsLoading(false); // Definir isLoading como false para não bloquear a UI
        }
      }, 5000); // Reduzido para 5s
      return () => clearTimeout(timer);

    } else {
      console.log("No active transformation image to load."); // Log para depuração
      setIsLoading(false); 
    }
  }, [activeIndex, activeTransformation]); // Removido imageLoaded da dependência para evitar loops

  // Efeito para a transição automática de slides
  useEffect(() => {
    if (transformations.length <= 1 || !imageLoaded) return; // Não inicia se não houver imagens suficientes ou a imagem atual não carregou

    const intervalId = setInterval(() => {
      setActiveIndex(prev => (prev === transformations.length - 1 ? 0 : prev + 1));
    }, autoSlideInterval);

    return () => clearInterval(intervalId); 
  }, [transformations.length, autoSlideInterval, imageLoaded, activeIndex]); // Adicionado activeIndex para reiniciar o timer ao navegar manualmente

  useEffect(() => {
    if (imageLoaded) {
      setIsLoading(false);
    }
  }, [imageLoaded]);

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

  const createTinyPlaceholder = (url: string) => {
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
            Transformações de Mulheres que Colocaram em Prática Seu Estilo de Ser
          </h2>
          <p className="text-lg text-[#432818] dark:text-[#d1c7b8] max-w-3xl mx-auto mt-4">
            Mulheres reais que reencontraram a própria essência e passaram a refletir quem são — com leveza, intenção e autenticidade — através do estilo pessoal.
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
            {isLoading && !imageLoaded ? (
              <div className="aspect-[4/5] bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center w-full mx-auto">
                <p className="text-gray-500 dark:text-gray-400">Carregando transformação...</p>
              </div>
            ) : (
              <Card className="overflow-hidden shadow-2xl rounded-xl border border-[#B89B7A]/20 dark:border-[#E0C9B1]/20 bg-white dark:bg-[#332820]">
                <div className="relative w-full aspect-[4/5] mx-auto">
                  <OptimizedImage
                    src={activeTransformation.image}
                    alt={`${activeTransformation.name} - Transformação`}
                    width={activeTransformation.width || 800}
                    height={activeTransformation.height || 1000}
                    className="absolute top-0 left-0 w-full h-full object-cover rounded-t-xl"
                    onLoad={() => {
                      console.log('OptimizedImage onLoad triggered for:', activeTransformation.image);
                      setImageLoaded(true);
                      setIsLoading(false);
                    }}
                    priority={true}
                    quality={85}
                    placeholderColor="#f8f4ef"
                  />
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
