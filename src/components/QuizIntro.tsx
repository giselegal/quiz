'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { OptimizedImage } from './ui/optimized-image';
import { preloadCriticalImages } from '@/utils/imageManager';
import Logo from './ui/logo';
import AutoFixedImages from './ui/AutoFixedImages';

/**
 * QuizIntro - Componente da página inicial do quiz com layout melhorado e performance otimizada
 * 
 * Melhorias implementadas:
 * 1. Layout com espaçamento vertical proporcional e consistente
 * 2. Barra dourada com largura proporcional ao logo
 * 3. Performance de carregamento otimizada
 * 4. Estrutura de componentes simplificada
 * 5. Responsividade refinada para todos os dispositivos
 * 6. Remoção de transições e animações desnecessárias
 * 7. Carregamento imediato com estratégia de recursos otimizada
 */

interface QuizIntroProps {
  onStart: (nome: string) => void;
}

export const QuizIntro: React.FC<QuizIntroProps> = ({
  onStart
}) => {
  const [nome, setNome] = useState('');

  // Efeito único e simplificado para carregamento posterior de recursos
  useEffect(() => {
    // Carrega recursos adicionais após o componente estar visível
    if (typeof requestIdleCallback === 'function') {
      // Usa tempos ociosos do browser para carregar recursos não-críticos
      requestIdleCallback(() => {
        preloadCriticalImages('quiz');
      }, { timeout: 2000 });
    } else {
      // Fallback para browsers que não suportam requestIdleCallback
      const idleTimer = setTimeout(() => {
        preloadCriticalImages('quiz');
      }, 2000); // Tempo suficiente para garantir que o LCP ocorreu
      
      return () => clearTimeout(idleTimer);
    }
  }, []);

  // Configuração optimizada do logo
  const logoBaseUrl = "https://res.cloudinary.com/dqljyf76t/image/upload/";
  const logoImageId = "v1744911572/LOGO_DA_MARCA_GISELE_r14oz2";
  
  // URLs otimizadas para o logo em diferentes formatos
  const logoImageUrls = {
    webp: `${logoBaseUrl}f_webp,q_100,w_140,h_60,c_fit,dpr_2.0,e_sharpen:100/${logoImageId}.webp`,
    png: `${logoBaseUrl}f_png,q_100,w_140,h_60,c_fit,dpr_2.0,e_sharpen:100/${logoImageId}.png`,
    avif: `${logoBaseUrl}f_avif,q_100,w_140,h_60,c_fit,dpr_2.0,e_sharpen:100/${logoImageId}.avif`
  };
  
  // Otimização: Adicionando múltiplos tamanhos com formatos modernos e parâmetros de qualidade
  const introImageBaseUrl = "https://res.cloudinary.com/dqljyf76t/image/upload/";
  const introImageId = "v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up";
  
  // Função para criar URLs otimizadas com diferentes tamanhos e formatos
  const getOptimizedImageUrl = (baseUrl: string, imageId: string, format: string, width: number, quality: number) => {
    return `${baseUrl}f_${format},q_${quality},w_${width},c_limit,dpr_auto${width > 300 ? ',e_sharpen:30' : ''}/${imageId}.${format}`;
  };
  
  // URLs otimizadas para diferentes tamanhos e formatos
  const introImageUrls = {
    avif: {
      small: getOptimizedImageUrl(introImageBaseUrl, introImageId, 'avif', 320, 90),
      medium: getOptimizedImageUrl(introImageBaseUrl, introImageId, 'avif', 384, 90),
      large: getOptimizedImageUrl(introImageBaseUrl, introImageId, 'avif', 420, 90)
    },
    webp: {
      small: getOptimizedImageUrl(introImageBaseUrl, introImageId, 'webp', 320, 90),
      medium: getOptimizedImageUrl(introImageBaseUrl, introImageId, 'webp', 384, 90),
      large: getOptimizedImageUrl(introImageBaseUrl, introImageId, 'webp', 420, 90)
    },
    // Inclui versão de baixa qualidade para carregamento progressivo
    placeholder: `${introImageBaseUrl}f_webp,q_20,w_60,c_limit,e_blur:150/${introImageId}.webp`,
    png: getOptimizedImageUrl(introImageBaseUrl, introImageId, 'png', 480, 85)
  };

  // Pré-carregamento otimizado com link rel=preload para o LCP
  useEffect(() => {
    // Apenas adiciona preload para a imagem principal (LCP)
    const mainImagePreload = document.createElement('link');
    mainImagePreload.rel = 'preload';
    mainImagePreload.as = 'image';
    mainImagePreload.href = introImageUrls.webp.small;
    mainImagePreload.type = 'image/webp';
    document.head.appendChild(mainImagePreload);
    
    // Preload para o logo (importante, mas pequeno)
    const logoPreload = document.createElement('link');
    logoPreload.rel = 'preload';
    logoPreload.as = 'image';
    logoPreload.href = logoImageUrls.webp;
    logoPreload.type = 'image/webp';
    document.head.appendChild(logoPreload);
    
    return () => {
      if (mainImagePreload.parentNode) mainImagePreload.parentNode.removeChild(mainImagePreload);
      if (logoPreload.parentNode) logoPreload.parentNode.removeChild(logoPreload);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nome.trim()) {
      onStart(nome);
    }
  };

  return (
    <AutoFixedImages>
      <div 
        className="quiz-intro flex flex-col items-center w-full"
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
              <picture>
                {/* Formatos modernos para melhor qualidade e tamanho */}
                <source srcSet={logoImageUrls.avif} type="image/avif" />
                <source srcSet={logoImageUrls.webp} type="image/webp" />
                <img 
                  src={logoImageUrls.png}
                  alt="Logo Gisele Galvão"
                  className="w-full h-auto mx-auto"
                  width={140}
                  height={60}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  style={{
                    objectFit: 'contain',
                    imageRendering: 'crisp-edges'
                  }}
                />
              </picture>
              {/* Barra dourada com largura exatamente igual ao logo */}
              <div className="h-[2px] w-full bg-[#B89B7A] mt-2 rounded-full"></div>
            </div>
          </div>

          {/* Título principal com espaçamento proporcional */}
          <h1 className="font-playfair text-xl sm:text-2xl md:text-3xl font-bold text-center leading-tight text-[#432818] px-2">
            Chega de um guarda-roupa lotado e da sensação de que nada combina com você.
          </h1>

          {/* Container de imagem com proporções fixas para evitar layout shift */}
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto relative overflow-hidden rounded-lg shadow-md flex items-center justify-center" style={{minHeight: 320, background: '#f8f6f2'}}>
            <picture>
              {/* Formatos modernos para browsers que suportam */}
              <source 
                srcSet={`${introImageUrls.avif.small} 320w, ${introImageUrls.avif.medium} 384w, ${introImageUrls.avif.large} 420w`} 
                type="image/avif" 
                sizes="(max-width: 640px) 320px, (max-width: 768px) 384px, 420px"
              />
              <source 
                srcSet={`${introImageUrls.webp.small} 320w, ${introImageUrls.webp.medium} 384w, ${introImageUrls.webp.large} 420w`} 
                type="image/webp" 
                sizes="(max-width: 640px) 320px, (max-width: 768px) 384px, 420px"
              />
              {/* Fallback para navegadores sem suporte a formatos modernos */}
              <img
                src={introImageUrls.png}
                alt="Descubra seu estilo predominante"
                className="w-full h-auto max-h-[340px] object-contain quiz-intro-image"
                width={320}
                height={340}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                style={{
                  background: '#f8f6f2', 
                  display: 'block', 
                  margin: '0 auto',
                  backgroundImage: `url('${introImageUrls.placeholder}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
                sizes="(max-width: 640px) 320px, (max-width: 768px) 384px, 420px"
              />
            </picture>
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
              className="w-full bg-[#B89B7A] hover:bg-[#A1835D] text-white py-2.5 sm:py-3 px-4 text-base sm:text-lg font-semibold rounded-md shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#B89B7A] focus:ring-offset-2"
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
