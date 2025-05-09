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
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [criticalAssetsLoaded, setCriticalAssetsLoaded] = useState(false);

  // Preload critical assets on component mount
  useEffect(() => {
    // Use our new image manager to preload critical intro images
    preloadCriticalImages('intro');
    
    // Preload specific images by their IDs from the image bank
    preloadImagesByIds(['main-logo', 'intro-image'], {
      batchSize: 2,
      quality: 95,
      onComplete: () => {
        setCriticalAssetsLoaded(true);
        setImagesLoaded(true);
        setIsLoading(false);
      }
    });

    // Fallback for maximum loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Preload first quiz question images after critical assets are loaded
  useEffect(() => {
    if (criticalAssetsLoaded) {
      // Start preloading the first question images
      preloadCriticalImages('quiz');
    }
  }, [criticalAssetsLoaded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nome.trim()) {
      onStart(nome);
    }
  };

  const introImageDetails = getImageById('intro-image');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FEFEFE] py-[31px] mx-0 px-[5px]">
      <div className="">
        {/* Logotipo - menor e com mais espaço embaixo */}
        <div className="flex justify-center mb-12">
          <OptimizedImage 
            src="https://res.cloudinary.com/dqljyf76t/image/upload/q_95,f_auto/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp" 
            alt="Logo Gisele Galvão" 
            className="w-14 md:w-18 h-auto" 
            width={72} 
            height={36} 
            priority={true} 
          />
        </div>

        {/* Barra de carregamento dourada animada - aumentado o gap */}
        <div className="relative w-full h-[3px] bg-[#f1e8db] rounded-full overflow-hidden mb-8">
          <div className="absolute inset-0 w-1/3 bg-[#b29670] animate-loading-bar rounded-full"></div>
        </div>

        {/* Título */}
        <h1 className="font-playfair text-xl md:text-2xl font-bold text-center mb-4 leading-normal text-[#432818] px-[12px]">
          Chega de um guarda-roupa lotado e da sensação de que nada combina com você.
        </h1>

        {/* Imagem - ajustada para melhor responsividade e centralização */}
        <div className="flex justify-center mb-6 w-full px-4">
          <OptimizedImage 
            src={introImageDetails?.src || 'https://res.cloudinary.com/dqljyf76t/image/upload/q_95,f_auto/v1745193439/9a20446f-e01f-48f4-96d0-f4b37cc06625_ebd68o.jpg'} 
            alt={introImageDetails?.alt || "Mulher elegante com roupas estilosas"} 
            width={360} // Adicionado para otimização de tamanho
            className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] h-auto rounded-lg shadow-sm object-cover mx-auto"
            priority={true} 
          />
        </div>

        {/* Subtítulo */}
        <p className="text-sm text-[#433830] text-center mb-7 max-w-md mx-auto px-[18px]">
          Em poucos minutos, descubra seu{' '}
          <span className="font-semibold text-[#B89B7A]">Estilo Predominante</span> — e aprenda a montar
          looks que realmente refletem sua <span className="font-semibold text-[#b29670]">essência</span>, com
          praticidade e <span className="font-semibold text-[#aa6b5d]">confiança</span>.
        </p>

        {/* Formulário - ajustado para melhor responsividade */}
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto flex flex-col gap-3" aria-live="polite">
          <label htmlFor="name" className="text-xs font-semibold text-[#432818]">
            NOME
          </label>
          <Input 
            id="name" 
            placeholder="Digite seu nome" 
            value={nome} 
            onChange={e => setNome(e.target.value)} 
            className="w-full p-3 border-[#b29670] focus:border-[#a1835d] focus:ring-[#a1835d] bg-[#FEFEFE]" 
            autoFocus 
            aria-required="true" 
          />
          <Button 
            type="submit" 
            className="w-full mx-auto bg-[#b29670] hover:bg-[#a1835d] text-white py-3 px-4 text-base rounded-md shadow-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#b29670] focus:ring-offset-2 mt-3" 
            disabled={!nome.trim()}
          >
            Quero Descobrir meu Estilo Agora!
          </Button>
          <p className="text-xs text-center text-gray-500 mt-2">
            Ao clicar, você concorda com nossa política de privacidade
          </p>
        </form>
      </div>
    </div>
  );
};

export default QuizIntro;
