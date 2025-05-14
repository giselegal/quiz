
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { StyleResult } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { trackButtonClick, trackSaleConversion } from '@/utils/analytics';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ShoppingCart, Heart, Award, CheckCircle, Star } from 'lucide-react';

// Lazy load componentes menos críticos
const Testimonials = lazy(() => import('@/components/quiz-result/sales/Testimonials'));
const BenefitList = lazy(() => import('@/components/quiz-result/sales/BenefitList'));

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
  const navigate = useNavigate();
  const [imagesLoaded, setImagesLoaded] = useState(false);
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
        loadedCount++;
        console.error(`Failed to load image: ${src}`);
        if (loadedCount === totalImages) {
          setCriticalImagesLoaded(true);
        }
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
    
    // Rastrear conversão para analytics
    trackSaleConversion(39);
    
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
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <img 
            src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911667/WhatsApp_Image_2025-04-02_at_09.40.53_cv8p5y.jpg" 
            alt="Logo" 
            className="h-16" 
            width="128"
            height="64"
          />
          <Button 
            onClick={handleBuyNow}
            className="bg-[#aa6b5d] hover:bg-[#8f574a]"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Quero Comprar
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <h1 className="text-3xl md:text-4xl font-playfair text-[#aa6b5d] mb-4">
                {userName}, seu Estilo é {primaryStyle.category}!
              </h1>
              <p className="text-lg mb-6 text-[#3a3a3a]">
                Descubra como aplicar seu estilo predominante com clareza e autenticidade no seu dia a dia.
              </p>
              <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <h2 className="font-medium text-[#aa6b5d] mb-2">Seu estilo predominante:</h2>
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full bg-[#aa6b5d] flex items-center justify-center text-white text-2xl font-bold">
                    {primaryStyle.percentage}%
                  </div>
                  <div className="ml-4">
                    <h3 className="font-playfair text-xl">{primaryStyle.category}</h3>
                    <p className="text-sm text-[#3a3a3a]/80">
                      {getStyleDescription(primaryStyle.category)}
                    </p>
                  </div>
                </div>
              </div>
              {secondaryStyles.length > 0 && (
                <div>
                  <h3 className="font-medium text-[#aa6b5d] mb-2">Seus estilos secundários:</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {secondaryStyles.slice(0, 2).map((style, index) => (
                      <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="font-medium">{style.category}</p>
                        <p className="text-sm text-[#3a3a3a]/60">{style.percentage}%</p>
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
                className="rounded-lg shadow-lg w-full"
                loading="lazy"
                width="600"
                height="400"
              />
            </div>
          </div>
        </section>

        {/* Offer Card */}
        <Card className="p-6 md:p-8 border-[#aa6b5d]/20 mb-16">
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
                width="600"
                height="400"
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

          <Button 
            onClick={handleBuyNow}
            className="w-full bg-[#aa6b5d] hover:bg-[#8f574a] text-white py-6 rounded-md text-lg transition-colors duration-300"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Quero meu Guia + Bônus por R$39,00
          </Button>
        </Card>

        {/* Bonus Carousel */}
        <section className="mb-16">
          <h2 className="text-2xl font-playfair text-[#aa6b5d] mb-6 text-center">
            Bônus Exclusivos
          </h2>
          <Carousel className="w-full">
            <CarouselContent>
              {[
                {
                  title: "Guia de Maquiagem",
                  img: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911677/C%C3%B3pia_de_MOCKUPS_15_-_Copia_grstwl.webp"
                },
                {
                  title: "Guia de Acessórios",
                  img: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911666/C%C3%B3pia_de_Template_Dossi%C3%AA_Completo_2024_15_-_Copia_ssrhu3.webp"
                },
                {
                  title: "Checklist de Compras",
                  img: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911682/C%C3%B3pia_de_MOCKUPS_13_znzbks.webp"
                }
              ].map((bonus, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="overflow-hidden">
                      <img
                        src={bonus.img}
                        alt={bonus.title}
                        className="w-full aspect-[3/2] object-cover"
                        loading="lazy"
                        width="400"
                        height="267"
                      />
                      <div className="p-4 text-center">
                        <h3 className="font-medium">{bonus.title}</h3>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </section>

        {/* Two Columns: About Author */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <img
                src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911667/WhatsApp_Image_2025-04-02_at_09.40.53_cv8p5y.jpg"
                alt="Foto da Autora"
                className="rounded-lg shadow-md w-full"
                loading="lazy"
                width="500"
                height="375"
              />
            </div>
            <div>
              <h2 className="text-2xl font-playfair text-[#aa6b5d] mb-4">
                Sobre a Autora
              </h2>
              <p className="mb-4">
                Com mais de 10 anos de experiência em consultoria de imagem e estilo pessoal, 
                ajudei centenas de mulheres a descobrirem sua verdadeira essência através das roupas.
              </p>
              <p>
                Minha missão é ajudar você a construir um guarda-roupa que reflita sua personalidade, 
                valorize seu tipo físico e simplifique sua rotina, permitindo que você se vista com 
                confiança todos os dias.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials - Lazy loaded */}
        <section className="mb-16">
          <h2 className="text-2xl font-playfair text-[#aa6b5d] mb-6 text-center">
            O que Dizem As Alunas
          </h2>
          <Suspense fallback={
            <div className="text-center p-8">
              <LoadingSpinner />
            </div>
          }>
            <Testimonials />
          </Suspense>
        </section>

        {/* Guarantee */}
        <section className="mb-16">
          <Card className="p-6 border-[#aa6b5d]/20 bg-[#fff7f3]">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="md:w-1/4 flex justify-center">
                <div className="w-32 h-32 rounded-full bg-[#aa6b5d] flex items-center justify-center text-white">
                  <div className="text-center">
                    <Award className="w-12 h-12 mx-auto" />
                    <span className="block font-bold text-xl">7 Dias</span>
                  </div>
                </div>
              </div>
              <div className="md:w-3/4">
                <h2 className="text-2xl font-playfair text-[#aa6b5d] mb-4">
                  Garantia de Satisfação
                </h2>
                <p className="mb-2">
                  Se você não ficar completamente satisfeita com o seu Guia de Estilo Personalizado, 
                  basta solicitar o reembolso em até 7 dias após a compra.
                </p>
                <p>
                  Sem perguntas, sem complicações. Sua satisfação é nossa prioridade!
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-playfair text-[#aa6b5d] mb-6 text-center">
            Perguntas Frequentes
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {[
              {
                question: "Como vou receber meu guia após a compra?",
                answer: "Imediatamente após a confirmação do pagamento, você receberá um e-mail com as instruções de acesso à sua área de membros, onde poderá baixar todos os materiais."
              },
              {
                question: "O guia é personalizado para o meu estilo?",
                answer: "Sim! O guia é totalmente adaptado ao seu estilo predominante identificado no quiz, com dicas específicas para valorizar suas características únicas."
              },
              {
                question: "Posso acessar em qualquer dispositivo?",
                answer: "Sim, o guia está em formato PDF que pode ser acessado em qualquer dispositivo (computador, tablet ou celular)."
              },
              {
                question: "Por quanto tempo terei acesso aos materiais?",
                answer: "O acesso é vitalício! Uma vez que você adquire o guia, ele é seu para sempre, incluindo futuras atualizações."
              }
            ].map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p>{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Final CTA */}
        <section className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-playfair text-[#aa6b5d] mb-4">
            Transforme seu Estilo Agora!
          </h2>
          <p className="mb-8 max-w-2xl mx-auto">
            Não perca mais tempo com roupas que não combinam com você. Descubra como 
            expressar sua verdadeira essência através do seu estilo pessoal.
          </p>
          <Button 
            onClick={handleBuyNow}
            className="bg-[#aa6b5d] hover:bg-[#8f574a] text-white py-6 px-8 rounded-md text-lg transition-colors duration-300"
          >
            <Star className="w-5 h-5 mr-2" />
            Quero Transformar Meu Estilo
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#432818] text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="mb-4">© 2025 Todos os direitos reservados</p>
          <div className="flex justify-center gap-4">
            <a href="#" className="text-white hover:text-[#B89B7A]">Termos de Uso</a>
            <a href="#" className="text-white hover:text-[#B89B7A]">Política de Privacidade</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

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

export default QuizResultSalesPage;
