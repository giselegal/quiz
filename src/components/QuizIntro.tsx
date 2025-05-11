// filepath: /workspaces/quiz-sell-genius-66/src/components/QuizIntro.tsx
'use client';

import React from 'react';
import { useState, useEffect, useRef, memo, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { preloadCriticalImages } from '@/utils/imageManager';
import AutoFixedImages from './ui/AutoFixedImages';
import { 
  loadTinyImageAsBase64, 
  getOptimizedImageUrl,
  getTinyImageUrl
} from '@/utils/inlineImageUtils';

// --- Constantes e URLs otimizadas (computadas apenas uma vez) ---

const LOGO_BASE_URL = "https://res.cloudinary.com/dqljyf76t/image/upload/";
const LOGO_IMAGE_ID = "v1744911572/LOGO_DA_MARCA_GISELE_r14oz2";

const INTRO_IMAGE_BASE_URL = "https://res.cloudinary.com/dqljyf76t/image/upload/";
const INTRO_IMAGE_ID = "v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up";

// URLs pré-computadas para evitar recálculos durante renderização
const STATIC_LOGO_IMAGE_URLS = {
  webp: `${LOGO_BASE_URL}f_webp,q_85,w_140,h_60,c_fit,dpr_auto/${LOGO_IMAGE_ID}.webp`,
  png: `${LOGO_BASE_URL}f_png,q_85,w_140,h_60,c_fit,dpr_auto/${LOGO_IMAGE_ID}.png`,
  avif: `${LOGO_BASE_URL}f_avif,q_85,w_140,h_60,c_fit,dpr_auto/${LOGO_IMAGE_ID}.avif`
};

// URLs estáticas para evitar regeneração
const STATIC_INTRO_IMAGE_URLS = {
  avif: {
    tiny: `${INTRO_IMAGE_BASE_URL}f_avif,q_60,w_200,c_limit,dpr_1.0/${INTRO_IMAGE_ID}.avif`,
    small: `${INTRO_IMAGE_BASE_URL}f_avif,q_75,w_345,c_limit,dpr_auto/${INTRO_IMAGE_ID}.avif`,
    medium: `${INTRO_IMAGE_BASE_URL}f_avif,q_80,w_400,c_limit,dpr_auto/${INTRO_IMAGE_ID}.avif`,
    large: `${INTRO_IMAGE_BASE_URL}f_avif,q_85,w_450,c_limit,dpr_auto/${INTRO_IMAGE_ID}.avif`
  },
  webp: {
    tiny: `${INTRO_IMAGE_BASE_URL}f_webp,q_60,w_200,c_limit,dpr_1.0/${INTRO_IMAGE_ID}.webp`,
    small: `${INTRO_IMAGE_BASE_URL}f_webp,q_70,w_345,c_limit,dpr_auto/${INTRO_IMAGE_ID}.webp`,
    medium: `${INTRO_IMAGE_BASE_URL}f_webp,q_75,w_400,c_limit,dpr_auto/${INTRO_IMAGE_ID}.webp`,
    large: `${INTRO_IMAGE_BASE_URL}f_webp,q_80,w_450,c_limit,dpr_auto/${INTRO_IMAGE_ID}.webp`
  },
  placeholder: `${INTRO_IMAGE_BASE_URL}f_webp,q_5,w_30,c_limit,e_blur:100/${INTRO_IMAGE_ID}.webp`,
  png: `${INTRO_IMAGE_BASE_URL}f_png,q_75,w_345,c_limit/${INTRO_IMAGE_ID}.png`
};

// --- Pré-carregamento de imagens críticas ---
// Anexa links de preload no head para imagens críticas para LCP
if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  const preloadLink = (url: string, as: string = 'image') => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = as;
    document.head.appendChild(link);
  };
  
  // Apenas preload de recursos críticos iniciais (LCP)
  preloadLink(STATIC_LOGO_IMAGE_URLS.avif);
  preloadLink(STATIC_INTRO_IMAGE_URLS.avif.small);
}

interface QuizIntroProps {
  onStart: (nome: string) => void;
}

export function QuizIntro({ onStart }) {
  const [nome, setNome] = useState('');
  const [mainImageWidth, setMainImageWidth] = useState(0);
  const [tinyBase64, setTinyBase64] = useState<string>('');

  // Refs para medir e otimizar
  const mainImageRef = useRef<HTMLDivElement>(null);
  const imageLoaded = useRef<boolean>(false);
  const preloadInitiated = useRef<boolean>(false);

  // Efeito para capturar a largura da imagem principal - usando ResizeObserver
  useEffect(() => {
    if (!mainImageRef.current) return;
  
    const updateWidth = () => {
      if (mainImageRef.current) {
        setMainImageWidth(mainImageRef.current.offsetWidth);
      }
    };

    // Inicialização única
    updateWidth();
  
    // Usando ResizeObserver em vez de eventos de janela para melhor performance
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(mainImageRef.current);
  
    return () => resizeObserver.disconnect();
  }, []);

  // Efeito para carregar a versão tiny da imagem como base64 - otimizado
  useEffect(() => {
    let isMounted = true;
    
    const loadTinyBase64 = async () => {
      // Evita carregamentos desnecessários
      if (tinyBase64 || imageLoaded.current) return;
      
      try {
        const base64Data = await loadTinyImageAsBase64(STATIC_INTRO_IMAGE_URLS.placeholder);
        if (isMounted && base64Data) {
          setTinyBase64(base64Data);
        }
      } catch (error) {
        console.error('[QuizIntro] Erro ao carregar imagem tiny:', error);
      }
    };

    loadTinyBase64();
    
    return () => { isMounted = false; };
  }, []);

  // Efeito otimizado para preload de recursos secundários
  useEffect(() => {
    if (preloadInitiated.current) return;
    preloadInitiated.current = true;
    
    // Função que detecta visibilidade e inatividade
    const preloadWhenIdle = () => {
      // Usa Intersection Observer para detectar visibilidade
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          // Elemento está visível, agendar carregamento em momento ocioso
          if (typeof requestIdleCallback === 'function') {
            requestIdleCallback(() => preloadCriticalImages('quiz'), { timeout: 1500 });
          } else {
            setTimeout(() => preloadCriticalImages('quiz'), 1500);
          }
          observer.disconnect();
        }
      });
      
      // Observe o contêiner principal
      if (mainImageRef.current) {
        observer.observe(mainImageRef.current);
      }
    };
    
    preloadWhenIdle();
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (nome.trim()) {
      onStart(nome);
    }
  }, [nome, onStart]);

  return (
    <AutoFixedImages>
      <div
        className="quiz-intro flex flex-col items-center w-full"
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FBF8F4 100%)',
          minHeight: '100vh',
          contain: 'layout'
        }}
        data-section="intro"
      >
        <div className="w-full max-w-lg px-4 sm:px-6 pt-6 sm:pt-8 md:pt-10 pb-8 space-y-5 sm:space-y-8">
          {/* Logo e separador - componente otimizado */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <picture>
                <source srcSet={STATIC_LOGO_IMAGE_URLS.avif} type="image/avif" />
                <source srcSet={STATIC_LOGO_IMAGE_URLS.webp} type="image/webp" />
                <img
                  src={STATIC_LOGO_IMAGE_URLS.png}
                  alt="Logo Gisele Galvão"
                  className="h-auto mx-auto"
                  width={140}
                  height={60}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  style={{
                    objectFit: 'contain',
                    maxWidth: '100%',
                    aspectRatio: '140/60',
                    width: '140px',
                    height: '60px'
                  }} />
              </picture>

              <div
                className="h-[2px] bg-[#B89B7A] mt-2 rounded-full mx-auto"
                style={{
                  width: mainImageWidth > 0 ? `${mainImageWidth}px` : '100%',
                  maxWidth: '100%',
                  transition: 'width 0.3s ease-in-out'
                }}
              ></div>
            </div>
          </div>

          <h1 className="font-playfair text-xl sm:text-2xl md:text-3xl font-bold text-center leading-tight text-[#432818] px-1">
            Chega de um guarda-roupa lotado e da sensação de que nada combina com você.
          </h1>

          {/* Imagem otimizada com lazy loading adequado */}
          <div
            ref={mainImageRef}
            className="w-full max-w-[300px] sm:max-w-[345px] md:max-w-sm mx-auto relative overflow-hidden rounded-lg shadow-md"
            style={{
              height: 'auto',
              aspectRatio: '1 / 1.05',
              background: '#f8f6f2',
              contain: 'content',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundImage: tinyBase64 ? `url('${tinyBase64}')` : `url('${STATIC_INTRO_IMAGE_URLS.placeholder}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <picture>
              <source
                srcSet={`${STATIC_INTRO_IMAGE_URLS.avif.small} 345w, ${STATIC_INTRO_IMAGE_URLS.avif.medium} 400w, ${STATIC_INTRO_IMAGE_URLS.avif.large} 450w`}
                type="image/avif"
                sizes="(max-width: 640px) 300px, (max-width: 768px) 345px, 400px" />
              <source
                srcSet={`${STATIC_INTRO_IMAGE_URLS.webp.small} 345w, ${STATIC_INTRO_IMAGE_URLS.webp.medium} 400w, ${STATIC_INTRO_IMAGE_URLS.webp.large} 450w`}
                type="image/webp"
                sizes="(max-width: 640px) 300px, (max-width: 768px) 345px, 400px" />
              <img
                src={STATIC_INTRO_IMAGE_URLS.png}
                alt="Descubra seu estilo predominante"
                className="w-full h-auto object-contain quiz-intro-image"
                width={345}
                height={360}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                onLoad={() => { imageLoaded.current = true; }}
                style={{
                  display: 'block',
                  margin: '0 auto',
                  objectFit: 'contain',
                  aspectRatio: '345/360'
                }}
                sizes="(max-width: 640px) 300px, (max-width: 768px) 345px, 400px" />
            </picture>
          </div>

          <p className="text-sm md:text-base text-[#433830] text-center leading-relaxed max-w-md mx-auto px-2">
            Em poucos minutos, descubra seu <span className="font-semibold text-[#B89B7A]">Estilo Predominante</span> — e aprenda a montar
            looks que realmente refletem sua <span className="font-semibold text-[#432818]">essência</span>, com
            praticidade e <span className="font-semibold text-[#432818]">confiança</span>.
          </p>

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
                maxLength={32} />
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
}

// Memoização do componente para evitar re-renderizações desnecessárias
export default memo(QuizIntro);
