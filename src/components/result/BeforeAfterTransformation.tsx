import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useGlobalStyles } from '@/hooks/useGlobalStyles';
import { preloadTransformationImages, getHighQualityImageUrl, fixBlurryImage } from '@/utils/transformationImageUtils';
import { OptimizedImage } from '@/components/ui/optimized-image';

// Dados das transformações antes e depois
const transformations = [
  {
    title: "De Básico para Elegante",
    description: "Transformação de look casual para elegante mantendo conforto e personalidade",
    beforeImage: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746334752/antes_1_yf0zxc.jpg",
    afterImage: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746334752/depois_1_ysshc6.jpg",
  },
  {
    title: "Casual para Sofisticado",
    description: "Um look despojado transformado com peças-chave que valorizam o tipo de corpo",
    beforeImage: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746334752/antes_2_zdzixj.jpg", 
    afterImage: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746334752/depois_2_wvcyj0.jpg",
  },
  {
    title: "Moderno com Propósito",
    description: "Look que transmite personalidade e impacto sem perder o conforto",
    beforeImage: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746334752/antes_3_xdz6iu.jpg",
    afterImage: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746334752/depois_3_dkeq62.jpg",
  }
];

// Constantes para dimensões consistentes
const IMAGE_WIDTH = 400;
const IMAGE_HEIGHT = 533;
const AUTOPLAY_INTERVAL = 5000; // 5 seconds for auto-play
const TRANSITION_DURATION = 500; // 500ms para a transição

const BeforeAfterTransformation: React.FC = () => {
  const { globalStyles } = useGlobalStyles();
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const slideRef = useRef<HTMLDivElement>(null);

  const currentTransformation = transformations[activeIndex];

  // Pré-carregar todas as imagens quando o componente montar
  useEffect(() => {
    // Pré-carrega todas as imagens de transformação
    preloadTransformationImages(transformations);
  }, []);

  // Próxima transformação
  const nextTransformation = useCallback(() => {
    if (isTransitioning) return;
    setPreviousIndex(activeIndex);
    setDirection('right');
    setIsTransitioning(true);
    setActiveIndex(prevIndex => (prevIndex + 1) % transformations.length);
  }, [activeIndex, isTransitioning, transformations.length]);

  // Transformação anterior
  const prevTransformation = useCallback(() => {
    if (isTransitioning) return;
    setPreviousIndex(activeIndex);
    setDirection('left');
    setIsTransitioning(true);
    setActiveIndex(prevIndex => (prevIndex - 1 + transformations.length) % transformations.length);
  }, [activeIndex, isTransitioning, transformations.length]);

  // Gerenciar transição
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, TRANSITION_DURATION);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  // Auto-play carousel
  useEffect(() => {
    const timer = setTimeout(() => {
      nextTransformation();
    }, AUTOPLAY_INTERVAL);
    return () => clearTimeout(timer);
  }, [activeIndex, nextTransformation]);

  // Otimizar URL da imagem - versão melhorada
  const getOptimizedImageUrl = (url) => {
    const baseOptimized = getHighQualityImageUrl(url);
    // Verifica se a URL já tem parâmetros
    return baseOptimized.includes('?') 
      ? `${baseOptimized}&q=85&f=auto&w=${IMAGE_WIDTH}&e_sharpen:60` 
      : `${baseOptimized}?q=85&f=auto&w=${IMAGE_WIDTH}&e_sharpen:60`;
  };

  return (
    <div className="my-6 sm:my-8 md:my-10 bg-white rounded-lg shadow-md border border-[#B89B7A]/20 p-4 sm:p-5 md:p-6">
      <h2 className="text-xl sm:text-2xl font-playfair text-center text-[#aa6b5d] mb-4 sm:mb-6">
        Transformações Reais com Conhecimento de Estilo
      </h2>
      
      <div className="space-y-3 sm:space-y-4">
        {/* Title e Description */}
        <div className="text-center mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-medium text-[#432818] mb-1 sm:mb-2">{currentTransformation.title}</h3>
          <p className="text-sm sm:text-base text-[#432818]/75">{currentTransformation.description}</p>
        </div>
        
        {/* Imagens de Antes e Depois */}
        <div className="relative overflow-hidden" ref={slideRef}>
          <div 
            className={`transition-transform duration-500 ease-in-out ${isTransitioning ? (direction === 'right' ? '-translate-x-full' : 'translate-x-full') : 'translate-x-0'}`}
          >
            <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1 sm:space-y-2">
                <p className="text-center text-xs sm:text-sm font-medium text-[#aa6b5d]">ANTES</p>
                <div className="aspect-[3/4] relative bg-[#f9f4ef] rounded-lg overflow-hidden">
                  <OptimizedImage
                    src={getOptimizedImageUrl(currentTransformation.beforeImage)}
                    alt={`Antes - ${currentTransformation.title}`}
                    width={IMAGE_WIDTH}
                    height={IMAGE_HEIGHT}
                    className="w-full h-full object-cover"
                    priority={activeIndex === 0}
                    objectFit="cover"
                  />
                </div>
              </div>
              
              <div className="space-y-1 sm:space-y-2">
                <p className="text-center text-xs sm:text-sm font-medium text-[#aa6b5d]">DEPOIS</p>
                <div className="aspect-[3/4] relative bg-[#f9f4ef] rounded-lg overflow-hidden">
                  <OptimizedImage
                    src={getOptimizedImageUrl(currentTransformation.afterImage)}
                    alt={`Depois - ${currentTransformation.title}`}
                    width={IMAGE_WIDTH}
                    height={IMAGE_HEIGHT}
                    className="w-full h-full object-cover"
                    priority={activeIndex === 0}
                    objectFit="cover"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Absolute positioned container for previous slide (to create slide effect) */}
          <div 
            className={`absolute top-0 left-0 right-0 transition-transform duration-500 ease-in-out ${
              isTransitioning 
                ? (direction === 'right' ? 'translate-x-0' : '-translate-x-full') 
                : (direction === 'right' ? 'translate-x-full' : '-translate-x-full')
            }`}
            style={{ opacity: isTransitioning ? 1 : 0 }}
          >
            <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1 sm:space-y-2">
                <p className="text-center text-xs sm:text-sm font-medium text-[#aa6b5d]">ANTES</p>
                <div className="aspect-[3/4] relative bg-[#f9f4ef] rounded-lg overflow-hidden">
                  <OptimizedImage
                    src={getOptimizedImageUrl(transformations[previousIndex].beforeImage)}
                    alt={`Antes - ${transformations[previousIndex].title}`}
                    width={IMAGE_WIDTH}
                    height={IMAGE_HEIGHT}
                    className="w-full h-full object-cover"
                    objectFit="cover"
                  />
                </div>
              </div>
              
              <div className="space-y-1 sm:space-y-2">
                <p className="text-center text-xs sm:text-sm font-medium text-[#aa6b5d]">DEPOIS</p>
                <div className="aspect-[3/4] relative bg-[#f9f4ef] rounded-lg overflow-hidden">
                  <OptimizedImage
                    src={getOptimizedImageUrl(transformations[previousIndex].afterImage)}
                    alt={`Depois - ${transformations[previousIndex].title}`}
                    width={IMAGE_WIDTH}
                    height={IMAGE_HEIGHT}
                    className="w-full h-full object-cover"
                    objectFit="cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Dots indicator */}
        <div className="flex justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
          {transformations.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (isTransitioning) return;
                setPreviousIndex(activeIndex);
                setDirection(index > activeIndex ? 'right' : 'left');
                setIsTransitioning(true);
                setActiveIndex(index);
              }}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${
                index === activeIndex ? 'bg-[#aa6b5d]' : 'bg-[#B89B7A]/30'
              }`}
              aria-label={`Ver transformação ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Restored Section: Headline, Description List, CTA Button */}
      <div className="mt-6 sm:mt-8 text-center">
        <h3 className="text-2xl sm:text-3xl font-playfair font-bold text-[#432818] mb-3 sm:mb-4">
          Descubra Sua Melhor Versão
        </h3>
        <ul className="list-disc list-inside text-left max-w-md mx-auto text-[#432818]/80 space-y-1 sm:space-y-2 mb-4 sm:mb-6 text-sm sm:text-base">
          <li>Eleve sua autoestima e confiança.</li>
          <li>Comunique seu estilo pessoal com clareza.</li>
          <li>Alcance seus objetivos com uma imagem poderosa.</li>
        </ul>
        <button 
          className={`${globalStyles.primaryButton} py-2.5 sm:py-3 px-6 sm:px-8 text-base sm:text-lg w-full sm:w-auto rounded-lg`}
          onClick={() => window.open('https://pay.hotmart.com/N74003734E?checkoutMode=10', '_blank')}
        >
          Quero Minha Transformação!
        </button>
      </div>
    </div>
  );
};

export default BeforeAfterTransformation;
