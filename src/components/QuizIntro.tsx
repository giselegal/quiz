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
    preloadCriticalImages('intro');
    preloadImagesByIds(['main-logo', 'intro-image'], {
      batchSize: 2,
      quality: 95,
      onComplete: () => {
        setCriticalAssetsLoaded(true);
        setImagesLoaded(true);
        setIsLoading(false);
      }
    });

    const timer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Preload first quiz question images after critical assets are loaded
  useEffect(() => {
    if (criticalAssetsLoaded) {
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FEFEFE] py-8 px-4 md:px-6">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <svg className="animate-spin h-10 w-10 text-[#B89B7A]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-[#432818] mt-4">Carregando...</p> 
        </div>
      ) : (
        <div className="w-full max-w-md flex flex-col items-center">
          <div className="w-full flex justify-center mb-8">
            <OptimizedImage 
              src="https://res.cloudinary.com/dqljyf76t/image/upload/q_95,f_auto/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp" 
              alt="Logo Gisele Galvão" 
              className="w-20 md:w-24 h-auto"
              width={96} 
              height={48} 
              priority={true} 
            />
          </div>

          <h1 className="font-playfair text-xl md:text-2xl font-bold text-center mb-4 leading-normal text-[#432818] px-[12px]">
            Chega de um guarda-roupa lotado e da sensação de que nada combina com você.
          </h1>

          <div className="flex justify-center mb-6 w-full px-0">
            <OptimizedImage 
              src={introImageDetails?.src || 'https://res.cloudinary.com/dqljyf76t/image/upload/q_95,f_auto/v1745193439/9a20446f-e01f-48f4-96d0-f4b37cc06625_ebd68o.jpg'} 
              alt={introImageDetails?.alt || "Mulher elegante com roupas estilosas"} 
              width={896}
              height={896}
              className="w-full max-w-xs sm:max-w-sm md:max-w-md h-auto rounded-lg shadow-sm object-contain mx-auto"
              priority={true} 
            />
          </div>

          <p className="text-sm text-[#433830] text-center mb-7 max-w-md mx-auto px-[18px]">
            Em poucos minutos, descubra seu{' '}
            <span className="font-semibold text-[#B89B7A]">Estilo Predominante</span> — e aprenda a montar
            looks que realmente refletem sua <span className="font-semibold text-[#b29670]">essência</span>, com
            praticidade e <span className="font-semibold text-[#aa6b5d]">confiança</span>.
          </p>

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
      )}
    </div>
  );
};

export default QuizIntro;
