
import React, { useState, useEffect } from 'react';
import { QuizOfferHero } from '@/components/quiz-offer/QuizOfferHero';
import { EmbeddedQuizPreview } from '@/components/quiz-offer/EmbeddedQuizPreview';
import { QuizOfferCTA } from '@/components/quiz-offer/QuizOfferCTA';
import QuizPage from '@/components/QuizPage';
import Testimonials from '@/components/quiz-result/sales/Testimonials';
import Guarantee from '@/components/quiz-result/sales/Guarantee';
import BenefitList from '@/components/quiz-result/sales/BenefitList';
import BuildInfo from '@/components/BuildInfo';
import { initFacebookPixel, trackButtonClick } from '@/utils/analytics';
import { useUtmParameters } from '@/hooks/useUtmParameters';

const QuizOfferPage = () => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [hasScrolledToQuiz, setHasScrolledToQuiz] = useState(false);
  const { captureUtmParameters } = useUtmParameters();

  // Inicializa o Facebook Pixel e capturar UTM parameters quando a página carregar
  useEffect(() => {
    // Inicializar o Facebook Pixel
    initFacebookPixel();
    
    // Capturar UTM parameters
    captureUtmParameters();
    
    // Registrar o tempo de início para cálculos de métricas
    localStorage.setItem('offer_page_load_time', Date.now().toString());
  }, [captureUtmParameters]);

  // Função para iniciar o quiz
  const handleStartQuiz = () => {
    setShowQuiz(true);
    trackButtonClick('start-embedded-quiz', 'Iniciar Quiz Embutido', 'quiz-offer-page', 'start-quiz');
    
    // Scroll para a seção do quiz se ainda não tiver feito isso
    if (!hasScrolledToQuiz) {
      setTimeout(() => {
        const quizSection = document.getElementById('quiz-section');
        if (quizSection) {
          quizSection.scrollIntoView({ behavior: 'smooth' });
          setHasScrolledToQuiz(true);
        }
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="container mx-auto px-4">
        {/* Seção Hero */}
        <section className="py-8">
          <QuizOfferHero onStartQuizClick={handleStartQuiz} />
        </section>

        {/* Previsualização ou Quiz Completo */}
        <section id="quiz-section" className="py-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-playfair text-center text-[#432818] mb-6">
              {showQuiz ? 'Descubra Seu Estilo Pessoal' : 'Experimente o Quiz'}
            </h2>
            
            {showQuiz ? (
              <div className="border border-[#EAE4DA] rounded-lg overflow-hidden shadow-md bg-[#F9F7F4] p-4">
                <QuizPage />
              </div>
            ) : (
              <EmbeddedQuizPreview onStartQuiz={handleStartQuiz} />
            )}
          </div>
        </section>
        
        {/* CTA Principal */}
        <section className="py-8">
          <div className="max-w-3xl mx-auto">
            <QuizOfferCTA />
          </div>
        </section>
        
        {/* Imagens demonstrativas do produto */}
        <section className="py-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-playfair text-center text-[#432818] mb-6">
              O Que Você Vai Descobrir
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <img
                src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911677/C%C3%B3pia_de_MOCKUPS_15_-_Copia_grstwl.webp"
                alt="Mockup celular peças-chave por dentro"
                className="w-full rounded-lg shadow-md"
              />
              <img
                src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911667/WhatsApp_Image_2025-04-02_at_09.40.53_cv8p5y.jpg"
                alt="Foto Gisele Galvão"
                className="w-full rounded-lg shadow-md"
              />
            </div>
          </div>
        </section>
        
        {/* Lista de Benefícios */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto">
            <BenefitList />
          </div>
        </section>
        
        {/* Depoimentos */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-playfair text-center text-[#432818] mb-6">
              O Que Dizem Sobre o Guia
            </h2>
            <Testimonials />
          </div>
        </section>
        
        {/* Garantia */}
        <section className="py-8">
          <div className="max-w-3xl mx-auto">
            <Guarantee />
          </div>
        </section>
        
        {/* CTA Final */}
        <section className="py-8">
          <div className="max-w-3xl mx-auto">
            <QuizOfferCTA />
          </div>
        </section>
        
        <BuildInfo />
      </div>
    </div>
  );
};

export default QuizOfferPage;
