
import React, { useEffect, useState } from 'react';
import { useQuizContext } from '@/context/QuizContext';
import { QuizOfferHero } from '@/components/quiz-offer/QuizOfferHero';
import QuizOfferCTA from '@/components/quiz-offer/QuizOfferCTA';
import EmbeddedQuizPreview from '@/components/quiz-offer/EmbeddedQuizPreview';
import { trackButtonClick, captureUTMParameters } from '@/utils/analytics';
import usePerformanceMonitoring from '@/hooks/usePerformanceMonitoring';

const QuizOfferPage: React.FC = () => {
  const [showQuiz, setShowQuiz] = useState(false);
  const { resetQuiz } = useQuizContext();
  
  // Use web vitals monitoring
  usePerformanceMonitoring();
  
  useEffect(() => {
    // Reset quiz state when visiting this page
    resetQuiz();
    
    // Capture UTM parameters
    captureUTMParameters();
    
    // Record page view
    console.log('Quiz Offer Page loaded');
    
    // Any additional initialization
  }, [resetQuiz]);
  
  const handleStartQuizClick = () => {
    setShowQuiz(true);
    trackButtonClick('start-quiz', 'Começar Quiz', 'quiz-offer', 'engagement');
    // Smooth scroll to quiz section
    setTimeout(() => {
      document.getElementById('quiz-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      {/* Hero Section */}
      <header className="container mx-auto pt-8 pb-4 px-4">
        <div className="flex justify-center mb-8">
          <img 
            src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp"
            alt="Logo Gisele Galvão"
            width={140}
            height={60}
            className="h-auto w-36"
          />
        </div>
        
        <QuizOfferHero onStartQuizClick={handleStartQuizClick} />
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        {/* Quiz Section */}
        <div id="quiz-section" className="mb-16">
          {showQuiz ? (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-playfair text-[#432818] mb-6 text-center">
                Seu Quiz de Estilo Pessoal
              </h2>
              <EmbeddedQuizPreview />
            </div>
          ) : (
            <div className="max-w-3xl mx-auto bg-[#F9F7F4] p-8 rounded-lg text-center">
              <h2 className="text-2xl md:text-3xl font-playfair text-[#432818] mb-4">
                Pronta para descobrir seu estilo autêntico?
              </h2>
              <p className="text-lg text-[#432818]/80 mb-6">
                Responda algumas perguntas sobre suas preferências e descubra seu estilo pessoal único.
              </p>
              <button 
                onClick={handleStartQuizClick}
                className="bg-[#aa6b5d] hover:bg-[#9d5d50] text-white py-3 px-6 rounded-md text-lg font-medium"
              >
                Começar o Quiz Gratuito
              </button>
            </div>
          )}
        </div>
        
        {/* CTA Section */}
        <div className="max-w-xl mx-auto mb-16">
          <QuizOfferCTA />
        </div>
        
        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-playfair text-[#432818] mb-6 text-center">
            Perguntas Frequentes
          </h2>
          
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EAE4DA]">
              <h3 className="font-medium text-lg text-[#432818] mb-2">
                O que vou descobrir com este quiz?
              </h3>
              <p className="text-[#432818]/80">
                Você descobrirá seu estilo pessoal dominante e como ele reflete sua personalidade. 
                A versão completa inclui uma análise detalhada e recomendações personalizadas.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EAE4DA]">
              <h3 className="font-medium text-lg text-[#432818] mb-2">
                Quanto tempo leva para completar o quiz?
              </h3>
              <p className="text-[#432818]/80">
                O quiz gratuito leva aproximadamente 3-5 minutos para ser concluído. 
                A versão completa oferece uma análise mais profunda com aproximadamente 15 questões.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EAE4DA]">
              <h3 className="font-medium text-lg text-[#432818] mb-2">
                O que está incluído no guia completo?
              </h3>
              <p className="text-[#432818]/80">
                O guia completo inclui: análise detalhada de estilo, paleta de cores personalizada, 
                lista de peças essenciais para seu guarda-roupa, dicas de visagismo e combinações 
                ideais para seu biotipo.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-[#F9F7F4] py-8 px-4 mt-16">
        <div className="container mx-auto text-center">
          <p className="text-[#432818]/70 text-sm">
            © {new Date().getFullYear()} Gisele Galvão | Todos os direitos reservados
          </p>
        </div>
      </footer>
    </div>
  );
};

export default QuizOfferPage;
