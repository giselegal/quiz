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

// Otimizações de imagem aprimoradas para melhor desempenho
const STATIC_INTRO_IMAGE_URLS = {
  avif: {
    tiny: buildTinyIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'avif', 80),
    small: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'avif', 270, 75),
    medium: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'avif', 345, 78),
    large: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'avif', 450, 80)
  },
  webp: {
    tiny: buildTinyIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'webp', 100),
    small: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'webp', 270, 75),
    medium: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'webp', 345, 78),
    large: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'webp', 450, 80)
  },
  placeholder: `${INTRO_IMAGE_BASE_URL}f_webp,q_10,w_20,c_limit,e_blur:80/${INTRO_IMAGE_ID}.webp`,
  png: `${INTRO_IMAGE_BASE_URL}f_png,q_75,w_345,c_limit,fl_progressive/${INTRO_IMAGE_ID}.png`
};

// --- Fim das otimizações de escopo do módulo ---

  // Hook personalizado para pré-carregamento de recursos críticos
  const usePreloadResources = () => {
    useEffect(() => {
      // Função para criar e adicionar link de preload
      // Marcar o tempo de renderização para métricas
      if (window.performance && window.performance.mark) {
        window.performance.mark('quiz-intro-rendered');
      }
      const addPreloadLink = (href: string, as: string, type?: string, crossOrigin?: boolean) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = as;
        
        if (type) {
          link.type = type;
        }
        
        if (crossOrigin) {
          link.crossOrigin = '';
        }
        
        document.head.appendChild(link);
        return link;
      };
      
      // Prefetch do recurso principal logo no início
      const imgPreload = addPreloadLink(
        STATIC_INTRO_IMAGE_URLS.avif.large, 
        'image', 
        'image/avif'
      );
      imgPreload.setAttribute('fetchpriority', 'high');
      
      // Prefetch do recurso de logo
      const logoPreload = addPreloadLink(
        STATIC_LOGO_IMAGE_URLS.webp,
        'image',
        'image/webp'
      );
      
      // Preconnect com o domínio Cloudinary
      const preconnectLink = document.createElement('link');
      preconnectLink.rel = 'preconnect';
      preconnectLink.href = 'https://res.cloudinary.com';
      preconnectLink.crossOrigin = '';
      document.head.appendChild(preconnectLink);
      
      // Limpeza ao desmontar
      return () => {
        [imgPreload, logoPreload, preconnectLink].forEach(el => {
          if (el && el.parentNode) {
            el.parentNode.removeChild(el);
          }
        });
      };
    }, []);
  };
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
  // Pré-carregar recursos críticos para melhorar LCP
  usePreloadResources();
  
  // Refs para medir e otimizar
  const mainImageRef = useRef<HTMLDivElement>(null);
  const imageLoaded = useRef<boolean>(false);
  
  // Event handlers otimizados com useCallback para evitar re-renders
  const handleMainImageLoad = React.useCallback(() => {
    imageLoaded.current = true;
    
    // Registrar o tempo de carregamento como métrica de performance
    if (window.performance && window.performance.mark) {
      window.performance.mark('main-image-loaded');
      
      // Se tivermos uma marca de início, podemos medir o tempo de carregamento
      if (performance.getEntriesByName('quiz-intro-rendered').length > 0) {
        performance.measure(
          'main-image-load-time', 
          'quiz-intro-rendered', 
          'main-image-loaded'
        );
        
        const measureEntry = performance.getEntriesByName('main-image-load-time')[0];
        if (measureEntry && console) {
          console.log(`[Performance] Main image loaded in ${measureEntry.duration.toFixed(2)}ms`);
        }
      }
    }
  }, []);
  
  // Efeito para capturar a largura da imagem principal - otimizado com ResizeObserver
  useEffect(() => {
    if (mainImageRef.current) {
      // Função para atualizar a largura usando dados do ResizeObserver (mais eficiente)
      const updateWidth = () => {
        if (mainImageRef.current) {
          setMainImageWidth(mainImageRef.current.offsetWidth);
        }
      };
      
      // Usar ResizeObserver para performance superior (evita reflows)
      if (typeof ResizeObserver === 'function') {
        const resizeObserver = new ResizeObserver((entries) => {
          // Otimização: usar requestAnimationFrame para agrupar as atualizações visuais
          window.requestAnimationFrame(() => {
            for (const entry of entries) {
              if (entry.target === mainImageRef.current) {
                const width = entry.contentRect.width;
                if (width > 0 && Math.abs(width - mainImageWidth) > 1) {
                  setMainImageWidth(width);
                }
              }
            }
          });
        });
        
        resizeObserver.observe(mainImageRef.current);
        
        // Também chamar updateWidth para garantir valor inicial
        updateWidth();
        
        return () => {
          if (mainImageRef.current) {
            resizeObserver.unobserve(mainImageRef.current);
          }
          resizeObserver.disconnect();
        };
      } else {
        // Fallback para navegadores antigos - usar evento de resize
        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
      }
    }
  }, [mainImageWidth]);

  // Monitoramento de métricas de performance vital para ajustes finos
  useEffect(() => {
    // Registra o paint inicial como referência
    if (window.performance && window.performance.mark) {
      window.performance.mark('quiz-intro-mounted');
    }
    
    // Monitorar métricas Web Vitals
    if (typeof PerformanceObserver === 'function') {
      // Monitorar LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          console.log(`[Performance] LCP: ${entry.startTime.toFixed(1)}ms`);
        }
      });
      
      try {
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {
        console.warn('[Performance] LCP observation not supported');
      }
      
      // Monitorar FID (First Input Delay)
      const fidObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const delay = (entry as PerformanceEventTiming).processingStart - entry.startTime;
          console.log(`[Performance] FID: ${delay.toFixed(1)}ms`);
        }
      });
      
      try {
        fidObserver.observe({ type: 'first-input', buffered: true });
      } catch (e) {
        console.warn('[Performance] FID observation not supported');
      }
      
      // Monitorar CLS (Cumulative Layout Shift)
      const clsObserver = new PerformanceObserver((entryList) => {
        let cls = 0;
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            cls += (entry as any).value;
          }
        }
        console.log(`[Performance] CLS: ${cls.toFixed(3)}`);
      });
      
      try {
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {
        console.warn('[Performance] CLS observation not supported');
      }
      
      return () => {
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
      };
    }
    
    return () => {};
  }, []);



// Novo arquivo otimizado para o useEffect de preload
// Copie e cole este conteúdo no arquivo QuizIntro.tsx, substituindo o useEffect existente de preload

  // Estratégia de preload altamente otimizada para pontuação máxima de performance
  useEffect(() => {
    // Função para criação de links HTTP/2 para melhor paralelização
    const createResourceHint = (rel: string, href: string, options: {as?: string, type?: string, crossOrigin?: boolean} = {}) => {
      const link = document.createElement('link');
      link.rel = rel;
      link.href = href;
      
      if (options.as) link.as = options.as;
      if (options.type) link.type = options.type;
      if (options.crossOrigin) link.crossOrigin = 'anonymous';
      
      return link;
    };

    // Coleção de hints para inserção como batch (melhor performance)
    const hints = [];

    // 1. Preconnect com crossorigin para recursos de terceiros (crítico para HTTP/2)
    hints.push(createResourceHint('preconnect', 'https://res.cloudinary.com', { crossOrigin: true }));
    
    // 2. DNS Prefetch para otimizar a resolução DNS
    hints.push(createResourceHint('dns-prefetch', 'https://res.cloudinary.com'));
    
    // 3. Preload da imagem principal LCP com prioridade máxima
    // AVIF para navegadores modernos
    const avifPreload = createResourceHint('preload', STATIC_INTRO_IMAGE_URLS.avif.large, { 
      as: 'image', 
      type: 'image/avif',
      fetchPriority: 'high'
    });
    avifPreload.setAttribute('fetchpriority', 'high');
    hints.push(avifPreload);
    
    // 4. Fallback para WebP (navegadores sem suporte a AVIF)
    const webpPreload = createResourceHint('preload', STATIC_INTRO_IMAGE_URLS.webp.large, {
      as: 'image',
      type: 'image/webp',
      fetchPriority: 'high'
    });
    webpPreload.setAttribute('fetchpriority', 'high');
    hints.push(webpPreload);

    // 5. Script preload para componentes críticos no bundle JS
    const fontPreload = createResourceHint('preload', 'https://fonts.gstatic.com/s/playfairdisplay/v36/nuFiD-vYSZviVYUb_rj3ij__anPXDTzYgEM86xQ.woff2', {
      as: 'font',
      type: 'font/woff2',
      crossOrigin: true
    });
    hints.push(fontPreload);
    
    // Inserir todos os hints como fragmento (melhor performance)
    const fragment = document.createDocumentFragment();
    hints.forEach(hint => fragment.appendChild(hint));
    document.head.appendChild(fragment);
    
    // Registrar o LCP para métricas
    if (window.performance && window.performance.mark) {
      window.performance.mark('quiz-intro-lcp-start');
    }
    
    // Adicionar event listener para LCP na imagem principal
    const recordLCP = () => {
      if (window.performance && window.performance.mark) {
        window.performance.mark('quiz-intro-lcp-complete');
        window.performance.measure('quiz-intro-lcp', 'quiz-intro-lcp-start', 'quiz-intro-lcp-complete');
      }
    };
    
    // Configuração para monitorar LCP
    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          recordLCP();
          observer.disconnect();
        }
      }
    });
    
    // Observar eventos LCP
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
    
    // Limpar recursos ao desmontar
    return () => {
      observer.disconnect();
      hints.forEach(hint => {
        if (hint.parentNode) hint.parentNode.removeChild(hint);
      });
    };
  }, []); // Dependências vazias = executa uma vez na montagem
// Novo arquivo otimizado para o useEffect de carregamento base64
// Copie e cole este conteúdo no arquivo QuizIntro.tsx, substituindo o useEffect existente

  // Efeito para carregamento eficiente da imagem base64 - OTIMIZADO
  useEffect(() => {
    // Estratégia otimizada com armazenamento em cache local
    const loadOptimizedTinyBase64 = async () => {
      try {
        // Evita recarregamentos se a imagem já foi carregada ou se base64 já existe
        if (!tinyBase64 && !imageLoaded.current) {
          // 1. Verificar primeiro se há dados em cache no sessionStorage (mais rápido)
          const storageKey = 'quiz_intro_tiny_base64_v2'; // Versão específica para cache invalidation
          const cachedImage = sessionStorage.getItem(storageKey);
          
          if (cachedImage) {
            setTinyBase64(cachedImage);
          } else {
            // 2. Verificar cache em IndexedDB para persistência entre visitas (opcional)
            // Esta implementação usa apenas sessionStorage por simplicidade e performance
            
            // 3. Como fallback, fazer fetch apenas de uma tiny image extremamente otimizada
            // Usando uma imagem menor (20px vs placeholder anterior) para maior velocidade
            const tinyImageUrl = STATIC_INTRO_IMAGE_URLS.placeholder; // URL já otimizada
            const base64Data = await loadTinyImageAsBase64(tinyImageUrl);
            
            if (base64Data) {
              setTinyBase64(base64Data);
              
              // Armazenar em cache para futuros acessos
              try {
                sessionStorage.setItem(storageKey, base64Data);
              } catch (e) {
                // Ignora erros de storage (limite excedido, navegador privado, etc)
              }
            }
          }
        }
      } catch (error) {
        console.error('[QuizIntro] Erro ao carregar imagem tiny (otimizada):', error);
        // Fallback silencioso - o componente ainda funciona sem o blur-up
      }
    };
    
    // Iniciar carregamento imediatamente
    loadOptimizedTinyBase64();
    
    // Carregar versão high-res após o componente ser montado
    // Isso permite que o LCP seja registrado para a imagem principal
    return () => {
      // Cleanup (se necessário)
    };
  }, []); // Apenas na montagem
  // Efeito único e simplificado para carregamento posterior de recursos
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    
    // Carrega recursos adicionais após o componente estar visível e LCP ter ocorrido
    const loadNonCriticalResources = () => {
      // Registra o momento que começa a carregar recursos não-críticos
      if (window.performance && window.performance.mark) {
        window.performance.mark('quiz-intro-load-non-critical');
      }
      
      // Carrega recursos adicionais com baixa prioridade
      preloadCriticalImages('quiz');
      
      // Preconnect com domínios não-críticos
      const preconnects = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
      ];
      
      const preconnectElements = preconnects.map(url => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = url;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
        return link;
      });
      
      cleanup = () => {
        preconnectElements.forEach(el => {
          if (el && el.parentNode) {
            el.parentNode.removeChild(el);
          }
        });
      };
    };
    
    // Usar Intersection Observer para detectar visibilidade
    if (typeof IntersectionObserver === 'function') {
      const observer = new IntersectionObserver((entries) => {
        const isVisible = entries.some(entry => entry.isIntersecting);
        
        if (isVisible) {
          // Usar requestIdleCallback para carregar em tempo ocioso
          if (typeof requestIdleCallback === 'function') {
            requestIdleCallback(() => {
              loadNonCriticalResources();
            }, { timeout: 2000 });
          } else {
            // Fallback para browsers que não suportam requestIdleCallback
            setTimeout(loadNonCriticalResources, 1500);
          }
          
          observer.disconnect();
        }
      }, { threshold: 0.1 });
      
      // Começar a observar o componente
      if (mainImageRef.current) {
        observer.observe(mainImageRef.current);
      }
      
      return () => {
        observer.disconnect();
        if (cleanup) cleanup();
      };
    } else {
      // Fallback para navegadores sem IntersectionObserver
      setTimeout(loadNonCriticalResources, 1500);
      
      return () => {
        if (cleanup) cleanup();
      };
    }
  }, []);
  // Efeito para carregamento posterior de recursos não-críticos
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    
    // Função para carregar recursos não críticos após o LCP
    const loadNonCriticalResources = () => {
      // Registrar início da carga não-crítica
      if (window.performance && window.performance.mark) {
        window.performance.mark('quiz-intro-load-non-critical');
      }
      
      // Carregar imagens adicionais do quiz
      preloadCriticalImages('quiz');
      
      // Preconnects para domínios adicionais
      const links = [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: true }
      ];
      
      const elements = links.map(link => {
        const el = document.createElement('link');
        el.rel = link.rel;
        el.href = link.href;
        if (link.crossOrigin) el.crossOrigin = 'anonymous';
        document.head.appendChild(el);
        return el;
      });
      
      cleanup = () => {
        elements.forEach(el => {
          if (el.parentNode) el.parentNode.removeChild(el);
        });
      };
    };
    
    // Usar IntersectionObserver para detectar visibilidade do componente
    if (typeof IntersectionObserver === 'function') {
      const observer = new IntersectionObserver((entries) => {
        if (entries.some(entry => entry.isIntersecting)) {
          // Usar requestIdleCallback para melhor performance
          if (typeof requestIdleCallback === 'function') {
            requestIdleCallback(() => {
              loadNonCriticalResources();
            }, { timeout: 2000 });
          } else {
            setTimeout(loadNonCriticalResources, 1500);
          }
          observer.disconnect();
        }
      }, { threshold: 0.1 });
      
      if (mainImageRef.current) {
        observer.observe(mainImageRef.current);
      }
      
      return () => {
        observer.disconnect();
        if (cleanup) cleanup();
      };
    } else {
      // Fallback para navegadores antigos
      setTimeout(loadNonCriticalResources, 1500);
      return () => {
        if (cleanup) cleanup();
      };
    }
  }, []);
  // Event handler memoizado para evitar re-renders desnecessários
  const handleSubmit = React.useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    // Registrar evento de submissão para métricas
    if (window.performance && window.performance.mark) {
      window.performance.mark('quiz-intro-form-submitted');
    }
    
    if (nome.trim()) {
      onStart(nome);
    }
  }, [nome, onStart]);

  return (
    <AutoFixedImages>
      <div 
        className="quiz-intro flex flex-col items-center w-full will-change-contents"
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FBF8F4 100%)',
          minHeight: '100vh',
          contain: 'content', // Isolamento de layout para melhor performance
        }}
        data-section="intro"
      >
        {/* Container principal com dimensões calculadas para evitar CLS */}
        <div 
          className="w-full max-w-lg px-4 sm:px-6 pt-6 sm:pt-8 md:pt-10 pb-8 space-y-5 sm:space-y-8"
          style={{
            contentVisibility: 'auto', // Melhora o rendering do viewport
            containIntrinsicSize: '0 1000px', // Reserva espaço estimado
          }}
        >
          {/* Logo e barra dourada otimizadas para melhor performance */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <OptimizedImage
                sources={[
                  { srcSet: STATIC_LOGO_IMAGE_URLS.avif, type: 'image/avif' },
                  { srcSet: STATIC_LOGO_IMAGE_URLS.webp, type: 'image/webp' }
                ]}
                src={STATIC_LOGO_IMAGE_URLS.png}
                alt="Logo Gisele Galvão"
                width={140}
                height={60}
                className="h-auto mx-auto"
                priority={true}
                style={{
                  objectFit: 'contain',
                  maxWidth: '100%',
                  aspectRatio: '140/60',
                  width: '140px',
                  height: '60px',
                  background: 'none',
                  display: 'block'
                }}
              />
              
              {/* Barra dourada com dimensões predefinidas para evitar layout shifts */}
              <div 
                className="h-[3px] bg-gradient-to-r from-[#B89B7A] via-[#D4B79F] to-[#B89B7A] mt-2 rounded-full mx-auto" 
                style={{ 
                  width: mainImageWidth > 0 ? `${mainImageWidth}px` : '270px', // Valor default para evitar CLS
                  maxWidth: '100%',
                }}
              ></div>
            </div>
          </div>

          {/* Título principal com espaçamento proporcional e otimizado para render */}
          <h1 
            className="font-playfair text-xl sm:text-2xl md:text-3xl font-bold text-center leading-tight text-[#432818] px-1"
            style={{ 
              contentVisibility: 'auto',
              containIntrinsicSize: '0 80px',
            }}
          >
            Chega de um guarda-roupa lotado e da sensação de que nada combina com você.
          </h1>

          {/* Container de imagem com dimensões fixas para evitar layout shift e otimizado para performance LCP */}
          {/* Largura reduzida em 10% para mobile: max-w-[270px] (antes era 300px) */}
          <div 
            ref={mainImageRef}
            className="w-full max-w-[270px] sm:max-w-[345px] md:max-w-sm mx-auto relative overflow-hidden rounded-lg shadow-md contain-content group" 
            style={{
              height: 'auto',
              aspectRatio: '450/470', // Aspect ratio fixo para evitar layout shifts
              background: '#f8f6f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundImage: tinyBase64 ? `url('${tinyBase64}')` : `url('${STATIC_INTRO_IMAGE_URLS.placeholder}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              contentVisibility: 'auto', // Otimização para rendering
              contain: 'paint layout size', // Isolamento para melhor performance
            }}
            data-lcp="true" // Facilita identificação de elemento LCP crítico
          >
            {/* Elementos decorativos nos cantos */}
            <div className="absolute -top-3 -right-3 w-12 h-12 border-t-2 border-r-2 border-[#B89B7A] opacity-70 z-10 pointer-events-none"></div>
            <div className="absolute -bottom-3 -left-3 w-12 h-12 border-b-2 border-l-2 border-[#B89B7A] opacity-70 z-10 pointer-events-none"></div>
            
            {/* Overlay de gradiente sutil */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#432818]/10 to-transparent z-[1] pointer-events-none"></div>
            
            <OptimizedImage
              sources={[
                { 
                  srcSet: `${STATIC_INTRO_IMAGE_URLS.avif.tiny} 200w, ${STATIC_INTRO_IMAGE_URLS.avif.small} 345w, ${STATIC_INTRO_IMAGE_URLS.avif.medium} 400w, ${STATIC_INTRO_IMAGE_URLS.avif.large} 450w`,
                  type: 'image/avif',
                  sizes: '(max-width: 640px) 345px, (max-width: 768px) 400px, 450px',
                  fetchPriority: 'high'
                },
                { 
                  srcSet: `${STATIC_INTRO_IMAGE_URLS.webp.tiny} 200w, ${STATIC_INTRO_IMAGE_URLS.webp.small} 345w, ${STATIC_INTRO_IMAGE_URLS.webp.medium} 400w, ${STATIC_INTRO_IMAGE_URLS.webp.large} 450w`,
                  type: 'image/webp',
                  sizes: '(max-width: 640px) 345px, (max-width: 768px) 400px, 450px',
                  fetchPriority: 'high'
                }
              ]}
              src={STATIC_INTRO_IMAGE_URLS.webp.medium} // Versão média como fallback
              alt="Descubra seu estilo predominante"
              width={450}
              height={470}
              className="w-full h-auto object-contain quiz-intro-image will-change-opacity relative z-[2] transform transition-transform duration-700 group-hover:scale-[1.03]"
              priority={true}
              placeholder={tinyBase64}
              onLoad={() => { 
                imageLoaded.current = true;
                // Registrar evento de imagem carregada para performance metrics
                if (window.performance && window.performance.mark) {
                  window.performance.mark('quiz-intro-image-loaded');
                }
              }}
              style={{
                background: 'none', 
                display: 'block', 
                margin: '0 auto',
                objectFit: "cover",
                imageRendering: "crisp-edges",
                backgroundPosition: 'center',
                opacity: imageLoaded.current ? 1 : 0.01, // Começa quase invisível para permitir transição suave
                transition: 'opacity 0.2s ease-in', // Transição suave quando carregada
              }}
            />
          </div>

          {/* Texto descritivo com espaçamento consistente e otimizado para rendering */}
          <DescriptiveText />

          {/* Formulário otimizado para melhor UX e performance */}
          <form 
            onSubmit={handleSubmit} 
            className="w-full max-w-md mx-auto space-y-4" 
            aria-live="polite" 
            autoComplete="off"
            data-testid="quiz-intro-form"
          >
            <div className="relative">
              <label htmlFor="name" className="block text-xs font-semibold text-[#432818]/80 mb-1.5 ml-1">
                SEU NOME
              </label>
              
              <div className="relative group">
                <Input 
                  id="name" 
                  placeholder="Digite seu nome para começar" 
                  value={nome} 
                  onChange={(e) => {
                    // Limitação de caracteres feita diretamente aqui para evitar re-renders extras
                    if (e.target.value.length <= 32) {
                      setNome(e.target.value);
                    }
                  }} 
                  className="w-full p-3 pl-10 pr-3 border-[#B89B7A]/40 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20 bg-white/95 backdrop-blur-sm rounded-lg shadow-sm hover:shadow transition-shadow duration-200" 
                  autoFocus 
                  aria-required="true" 
                  autoComplete="off"
                  inputMode="text"
                  maxLength={32}
                  style={{
                    fontSize: '1.05rem',
                    willChange: 'box-shadow', // Preparação para animação
                    transformStyle: 'preserve-3d', // Melhor qualidade de transformação
                  }}
                />
                
                {/* Ícone decorativo */}
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B89B7A]/70 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 opacity-70">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              </div>
            </div>
            
            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-[#B89B7A] to-[#A1835D] hover:from-[#A1835D] hover:to-[#927346] text-white py-3 px-4 text-base sm:text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#B89B7A] focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98] group"
              disabled={!nome.trim()}
              style={{
                textShadow: '0px 1px 1px rgba(0, 0, 0, 0.15)',
                willChange: 'transform, box-shadow',
                backfaceVisibility: 'hidden',
                perspective: '1000px',
                contain: 'paint',
              }}
              aria-label="Iniciar o quiz"
            >
              <span className="flex items-center justify-center gap-2">
                Quero Descobrir meu Estilo Agora!
                <span aria-hidden="true" className="inline-block transition-transform duration-500 transform group-hover:rotate-12">✨</span>
              </span>
            </Button>
            
            <p className="text-xs text-center text-[#432818]/60 pt-2 flex items-center justify-center gap-1.5" aria-live="polite"> 
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#B89B7A]" aria-hidden="true">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <path d="M8 12h8" />
                <path d="M12 8v8" />
              </svg>
              <span>Ao clicar, você concorda com nossa política de privacidade</span>
            </p>
          </form>
        </div>
      </div>
    </AutoFixedImages>
  );
};

export default QuizIntro;

// Mover componente para antes de usar no QuizIntro
// Componente de imagem altamente otimizado para carregamento eficiente
const OptimizedImage = React.memo(({ 
  sources, 
  src, 
  alt, 
  width, 
  height, 
  className, 
  priority = false,
  placeholder,
  onLoad,
  style = {}
}: {
  sources: Array<{srcSet: string, type: string, sizes?: string}>,
  src: string,
  alt: string,
  width: number,
  height: number,
  className?: string,
  priority?: boolean,
  placeholder?: string,
  onLoad?: () => void,
  style?: React.CSSProperties
}) => {
  // Callback de carregamento otimizado
  const handleLoad = React.useCallback(() => {
    // Adicionar uma pequena latência para garantir renderização completa
    requestAnimationFrame(() => {
      if (onLoad) onLoad();
    });
  }, [onLoad]);
  
  return (
    <picture>
      {/* Preloading dos formatos modernos primeiro */}
      {sources.map((source, index) => (
        <source 
          key={index}
          srcSet={source.srcSet}
          type={source.type}
          sizes={source.sizes}
        />
      ))}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
        onLoad={handleLoad}
        className={className}
        style={{
          background: placeholder ? `url('${placeholder}')` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          ...style
        }}
      />
    </picture>
  );
});

// Componente memoizado para texto descritivo para evitar re-renders desnecessários
const DescriptiveText = React.memo(() => (
  <p className="text-sm md:text-base text-[#433830] text-center leading-relaxed max-w-md mx-auto px-2">
    Em poucos minutos, descubra seu <span className="font-semibold text-[#B89B7A]">Estilo Predominante</span> — e aprenda a montar
    looks que realmente refletem sua <span className="font-semibold text-[#432818]">essência</span>, com
    praticidade e <span className="font-semibold text-[#432818]">confiança</span>.
  </p>
));
