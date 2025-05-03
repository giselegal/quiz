import React, { useEffect, useState } from 'react';
import { useQuiz } from '@/hooks/useQuiz';
import { useGlobalStyles } from '@/hooks/useGlobalStyles';
import { Header } from '@/components/result/Header';
import { styleConfig } from '@/config/styleConfig';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { ShoppingCart, CheckCircle, ArrowDown, Lock } from 'lucide-react';
import { AnimatedWrapper } from '@/components/ui/animated-wrapper';
import SecondaryStylesSection from '@/components/quiz-result/SecondaryStylesSection';
import ErrorState from '@/components/result/ErrorState';
import MotivationSection from '@/components/result/MotivationSection';
import MentorSection from '@/components/result/MentorSection';
import GuaranteeSection from '@/components/result/GuaranteeSection';
import Testimonials from '@/components/quiz-result/sales/Testimonials';
import BeforeAfterTransformation from '@/components/result/BeforeAfterTransformation';
import BonusSection from '@/components/result/BonusSection';
import { Button } from '@/components/ui/button';
import { useLoadingState } from '@/hooks/useLoadingState';
import { useIsLowPerformanceDevice } from '@/hooks/use-mobile';
import ResultSkeleton from '@/components/result/ResultSkeleton';
import { trackButtonClick } from '@/utils/analytics';
import BuildInfo from '@/components/BuildInfo';
import SecurePurchaseElement from '@/components/result/SecurePurchaseElement';
import { useAuth } from '@/context/AuthContext';
import { useUtmParameters } from '@/hooks/useUtmParameters';

const ResultPage: React.FC = () => {
  const { primaryStyle, secondaryStyles } = useQuiz();
  const { globalStyles } = useGlobalStyles();
  const { user } = useAuth();
  const [imagesLoaded, setImagesLoaded] = useState({ style: false, guide: false });
  const isLowPerformance = useIsLowPerformanceDevice();
  const { isLoading, completeLoading } = useLoadingState({
    minDuration: isLowPerformance ? 400 : 800,
    disableTransitions: isLowPerformance
  });

  const { addUtmToUrl } = useUtmParameters();
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  useEffect(() => {
    if (!primaryStyle) return;
    window.scrollTo(0, 0);

    const criticalImages = [globalStyles.logo || 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp'];
    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    const { category } = primaryStyle;
    const { image, guideImage } = styleConfig[category];
    const styleImg = new Image();
    styleImg.src = `${image}?q=auto:best&f=auto&w=340`;
    styleImg.onload = () => setImagesLoaded(prev => ({ ...prev, style: true }));
    const guideImg = new Image();
    guideImg.src = `${guideImage}?q=auto:best&f=auto&w=540`;
    guideImg.onload = () => setImagesLoaded(prev => ({ ...prev, guide: true }));
  }, [primaryStyle, globalStyles.logo]);

  useEffect(() => {
    if (imagesLoaded.style && imagesLoaded.guide) completeLoading();
  }, [imagesLoaded, completeLoading]);

  if (!primaryStyle) return <ErrorState />;
  if (isLoading) return <ResultSkeleton />;

  const { category } = primaryStyle;
  const { image, guideImage, description } = styleConfig[category];

  const handleCTAClick = () => {
    trackButtonClick('checkout_button', 'Iniciar Checkout', 'results_page');
    const hotmartUrl = 'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912';
    const urlWithUtm = addUtmToUrl(hotmartUrl);
    window.location.href = urlWithUtm;
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      backgroundColor: globalStyles.backgroundColor || '#fffaf7',
      color: globalStyles.textColor || '#432818',
      fontFamily: globalStyles.fontFamily || 'inherit'
    }}>
      <Header primaryStyle={primaryStyle} logoHeight={globalStyles.logoHeight} logo={globalStyles.logo} logoAlt={globalStyles.logoAlt} userName={user?.userName} />

      <div className="container mx-auto px-4 py-6 max-w-4xl relative z-10">
        <Card className="p-6 mb-10 bg-white shadow-md border border-[#B89B7A]/20 card-elegant">
          <AnimatedWrapper animation="fade" show={true} duration={600} delay={300}>
            <div className="text-center mb-8">
              <div className="max-w-md mx-auto mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#8F7A6A]">Seu estilo predominante</span>
                  <span className="text-[#aa6b5d] font-medium">{primaryStyle.percentage}%</span>
                </div>
                <Progress value={primaryStyle.percentage} className="h-2 bg-[#F3E8E6]" indicatorClassName="bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d]" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <p className="text-[#432818] leading-relaxed">{description}</p>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-[#B89B7A]/10 glass-panel">
                  <h3 className="text-lg font-medium text-[#432818] mb-2">Estilos que Também Influenciam Você</h3>
                  <SecondaryStylesSection secondaryStyles={secondaryStyles} />
                </div>
              </div>
              <div className="max-w-[238px] mx-auto relative">
                <img src={`${image}?q=auto:best&f=auto&w=238`} alt={`Estilo ${category}`} className="w-full h-auto rounded-lg shadow-md hover:scale-105 transition-transform duration-300" loading="eager" fetchPriority="high" width="238" height="auto" />
                <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-[#B89B7A]"></div>
                <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-[#B89B7A]"></div>
              </div>
            </div>
            <div className="mt-8 max-w-[540px] mx-auto relative">
              <img src={`${guideImage}?q=auto:best&f=auto&w=540`} alt={`Guia de Estilo ${category}`} loading="lazy" className="w-full h-auto rounded-lg shadow-md hover:scale-105 transition-transform duration-300" width="540" height="auto" />
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium transform rotate-12">Exclusivo</div>
            </div>
          </AnimatedWrapper>
        </Card>

        <BeforeAfterTransformation />
        <MotivationSection />
        <BonusSection />
        <Testimonials />

        <div className="text-center my-10">
          <div className="bg-[#f9f4ef] p-6 rounded-lg border border-[#B89B7A]/10 mb-6">
            <h3 className="text-xl font-medium text-center text-[#aa6b5d] mb-4">Descubra Como Aplicar Seu Estilo na Prática</h3>
            <div className="flex justify-center"><ArrowDown className="w-8 h-8 text-[#B89B7A] animate-bounce" /></div>
          </div>

          <Button onClick={handleCTAClick} className="text-white py-4 px-6 rounded-md btn-cta-green" onMouseEnter={() => setIsButtonHovered(true)} onMouseLeave={() => setIsButtonHovered(false)} style={{
            background: "linear-gradient(to right, #4CAF50, #45a049)",
            boxShadow: "0 4px 14px rgba(76, 175, 80, 0.4)"
          }}>
            <span className="flex items-center justify-center gap-2">
              <ShoppingCart className={`w-5 h-5 transition-transform duration-300 ${isButtonHovered ? 'scale-110' : ''}`} />
              Quero meu Guia de Estilo Agora
            </span>
          </Button>

          <div className="mt-2 inline-block bg-[#aa6b5d]/10 px-3 py-1 rounded-full"></div>
          <SecurePurchaseElement />
        </div>

        <GuaranteeSection />
        <MentorSection />

        <div className="text-center mt-10">
          <h2 className="text-2xl md:text-3xl font-playfair text-[#aa6b5d] mb-4">Vista-se de Você — na Prática</h2>
          <div className="elegant-divider"></div>
          <p className="text-[#432818] mb-6 max-w-xl mx-auto">
            Agora que você conhece seu estilo, é hora de aplicá-lo com clareza e intenção. 
            O Guia da Gisele Galvão foi criado para mulheres como você — que querem se vestir 
            com autenticidade e transformar sua imagem em ferramenta de poder.
          </p>
          <div className="bg-gradient-to-r from-[#fff7f3] to-[#f9f4ef] p-6 rounded-lg mb-6 border border-[#B89B7A]/10 glass-panel">
            <h3 className="text-xl font-medium text-[#aa6b5d] mb-4">O Guia de Estilo e Imagem + Bônus Exclusivos</h3>
            <ul className="space-y-3 text-left max-w-xl mx-auto text-[#432818]">
              {["Looks com intenção e identidade", "Cores, modelagens e tecidos a seu favor", "Imagem alinhada aos seus objetivos", "Guarda-roupa funcional, sem compras por impulso"].map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-full flex items-center justify-center text-white mr-2 mt-0.5">
                    <CheckCircle className="h-3 w-3" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-[#B89B7A]/20 card-elegant mb-8 max-w-md mx-auto">
            <h3 className="text-xl font-medium text-center text-[#aa6b5d] mb-4">O Que Você Recebe Hoje</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center p-2 border-b border-[#B89B7A]/10"><span>Guia Principal</span><span className="font-medium">R$ 67,00</span></div>
              <div className="flex justify-between items-center p-2 border-b border-[#B89B7A]/10"><span>Bônus - Peças-chave</span><span className="font-medium">R$ 79,00</span></div>
              <div className="flex justify-between items-center p-2 border-b border-[#B89B7A]/10"><span>Bônus - Visagismo Facial</span><span className="font-medium">R$ 29,00</span></div>
              <div className="flex justify-between items-center p-2 pt-3 font-bold"><span>Valor Total</span>
                <div className="relative"><span>R$ 175,00</span><div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#ff5a5a] transform -translate-y-1/2 -rotate-3"></div></div>
              </div>
            </div>
            <div className="text-center p-4 bg-[#f9f4ef] rounded-lg">
              <p className="text-sm text-[#aa6b5d] uppercase font-medium">Hoje por apenas</p>
              <p className="text-4xl font-bold gold-text">R$ 39,00</p>
              <p className="text-xs text-[#3a3a3a]/60 mt-1">À vista</p>
              <p className="text-xs text-[#3a3a3a]/60 mt-1">ou 4x de R$ 10,86</p>
            </div>
          </div>

          <Button onClick={handleCTAClick} className="text-white py-5 px-8 rounded-md shadow-md transition-colors btn-3d mb-2" style={{
            background: "linear-gradient(to right, #4CAF50, #45a049)",
            boxShadow: "0 4px 14px rgba(76, 175, 80, 0.4)",
            fontSize: "1rem"
          }} onMouseEnter={() => setIsButtonHovered(true)} onMouseLeave={() => setIsButtonHovered(false)}>
            <span className="flex items-center justify-center gap-2">
              <ShoppingCart className={`w-4 h-4 transition-transform duration-300 ${isButtonHovered ? 'scale-110' : ''}`} />
              <span>Garantir Meu Guia + Bônus Especiais</span>
            </span>
          </Button>

          <SecurePurchaseElement />
          <p className="text-sm text-[#aa6b5d] mt-2 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" /><span>Oferta exclusiva nesta página</span>
          </p>
        </div>
      </div>

      <BuildInfo />
    </div>
  );
};

export default ResultPage;