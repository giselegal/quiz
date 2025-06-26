
"use client";

import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ShoppingCart, Heart, Award, CheckCircle, Star, XCircle } from 'lucide-react';
import { trackButtonClick } from '@/utils/analytics';

// Types
interface StyleResult {
  category: string;
  score: number;
  percentage: number;
}

// Helper function to get style descriptions
const getStyleDescription = (styleType: string): string => {
  switch (styleType) {
    case 'Natural':
      return 'Você valoriza o conforto e a praticidade. Seu estilo é descontraído e casual, com peças fáceis de usar no dia a dia.';
    case 'Clássico':
      return 'Você aprecia roupas atemporais e elegantes. Seu estilo é refinado e tradicional, com peças de qualidade que nunca saem de moda.';
    case 'Contemporâneo':
      return 'Você gosta de estar atualizado e seguir as tendências. Seu estilo é moderno e versátil, combinando o clássico com o atual.';
    case 'Elegante':
      return 'Você valoriza a sofisticação e o requinte. Seu estilo é polido e imponente, com peças de alta qualidade e acabamento impecável.';
    case 'Romântico':
      return 'Você aprecia detalhes delicados e femininos. Seu estilo é suave e gracioso, com elementos como rendas, babados e estampas florais.';
    case 'Sexy':
      return 'Você gosta de valorizar suas curvas. Seu estilo é sensual e marcante, com peças que destacam seu corpo e sua confiança.';
    case 'Dramático':
      return 'Você busca impactar e chamar atenção. Seu estilo é arrojado e marcante, com peças estruturadas e de design diferenciado.';
    case 'Criativo':
      return 'Você adora expressar sua individualidade. Seu estilo é único e original, combinando cores, texturas e elementos de forma não convencional.';
    default:
      return 'Seu estilo pessoal reflete sua personalidade e preferências únicas.';
  }
};

// Lazy load componentes menos críticos
const Testimonials = lazy(() => import('@/components/quiz-result/sales/Testimonials'));

interface QuizResultSalesPageProps {
  primaryStyle: StyleResult;
  secondaryStyles: StyleResult[];
  userName?: string;
}

const QuizResultSalesPage: React.FC<QuizResultSalesPageProps> = ({
  primaryStyle,
  secondaryStyles,
  userName = 'Visitante'
}) => {
  const { toast } = useToast();
  const [criticalImagesLoaded, setCriticalImagesLoaded] = useState(false);

  // Pré-carregar imagens críticas
  useEffect(() => {
    const criticalImages = [
      "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911667/WhatsApp_Image_2025-04-02_at_09.40.53_cv8p5y.jpg"
    ];
    
    let loadedCount = 0;
    const totalImages = criticalImages.length;
    
    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setCriticalImagesLoaded(true);
        }
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${src}`);
      };
    });

    // Timeout para garantir que não ficará travado mesmo se alguma imagem falhar
    const timeout = setTimeout(() => {
      setCriticalImagesLoaded(true);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  const handleBuyNow = () => {
    // Rastrear evento de clique no botão
    trackButtonClick('buy_now_button', 'Quero Comprar', 'result_page_main_cta');
    
    toast({
      title: "Redirecionando para o checkout",
      description: "Você será redirecionado para a página de pagamento.",
    });

    // URL do checkout
    window.location.href = "https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912";
  };

  // Loading state quando imagens críticas estão carregando
  if (!criticalImagesLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fffaf7]">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-[#432818]">Carregando seu resultado personalizado...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf7]">
      {/* Header */}
      <header className="bg-white py-4 px-4 border-b border-[#B89B7A]/20 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <img 
            src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911667/WhatsApp_Image_2025-04-02_at_09.40.53_cv8p5y.jpg" 
            alt="Logo" 
            className="h-12 sm:h-16" 
            width="128"
            height="64"
          />
          <div className="text-center sm:text-right">
            <p className="text-sm text-[#432818]">
              <span className="font-semibold text-[#aa6b5d]">5 x de R$ 8,83 *</span>
            </p>
            <p className="text-sm text-[#432818]">Ou R$ 39,90 à vista</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-playfair text-[#aa6b5d] mb-4">
                {userName}, seu Estilo é {primaryStyle.category}!
              </h1>
              <p className="text-base sm:text-lg mb-6 text-[#3a3a3a]">
                Descubra como aplicar seu estilo predominante com clareza e autenticidade no seu dia a dia.
              </p>
              
              {/* Resultado do Estilo */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm mb-6 border border-[#B89B7A]/10">
                <h2 className="font-medium text-[#aa6b5d] mb-3">Seu estilo predominante:</h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#aa6b5d] to-[#B89B7A] flex items-center justify-center text-white text-xl font-bold shadow-md">
                      {primaryStyle.percentage}%
                    </div>
                    <div>
                      <h3 className="font-playfair text-xl sm:text-2xl text-[#432818] font-semibold">
                        {primaryStyle.category}
                      </h3>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-[#3a3a3a]/80 mt-3 leading-relaxed">
                  {getStyleDescription(primaryStyle.category)}
                </p>
              </div>

              {/* Estilos Complementares */}
              {secondaryStyles.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-[#aa6b5d] mb-4">
                    Seus estilos complementares
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {secondaryStyles.slice(0, 2).map((style, index) => (
                      <div
                        key={index}
                        className="bg-white p-4 rounded-lg shadow-sm border border-[#B89B7A]/10"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-[#432818] text-sm">
                            {style.category}
                          </span>
                          <span className="text-sm font-semibold text-[#aa6b5d]">
                            {style.percentage}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-[#FAF9F7] rounded-full overflow-hidden">
                          <div
                            className="h-2 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-full transition-all duration-500"
                            style={{ width: `${style.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="order-1 md:order-2">
              <img
                src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911666/C%C3%B3pia_de_Template_Dossi%C3%AA_Completo_2024_15_-_Copia_ssrhu3.webp"
                alt="Resultado do Quiz Visagismo"
                className="rounded-lg shadow-lg w-full max-w-md mx-auto"
                loading="lazy"
                width="600"
                height="400"
              />
            </div>
          </div>
        </section>

        {/* Seção Antes e Depois */}
        <section className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-playfair text-[#aa6b5d] text-center mb-8">
            A Diferença de Conhecer Seu Estilo
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Antes */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-red-200">
              <h3 className="text-lg font-semibold text-red-600 mb-4 text-center">
                ❌ Quando você não conhece seu estilo...
              </h3>
              <ul className="space-y-3">
                {[
                  "Compra peças por impulso que não combinam entre si",
                  "Sente que tem um guarda-roupa cheio, mas 'nada para vestir'",
                  "Investe em tendências que não valorizam sua imagem",
                  "Tem dificuldade em criar uma imagem coerente e autêntica"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Depois */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-green-200">
              <h3 className="text-lg font-semibold text-[#4CAF50] mb-4 text-center">
                ✅ Quando você domina seu estilo...
              </h3>
              <ul className="space-y-3">
                {[
                  "Economiza tempo e dinheiro em compras conscientes",
                  "Projeta a imagem que realmente representa você",
                  "Aumenta sua confiança em qualquer ambiente",
                  "Cria looks harmoniosos com menos peças"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#4CAF50] mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Offer Card */}
        <section className="mb-16">
          <Card className="p-6 md:p-8 border-[#aa6b5d]/20">
            <h2 className="text-2xl md:text-3xl font-playfair text-[#aa6b5d] mb-6 text-center">
              Guia de Estilo Personalizado + Bônus Exclusivos
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <img
                  src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911682/C%C3%B3pia_de_MOCKUPS_13_znzbks.webp"
                  alt="Mockup do Guia de Estilo"
                  className="rounded-lg shadow-md w-full"
                  loading="lazy"
                  width="400"
                  height="300"
                />
              </div>
              
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-medium text-[#aa6b5d] mb-4">
                  O que você vai receber:
                </h3>
                <ul className="space-y-3 mb-6">
                  {[
                    "Guia completo do seu estilo predominante",
                    "Paleta de cores personalizada",
                    "Lista de peças essenciais para seu guarda-roupa",
                    "Guia de combinações e dicas de styling",
                    "Acesso vitalício a atualizações"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-[#aa6b5d] mr-2 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                  <div className="text-center">
                    <p className="text-sm text-[#3a3a3a]/60 mb-1">Valor original</p>
                    <p className="text-lg line-through text-[#3a3a3a]/70">
                      R$ 175,00
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-[#aa6b5d] mb-1">Por apenas</p>
                    <p className="text-3xl font-bold text-[#aa6b5d]">
                      R$ 39,00
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center md:text-right mb-4">
              <p className="text-sm text-[#432818]">Parcelamento: 5x de R$ 8,83*</p>
              <p className="text-sm text-[#432818]">ou R$ 39,90 à vista</p>
            </div>
            
            <div className="text-center">
              <Button 
                onClick={handleBuyNow}
                size="lg"
                className="bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold px-8 py-3"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Quero Meu Guia Agora
              </Button>
            </div>
          </Card>
        </section>

        {/* Final CTA */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">
              Sua Transformação Começa Agora!
            </h2>
            <p className="mb-6">
              Não perca mais tempo se sentindo perdida com seu guarda-roupa.
            </p>
            <Button 
              onClick={handleBuyNow}
              size="lg"
              className="bg-white text-[#aa6b5d] hover:bg-gray-100 font-bold px-8 py-3"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Quero Meu Guia Agora
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default QuizResultSalesPage;
