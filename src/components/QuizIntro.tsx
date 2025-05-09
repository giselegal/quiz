'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import OptimizedImage from './ui/OptimizedImage';
import { preloadImagesByIds, preloadCriticalImages } from '@/utils/imageManager';
import { getImageById } from '@/data/imageBank';

interface QuizIntroProps {
  onStart: (nome: string) => void;
}

export const QuizIntro: React.FC<QuizIntroProps> = ({
  onStart
}) => {
  const [nome, setNome] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Controla o spinner principal
  const [showContent, setShowContent] = useState(false); // Controla o fade-in do conteúdo
  // criticalAssetsLoaded e imagesLoaded foram removidos do controle direto da UI aqui
  // para simplificar, mas a lógica de preloadCriticalImages('quiz') ainda pode usá-los internamente se necessário.
  const [criticalAssetsForQuizPreloaded, setCriticalAssetsForQuizPreloaded] = useState(false);


  useEffect(() => {
    let isMounted = true;

    const loadInitialAssets = async () => {
      try {
        // Assumindo que preloadCriticalImages pode ser uma Promise ou que não bloqueia criticamente o fluxo principal.
        // Se for crítico, deve ser awaited.
        preloadCriticalImages('intro'); 
        
        // Pré-carrega a logo e a imagem de introdução
        await preloadImagesByIds(['main-logo', 'intro-image'], {
          batchSize: 2,
          quality: 95,
        });

        if (isMounted) {
          setIsLoading(false); // Desliga o spinner principal
          setCriticalAssetsForQuizPreloaded(true); // Sinaliza que os assets da intro foram carregados
          // Inicia a transição para mostrar o conteúdo
          setTimeout(() => {
            if (isMounted) setShowContent(true);
          }, 50); // Pequeno delay para a transição de opacidade
        }
      } catch (error) {
        console.error("Falha ao pré-carregar imagens da introdução:", error);
        if (isMounted) {
          setIsLoading(false); // Mesmo em erro, desliga o spinner para não bloquear
          setShowContent(true); // Tenta mostrar o conteúdo
        }
      }
    };

    loadInitialAssets();

    // Fallback timer para garantir que a UI não fique presa no carregamento
    const fallbackTimer = setTimeout(() => {
      if (isMounted && isLoading) {
        setIsLoading(false);
        setShowContent(true);
      }
    }, 7000); // Aumentado para 7s para dar mais margem

    return () => {
      isMounted = false;
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Preload first quiz question images after critical assets of intro are loaded
  useEffect(() => {
    if (criticalAssetsForQuizPreloaded) {
      preloadCriticalImages('quiz');
    }
  }, [criticalAssetsForQuizPreloaded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nome.trim()) {
      onStart(nome);
    }
  };

  const introImageDetails = getImageById('intro-image');

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FEFEFE] py-8 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center">
          <svg className="animate-spin h-12 w-12 text-[#B89B7A]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-[#432818] mt-4 text-base font-medium">Preparando uma experiência única para você...</p>
          <p className="text-gray-500 mt-2 text-sm">Só um momento, estamos quase lá!</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen flex flex-col items-center justify-center bg-[#FEFEFE] py-8 px-4 md:px-6 transition-opacity duration-700 ease-in-out ${showContent ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="w-full max-w-md flex flex-col items-center"> {/* Container principal do conteúdo visível */}
        
        {/* Seção da Logo e Barra - Margem inferior reduzida */}
        <div className="w-full flex flex-col items-center mb-4 md:mb-6"> 
          <div className="w-28 sm:w-32 md:w-36"> 
            <OptimizedImage 
              src="https://res.cloudinary.com/dqljyf76t/image/upload/q_95,f_auto/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp" 
              alt="Logo Gisele Galvão" 
              className="block h-auto w-full"
              width={144}
              height={72}
              priority={true} 
              objectFit="contain"
            />
          </div>
          <div className="mt-2 h-[2px] w-24 sm:w-28 md:w-32 bg-[#B89B7A] rounded"></div>
        </div>

        {/* Headline - Tamanho e peso da fonte aumentados, margem inferior ajustada */}
        <h1 className="font-playfair text-2xl sm:text-3xl md:text-3xl font-bold text-center mb-5 leading-tight text-[#432818]">
          Chega de um guarda-roupa lotado e da sensação de que nada combina com você.
        </h1>

        {/* Imagem Principal */}
        <div className="flex justify-center mb-3 w-full"> {/* Margem inferior reduzida */}
          <OptimizedImage 
            src={introImageDetails?.src || 'https://res.cloudinary.com/dqljyf76t/image/upload/q_95,f_auto/v1745193439/9a20446f-e01f-48f4-96d0-f4b37cc06625_ebd68o.jpg'} 
            alt={introImageDetails?.alt || "Mulher elegante com roupas estilosas"} 
            width={896}
            height={896}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md h-auto rounded-lg shadow-sm object-contain mx-auto"
            priority={true} 
          />
        </div>
        
        {/* Texto descritivo - Movido para logo abaixo da imagem, margem inferior ajustada */}
        <p className="text-sm text-[#433830] text-center mb-6 max-w-md mx-auto px-4"> {/* px ajustado e mb ajustado */}
          Em poucos minutos, descubra seu{' '}
          <span className="font-semibold text-[#B89B7A]">Estilo Predominante</span> — e aprenda a montar
          looks que realmente refletem sua <span className="font-semibold text-[#432818]">essência</span>, com
          praticidade e <span className="font-semibold text-[#432818]">confiança</span>.
        </p>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto flex flex-col gap-4" aria-live="polite"> {/* gap aumentado ligeiramente */}
          <div>
            <label htmlFor="name" className="block text-xs font-semibold text-[#432818] mb-1">
              NOME
            </label>
            <Input 
              id="name" 
              placeholder="Digite seu nome" 
              value={nome} 
              onChange={e => setNome(e.target.value)} 
              className="w-full p-3 border-[#B89B7A] focus:border-[#A1835D] focus:ring-[#A1835D] bg-[#FEFEFE] rounded-md" // Cor da borda e foco ajustadas, rounded-md
              autoFocus 
              aria-required="true" 
            />
          </div>
          <Button 
            type="submit" 
            className="w-full mx-auto bg-[#B89B7A] hover:bg-[#A1835D] text-white py-3.5 px-4 text-base sm:text-lg font-semibold rounded-md shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#B89B7A] focus:ring-offset-2 mt-2 transform hover:scale-105" // Cores, padding, fonte, sombra e transição/hover ajustados
            disabled={!nome.trim()}
          >
            Quero Descobrir meu Estilo Agora!
          </Button>
          <p className="text-xs text-center text-gray-500 mt-1"> {/* mt reduzido */}
            Ao clicar, você concorda com nossa política de privacidade
          </p>
        </form>
      </div>
    </div>
  );
};

export default QuizIntro;
