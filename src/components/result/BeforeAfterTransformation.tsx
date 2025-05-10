import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useGlobalStyles } from '@/hooks/useGlobalStyles';
import { preloadTransformationImages, getHighQualityImageUrl, fixBlurryImage } from '@/utils/transformationImageUtils';
import { OptimizedImage } from '@/components/ui/optimized-image';

// Dados das transformações antes e depois
const transformations = [
  {
    title: "De Básico para Elegante",
    description: "Transformação de look casual para elegante mantendo conforto e personalidade.",
    image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746334752/antes-depois-1.webp",
  },
  {
    title: "Casual para Sofisticado",
    description: "Um look despojado transformado com peças-chave que valorizam o tipo de corpo.",
    image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746334752/antes-depois-2.webp",
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
    <div className="my-6 sm:my-8 md:my-10 bg-white rounded-lg shadow-md border border-[#B89B7A]/20 p-4 sm:p-6 max-w-lg mx-auto">
      <h2 className="text-xl sm:text-2xl font-playfair text-center text-[#aa6b5d] mb-4 sm:mb-6">
        Transformações Reais com Conhecimento de Estilo
      </h2>
      <div className="flex flex-col items-center">
        {/* Imagem composta (antes/depois) */}
        <div className="relative w-full flex justify-center">
          <OptimizedImage
            src={currentTransformation.image}
            alt={currentTransformation.title}
            width={IMAGE_WIDTH}
            height={IMAGE_HEIGHT}
            className="rounded-lg shadow-md object-contain w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto bg-[#f9f4ef]"
            priority={true}
          />
          {/* Botões de navegação */}
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-[#B89B7A]/20 transition"
            onClick={prevTransformation}
            aria-label="Anterior"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-[#B89B7A]/20 transition"
            onClick={nextTransformation}
            aria-label="Próxima"
          >
            <ArrowRight size={20} />
          </button>
        </div>
        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-4">
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
              className={`w-2 h-2 rounded-full transition-colors ${index === activeIndex ? 'bg-[#aa6b5d]' : 'bg-[#B89B7A]/30'}`}
              aria-label={`Ver transformação ${index + 1}`}
            />
          ))}
        </div>
        {/* Título e descrição */}
        <div className="text-center mt-6">
          <h3 className="text-lg sm:text-xl font-medium text-[#432818] mb-2">{currentTransformation.title}</h3>
          <p className="text-sm sm:text-base text-[#432818]/75 mb-4">{currentTransformation.description}</p>
          <button
            className={`${globalStyles.primaryButton} py-2.5 sm:py-3 px-6 sm:px-8 text-base sm:text-lg w-full sm:w-auto rounded-lg`}
            onClick={() => window.open('https://pay.hotmart.com/N74003734E?checkoutMode=10', '_blank')}
          >
            Quero Minha Transformação!
          </button>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterTransformation;
