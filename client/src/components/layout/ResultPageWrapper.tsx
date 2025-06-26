import React, { useEffect, useState, useCallback } from "react";
import { useQuiz } from "@/hooks/useQuiz";
import { useGlobalStyles } from "@/hooks/useGlobalStyles";
import { useAuth } from "@/contexts/AuthContext";
import { useLoadingState } from "@/hooks/useLoadingState";
import { useIsLowPerformanceDevice } from "@/hooks/use-mobile";
import { tokens } from "@/config/designTokens";
import ResultHeaderSection from "@/components/quiz-sections/ResultHeaderSection";

interface ResultPageWrapperProps {
  children: React.ReactNode;
}

export const ResultPageWrapper: React.FC<ResultPageWrapperProps> = ({
  children,
}) => {
  const { primaryStyle, secondaryStyles } = useQuiz();
  const { globalStyles } = useGlobalStyles();
  const { user } = useAuth();
  const isLowPerformance = useIsLowPerformanceDevice();
  const { isLoading, completeLoading } = useLoadingState({
    minDuration: isLowPerformance ? 100 : 300,
    disableTransitions: isLowPerformance,
  });

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("primary-style");
  const [imagesLoaded, setImagesLoaded] = useState({
    style: false,
    guide: false,
  });

  // Callback para quando as imagens carregam
  const handleImageLoad = useCallback((imageType: "style" | "guide") => {
    console.log(`[ResultPageWrapper] Imagem ${imageType} carregada`);
    setImagesLoaded(prev => ({ ...prev, [imageType]: true }));
  }, []);

  // Effect para controle de carregamento otimizado
  useEffect(() => {
    if (!primaryStyle) return;
    window.scrollTo(0, 0);

    // Verificar se os resultados foram pré-carregados
    const hasPreloadedResults = localStorage.getItem("preloadedResults") === "true";
    
    if (hasPreloadedResults) {
      console.log('[ResultPageWrapper] Resultados pré-carregados detectados, acelerando carregamento');
      setImagesLoaded({ style: true, guide: true });
      completeLoading();
      return;
    }

    // Timeout de segurança para dispositivos mais lentos
    const safetyTimeout = setTimeout(() => {
      console.log('[ResultPageWrapper] Safety timeout ativado, finalizando carregamento');
      setImagesLoaded({ style: true, guide: true });
      completeLoading();
    }, isLowPerformance ? 1500 : 2500);

    // Simular carregamento de recursos críticos
    const criticalResourcesTimeout = setTimeout(() => {
      setImagesLoaded(prev => ({ ...prev, style: true }));
    }, 200);

    const secondaryResourcesTimeout = setTimeout(() => {
      setImagesLoaded(prev => ({ ...prev, guide: true }));
    }, 600);

    return () => {
      clearTimeout(safetyTimeout);
      clearTimeout(criticalResourcesTimeout);
      clearTimeout(secondaryResourcesTimeout);
    };
  }, [primaryStyle, globalStyles.logo, completeLoading, isLowPerformance]);

  // Effect para finalizar carregamento quando todas as imagens estão prontas
  useEffect(() => {
    if (imagesLoaded.style && imagesLoaded.guide) {
      console.log('[ResultPageWrapper] Todas as imagens carregadas, finalizando loading');
      completeLoading();
    }
  }, [imagesLoaded, completeLoading]);

  // Scroll tracking e navegação
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 120);

      // Tracking de seção ativa
      const sections = [
        "primary-style",
        "transformations", 
        "motivation",
        "bonuses",
        "testimonials",
        "guarantee",
        "mentor",
        "cta",
      ];

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element?.getBoundingClientRect().top <= 250) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 100,
        behavior: "smooth",
      });
    }
  }, []);

  if (!primaryStyle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Carregando resultado...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundColor: tokens.colors.background,
        color: tokens.colors.text,
        fontFamily: globalStyles.fontFamily || "Inter, system-ui, sans-serif",
      }}
    >
      {/* Scrollbar personalizada e Focus states */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: ${tokens.colors.borderLight}; }
          ::-webkit-scrollbar-thumb { 
            background: linear-gradient(to bottom, ${tokens.colors.primary}, ${tokens.colors.secondary}); 
            border-radius: 3px; 
          }
          ::-webkit-scrollbar-thumb:hover { 
            background: linear-gradient(to bottom, ${tokens.colors.secondary}, ${tokens.colors.primary}); 
          }
          html { scroll-behavior: smooth; }
          button:focus-visible, a:focus-visible { 
            outline: 2px solid ${tokens.colors.primary}; 
            outline-offset: 2px; 
          }
        `,
        }}
      />

      {/* Background decorativo */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute top-0 right-0 w-1/2 h-1/2 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"
          style={{
            background: `linear-gradient(135deg, ${tokens.colors.primary}20, transparent)`
          }}
        ></div>
        <div 
          className="absolute bottom-0 left-0 w-1/3 h-1/3 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"
          style={{
            background: `linear-gradient(45deg, ${tokens.colors.secondary}15, transparent)`
          }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/4 w-1/4 h-1/4 rounded-full blur-2xl"
          style={{
            background: `linear-gradient(90deg, ${tokens.colors.primary}10, transparent)`
          }}
        ></div>
      </div>

      {/* Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
        style={{
          borderBottom: isScrolled ? `1px solid ${tokens.colors.border}` : 'none'
        }}
      >
        <div className="container mx-auto max-w-6xl px-4 py-4 lg:py-6">
          <div className="flex justify-center">
            <img
              src={globalStyles.logo}
              alt={globalStyles.logoAlt || "Logo"}
              style={{ height: globalStyles.logoHeight || "50px" }}
              className="h-auto object-contain transition-all duration-300 hover:scale-105"
            />
          </div>
        </div>
      </header>

      {/* Navigation dots */}
      <div
        className={`fixed right-6 top-1/2 transform -translate-y-1/2 z-40 transition-all duration-500 ${
          isScrolled ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
        }`}
      >
        <div 
          className="flex flex-col gap-2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg"
          style={{
            border: `1px solid ${tokens.colors.border}`,
            boxShadow: tokens.shadows.lg
          }}
        >
          {[
            { id: "primary-style", label: "Seu Estilo" },
            { id: "transformations", label: "Transformações" },
            { id: "motivation", label: "Motivação" },
            { id: "bonuses", label: "Bônus" },
            { id: "testimonials", label: "Depoimentos" },
            { id: "guarantee", label: "Garantia" },
            { id: "cta", label: "Adquirir" },
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`group relative w-2 h-2 rounded-full transition-all duration-300 ${
                activeSection === section.id
                  ? "scale-125 shadow-md"
                  : "hover:scale-110"
              }`}
              style={{
                backgroundColor: activeSection === section.id
                  ? tokens.colors.primary
                  : tokens.colors.textLight
              }}
              aria-label={`Ir para seção ${section.label}`}
            >
              <div className="absolute right-5 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div 
                  className="text-white text-xs px-2 py-1 rounded whitespace-nowrap"
                  style={{ backgroundColor: tokens.colors.text }}
                >
                  {section.label}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <main className="container mx-auto px-4 lg:px-6 py-8 lg:py-12 max-w-6xl relative z-10">
        {/* Renderizar o ResultHeaderSection como primeiro componente */}
        <ResultHeaderSection
          primaryStyle={primaryStyle}
          secondaryStyles={secondaryStyles || []}
          user={user}
          isLowPerformance={isLowPerformance}
          onImageLoad={handleImageLoad}
        />
        
        {children}
      </main>

      {/* Rodapé */}
      <footer
        className="mt-28 border-t"
        style={{
          borderTopColor: tokens.colors.border,
          background: `linear-gradient(90deg, ${tokens.colors.backgroundAlt}, ${tokens.colors.background})`
        }}
      >
        <div className="container mx-auto px-4 lg:px-6 py-12 lg:py-16 max-w-6xl">
          <div className="text-center space-y-6">
            <div className="mb-8">
              <a
                href="/politica-privacidade"
                className="transition-colors duration-300 font-medium text-sm lg:text-base underline underline-offset-4"
                style={{
                  color: tokens.colors.textSecondary,
                  textDecorationColor: `${tokens.colors.primary}50`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = tokens.colors.primary;
                  e.currentTarget.style.textDecorationColor = tokens.colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = tokens.colors.textSecondary;
                  e.currentTarget.style.textDecorationColor = `${tokens.colors.primary}50`;
                }}
              >
                Política de Privacidade
              </a>
            </div>
            <div 
              className="w-32 h-px mx-auto mb-8"
              style={{
                background: `linear-gradient(90deg, transparent, ${tokens.colors.primary}, transparent)`
              }}
            ></div>
            <p 
              className="text-sm lg:text-base font-medium"
              style={{ color: tokens.colors.textMuted }}
            >
              © 2025 Gisele Galvão. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
