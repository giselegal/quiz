'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { OptimizedImage } from './ui/optimized-image';
import { preloadImagesByIds, preloadCriticalImages } from '@/utils/imageManager';
import { getImageById } from '@/data/imageBank';
import Logo from './ui/logo';
import AutoFixedImages from './ui/AutoFixedImages';
import '../utils/fix-blurry-images.js';
import { fixBlurryIntroQuizImages } from '@/utils/fixBlurryIntroQuizImages';
import { LoadingState } from './ui/loading-state';

/**
 * QuizIntro - Componente da página inicial do quiz com layout melhorado
 * 
 * Melhorias implementadas:
 * 1. Layout com espaçamento vertical proporcional e consistente
 * 2. Barra dourada com largura proporcional ao logo
 * 3. Performance de carregamento otimizada
 * 4. Estrutura de componentes simplificada
 * 5. Transições e animações suavizadas
 * 6. Responsividade refinada para todos os dispositivos
 */

interface QuizIntroProps {
  onStart: (nome: string) => void;
}

export const QuizIntro: React.FC<QuizIntroProps> = ({
  onStart
}) => {
  const [nome, setNome] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [assetsPreloaded, setAssetsPreloaded] = useState(false);

  // Efeito para carregamento inicial de recursos
  useEffect(() => {
    let isMounted = true;

    const loadInitialAssets = async () => {
      try {
        console.log("[QuizIntro] Iniciando carregamento de assets...");
        
        // Pré-carrega imagens críticas com otimização para LCP (Largest Contentful Paint)
        await preloadCriticalImages('intro'); 
        
        // Pré-carrega os assets mais importantes com alta prioridade
        await preloadImagesByIds(['main-logo', 'intro-image'], {
          batchSize: 2,
          quality: 95,
          generateLowQuality: true
        });

        console.log("[QuizIntro] Assets carregados com sucesso");
        
        if (isMounted) {
          setIsLoading(false);
          setAssetsPreloaded(true);
          
          // Inicia a transição de fade-in com delay mínimo para fluidez visual
          setTimeout(() => {
            if (isMounted) {
              setShowContent(true);
            }
          }, 20); // Reduzido para melhorar percepção de velocidade
        }
      } catch (error) {
        console.error("Falha ao pré-carregar imagens da introdução:", error);
        if (isMounted) {
          setIsLoading(false);
          setShowContent(true);
        }
      }
    };

    loadInitialAssets();

    // Fallback timer mais curto para melhorar UX
    const fallbackTimer = setTimeout(() => {
      if (isMounted && isLoading) {
        console.log("[QuizIntro] Usando fallback timer para mostrar conteúdo");
        setIsLoading(false);
        setShowContent(true);
      }
    }, 3000); // Reduzido de 5s para 3s para melhor experiência

    return () => {
      isMounted = false;
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Pré-carrega imagens da primeira questão após carregar assets críticos
  useEffect(() => {
    if (assetsPreloaded) {
      preloadCriticalImages('quiz');
    }
  }, [assetsPreloaded]);

  // Correção de imagens após renderização completa
  useEffect(() => {
    if (showContent && !isLoading) {
      // Aplica correção uma vez após renderização
      const fixImagesTimer = setTimeout(() => {
        console.log('[QuizIntro] Aplicando correção para imagens borradas');
        fixBlurryIntroQuizImages();
      }, 100);
      
      return () => clearTimeout(fixImagesTimer);
    }
  }, [showContent, isLoading]);

  // Pré-carregamento explícito do LCP (imagem principal do quiz)
  React.useEffect(() => {
    const lcpLink = document.createElement('link');
    lcpLink.rel = 'preload';
    lcpLink.as = 'image';
    lcpLink.href = introImageUrl;
    lcpLink.crossOrigin = 'anonymous';
    document.head.appendChild(lcpLink);
    return () => {
      document.head.removeChild(lcpLink);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nome.trim()) {
      onStart(nome);
    }
  };

  const logoUrl = "https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_80,w_112,h_56,c_limit,dpr_auto,e_sharpen:60/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp";
  const introImageUrl = "https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_80,w_480/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.png";

  // Substituir o spinner de carregamento pela logo
  if (isLoading) {
    return (
      <LoadingState 
        message="Preparando sua experiência personalizada..." 
        showLogo={true} 
        // Melhoria: role e aria-busy para acessibilidade
        role="status"
        aria-busy="true"
      />
    );
  }

  if (!showContent) {
    // Garante que nada é renderizado até o fade-in
    return (
      <div aria-hidden="true" style={{display: 'none'}} />
    );
  }

  return (
    <AutoFixedImages>
      <div 
        className={`quiz-intro flex flex-col items-center w-full transition-opacity duration-500 ease-in-out ${showContent ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FBF8F4 100%)',
          minHeight: '100vh'
        }}
        data-section="intro"
      >
        <div className="w-full max-w-lg px-4 sm:px-6 pt-6 sm:pt-8 md:pt-10 pb-8 space-y-6 sm:space-y-8">
          {/* Logo e barra dourada alinhadas */}
          <div className="flex flex-col items-center">
            <div className="relative w-28 sm:w-32 md:w-36">
              <img 
                src={logoUrl}
                alt="Logo Gisele Galvão"
                className="w-full h-auto mx-auto"
                width={140}
                height={60}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                style={{objectFit: 'contain'}}
              />
              {/* Barra dourada com largura exatamente igual ao logo */}
              <div className="h-[2px] w-full bg-[#B89B7A] mt-2 rounded-full"></div>
            </div>
          </div>

          {/* Título principal com espaçamento proporcional */}
          <h1 className="font-playfair text-xl sm:text-2xl md:text-3xl font-bold text-center leading-tight text-[#432818] px-2">
            Chega de um guarda-roupa lotado e da sensação de que nada combina com você.
          </h1>

          {/* Container de imagem com proporções fixas para evitar layout shift */}
          <div className="w-full aspect-[7/9] max-w-xs sm:max-w-sm md:max-w-md mx-auto relative overflow-hidden rounded-lg shadow-md">
            <img
              src={introImageUrl}
              alt="Intro Quiz"
              className="w-full h-full object-cover quiz-intro-image"
              width={480}
              height={617}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              style={{background: '#f8f6f2'}}
            />
          </div>

          {/* Texto descritivo com espaçamento consistente */}
          <p className="text-sm md:text-base text-[#433830] text-center leading-relaxed max-w-md mx-auto px-2">
            Em poucos minutos, descubra seu <span className="font-semibold text-[#B89B7A]">Estilo Predominante</span> — e aprenda a montar
            looks que realmente refletem sua <span className="font-semibold text-[#432818]">essência</span>, com
            praticidade e <span className="font-semibold text-[#432818]">confiança</span>.
          </p>

          {/* Formulário com espaçamento interno consistente */}
          <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-4" aria-live="polite" autoComplete="off">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-[#432818] mb-1.5">
                NOME
              </label>
              <Input 
                id="name" 
                placeholder="Digite seu nome" 
                value={nome} 
                onChange={e => setNome(e.target.value)} 
                className="w-full p-2.5 border-[#B89B7A] focus:border-[#A1835D] focus:ring-[#A1835D] bg-[#FEFEFE] rounded-md" 
                autoFocus 
                aria-required="true" 
                autoComplete="off"
                inputMode="text"
                maxLength={32}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-[#B89B7A] hover:bg-[#A1835D] text-white py-2.5 sm:py-3 px-4 text-base sm:text-lg font-semibold rounded-md shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#B89B7A] focus:ring-offset-2 transform hover:-translate-y-1 hover:scale-102"
              disabled={!nome.trim()}
            >
              Quero Descobrir meu Estilo Agora!
            </Button>
            
            <p className="text-xs text-center text-gray-500 pt-1"> 
              Ao clicar, você concorda com nossa política de privacidade
            </p>
          </form>
        </div>
      </div>
    </AutoFixedImages>
  );
};

export default QuizIntro;
