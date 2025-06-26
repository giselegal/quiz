import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../ui/button";
import {
  CheckCircle,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { trackButtonClick } from "@/utils/analytics";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { preloadImagesByUrls } from "@/utils/imageManager";

interface BeforeAfterTransformationProps {
  primaryStyle?: any;
  onContinue?: () => void;
  handleCTAClick?: () => void;
}

interface TransformationItem {
  image: string;
  name: string;
  id: string;
  width?: number;
  height?: number;
}

// Transformações reais de clientes
const transformations: TransformationItem[] = [
  {
    image:
      "https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_90,w_1200/v1745519979/Captura_de_tela_2025-03-31_034324_pmdn8y.webp",
    name: "Adriana",
    id: "transformation-adriana",
    width: 1200,
    height: 1500,
  },
  {
    image:
      "https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_90,w_1200/v1745522326/Captura_de_tela_2025-03-31_034324_cpugfj.webp",
    name: "Mariangela",
    id: "transformation-mariangela",
    width: 1200,
    height: 1500,
  },
];

// Pré-carregar as imagens prioritárias
const preloadInitialTransformationImages = () => {
  const imageUrls = transformations.slice(0, 1).map((item) => item.image);
  if (imageUrls.length > 0) {
    preloadImagesByUrls(imageUrls, {
      quality: 85,
      batchSize: 1,
    });
  }
};

export const BeforeAfterTransformation: React.FC<
  BeforeAfterTransformationProps
> = ({ primaryStyle, onContinue, handleCTAClick }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Default style if none provided
  const defaultStyle: any = {
    category: "Natural",
    score: 0,
    percentage: 0,
  };

  const style = primaryStyle || defaultStyle;
  const activeTransformation = transformations[activeIndex];
  const autoSlideInterval = 6000; // Intervalo para mudança automática

  // Efeito para pré-carregar imagens iniciais
  useEffect(() => {
    preloadInitialTransformationImages();
    const fallbackLoadingTimer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
    }, 3000);

    return () => clearTimeout(fallbackLoadingTimer);
  }, []);

  // Efeito para gerenciar carregamento de imagens
  useEffect(() => {
    setImageLoaded(false);
    setIsLoading(true);

    const currentImage = activeTransformation?.image;
    if (currentImage) {
      const img = new Image();
      img.src = currentImage;
      img.onload = () => {
        setImageLoaded(true);
        setIsLoading(false);
      };
      img.onerror = () => {
        setIsLoading(false);
      };

      // Pré-carrega próxima imagem
      const nextIndex = (activeIndex + 1) % transformations.length;
      if (
        transformations.length > 1 &&
        transformations[nextIndex] &&
        nextIndex !== activeIndex
      ) {
        const nextImg = new Image();
        nextImg.src = transformations[nextIndex].image;
      }

      const timer = setTimeout(() => {
        if (!imageLoaded) {
          setIsLoading(false);
        }
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [activeIndex, activeTransformation]);

  // Auto slide para as transformações
  useEffect(() => {
    if (transformations.length <= 1 || !imageLoaded) return;

    const intervalId = setInterval(() => {
      setActiveIndex((prev) =>
        prev === transformations.length - 1 ? 0 : prev + 1
      );
    }, autoSlideInterval);

    return () => clearInterval(intervalId);
  }, [transformations.length, autoSlideInterval, imageLoaded, activeIndex]);

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
  };

  const handlePrevClick = () => {
    setActiveIndex((prev) =>
      prev === 0 ? transformations.length - 1 : prev - 1
    );
  };

  const handleNextClick = () => {
    setActiveIndex((prev) =>
      prev === transformations.length - 1 ? 0 : prev + 1
    );
  };

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else if (handleCTAClick) {
      handleCTAClick();
    }
  };

  const handleButtonClick = () => {
    trackButtonClick(
      "checkout_button",
      "Iniciar Checkout",
      "transformation_section"
    );
    if (handleCTAClick) {
      handleCTAClick();
    } else {
      window.location.href =
        "https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912";
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto border-0 shadow-lg overflow-hidden bg-white/95 backdrop-blur">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 lg:gap-12">
          {/* Seção de Texto */}
          <div className="text-left lg:w-2/5 order-2 lg:order-1">
            <h4 className="text-xl md:text-2xl font-semibold text-[#432818] mb-4 font-playfair">
              Transforme Sua Imagem,{" "}
              <span className="text-[#aa6b5d]">Revele Sua Essência</span>
            </h4>
            <p className="text-gray-700 mb-6 leading-snug sm:leading-relaxed">
              Seu estilo é uma ferramenta poderosa. Não se trata apenas de
              roupas, mas de comunicar quem você é e aspira ser. Com a
              orientação certa, você pode:
            </p>
            <ul className="space-y-2 sm:space-y-3 text-gray-700 mb-6 sm:mb-8">
              {[
                {
                  text: "Construir looks com intenção e identidade visual.",
                },
                {
                  text: "Utilizar cores, modelagens e tecidos a seu favor.",
                },
                {
                  text: "Alinhar sua imagem aos seus objetivos pessoais e profissionais.",
                },
                {
                  text: "Desenvolver um guarda-roupa funcional e inteligente.",
                },
              ].map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#B89B7A] mr-3 mt-1 flex-shrink-0" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
            <Button
              onClick={handleButtonClick}
              className="text-white py-3 sm:py-3.5 px-6 sm:px-8 rounded-lg transition-all duration-300 w-full sm:w-auto text-sm sm:text-base font-medium leading-tight"
              style={{
                background: "linear-gradient(to right, #aa6b5d, #B89B7A)",
                boxShadow: "0 4px 14px rgba(184, 155, 122, 0.3)",
              }}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
            >
              <span className="flex items-center justify-center gap-2 sm:gap-2.5 leading-none">
                <ShoppingCart
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${
                    isButtonHovered ? "scale-110" : ""
                  }`}
                />
                <span className="leading-none">
                  Quero Transformar Minha Imagem
                </span>
              </span>
            </Button>
          </div>

          {/* Seção do Slider de Imagem */}
          <div className="lg:w-3/5 order-1 lg:order-2 w-full max-w-xl mx-auto">
            {isLoading && !imageLoaded ? (
              <div className="aspect-[4/5] bg-gray-200 rounded-lg flex items-center justify-center w-full mx-auto">
                <p className="text-gray-500">Carregando transformação...</p>
              </div>
            ) : (
              <Card className="overflow-hidden shadow-2xl rounded-xl border border-[#B89B7A]/20 bg-white">
                <div className="relative w-full aspect-[4/5] mx-auto">
                  <OptimizedImage
                    src={activeTransformation.image}
                    alt={`${activeTransformation.name} - Transformação`}
                    width={activeTransformation.width || 800}
                    height={activeTransformation.height || 1000}
                    className="absolute top-0 left-0 w-full h-full object-cover rounded-t-xl"
                    onLoad={() => {
                      setImageLoaded(true);
                      setIsLoading(false);
                    }}
                    priority={true}
                    quality={85}
                    placeholderColor="#f8f4ef"
                  />
                </div>
                <div className="p-4 bg-white rounded-b-xl">
                  <p className="text-center text-xl font-medium text-[#432818] mb-2">
                    {activeTransformation.name}
                  </p>
                  <div className="flex justify-center space-x-2 mt-2">
                    {transformations.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          activeIndex === index
                            ? "bg-[#B89B7A]"
                            : "bg-gray-300 hover:bg-gray-400"
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
                <Button
                  variant="outline"
                  onClick={handlePrevClick}
                  className="text-[#432818] border-[#B89B7A] hover:bg-[#B89B7A]/10"
                >
                  <ChevronLeft className="w-5 h-5 mr-1" /> Anterior
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNextClick}
                  className="text-[#432818] border-[#B89B7A] hover:bg-[#B89B7A]/10"
                >
                  Próxima <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BeforeAfterTransformation;
