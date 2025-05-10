'use client';

import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { preloadCriticalImages } from '@/utils/imageManager';
import AutoFixedImages from './ui/AutoFixedImages';
import { 
  getTinyBase64ImageUrl, 
  loadTinyImageAsBase64, 
  getOptimizedImageUrl,
  getTinyImageUrl
} from '@/utils/inlineImageUtils';

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

  // Configuração otimizada do logo com fundo transparente
  const logoBaseUrl = "https://res.cloudinary.com/dqljyf76t/image/upload/";
  // Certifique-se de que este é o ID público correto da sua imagem de logo no Cloudinary.
  // O parâmetro `b_transparent` tentará tornar o fundo da imagem transparente.
  // Para melhores resultados, a imagem original carregada no Cloudinary:
  // 1. Deve ser um formato que suporte transparência (ex: PNG).
  // 2. Idealmente, já deve ter um fundo transparente.
  // 3. Se tiver um fundo sólido, `b_transparent` funciona melhor com fundos simples (ex: branco).
  const logoImageId = "v1744911572/LOGO_DA_MARCA_GISELE_r14oz2";
  
  // URLs otimizadas para o logo em diferentes formatos, incluindo o parâmetro b_transparent
  // e usando q_auto e dpr_auto para melhor otimização pelo Cloudinary.
  const logoImageUrls = {
    webp: `${logoBaseUrl}f_webp,q_auto,w_140,h_60,c_fit,dpr_auto,e_sharpen:100,b_transparent/${logoImageId}.webp`,
    png: `${logoBaseUrl}f_png,q_auto,w_140,h_60,c_fit,dpr_auto,e_sharpen:100,b_transparent/${logoImageId}.png`,
    avif: `${logoBaseUrl}f_avif,q_auto,w_140,h_60,c_fit,dpr_auto,e_sharpen:100,b_transparent/${logoImageId}.avif`
  };
  
  // Otimização: Adicionando múltiplos tamanhos com formatos modernos e parâmetros de qualidade
  const introImageBaseUrl = "https://res.cloudinary.com/dqljyf76t/image/upload/";
  const introImageId = "v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up";
  
  // Função para criar URLs otimizadas com diferentes tamanhos e formatos
  const getOptimizedImageUrl = (baseUrl: string, imageId: string, format: string, width: number, quality: number) => {
    // Parâmetros otimizados para acelerar carregamento
    return `${baseUrl}f_${format},q_${quality},w_${width},c_limit,dpr_auto,fl_progressive,fl_lossy${width > 300 ? ',e_sharpen:30' : ''}/${imageId}.${format}`;
  };
  
  // Versão extremamente leve para preload inicial - garante LCP rápido
  const getTinyPreloadImageUrl = (baseUrl: string, imageId: string, format: string, width: number) => {
    // Versão super-otimizada com qualidade mínima aceitável
    return `${baseUrl}f_${format},q_50,w_${width},c_limit,dpr_1.0/${imageId}.${format}`;
  };
  
  // URLs otimizadas para diferentes tamanhos e formatos
  const introImageUrls = {
    avif: {
      tiny: getTinyPreloadImageUrl(introImageBaseUrl, introImageId, 'avif', 200),
      small: getOptimizedImageUrl(introImageBaseUrl, introImageId, 'avif', 345, 80),
      medium: getOptimizedImageUrl(introImageBaseUrl, introImageId, 'avif', 400, 85),
      large: getOptimizedImageUrl(introImageBaseUrl, introImageId, 'avif', 450, 90)
    },
    webp: {
      tiny: getTinyPreloadImageUrl(introImageBaseUrl, introImageId, 'webp', 200),
      small: getOptimizedImageUrl(introImageBaseUrl, introImageId, 'webp', 345, 75),
      medium: getOptimizedImageUrl(introImageBaseUrl, introImageId, 'webp', 400, 80),
      large: getOptimizedImageUrl(introImageBaseUrl, introImageId, 'webp', 450, 85)
    },
    // Versão base64 tiny inline para mostrar instantaneamente
    placeholder: `${introImageBaseUrl}f_webp,q_1,w_20,c_limit,e_blur:200/${introImageId}.webp`,
    png: `${introImageBaseUrl}f_png,q_60,w_345,c_limit/${introImageId}.png`
  };

  // Pré-carregamento para LCP com estratégia otimizada e priorização de conteúdo mínimo viável
  useEffect(() => {
    // Função para instalar headers HTTP para sugestão de recursos ao navegador
    const addResourceHints = () => {
      // Adiciona hint de preconnect para o domínio Cloudinary
      const preconnect = document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.href = 'https://res.cloudinary.com';
      preconnect.crossOrigin = 'anonymous';
      document.head.appendChild(preconnect);
      
      // Prioriza DNS-prefetch também
      const dnsPrefetch = document.createElement('link');
      dnsPrefetch.rel = 'dns-prefetch';
      dnsPrefetch.href = 'https://res.cloudinary.com';
      document.head.appendChild(dnsPrefetch);
    };
    
    // Carrega a versão placeholder super tiny para LCP imediato
    const preloadCriticalAssets = () => {
      // Carrega o placeholder blurred primeiro (prioridade máxima)
      const placeholderPreload = document.createElement('link');
      placeholderPreload.rel = 'preload';
      placeholderPreload.as = 'image';
      placeholderPreload.href = introImageUrls.placeholder;
      placeholderPreload.type = 'image/webp';
      placeholderPreload.setAttribute('fetchpriority', 'high');
      document.head.appendChild(placeholderPreload);
      
      // Depois a versão tiny (segundo mais importante)
      const tinyImagePreload = document.createElement('link');
      tinyImagePreload.rel = 'preload';
      tinyImagePreload.as = 'image';
      tinyImagePreload.href = introImageUrls.avif.tiny;
      tinyImagePreload.type = 'image/avif';
      tinyImagePreload.setAttribute('fetchpriority', 'high');
      document.head.appendChild(tinyImagePreload);
      
      // Logo em paralelo (menor, mas importante)
      const logoPreload = document.createElement('link');
      logoPreload.rel = 'preload';
      logoPreload.as = 'image';
      logoPreload.href = logoImageUrls.avif;
      logoPreload.type = 'image/avif';
      document.head.appendChild(logoPreload);
      
      return { placeholderPreload, tinyImagePreload, logoPreload };
    };
    
    // Adiciona resource hints
    addResourceHints();
    
    // Preload de recursos críticos
    const criticalAssets = preloadCriticalAssets();
    
    // Depois de 150ms, preload da versão de qualidade maior em segundo plano
    const timer = setTimeout(() => {
      const betterQualityPreload = document.createElement('link');
      betterQualityPreload.rel = 'preload';
      betterQualityPreload.as = 'image';
      betterQualityPreload.href = introImageUrls.avif.small;
      betterQualityPreload.type = 'image/avif';
      document.head.appendChild(betterQualityPreload);
      
      // Também preload do fallback webp
      const webpPreload = document.createElement('link');
      webpPreload.rel = 'preload';
      webpPreload.as = 'image';
      webpPreload.href = introImageUrls.webp.tiny;
      webpPreload.type = 'image/webp';
      document.head.appendChild(webpPreload);
      
      return { betterQualityPreload, webpPreload };
    }, 150);
    
    // Limpa todos recursos quando componente desmonta
    return () => {
      clearTimeout(timer);
      const elements = Object.values(criticalAssets);
      elements.forEach(el => {
        if (el.parentNode) el.parentNode.removeChild(el);
      });
    };
  }, []);

  // Efeito para carregar a versão tiny da imagem como base64 para exibição instantânea
  useEffect(() => {
    // Carrega a versão mais leve possível da imagem como base64 para exibição instantânea
    const loadTinyBase64 = async () => {
      try {
        // Carrega apenas uma vez
        if (!tinyBase64 && !imageLoaded.current) {
          const base64Data = await loadTinyImageAsBase64(introImageUrls.placeholder);
          setTinyBase64(base64Data);
        }
      } catch (error) {
        console.error('[QuizIntro] Erro ao carregar imagem tiny:', error);
      }
    };
    
    loadTinyBase64();
  }, [introImageUrls.placeholder, tinyBase64]);

  // Adicionando preload para otimizar o carregamento da imagem principal e melhorar o LCP
  useEffect(() => {
    const preloadImage = (url: string, type: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      link.type = type;
      document.head.appendChild(link);
    };

    // Preload da imagem principal em formato AVIF e WebP
    preloadImage(introImageUrls.avif.large, 'image/avif');
    preloadImage(introImageUrls.webp.large, 'image/webp');

    // Preload do logo
    preloadImage(logoImageUrls.avif, 'image/avif');
    preloadImage(logoImageUrls.webp, 'image/webp');
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
            <div className="relative">
              <picture>
                {/* Formatos modernos para melhor qualidade e tamanho */}
                <source srcSet={logoImageUrls.avif} type="image/avif" />
                <source srcSet={logoImageUrls.webp} type="image/webp" />
                <img 
                  src={logoImageUrls.png}
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
                    height: '60px'
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
          <div 
            ref={mainImageRef}
            className="w-full max-w-[345px] sm:max-w-sm md:max-w-md mx-auto relative overflow-hidden rounded-lg shadow-md" 
            style={{
              minHeight: 320,
              height: 'auto',
              aspectRatio: '1 / 1.05',
              background: '#f8f6f2',
              contain: 'layout',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundImage: tinyBase64 ? `url('${tinyBase64}')` : `url('${introImageUrls.placeholder}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <picture>
              {/* Formatos modernos para browsers que suportam, com preload da versão tiny primeiro */}
              <source 
                srcSet={`${introImageUrls.avif.tiny} 200w, ${introImageUrls.avif.small} 345w, ${introImageUrls.avif.medium} 400w, ${introImageUrls.avif.large} 450w`} 
                type="image/avif" 
                sizes="(max-width: 640px) 345px, (max-width: 768px) 400px, 450px"
              />
              <source 
                srcSet={`${introImageUrls.webp.tiny} 200w, ${introImageUrls.webp.small} 345w, ${introImageUrls.webp.medium} 400w, ${introImageUrls.webp.large} 450w`} 
                type="image/webp" 
                sizes="(max-width: 640px) 345px, (max-width: 768px) 400px, 450px"
              />
              {/* Fallback para navegadores sem suporte a formatos modernos */}
              <img
                src="https://res.cloudinary.com/dqljyf76t/image/upload/f_avif,q_auto,w_450,c_limit/v1709737559/quiz-sell-genius/quiz-intro-image.png"
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
                  backgroundImage: `url('${introImageUrls.placeholder}')`,
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
