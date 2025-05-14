'use client';

import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { preloadCriticalImages } from '@/utils/imageManager';
import AutoFixedImages from './ui/AutoFixedImages';
import { 
  // getTinyBase64ImageUrl, // Parece não ser usado diretamente no JSX, mas loadTinyImageAsBase64 é.
  loadTinyImageAsBase64, 
  getOptimizedImageUrl, // Importado, mas localmente era sombreado. Manter para outras possíveis utilizações.
  getTinyImageUrl        // Importado, mas localmente era sombreado. Manter para outras possíveis utilizações.
} from '@/utils/inlineImageUtils';

// --- Otimizações: Constantes e funções movidas para o escopo do módulo ---

const LOGO_BASE_URL = "https://res.cloudinary.com/dqljyf76t/image/upload/";
const LOGO_IMAGE_ID = "v1744911572/LOGO_DA_MARCA_GISELE_r14oz2";

const INTRO_IMAGE_BASE_URL = "https://res.cloudinary.com/dqljyf76t/image/upload/";
const INTRO_IMAGE_ID = "v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up";

// Funções utilitárias renomeadas e movidas para fora do componente
const buildOptimizedIntroImageUrl = (baseUrl: string, imageId: string, format: string, width: number, quality: number) => {
  return `${baseUrl}f_${format},q_${quality},w_${width},c_limit,dpr_auto,fl_progressive,fl_lossy${width > 300 ? ',e_sharpen:30' : ''}/${imageId}.${format}`;
};

const buildTinyIntroImageUrl = (baseUrl: string, imageId: string, format: string, width: number) => {
  return `${baseUrl}f_${format},q_60,w_${width},c_limit,dpr_1.0/${imageId}.${format}`;
};

const STATIC_LOGO_IMAGE_URLS = {
  webp: `${LOGO_BASE_URL}f_webp,q_auto,w_140,h_60,c_fit,dpr_auto,e_sharpen:100/${LOGO_IMAGE_ID}.webp`,
  png: `${LOGO_BASE_URL}f_png,q_auto,w_140,h_60,c_fit,dpr_auto,e_sharpen:100/${LOGO_IMAGE_ID}.png`,
  avif: `${LOGO_BASE_URL}f_avif,q_auto,w_140,h_60,c_fit,dpr_auto,e_sharpen:100/${LOGO_IMAGE_ID}.avif`
};

const STATIC_INTRO_IMAGE_URLS = {
  avif: {
    tiny: buildTinyIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'avif', 200),
    small: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'avif', 345, 75),
    medium: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'avif', 400, 80),
    large: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'avif', 450, 85)
  },
  webp: {
    tiny: buildTinyIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'webp', 200),
    small: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'webp', 345, 70),
    medium: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'webp', 400, 75),
    large: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'webp', 450, 80)
  },
  placeholder: `${INTRO_IMAGE_BASE_URL}f_webp,q_10,w_20,c_limit,e_blur:80/${INTRO_IMAGE_ID}.webp`,
  png: `${INTRO_IMAGE_BASE_URL}f_png,q_75,w_345,c_limit,fl_progressive/${INTRO_IMAGE_ID}.png`
};

// --- Fim das otimizações de escopo do módulo ---

/**
 * QuizIntro - Componente da página inicial do quiz com layout melhorado e performance otimizada
 * 
 * Melhorias implementadas:
 * 1. Layout com espaçamento vertical proporcional e consistente
 * 2. Barra dourada com largura igual a imagem principal para uniformidade visual
 * 3. Performance de carregamento otimizada 
 * 4. Estrutura de componentes simplificada
 * 5. Responsividade refinada para todos os dispositivos
 * 6. Remoção de transições e animações desnecessárias
 * 7. Carregamento imediato com estratégia de recursos otimizada
 * 8. Logo otimizada com fundo transparente
 */

interface QuizIntroProps {
  onStart: (nome: string) => void;
}

export const QuizIntro: React.FC<QuizIntroProps> = ({
  onStart
}) => {
  const [nome, setNome] = useState('');
  const [mainImageWidth, setMainImageWidth] = useState(0);
  const [tinyBase64, setTinyBase64] = useState<string>('');
  
  // Refs para medir e otimizar
  const mainImageRef = useRef<HTMLDivElement>(null);
  const imageLoaded = useRef<boolean>(false);
  
  // Efeito para capturar a largura da imagem principal
  useEffect(() => {
    if (mainImageRef.current) {
      const updateWidth = () => {
        if (mainImageRef.current) {
          setMainImageWidth(mainImageRef.current.offsetWidth);
        }
      };
      
      // Atualiza na montagem
      updateWidth();
      
      // Atualiza no resize
      window.addEventListener('resize', updateWidth);
      
      return () => {
        window.removeEventListener('resize', updateWidth);
      };
    }
  }, []);

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
  
  // Pré-carregamento para LCP com estratégia otimizada - MELHORADO
  useEffect(() => {
    // Preconnect para o domínio Cloudinary para acelerar conexões futuras
    const preconnectLink = document.createElement('link');
    preconnectLink.rel = 'preconnect';
    preconnectLink.href = 'https://res.cloudinary.com';
    preconnectLink.crossOrigin = 'anonymous';
    document.head.appendChild(preconnectLink);

    // DNS Prefetch para melhorar resolução de nome
    const dnsPrefetchLink = document.createElement('link');
    dnsPrefetchLink.rel = 'dns-prefetch';
    dnsPrefetchLink.href = 'https://res.cloudinary.com';
    document.head.appendChild(dnsPrefetchLink);

    // Preload APENAS a imagem principal - LCP crítico
    const lcpCandidatePreload = document.createElement('link');
    lcpCandidatePreload.rel = 'preload';
    lcpCandidatePreload.as = 'image';
    lcpCandidatePreload.href = STATIC_INTRO_IMAGE_URLS.avif.large;
    lcpCandidatePreload.type = 'image/avif';
    lcpCandidatePreload.setAttribute('fetchpriority', 'high');
    document.head.appendChild(lcpCandidatePreload);
    
    // Limpeza ao desmontar
    return () => {
      if (preconnectLink.parentNode) preconnectLink.parentNode.removeChild(preconnectLink);
      if (dnsPrefetchLink.parentNode) dnsPrefetchLink.parentNode.removeChild(dnsPrefetchLink);
      if (lcpCandidatePreload.parentNode) lcpCandidatePreload.parentNode.removeChild(lcpCandidatePreload);
    };
  }, []);



// Novo arquivo otimizado para o useEffect de preload
// Copie e cole este conteúdo no arquivo QuizIntro.tsx, substituindo o useEffect existente de preload

  // Pré-carregamento para LCP com estratégia otimizada - MELHORADO
  useEffect(() => {
    // Preconnect para o domínio Cloudinary para acelerar conexões futuras
    const preconnectLink = document.createElement('link');
    preconnectLink.rel = 'preconnect';
    preconnectLink.href = 'https://res.cloudinary.com';
    preconnectLink.crossOrigin = 'anonymous';
    document.head.appendChild(preconnectLink);

    // DNS Prefetch para melhorar resolução de nome
    const dnsPrefetchLink = document.createElement('link');
    dnsPrefetchLink.rel = 'dns-prefetch';
    dnsPrefetchLink.href = 'https://res.cloudinary.com';
    document.head.appendChild(dnsPrefetchLink);

    // Preload APENAS a imagem principal - LCP crítico
    const lcpCandidatePreload = document.createElement('link');
    lcpCandidatePreload.rel = 'preload';
    lcpCandidatePreload.as = 'image';
    lcpCandidatePreload.href = STATIC_INTRO_IMAGE_URLS.avif.large;
    lcpCandidatePreload.type = 'image/avif';
    lcpCandidatePreload.setAttribute('fetchpriority', 'high');
    document.head.appendChild(lcpCandidatePreload);
    
    // Limpeza ao desmontar
    return () => {
      if (preconnectLink.parentNode) preconnectLink.parentNode.removeChild(preconnectLink);
      if (dnsPrefetchLink.parentNode) dnsPrefetchLink.parentNode.removeChild(dnsPrefetchLink);
      if (lcpCandidatePreload.parentNode) lcpCandidatePreload.parentNode.removeChild(lcpCandidatePreload);
    };
  }, []); // Dependências vazias = executa uma vez na montagem
// Novo arquivo otimizado para o useEffect de carregamento base64
// Copie e cole este conteúdo no arquivo QuizIntro.tsx, substituindo o useEffect existente

  // Efeito para carregar a versão tiny da imagem como base64 para exibição instantânea - OTIMIZADO
  useEffect(() => {
    // Carrega a versão mais leve possível da imagem como base64 para exibição instantânea
    const loadTinyBase64 = async () => {
      try {
        // Evita recarregamentos e usa cache quando possível
        if (!tinyBase64 && !imageLoaded.current) {
          // Verifica se já existe no sessionStorage para evitar refetch
          const cachedImage = sessionStorage.getItem('quiz_intro_tiny_base64');
          if (cachedImage) {
            setTinyBase64(cachedImage);
          } else {
            const base64Data = await loadTinyImageAsBase64(STATIC_INTRO_IMAGE_URLS.placeholder);
            if (base64Data) {
              setTinyBase64(base64Data);
              // Cache para evitar refetches na mesma sessão
              try {
                sessionStorage.setItem('quiz_intro_tiny_base64', base64Data);
              } catch (e) {
                // Ignora erros de storage (limite excedido, etc)
              }
            }
          }
        }
      } catch (error) {
        console.error('[QuizIntro] Erro ao carregar imagem tiny:', error);
      }
    };
    
    loadTinyBase64();
  }, []); // Dependências vazias para executar apenas na montagem
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
        {/* Ajuste no espaçamento vertical para mobile: space-y-5, e mantendo sm:space-y-8 para telas maiores */}
        <div className="w-full max-w-lg px-4 sm:px-6 pt-6 sm:pt-8 md:pt-10 pb-8 space-y-5 sm:space-y-8">
          {/* Logo e barra dourada alinhadas */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <picture>
                {/* Formatos modernos para melhor qualidade e tamanho */}
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
                    imageRendering: 'crisp-edges',
                    maxWidth: '100%',
                    aspectRatio: '140/60',
                    width: '140px',
                    height: '60px',
                    background: 'none'
                  }}
                />
              </picture>
              
              {/* Barra dourada com largura igual à imagem principal para visual mais equilibrado */}
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

          {/* Título principal com espaçamento proporcional */}
          <h1 className="font-playfair text-xl sm:text-2xl md:text-3xl font-bold text-center leading-tight text-[#432818] px-1">
            Chega de um guarda-roupa lotado e da sensação de que nada combina com você.
          </h1>

          {/* Container de imagem com dimensões fixas para evitar layout shift */}
          {/* Ajuste no max-width para mobile: max-w-[300px], sm:max-w-[345px], md:max-w-sm */}
          {/* Remoção do minHeight inline para permitir que aspectRatio e max-width controlem melhor as dimensões */}
          <div 
            ref={mainImageRef}
            className="w-full max-w-[300px] sm:max-w-[345px] md:max-w-sm mx-auto relative overflow-hidden rounded-lg shadow-md" 
            style={{
              // minHeight: 320, // Removido para melhor responsividade com aspectRatio
              height: 'auto',
              aspectRatio: '1 / 1.05',
              background: '#f8f6f2',
              contain: 'layout',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundImage: tinyBase64 ? `url('${tinyBase64}')` : `url('${STATIC_INTRO_IMAGE_URLS.placeholder}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <picture>
              {/* Formatos modernos para browsers que suportam, com preload da versão tiny primeiro */}
              <source 
                srcSet={`${STATIC_INTRO_IMAGE_URLS.avif.tiny} 200w, ${STATIC_INTRO_IMAGE_URLS.avif.small} 345w, ${STATIC_INTRO_IMAGE_URLS.avif.medium} 400w, ${STATIC_INTRO_IMAGE_URLS.avif.large} 450w`} 
                type="image/avif" 
                sizes="(max-width: 640px) 345px, (max-width: 768px) 400px, 450px"
              />
              <source 
                srcSet={`${STATIC_INTRO_IMAGE_URLS.webp.tiny} 200w, ${STATIC_INTRO_IMAGE_URLS.webp.small} 345w, ${STATIC_INTRO_IMAGE_URLS.webp.medium} 400w, ${STATIC_INTRO_IMAGE_URLS.webp.large} 450w`} 
                type="image/webp" 
                sizes="(max-width: 640px) 345px, (max-width: 768px) 400px, 450px"
              />
              {/* Fallback para navegadores sem suporte a formatos modernos */}
              {/* O src agora usa uma URL otimizada do mesmo introImageId */}
              <img
                src={STATIC_INTRO_IMAGE_URLS.png} // Alterado para usar a URL PNG otimizada do introImageId correto
                alt="Descubra seu estilo predominante"
                className="w-full h-auto object-contain quiz-intro-image"
                width={345}
                height={360}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                onLoad={() => { imageLoaded.current = true; }}
                style={{
                  background: '#f8f6f2', 
                  display: 'block', 
                  margin: '0 auto',
                  objectFit: 'contain',
                  aspectRatio: '345/360',
                  backgroundImage: `url('${STATIC_INTRO_IMAGE_URLS.placeholder}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  imageRendering: 'auto',
                  contain: 'paint'
                }}
                sizes="(max-width: 640px) 345px, (max-width: 768px) 400px, 450px"
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
