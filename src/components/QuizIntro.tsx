'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { OptimizedImage } from './ui/optimized-image';
import FixedIntroImage from './ui/FixedIntroImage';
import { preloadImagesByIds, preloadCriticalImages } from '@/utils/imageManager';
import { getImageById } from '@/data/imageBank';
// Remover importações desnecessárias
// import { LoadingSpinner } from './ui/loading-spinner';
import AutoFixedImages from './ui/AutoFixedImages';
import '../utils/fix-blurry-images.js';
import { fixBlurryIntroQuizImages } from '@/utils/fixBlurryIntroQuizImages';

/**
 * QuizIntro - Componente completamente restruturado para a página inicial do quiz
 * 
 * Problemas resolvidos:
 * 1. Problemas de layout que criavam "buracos vazios" e espaçamento irregular
 * 2. Conflitos entre min-h-screen e outros componentes de layout
 * 3. Problemas de renderização da imagem principal que não empurrava o conteúdo
 * 4. Incompatibilidades entre diferentes abordagens de espaçamento (gap-y vs space-y)
 * 
 * Melhorias implementadas:
 * 1. Layout mais previsível com estrutura HTML simplificada
 * 2. Remoção de min-h-screen substituído por uma abordagem mais robusta
 * 3. Imagem principal com aspect-ratio fixo para evitar saltos de layout
 * 4. Gradiente sutil para melhorar a aparência visual
 * 5. Estrutura de formulário com espaçamento tradicional via margins
 * 6. Estado de loading consistente com o layout final
 * 7. Responsividade aprimorada para todos os dispositivos
 */

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
  const [logoLoaded, setLogoLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadInitialAssets = async () => {
      try {
        console.log("[QuizIntro] Iniciando carregamento de assets...");
        
        // Pré-carrega imagens críticas para a introdução com maior qualidade
        preloadCriticalImages('intro'); 
        
        // Pré-carrega a logo e a imagem de introdução com alta qualidade
        await preloadImagesByIds(['main-logo', 'intro-image'], {
          batchSize: 2,
          quality: 95,
          // Garante que os placeholders terão boa qualidade
          generateLowQuality: true
        });

        console.log("[QuizIntro] Assets carregados com sucesso");
        
        if (isMounted) {
          setIsLoading(false); // Desliga o spinner principal
          setCriticalAssetsForQuizPreloaded(true); // Sinaliza que os assets da intro foram carregados
          // Inicia a transição para mostrar o conteúdo com um delay menor
          setTimeout(() => {
            if (isMounted) {
              setShowContent(true);
              console.log("[QuizIntro] Conteúdo exibido");
            }
          }, 30); // Reduzido de 50ms para 30ms para transição mais rápida
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
    }, 5000); // Reduzido para 5s para melhorar a experiência do usuário

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

  useEffect(() => {
    // Aplicar correção específica para imagens borradas quando o componente for montado
    if (showContent && !isLoading) {
      // Pequeno atraso para garantir que as imagens foram renderizadas
      setTimeout(() => {
        console.log('[QuizIntro] Aplicando correção para imagens borradas');
        const count = fixBlurryIntroQuizImages();
        console.log(`[QuizIntro] Correção aplicada com sucesso: ${count} imagens corrigidas`);
      }, 100);
    }
  }, [showContent, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nome.trim()) {
      onStart(nome);
    }
  };

  const introImageDetails = getImageById('intro-image');
  const logoUrl = "https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_99,dpr_auto,e_sharpen:80/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp";

  if (isLoading) {
    return (
      <div 
        className="flex flex-col items-center justify-center min-h-screen"
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FBF8F4 100%)'
        }}
      >
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <div className="relative">
            <img
              src={logoUrl}
              alt="Gisele Galvão"
              className="h-auto w-32 sm:w-36 md:w-40 mx-auto"
              width={160}
              height={80}
              loading="eager"
              fetchPriority="high"
              onLoad={() => setLogoLoaded(true)}
            />
            {/* Efeito de brilho abaixo do logo */}
            <div className="absolute -bottom-4 -left-4 -right-4 h-2 bg-gradient-to-r from-transparent via-[#B89B7A] to-transparent opacity-70"></div>
          </div>
          
          {/* Texto de carregamento minimalista */}
          <p className="mt-6 text-sm text-[#432818]/60 font-light">
            Preparando sua experiência personalizada...
          </p>
        </div>
      </div>
    );
  }

  return (
    <AutoFixedImages>
      <div 
        className={`quiz-intro flex flex-col items-center justify-start py-10 px-6 sm:px-8 md:px-10 transition-opacity duration-700 ease-in-out ${showContent ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FBF8F4 100%)',
          minHeight: '100vh',
          paddingBottom: '3rem'
        }}
        data-section="intro"
      >
      <div className="w-full max-w-lg flex flex-col items-center space-y-6 pb-8"> {/* Alterado de space-y-8 para space-y-6 */}
        
        {/* Seção da Logo e Barra - Margem inferior ajustada */}
        <div className="w-full flex flex-col items-center"> {/* Removido mb-4 */}
          <div className="w-32 sm:w-36 md:w-40"> 
            <OptimizedImage 
              src="https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_99,dpr_auto,e_sharpen:80/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp" 
              alt="Logo Gisele Galvão" 
              className="block h-auto w-full"
              width={160}
              height={80}
              priority={true} 
              objectFit="contain"
              quality={99}
              placeholderColor="#ffffff"
            />
          </div>
          <div className="mt-2 h-[3px] w-48 sm:w-52 md:w-60 bg-[#B89B7A] rounded"></div> {/* Alterado de mt-3 para mt-2 */}
        </div>

        {/* Headline - Tamanho e peso da fonte aumentados, margem inferior ajustada */}
        <h1 className="font-playfair text-2xl sm:text-3xl md:text-3xl font-bold text-center leading-tight text-[#432818]"> {/* Removido mb-4 */}
          Chega de um guarda-roupa lotado e da sensação de que nada combina com você.
        </h1>

        {/* Imagem Principal - Substituída por FixedIntroImage para eliminar embaçamento */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-sm sm:max-w-md md:max-w-lg">
            <FixedIntroImage 
              src={introImageDetails?.src || 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745193439/9a20446f-e01f-48f4-96d0-f4b37cc06625_ebd68o.webp'} 
              alt={introImageDetails?.alt || "Mulher elegante com roupas estilosas"} 
              width={1000}
              height={1000}
              priority={true}
              className="rounded-lg overflow-hidden shadow-md"
            />
          </div>
        </div>
        
        {/* Texto descritivo - Movido para logo abaixo da imagem, margem inferior ajustada */}
        <p className="text-sm sm:text-base text-[#433830] text-center leading-relaxed max-w-md mx-auto px-2 sm:px-4"> 
          Em poucos minutos, descubra seu{' '}
          <span className="font-semibold text-[#B89B7A]">Estilo Predominante</span> — e aprenda a montar
          looks que realmente refletem sua <span className="font-semibold text-[#432818]">essência</span>, com
          praticidade e <span className="font-semibold text-[#432818]">confiança</span>.
        </p>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="w-full mx-auto mt-2" aria-live="polite">
          <div className="mb-4">
            <label htmlFor="name" className="block text-xs font-semibold text-[#432818] mb-1">
              NOME
            </label>
            <Input 
              id="name" 
              placeholder="Digite seu nome" 
              value={nome} 
              onChange={e => setNome(e.target.value)} 
              className="w-full p-3 border-[#B89B7A] focus:border-[#A1835D] focus:ring-[#A1835D] bg-[#FEFEFE] rounded-md" 
              autoFocus 
              aria-required="true" 
            />
          </div>
          <Button 
            type="submit" 
            className="w-full mx-auto bg-[#B89B7A] hover:bg-[#A1835D] text-white py-3 sm:py-4 px-4 text-base sm:text-lg font-semibold rounded-md shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#B89B7A] focus:ring-offset-2 transform hover:-translate-y-1 hover:scale-102"
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
    </AutoFixedImages>
  );
};

export default QuizIntro;
