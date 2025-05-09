import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useGlobalStyles } from '@/hooks/useGlobalStyles';
import { preloadTransformationImages, getHighQualityImageUrl, fixBlurryImage } from '@/utils/transformationImageUtils';

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

const BeforeAfterTransformation: React.FC = () => {
  const { globalStyles } = useGlobalStyles();
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState({ before: false, after: false });
  const [isLoading, setIsLoading] = useState(true);
  const AUTOPLAY_INTERVAL = 5000; // 5 seconds for auto-play

  const currentTransformation = transformations[activeIndex];

  // Pré-carregar todas as imagens quando o componente montar
  useEffect(() => {
    // Pré-carrega todas as imagens de transformação
    preloadTransformationImages(transformations);
    
    // Timeout de segurança para garantir que o loading não ficará preso
    const safetyTimer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    
    return () => clearTimeout(safetyTimer);
  }, []);

  // Gerenciar carregamento de imagens ao mudar de transformação
  useEffect(() => {
    // Resetar estado de carregamento para a nova transformação
    setImageLoaded({ before: false, after: false });
    setIsLoading(true);

    // Timeout de segurança para cada transição
    const timer = setTimeout(() => {
      if (!imageLoaded.before || !imageLoaded.after) {
        console.warn("Image loading timed out, showing anyway");
        setIsLoading(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [activeIndex]);

  // Verificar se ambas as imagens carregaram para esconder o loading
  useEffect(() => {
    if (imageLoaded.before && imageLoaded.after) {
      setIsLoading(false);
    }
  }, [imageLoaded]);

  // Próxima transformação
  const nextTransformation = useCallback(() => {
    setActiveIndex(prevIndex => (prevIndex + 1) % transformations.length);
  }, [transformations.length]);

  // Transformação anterior
  const prevTransformation = useCallback(() => {
    setActiveIndex(prevIndex => (prevIndex - 1 + transformations.length) % transformations.length);
  }, [transformations.length]);

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
      ? `${baseOptimized}&q=85&f=auto&w=400&e_sharpen:60` 
      : `${baseOptimized}?q=85&f=auto&w=400&e_sharpen:60`;
  };

  // Corrigir imagem embaçada
  const handleImageRef = (element) => {
    if (element) {
      fixBlurryImage(element);
    }
  };

  return (
    <div className="my-10 bg-white rounded-lg shadow-md border border-[#B89B7A]/20 p-6">
      <h2 className="text-2xl font-playfair text-center text-[#aa6b5d] mb-6">
        Transformações Reais com Conhecimento de Estilo
      </h2>
      
      <div className="space-y-4">
        {/* Title e Description */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-medium text-[#432818]">{currentTransformation.title}</h3>
          <p className="text-[#432818]/75">{currentTransformation.description}</p>
        </div>
        
        {/* Imagens de Antes e Depois */}
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#f9f4ef]/50 z-10 backdrop-blur-sm">
              <div className="w-10 h-10 border-2 border-[#B89B7A] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-center text-sm font-medium text-[#aa6b5d]">ANTES</p>
              <div className="aspect-[3/4] relative bg-[#f9f4ef] rounded-lg overflow-hidden">
                <img 
                  ref={handleImageRef}
                  src={getOptimizedImageUrl(currentTransformation.beforeImage)}
                  alt={`Antes - ${currentTransformation.title}`}
                  className="w-full h-full object-cover transition-opacity duration-300"
                  loading="lazy"
                  fetchPriority={activeIndex === 0 ? "high" : "auto"}
                  width="400"
                  height="533"
                  onLoad={() => setImageLoaded(prev => ({ ...prev, before: true }))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-center text-sm font-medium text-[#aa6b5d]">DEPOIS</p>
              <div className="aspect-[3/4] relative bg-[#f9f4ef] rounded-lg overflow-hidden">
                <img 
                  ref={handleImageRef}
                  src={getOptimizedImageUrl(currentTransformation.afterImage)}
                  alt={`Depois - ${currentTransformation.title}`}
                  className="w-full h-full object-cover transition-opacity duration-300"
                  loading="lazy"
                  fetchPriority={activeIndex === 0 ? "high" : "auto"}
                  width="400"
                  height="533"
                  onLoad={() => setImageLoaded(prev => ({ ...prev, after: true }))}
                />
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex justify-between absolute top-1/2 -translate-y-1/2 left-0 right-0 px-2">
            <button 
              onClick={prevTransformation} 
              className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md text-[#B89B7A] transition-colors"
              aria-label="Transformação anterior"
            >
              <ArrowLeft size={16} />
            </button>
            <button 
              onClick={nextTransformation} 
              className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md text-[#B89B7A] transition-colors"
              aria-label="Próxima transformação"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
        
        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {transformations.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === activeIndex ? 'bg-[#aa6b5d]' : 'bg-[#B89B7A]/30'
              }`}
              aria-label={`Ver transformação ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Restored Section: Headline, Description List, CTA Button */}
      <div className="mt-8 text-center">
        <h3 className="text-3xl font-playfair font-bold text-[#432818] mb-4">
          Descubra Sua Melhor Versão
        </h3>
        <ul className="list-disc list-inside text-left max-w-md mx-auto text-[#432818]/80 space-y-2 mb-6">
          <li>Eleve sua autoestima e confiança.</li>
          <li>Comunique seu estilo pessoal com clareza.</li>
          <li>Alcance seus objetivos com uma imagem poderosa.</li>
        </ul>
        <button 
          className={`${globalStyles.primaryButton} py-3 px-8 text-lg w-full sm:w-auto rounded-lg`}
          onClick={() => window.open('https://pay.hotmart.com/N74003734E?checkoutMode=10', '_blank')} // Example CTA action
        >
          Quero Minha Transformação!
        </button>
      </div>
    </div>
  );
};

export default BeforeAfterTransformation;
