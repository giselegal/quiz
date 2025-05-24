// ✅ TESTE - Arquivo ResultPage atualizado - 23/05/2025
import React, { useEffect, useState, Suspense, lazy } from 'react';
import { useQuiz } from '@/hooks/useQuiz';
import { useGlobalStyles } from '@/hooks/useGlobalStyles';
import { Header } from '@/components/result/Header';
import { styleConfig } from '@/config/styleConfig';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { ShoppingCart, CheckCircle, ArrowDown, Clock, ChevronLeft, ChevronRight, Shield, Award, Hourglass } from 'lucide-react';
import { AnimatedWrapper } from '@/components/ui/animated-wrapper';
import SecondaryStylesSection from '@/components/quiz-result/SecondaryStylesSection';
import ErrorState from '@/components/result/ErrorState';
import { Button } from '@/components/ui/button';
import { useLoadingState } from '@/hooks/useLoadingState';
import { useIsLowPerformanceDevice } from '@/hooks/use-mobile';
import ResultSkeleton from '@/components/result/ResultSkeleton';
import { trackButtonClick } from '@/utils/analytics';
import BuildInfo from '@/components/BuildInfo';
import SecurePurchaseElement from '@/components/result/SecurePurchaseElement';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import ProgressiveImage from '@/components/ui/progressive-image';
import ResourcePreloader from '@/components/result/ResourcePreloader';
import PerformanceMonitor from '@/components/result/PerformanceMonitor';

// Seções carregadas via lazy
const BeforeAfterTransformation = lazy(() => import('@/components/result/BeforeAfterTransformation4'));
const MotivationSection = lazy(() => import('@/components/result/MotivationSection'));
const BonusSection = lazy(() => import('@/components/result/BonusSection'));
const Testimonials = lazy(() => import('@/components/quiz-result/sales/Testimonials'));
const GuaranteeSection = lazy(() => import('@/components/result/GuaranteeSection'));
const MentorSection = lazy(() => import('@/components/result/MentorSection'));

// Design tokens
const tokens = {
  colors: {
    primary: '#B89B7A',
    primaryDark: '#A1835D',
    primaryLight: '#D4B79F',
    secondary: '#aa6b5d',
    secondaryDark: '#8F5A4D',
    secondaryLight: '#C28A7D',
    background: '#fffaf7',
    backgroundAlt: '#f9f4ef',
    text: '#432818',
    textLight: '#8F7A6A',
    success: '#4CAF50',
    successDark: '#45a049',
    border: 'rgba(184, 155, 122, 0.2)',
    borderLight: 'rgba(184, 155, 122, 0.1)',
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    highlight: '0 0 15px rgba(184, 155, 122, 0.3)',
    cta: '0 4px 14px rgba(76, 175, 80, 0.4)',
  },
  radius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    full: '9999px',
  },
  transitions: {
    fast: '0.2s ease',
    medium: '0.3s ease',
    slow: '0.5s ease',
  }
};

// Componente de título padronizado - SIMPLIFICADO
const SectionTitle: React.FC<{
  children: React.ReactNode;
  subtitle?: string;
  size?: 'lg' | 'xl';
  className?: string;
  variant?: 'primary' | 'secondary' | 'simple';
}> = ({ children, subtitle, size = 'xl', className = '', variant = 'simple' }) => (
  <AnimatedWrapper 
    className={`text-center mb-12 ${className}`}
    animation="fade"
    show={true}
    duration={600}
  >
    {/* Decoração superior - APENAS para títulos principais */}
    {variant === 'primary' && (
      <div className="inline-flex items-center gap-3 mb-4">
        <div className="w-8 h-px bg-gradient-to-r from-transparent via-[#B89B7A] to-transparent"></div>
        <div className="w-2 h-2 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-full shadow-sm"></div>
        <div className="w-8 h-px bg-gradient-to-r from-transparent via-[#B89B7A] to-transparent"></div>
      </div>
    )}
    
    {/* Título principal - estilos diferenciados */}
    <h2 className={`font-playfair font-bold leading-tight ${
      variant === 'primary' 
        ? 'text-[#432818] mb-4 bg-gradient-to-r from-[#432818] via-[#aa6b5d] to-[#432818] bg-clip-text text-transparent'
        : variant === 'secondary'
        ? 'text-[#432818] mb-4'
        : 'text-[#432818] mb-4'
    } ${
      size === 'xl' ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-2xl md:text-3xl lg:text-4xl'
    }`}>
      {children}
    </h2>
    
    {/* Subtítulo opcional */}
    {subtitle && (
      <p className="text-lg md:text-xl text-[#8F7A6A] leading-relaxed max-w-3xl mx-auto mb-6">
        {subtitle}
      </p>
    )}
    
    {/* Linha decorativa inferior - APENAS para título principal */}
    {variant === 'primary' && (
      <div className="w-20 h-1 bg-gradient-to-r from-[#B89B7A] via-[#aa6b5d] to-[#B89B7A] rounded-full mx-auto shadow-sm"></div>
    )}
  </AnimatedWrapper>
);

const ResultPage: React.FC = () => {
  const { primaryStyle, secondaryStyles } = useQuiz();
  const { globalStyles } = useGlobalStyles();
  const { user } = useAuth();
  const [imagesLoaded, setImagesLoaded] = useState({
    style: false,
    guide: false
  });
  const isLowPerformance = useIsLowPerformanceDevice();
  const { isLoading, completeLoading } = useLoadingState({
    minDuration: isLowPerformance ? 100 : 300,
    disableTransitions: isLowPerformance
  });

  // Button hover state
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  
  // Scroll tracking for sticky header and bottom bar
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBottomBar, setShowBottomBar] = useState(false);
  
  // Active section tracking
  const [activeSection, setActiveSection] = useState('primary-style');
  
  // Temporizador de contagem regressiva
  const [timer, setTimer] = useState({
    hours: 2,
    minutes: 59,
    seconds: 59
  });
  
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer.seconds > 0) {
          return { ...prevTimer, seconds: prevTimer.seconds - 1 };
        } else if (prevTimer.minutes > 0) {
          return { ...prevTimer, minutes: prevTimer.minutes - 1, seconds: 59 };
        } else if (prevTimer.hours > 0) {
          return { hours: prevTimer.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reset timer quando chegar a zero (para manter a oferta "limitada")
          return { hours: 2, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);
    
    return () => clearInterval(countdownInterval);
  }, []);
  
  useEffect(() => {
    if (!primaryStyle) return;
    window.scrollTo(0, 0);
    
    const hasPreloadedResults = localStorage.getItem('preloadedResults') === 'true';
    
    if (hasPreloadedResults) {
      setImagesLoaded({ style: true, guide: true });
      completeLoading();
      return;
    } 
    
    const safetyTimeout = setTimeout(() => {
      setImagesLoaded({ style: true, guide: true });
      completeLoading();
    }, 2500);

    return () => clearTimeout(safetyTimeout);
  }, [primaryStyle, globalStyles.logo, completeLoading]);
  
  useEffect(() => {
    if (imagesLoaded.style && imagesLoaded.guide) completeLoading();
  }, [imagesLoaded, completeLoading]);
  
  // Scroll tracking effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
      
      // Show bottom bar only when near the end of the page
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrolledToBottom = scrollTop + windowHeight >= documentHeight - 800; // Show 800px before end
      
      setShowBottomBar(scrolledToBottom);
      
      // Track active section
      const sections = [
        { id: 'primary-style', element: document.getElementById('primary-style') },
        { id: 'transformations', element: document.getElementById('transformations') },
        { id: 'motivation', element: document.getElementById('motivation') },
        { id: 'bonuses', element: document.getElementById('bonuses') },
        { id: 'testimonials', element: document.getElementById('testimonials') },
        { id: 'guarantee', element: document.getElementById('guarantee') },
        { id: 'mentor', element: document.getElementById('mentor') },
        { id: 'cta', element: document.getElementById('cta') },
      ];
      
      // Find the section that is currently in view
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  if (!primaryStyle) return <ErrorState />;
  if (isLoading) return <ResultSkeleton />;
  
  const { category } = primaryStyle;
  const { image, guideImage, description } = styleConfig[category];
  
  const handleCTAClick = (e) => {
    // Prevenir comportamento padrão e propagação
    e.preventDefault();
    e.stopPropagation();
    
    // Prevenir múltiplos cliques
    if (window.ctaClickProcessing) return;
    window.ctaClickProcessing = true;
    
    trackButtonClick('checkout_button', 'Iniciar Checkout', 'results_page');
    
    // Para desktop, usar window.open para garantir funcionamento
    if (window.innerWidth >= 768) {
      window.open('https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912', '_blank');
    } else {
      // Para mobile, usar location.href
      window.location.href = 'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912';
    }
    
    // Limpar flag após delay
    setTimeout(() => {
      window.ctaClickProcessing = false;
    }, 1000);
  };
  
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      backgroundColor: globalStyles.backgroundColor || tokens.colors.background,
      color: globalStyles.textColor || tokens.colors.text,
      fontFamily: globalStyles.fontFamily || 'inherit'
    }}>
      {/* Custom scrollbar styles */}
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #B89B7A, #aa6b5d);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #aa6b5d, #B89B7A);
        }
      `}</style>

      {/* Preloaders and monitors */}
      <ResourcePreloader />
      <PerformanceMonitor />
      
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-[#B89B7A]/10 to-[#B89B7A]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-tr from-[#aa6b5d]/10 to-[#aa6b5d]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      <div className="absolute top-1/3 left-0 w-1/5 h-1/5 bg-gradient-to-r from-[#B89B7A]/5 to-[#aa6b5d]/5 rounded-full blur-3xl -translate-x-1/2"></div>
      
      {/* Header - Super simplificado */}
      <header className="py-4 px-6 sticky top-0 z-50 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto max-w-4xl flex justify-center">
          <img
            src={globalStyles.logo}
            alt={globalStyles.logoAlt || "Logo"}
            style={{ height: globalStyles.logoHeight || '60px' }}
            className="h-auto object-contain"
          />
        </div>
      </header>

      {/* Navigation dots (only visible on scroll) */}
      <div className={`fixed right-4 top-1/2 transform -translate-y-1/2 z-50 transition-opacity duration-500 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col gap-2">
          {[
            { id: 'primary-style', label: 'Seu Estilo' },
            { id: 'transformations', label: 'Transformações' },
            { id: 'motivation', label: 'Motivação' },
            { id: 'bonuses', label: 'Bônus' },
            { id: 'testimonials', label: 'Depoimentos' },
            { id: 'guarantee', label: 'Garantia' },
            { id: 'cta', label: 'Adquirir' }
          ].map(section => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${activeSection === section.id ? 'bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] scale-125 shadow-sm' : 'bg-gray-300 hover:bg-gray-400'}`}
              aria-label={`Ir para seção ${section.label}`}
              title={section.label}
            />
          ))}
        </div>
      </div>

      {/* Sticky CTA - COR DA MARCA */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-[#B89B7A]/20 py-3 px-4 z-40 transition-transform duration-500 ${showBottomBar ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="container mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm font-medium text-[#432818]">Guia de Estilo e Imagem + Bônus</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="text-xs text-[#8F7A6A] whitespace-nowrap">5x de</span>
              <span className="text-xl font-bold bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] bg-clip-text text-transparent whitespace-nowrap">R$ 8,83</span>
              <span className="text-xs font-normal text-[#8F7A6A] whitespace-nowrap">ou R$ 39,90 à vista</span>
            </div>
          </div>
          <Button 
            onClick={handleCTAClick} 
            className="text-white text-sm sm:text-base leading-none py-3 px-6 rounded-md shadow-md transition-all duration-300 w-full sm:w-auto cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${tokens.colors.primary}, ${tokens.colors.secondary})`,
              boxShadow: '0 4px 14px rgba(184, 155, 122, 0.4)',
              transform: isButtonHovered ? 'translateY(-2px)' : 'translateY(0)',
            }}
            onMouseEnter={() => setIsButtonHovered(true)} 
            onMouseLeave={() => setIsButtonHovered(false)}
            type="button"
          >
            <span className="flex items-center justify-center gap-2">
              <ShoppingCart className={`w-4 h-4 transition-transform duration-300 ${isButtonHovered ? 'scale-110' : ''}`} />
              Adquirir Agora
            </span>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl relative z-10">
        {/* Primary Style Card - Título melhorado */}
        <section id="primary-style" className="scroll-mt-20">
          <Card className="p-6 mb-10 bg-white shadow-lg border border-[#B89B7A]/20 rounded-xl overflow-hidden relative">
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#B89B7A]/30 rounded-tl-xl"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#B89B7A]/30 rounded-br-xl"></div>
            
            <AnimatedWrapper animation="fade" show={true} duration={600} delay={300}>
              <div className="text-center mb-8">
                {/* Nome do usuário com decoração elegante */}
                {user?.userName && (
                  <AnimatedWrapper 
                    className="mb-6"
                    animation="scale"
                    show={true}
                    duration={500}
                    delay={200}
                  >
                    <span className="text-xl md:text-2xl text-[#aa6b5d] font-bold bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] bg-clip-text text-transparent">
                      Olá, {user.userName}!
                    </span>
                    <div className="w-12 h-px bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] mx-auto mt-2"></div>
                  </AnimatedWrapper>
                )}
                
                {/* Título principal do estilo */}
                <h1 className="text-xl md:text-2xl lg:text-3xl font-playfair text-[#432818] mb-6 leading-tight whitespace-nowrap">
                  Seu Estilo Predominante é:
                </h1>
                <div className="max-w-md mx-auto mb-6">
                  <div className="flex items-center justify-end text-sm text-[#8F7A6A] mb-2">
                    <span className="font-medium">{primaryStyle.percentage}%</span>
                  </div>
                  <Progress 
                    value={primaryStyle.percentage} 
                    className="h-1.5 bg-[#F5F2EC] rounded-full overflow-hidden shadow-inner" 
                    indicatorClassName="bg-gradient-to-r from-[#B89B7A] via-[#D4B79F] to-[#A1835D] transition-all duration-700 ease-in-out shadow-sm"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6 order-2 md:order-1">
                  <AnimatedWrapper animation={isLowPerformance ? 'none' : 'fade'} show={true} duration={400} delay={400}>
                    <p className="text-[#432818] leading-relaxed text-base md:text-lg">
                      {description.split('você').map((part, index, array) => (
                        <React.Fragment key={index}>
                          {part}
                          {index < array.length - 1 && (
                            <span className="font-bold text-[#aa6b5d] bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] bg-clip-text text-transparent">
                              você
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </p>
                  </AnimatedWrapper>
                  <AnimatedWrapper animation={isLowPerformance ? 'none' : 'fade'} show={true} duration={400} delay={600}>
                    <div className="bg-gradient-to-r from-[#fff7f3] to-[#f9f4ef] rounded-lg p-5 shadow-sm border border-[#B89B7A]/10">
                      <h3 className="text-lg font-medium text-[#aa6b5d] mb-3">Estilos que Também Influenciam Você</h3>
                      <SecondaryStylesSection secondaryStyles={secondaryStyles} />
                    </div>
                  </AnimatedWrapper>
                </div>
                <AnimatedWrapper animation={isLowPerformance ? 'none' : 'scale'} show={true} duration={500} delay={500} className="order-1 md:order-2">
                  <div className="max-w-[214px] md:max-w-[280px] mx-auto relative"> 
                    <ProgressiveImage 
                      src={`${image}?q=85&f=auto&w=280`} 
                      alt={`Estilo ${category}`} 
                      width={280} 
                      height={350} 
                      className="w-full h-auto rounded-lg shadow-md hover:scale-105 transition-transform duration-300" 
                      loading="eager" 
                      fetchPriority="high" 
                      onLoad={() => setImagesLoaded(prev => ({ ...prev, style: true }))}
                    />
                    {/* Elegant decorative corners - ajustados para mobile menor */}
                    <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-7 h-7 md:w-10 md:h-10 border-t-2 border-r-2 border-[#B89B7A] rounded-tr-lg"></div>
                    <div className="absolute -bottom-1 -left-1 md:-bottom-2 md:-left-2 w-7 h-7 md:w-10 md:h-10 border-b-2 border-l-2 border-[#B89B7A] rounded-bl-lg"></div>
                    
                    {/* Style badge - ajustado para mobile menor */}
                    <div className="absolute -top-1.5 -left-1.5 md:-top-3 md:-left-3 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white px-2.5 py-0.5 md:px-4 md:py-1 rounded-full shadow-lg text-xs md:text-sm font-medium transform -rotate-12">
                      {category}
                    </div>
                  </div>
                </AnimatedWrapper>
              </div>
              
              <AnimatedWrapper animation={isLowPerformance ? 'none' : 'fade'} show={true} duration={400} delay={800}>
                <div className="mt-10 max-w-[600px] mx-auto relative">
                  <h3 className="text-xl font-medium text-center text-[#aa6b5d] mb-4">
                    Seu Guia de Estilo Personalizado
                  </h3>
                  <ProgressiveImage 
                    src={`${guideImage}?q=85&f=auto&w=600`} 
                    alt={`Guia de Estilo ${category}`} 
                    loading="lazy" 
                    className="w-full h-auto rounded-lg shadow-lg hover:scale-102 transition-transform duration-300" 
                    onLoad={() => setImagesLoaded(prev => ({ ...prev, guide: true }))} 
                  />
                  {/* Elegant badge - mais 5% menor */}
                  <div className="absolute -top-2.5 -right-2.5 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white px-2.5 py-1 rounded-full shadow-lg text-xs font-medium transform rotate-12">
                    Exclusivo
                  </div>
                </div>
              </AnimatedWrapper>

              {/* NOVA SEÇÃO MOTIVACIONAL + CTA */}
              <AnimatedWrapper animation={isLowPerformance ? 'none' : 'fade'} show={true} duration={500} delay={1000}>
                <div className="mt-16 text-center max-w-2xl mx-auto">
                  {/* Texto motivacional */}
                  <div className="bg-gradient-to-r from-[#fff7f3] to-[#f9f4ef] rounded-xl p-8 border border-[#B89B7A]/20 mb-8">
                    <div className="mb-6">
                      <p className="text-lg text-[#432818] leading-relaxed mb-4">
                        <span className="font-semibold text-[#aa6b5d]">Você já descobriu seu Estilo</span> e isso é muito poderoso. 
                        <span className="font-medium text-[#B89B7A]"> Conhecimento é clareza.</span>
                      </p>
                      <p className="text-lg text-[#432818] leading-relaxed mb-6">
                        E clareza muda o jeito que você se vê, se escolhe, se posiciona.
                      </p>
                      
                      {/* Separador visual */}
                      <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#B89B7A] to-transparent"></div>
                        <div className="w-2 h-2 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-full"></div>
                        <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#B89B7A] to-transparent"></div>
                      </div>
                      
                      <p className="text-lg text-[#432818] leading-relaxed mb-2">
                        <span className="font-semibold text-[#aa6b5d]">Mas é na ação que a verdadeira transformação acontece.</span>
                      </p>
                      <p className="text-lg text-[#432818] leading-relaxed">
                        É quando você aplica o que aprendeu… que <span className="font-medium text-[#B89B7A]">o espelho começa a contar uma nova história.</span>
                      </p>
                    </div>

                    {/* Call to Action motivacional */}
                    <div className="text-center">
                      <h4 className="text-xl font-playfair font-bold text-[#432818] mb-4">
                        Pronta para Escrever Essa Nova História?
                      </h4>
                      <p className="text-[#8F7A6A] mb-6 text-sm">
                        Receba seu guia completo do estilo <span className="font-semibold text-[#aa6b5d]">{category}</span> e comece sua transformação hoje mesmo
                      </p>
                      
                      {/* Preço compacto */}
                      <div className="flex items-center justify-center gap-4 mb-6 text-sm">
                        <span className="text-[#8F7A6A]">Apenas</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] bg-clip-text text-transparent">R$ 39,90</span>
                        <span className="text-[#8F7A6A]">ou 5x R$ 8,83</span>
                      </div>

                      <Button 
                        onClick={handleCTAClick} 
                        className="text-white text-base sm:text-lg leading-none py-3 sm:py-4 px-6 sm:px-8 rounded-lg shadow-lg transition-all duration-300 cursor-pointer font-semibold w-full sm:w-auto min-h-[48px]"
                        style={{
                          background: `linear-gradient(to right, ${tokens.colors.primary}, ${tokens.colors.secondary})`,
                          boxShadow: '0 4px 14px rgba(184, 155, 122, 0.4)',
                        }}
                        type="button"
                      >
                        <span className="flex items-center justify-center gap-2 sm:gap-3">
                          <ShoppingCart className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" />
                          <span className="whitespace-nowrap">Começar Minha Transformação</span>
                        </span>
                      </Button>

                      {/* Elemento de confiança */}
                      <div className="flex items-center justify-center gap-4 text-xs text-[#8F7A6A] mt-4">
                        <div className="flex items-center gap-1">
                          <Shield className="w-3 h-3 text-[#B89B7A]" />
                          <span>Seguro</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="w-3 h-3 text-[#B89B7A]" />
                          <span>Acesso imediato</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedWrapper>
            </AnimatedWrapper>
          </Card>
        </section>

        {/* Before/After Transformation Section */}
        <section id="transformations" className="scroll-mt-20 mb-16">
          <SectionTitle variant="simple">
            Transformações Reais
          </SectionTitle>
          <Suspense fallback={
            <div className="py-10 flex flex-col items-center justify-center">
              <LoadingSpinner size="lg" className="mb-4" />
              <p className="text-[#8F7A6A]">Carregando transformações...</p>
            </div>
          }>
            <AnimatedWrapper animation={isLowPerformance ? 'none' : 'fade'} show={true} duration={400}>
              <BeforeAfterTransformation />
            </AnimatedWrapper>
          </Suspense>

          {/* CTA INTERMEDIÁRIO - RESPONSIVIDADE MELHORADA */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-[#fff7f3] to-[#f9f4ef] rounded-xl p-6 sm:p-8 border border-[#B89B7A]/20 max-w-2xl mx-auto">
              <h3 className="text-xl sm:text-2xl font-playfair font-bold text-[#432818] mb-4">
                Pronta para Sua Transformação?
              </h3>
              <p className="text-[#8F7A6A] mb-6 leading-relaxed text-sm sm:text-base">
                Receba seu guia personalizado para o estilo <span className="font-semibold text-[#aa6b5d]">{category}</span> e comece hoje mesmo!
              </p>
              
              {/* Preço resumido - RESPONSIVO */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-6">
                <div className="text-center">
                  <span className="text-xs sm:text-sm text-[#8F7A6A]">5x de</span>
                  <span className="text-xl sm:text-2xl font-bold text-[#aa6b5d] ml-2">R$ 8,83</span>
                </div>
                <div className="text-[#8F7A6A] text-sm">ou</div>
                <div className="text-center">
                  <span className="text-xs sm:text-sm text-[#8F7A6A]">à vista</span>
                  <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] bg-clip-text text-transparent ml-2">R$ 39,90</span>
                </div>
              </div>

              <Button 
                onClick={handleCTAClick} 
                className="text-white text-base sm:text-lg leading-none py-3 sm:py-4 px-6 sm:px-8 rounded-lg shadow-lg transition-all duration-300 cursor-pointer font-semibold w-full sm:w-auto min-h-[48px]"
                style={{
                  background: `linear-gradient(to right, ${tokens.colors.primary}, ${tokens.colors.secondary})`,
                  boxShadow: '0 4px 14px rgba(184, 155, 122, 0.4)',
                }}
                type="button"
              >
                <span className="flex items-center justify-center gap-2 sm:gap-3">
                  <ShoppingCart className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" />
                  <span className="whitespace-nowrap">Quero Meu Guia Personalizado</span>
                </span>
              </Button>
            </div>
          </div>
        </section>

        {/* Motivation Section */}
        <section id="motivation" className="scroll-mt-20 mb-16">
          <SectionTitle 
            variant="secondary"
            subtitle="Descubra o poder de se vestir com propósito e autenticidade"
          >
            A Jornada da Sua Transformação
          </SectionTitle>
          <Suspense fallback={
            <div className="py-10 flex flex-col items-center justify-center">
              <LoadingSpinner size="lg" className="mb-4" />
              <p className="text-[#8F7A6A]">Carregando conteúdo...</p>
            </div>
          }>
            <AnimatedWrapper animation={isLowPerformance ? 'none' : 'fade'} show={true} duration={400}>
              <MotivationSection />
            </AnimatedWrapper>
          </Suspense>
        </section>
        
        {/* Bonus Section */}
        <section id="bonuses" className="scroll-mt-20 mb-12">
          <SectionTitle 
            variant="simple"
            subtitle="Materiais exclusivos para acelerar sua transformação de imagem"
          >
            Bônus Especiais Inclusos
          </SectionTitle>
          <Suspense fallback={
            <div className="py-10 flex flex-col items-center justify-center">
              <LoadingSpinner size="lg" className="mb-4" />
              <p className="text-[#8F7A6A]">Carregando bônus...</p>
            </div>
          }>
            <AnimatedWrapper animation={isLowPerformance ? 'none' : 'fade'} show={true} duration={400}>
              <BonusSection />
            </AnimatedWrapper>
          </Suspense>
        </section>
        
        {/* Testimonials Section */}
        <section id="testimonials" className="scroll-mt-20 mb-12">
          <SectionTitle 
            variant="simple"
            subtitle="Histórias reais de mulheres que transformaram sua relação com a moda"
          >
            O Que Dizem Nossas Clientes
          </SectionTitle>
          <Suspense fallback={
            <div className="py-10 flex flex-col items-center justify-center">
              <LoadingSpinner size="lg" className="mb-4" />
              <p className="text-[#8F7A6A]">Carregando depoimentos...</p>
            </div>
          }>
            <AnimatedWrapper animation={isLowPerformance ? 'none' : 'fade'} show={true} duration={400}>
              <Testimonials />
            </AnimatedWrapper>
          </Suspense>
        </section>
        
        {/* Guarantee Section */}
        <section id="guarantee" className="scroll-mt-20 mb-12">
          <SectionTitle 
            variant="simple"
            subtitle="Sua satisfação é nossa prioridade - compre sem riscos"
          >
            Garantia de Satisfação
          </SectionTitle>
          <Suspense fallback={
            <div className="py-10 flex flex-col items-center justify-center">
              <LoadingSpinner size="lg" className="mb-4" />
              <p className="text-[#8F7A6A]">Carregando garantia...</p>
            </div>
          }>
            <AnimatedWrapper animation={isLowPerformance ? 'none' : 'fade'} show={true} duration={400}>
              <GuaranteeSection />
            </AnimatedWrapper>
          </Suspense>
        </section>
        
        {/* Mentor Section */}
        <section id="mentor" className="scroll-mt-20 mb-16">
          <SectionTitle 
            variant="simple"
            subtitle="Conheça a especialista que vai guiar sua transformação de imagem"
          >
            Conheça sua Mentora
          </SectionTitle>
          <Suspense fallback={
            <div className="py-10 flex flex-col items-center justify-center">
              <LoadingSpinner size="lg" className="mb-4" />
              <p className="text-[#8F7A6A]">Carregando informações da mentora...</p>
            </div>
          }>
            <AnimatedWrapper animation={isLowPerformance ? 'none' : 'fade'} show={true} duration={400}>
              <MentorSection />
            </AnimatedWrapper>
          </Suspense>
        </section>

        {/* SEÇÃO DE TRANSIÇÃO - Adicionar espaço antes do CTA final */}
        <div className="mb-20">
          <div className="text-center py-12">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#B89B7A] to-transparent mx-auto mb-6"></div>
            <p className="text-lg text-[#8F7A6A] font-medium">
              Está pronta para transformar seu estilo?
            </p>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#B89B7A] to-transparent mx-auto mt-6"></div>
          </div>
        </div>
        
        {/* Final CTA Section - ESPAÇAMENTO OTIMIZADO */}
        <section id="cta" className="scroll-mt-20 mb-20 bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-[#B89B7A]/20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-pattern-light opacity-5 pointer-events-none"></div>
          <AnimatedWrapper animation={isLowPerformance ? 'none' : 'fade'} show={true} duration={600} delay={300}>
            {/* Título CTA com decoração elegante */}
            <AnimatedWrapper 
              className="text-center mb-12"
              animation="fade"
              show={true}
              duration={600}
            >
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#B89B7A] to-transparent"></div>
                <div className="w-3 h-3 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-full shadow-md animate-pulse"></div>
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#B89B7A] to-transparent"></div>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-[#432818] mb-6 leading-tight bg-gradient-to-r from-[#432818] via-[#aa6b5d] to-[#432818] bg-clip-text text-transparent relative z-10">
                Transforme Seu Estilo Hoje
              </h2>
              
              <p className="text-lg md:text-xl text-[#8F7A6A] leading-relaxed mb-8 relative z-10">
                Seu guia completo para o estilo <span className="font-semibold text-[#aa6b5d]">{category}</span> + bônus exclusivos
              </p>
            </AnimatedWrapper>
            
            {/* PREVIEW VISUAL DOS MATERIAIS - ESPAÇAMENTO MELHORADO */}
            <div className="mb-12 relative z-10">
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
                {/* Guia Principal - Imagem específica por categoria */}
                <div className="bg-gradient-to-br from-[#fff7f3] to-[#f9f4ef] rounded-lg p-4 border border-[#B89B7A]/20">
                  <div className="aspect-[3/4] bg-white rounded-lg mb-3 flex items-center justify-center relative overflow-hidden shadow-sm p-2">
                    <ProgressiveImage 
                      src={(() => {
                        const guideImages = {
                          'Natural': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/GUIA_NATURAL_fzp6fc.webp',
                          'Clássico': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071343/GUIA_CL%C3%81SSICO_ux1yhf.webp',
                          'Contemporâneo': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071343/GUIA_CONTEMPOR%C3%82NEO_vcklxe.webp',
                          'Elegante': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071342/GUIA_ELEGANTE_asez1q.webp',
                          'Romântico': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071343/GUIA_ROM%C3%82NTICO_ci4hgk.webp',
                          'Sexy': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071349/GUIA_SEXY_t5x2ov.webp',
                          'Dramático': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745073346/GUIA_DRAM%C3%81TICO_mpn60d.webp',
                          'Criativo': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071342/GUIA_CRIATIVO_ntbzph.webp'
                        };
                        return guideImages[category] || guideImages['Natural'];
                      })()} 
                      alt={`Guia ${category}`}
                      className="max-w-full max-h-full object-contain rounded-lg"
                      loading="lazy"
                    />
                    <div className="absolute top-1 right-1 bg-[#B89B7A] px-2 py-1 rounded-full text-xs text-white font-medium shadow-sm">PDF</div>
                  </div>
                  <h4 className="font-semibold text-[#432818] text-sm mb-1">Guia de Estilo {category}</h4>
                  <p className="text-xs text-[#8F7A6A]">Personalizado para você</p>
                </div>

                {/* E-book Transformação */}
                <div className="bg-gradient-to-br from-[#fff7f3] to-[#f9f4ef] rounded-lg p-4 border border-[#B89B7A]/20">
                  <div className="aspect-[3/4] bg-white rounded-lg mb-3 flex items-center justify-center relative overflow-hidden shadow-sm p-2">
                    <ProgressiveImage 
                      src="https://res.cloudinary.com/dqljyf76t/image/upload/v1745515075/Espanhol_Portugu%C3%AAs_1_uru4r3.png" 
                      alt="E-book Transformação de Imagem"
                      className="max-w-full max-h-full object-contain rounded-lg"
                      loading="lazy"
                    />
                    <div className="absolute top-1 right-1 bg-[#aa6b5d] px-2 py-1 rounded-full text-xs text-white font-medium shadow-sm">E-BOOK</div>
                  </div>
                  <h4 className="font-semibold text-[#432818] text-sm mb-1">E-book Transformação</h4>
                  <p className="text-xs text-[#8F7A6A]">Método completo de mudança</p>
                </div>

                {/* Guia de Visagismo */}
                <div className="bg-gradient-to-br from-[#fff7f3] to-[#f9f4ef] rounded-lg p-4 border border-[#B89B7A]/20">
                  <div className="aspect-[3/4] bg-white rounded-lg mb-3 flex items-center justify-center relative overflow-hidden shadow-sm p-2">
                    <ProgressiveImage 
                      src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911666/C%C3%B3pia_de_Template_Dossi%C3%AA_Completo_2024_15_-_Copia_ssrhu3.png" 
                      alt="Guia de Visagismo"
                      className="max-w-full max-h-full object-contain rounded-lg"
                      loading="lazy"
                    />
                    <div className="absolute top-1 right-1 bg-[#D4B79F] px-2 py-1 rounded-full text-xs text-white font-medium shadow-sm">BÔNUS</div>
                  </div>
                  <h4 className="font-semibold text-[#432818] text-sm mb-1">Guia de Visagismo</h4>
                  <p className="text-xs text-[#8F7A6A]">Cabelos e cores perfeitas</p>
                </div>
              </div>

              {/* Preview dos conteúdos internos - ESPAÇAMENTO MELHORADO */}
              <div className="mb-12">
                <div className="bg-gradient-to-r from-[#fff7f3] to-[#f9f4ef] rounded-xl p-6 border border-[#B89B7A]/20 max-w-3xl mx-auto">
                  <h4 className="text-lg font-semibold text-[#432818] mb-6 text-center">O que você encontrará dentro:</h4>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="relative rounded-lg overflow-hidden shadow-sm bg-white p-2">
                      <ProgressiveImage 
                        src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744920634/Espanhol_Portugu%C3%AAs_8_horqsn.png" 
                        alt="Todos os produtos da oferta"
                        className="w-full h-32 object-contain rounded-lg"
                        loading="lazy"
                      />
                    </div>
                    <div className="relative rounded-lg overflow-hidden shadow-sm bg-white p-2">
                      <ProgressiveImage 
                        src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911682/C%C3%B3pia_de_MOCKUPS_14_oxegnd.png" 
                        alt="Capas dos 3 guias principais"
                        className="w-full h-32 object-contain rounded-lg"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                    <div className="flex flex-col items-center">
                      <CheckCircle className="w-5 h-5 text-[#B89B7A] mb-1" />
                      <span className="text-xs text-[#432818] font-medium">Paletas de Cores</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Award className="w-5 h-5 text-[#B89B7A] mb-1" />
                      <span className="text-xs text-[#432818] font-medium">Looks Completos</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Shield className="w-5 h-5 text-[#B89B7A] mb-1" />
                      <span className="text-xs text-[#432818] font-medium">Peças Essenciais</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <ShoppingCart className="w-5 h-5 text-[#B89B7A] mb-1" />
                      <span className="text-xs text-[#432818] font-medium">Onde Comprar</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SEÇÃO DE VALOR - SEPARADA DO CTA */}
            <div className="mb-16">
              {/* Valor Total - ANCORAGEM CORRIGIDA */}
              <div className="bg-gradient-to-r from-[#fff7f3] to-[#f9f4ef] rounded-xl p-4 sm:p-6 border border-[#B89B7A]/20 max-w-lg mx-auto mb-8 overflow-hidden shadow-md">
                {/* Lista de valores individuais - VISÍVEL */}
                <div className="mb-6">
                  <h5 className="text-sm font-semibold text-[#432818] mb-4 text-center">Valor individual dos materiais:</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b border-[#B89B7A]/10">
                      <span className="text-xs sm:text-sm text-[#432818]">Guia de Estilo {category}</span>
                      <span className="text-sm font-medium text-[#8F7A6A] line-through">R$ 67,00</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#B89B7A]/10">
                      <span className="text-xs sm:text-sm text-[#432818]">E-book Transformação</span>
                      <span className="text-sm font-medium text-[#8F7A6A] line-through">R$ 47,00</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#B89B7A]/10">
                      <span className="text-xs sm:text-sm text-[#432818]">Guia de Visagismo</span>
                      <span className="text-sm font-medium text-[#8F7A6A] line-through">R$ 37,00</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#B89B7A]/10">
                      <span className="text-xs sm:text-sm text-[#432818]">Bônus Exclusivos</span>
                      <span className="text-sm font-medium text-[#8F7A6A] line-through">R$ 24,00</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-3 mt-3 border-t-2 border-[#B89B7A]/30">
                    <span className="text-sm font-bold text-[#432818]">TOTAL NORMAL:</span>
                    <span className="text-lg font-bold text-[#aa6b5d] line-through">R$ 175,00</span>
                  </div>
                </div>

                <div className="text-center border-t border-[#B89B7A]/20 pt-4 px-1 sm:px-2">
                  <p className="text-[#432818] text-sm sm:text-base mb-3 font-medium">Sua oferta especial hoje:</p>
                  <div className="mb-4">
                    <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] bg-clip-text text-transparent">
                      R$ 39,90
                    </span>
                    <p className="text-xs text-[#8F7A6A] mt-1">ou 5x de R$ 8,83 sem juros</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                    <div className="inline-flex items-center gap-2 bg-green-50 px-3 sm:px-4 py-2 rounded-full border border-green-200">
                      <span className="text-green-600 text-xs sm:text-sm font-medium whitespace-nowrap">
                        💰 Economia de R$ 135,10
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-red-50 px-3 sm:px-4 py-2 rounded-full border border-red-200">
                      <span className="text-red-600 text-xs sm:text-sm font-medium whitespace-nowrap">
                        ⏰ Oferta por tempo limitado
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Final - ESPAÇAMENTO AUMENTADO */}
            <div className="text-center mb-16">
              <Button 
                onClick={handleCTAClick} 
                className="text-white text-lg sm:text-xl leading-none py-4 sm:py-5 px-6 sm:px-8 md:px-12 rounded-lg sm:rounded-xl shadow-xl transition-all duration-300 cursor-pointer font-bold w-full sm:w-auto min-h-[56px]"
                style={{
                  background: `linear-gradient(to right, ${tokens.colors.success}, ${tokens.colors.successDark})`,
                  boxShadow: `0 8px 25px rgba(76, 175, 80, 0.4)`,
                }}
                type="button"
              >
                <span className="flex items-center justify-center gap-2 sm:gap-3">
                  <ShoppingCart className="w-5 sm:w-6 h-5 sm:h-6 flex-shrink-0" />
                  <span className="whitespace-nowrap text-sm sm:text-base md:text-lg">Garantir Minha Transformação</span>
                </span>
              </Button>

              {/* Elementos de confiança - MAIS ESPAÇADOS */}
              <div className="flex items-center justify-center gap-8 text-sm text-[#8F7A6A] flex-wrap mt-6">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#B89B7A] flex-shrink-0" />
                  <span className="whitespace-nowrap">Compra Segura</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#B89B7A] flex-shrink-0" />
                  <span className="whitespace-nowrap">Acesso Imediato</span>
                </div>
              </div>
            </div>
          </AnimatedWrapper>
        </section>

        {/* ESPAÇO ADICIONAL MAIOR antes do sticky CTA aparecer */}
        <div className="mb-48"></div>
      </div>
    </div>
  );
};

export default ResultPage;