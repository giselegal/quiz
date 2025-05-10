import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '../ui/button';
import { ShoppingCart, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { trackButtonClick } from '@/utils/analytics';
import { OptimizedImage } from '../ui/optimized-image';
import { preloadImagesByUrls } from '@/utils/imageManager';

interface TransformationItem {
  image: string;
  name: string;
  id: string;
  description: string;
}

const transformations: TransformationItem[] = [
  {
    image: "https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_90,w_800/v1745519979/Captura_de_tela_2025-03-31_034324_pmdn8y.webp",
    name: "Adriana",
    id: "transformation-adriana",
    description: "De básico para elegante, mantendo o conforto e autenticidade"
  },
  {
    image: "https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_90,w_800/v1745522326/Captura_de_tela_2025-03-31_034324_cpugfj.webp",
    name: "Mariangela",
    id: "transformation-mariangela",
    description: "Do casual ao sofisticado, valorizando seu tipo de corpo"
  }
];

const BeforeAfterTransformation: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const activeTransformation = transformations[activeIndex];
  const autoSlideInterval = 5000; // 5 segundos

  // Pré-carregamento inicial das imagens
  useEffect(() => {
    const imageUrls = transformations.map(t => t.image);
    preloadImagesByUrls(imageUrls, {
      quality: 90,
      batchSize: 2
    });
  }, []);

  // Gerenciamento da transição automática
  useEffect(() => {
    if (!imageLoaded || isTransitioning) return;

    const timer = setTimeout(() => {
      handleNextSlide();
    }, autoSlideInterval);

    return () => clearTimeout(timer);
  }, [imageLoaded, isTransitioning, activeIndex]);

  const handleNextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev + 1) % transformations.length);
    setTimeout(() => setIsTransitioning(false), 500); // Duração da transição
  }, [isTransitioning]);

  const handlePrevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev - 1 + transformations.length) % transformations.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const handleDotClick = useCallback((index: number) => {
    if (isTransitioning || index === activeIndex) return;
    setIsTransitioning(true);
    setActiveIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, activeIndex]);

  const handleCTAClick = useCallback(() => {
    trackButtonClick('transformation_cta', 'Transformação CTA', 'result_page');
    window.location.href = 'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912';
  }, []);

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
                { text: "Desenvolver um guarda-roupa funcional e inteligente." }
              ].map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#B89B7A] dark:text-[#D4B79F] mr-3 mt-1 flex-shrink-0" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
            
            <Button
              onClick={handleCTAClick}
              className="w-full sm:w-auto text-white py-3.5 px-8 rounded-lg transition-all duration-300 hover:scale-102 active:scale-98"
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

          {/* Seção do Slider */}
          <div className="lg:w-3/5 order-1 lg:order-2 w-full max-w-xl mx-auto">
            <Card className="overflow-hidden shadow-2xl rounded-xl border border-[#B89B7A]/20 dark:border-[#E0C9B1]/20 bg-white dark:bg-[#332820]">
              <div className={`relative w-full aspect-[4/5] transition-opacity duration-500 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
                <OptimizedImage
                  src={activeTransformation.image}
                  alt={`${activeTransformation.name} - Transformação`}
                  width={800}
                  height={1000}
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-t-xl"
                  onLoad={() => setImageLoaded(true)}
                  priority={true}
                  quality={90}
                  placeholderColor="#f8f4ef"
                />
              </div>
              
              <div className="p-4 bg-white dark:bg-[#332820] rounded-b-xl">
                <p className="text-center text-xl font-medium text-[#432818] dark:text-[#E0C9B1] mb-2">
                  {activeTransformation.name}
                </p>
                <p className="text-center text-sm text-[#432818]/80 dark:text-[#E0C9B1]/80 mb-4">
                  {activeTransformation.description}
                </p>
                <div className="flex justify-center space-x-2">
                  {transformations.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleDotClick(index)}
                      className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                        activeIndex === index 
                          ? 'bg-[#B89B7A] dark:bg-[#D4B79F]' 
                          : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                      }`}
                      aria-label={`Ver transformação ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </Card>

            {transformations.length > 1 && (
              <div className="flex justify-between mt-4">
                <Button
                  variant="outline"
                  onClick={handlePrevSlide}
                  className="text-[#432818] dark:text-[#d1c7b8] border-[#B89B7A] dark:border-[#E0C9B1]/50 hover:bg-[#B89B7A]/10 dark:hover:bg-[#E0C9B1]/10"
                  disabled={isTransitioning}
                >
                  <ChevronLeft className="w-5 h-5 mr-1" /> Anterior
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNextSlide}
                  className="text-[#432818] dark:text-[#d1c7b8] border-[#B89B7A] dark:border-[#E0C9B1]/50 hover:bg-[#B89B7A]/10 dark:hover:bg-[#E0C9B1]/10"
                  disabled={isTransitioning}
                >
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
