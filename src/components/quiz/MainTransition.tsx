import React, { useState } from 'react';
import { Card } from '../ui/card';
import { QuizQuestion } from '../QuizQuestion';
import { strategicQuestions } from '@/data/strategicQuestions';
import { UserResponse } from '@/types/quiz';
import { toast } from '../ui/use-toast';
import { Button } from '../ui/button';

interface MainTransitionProps {
  onAnswer: (response: UserResponse) => void;
  strategicAnswers: Record<string, string[]>;
}

export const MainTransition: React.FC<MainTransitionProps> = ({
  onAnswer,
  strategicAnswers,
}) => {
  const [showIntro, setShowIntro] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Define the currentAnswersForQuestion variable
  const currentQuestion = strategicQuestions[currentQuestionIndex];
  const currentAnswersForQuestion = currentQuestion 
    ? (strategicAnswers[currentQuestion.id] || []) 
    : [];

  const handleQuestionAnswer = (response: UserResponse) => {
    try {
      console.log('Strategic Question Answered:', response);
      onAnswer(response);
      
      // Only auto advance if the user has selected an option
      if (response.selectedOptions.length > 0) {
        // We don't auto-advance here anymore, we'll do it through the onNextClick
      }
    } catch (error) {
      console.error('Error handling strategic question:', error);
      toast({
        title: "Erro na transição do quiz",
        description: "Não foi possível processar sua resposta. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleNextClick = () => {
    if (currentQuestionIndex < strategicQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // If this is the last strategic question, notify the parent component
      onAnswer({
        questionId: currentQuestion.id,
        selectedOptions: currentAnswersForQuestion,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] px-4 py-10 flex items-start justify-center">
      <div className="max-w-3xl w-full mx-auto">
        {showIntro ? (
          <Card className="p-8 space-y-8 bg-white shadow-lg border-[#B89B7A]/20 mb-10">
            <h2 className="text-2xl font-playfair text-[#432818] text-center tracking-normal font-bold mt-4">
              Enquanto calculamos o seu resultado...
            </h2>
            
            <p className="text-[#1A1818]/90 text-lg">
              Queremos te fazer algumas perguntas que vão tornar sua <strong className="text-[#432818]">experiência</strong> ainda mais <strong className="text-[#432818]">completa</strong>.
            </p>
            
            <p className="text-[#1A1818]/90 text-lg">
              A ideia é simples: te ajudar a enxergar com mais <strong className="text-[#432818]">clareza</strong> onde você está agora — e para onde pode ir com mais <strong className="text-[#432818]">intenção</strong>, <strong className="text-[#432818]">leveza</strong> e <strong className="text-[#432818]">autenticidade</strong>.
            </p>
            
            <div className="bg-gradient-to-r from-[#B89B7A]/10 to-[#432818]/10 p-6 rounded-lg border border-[#B89B7A]/20">
              <p className="text-[#432818] italic text-center font-medium text-lg">
                Responda com <strong className="text-[#432818] not-italic">sinceridade</strong>. Isso é só entre você e a sua <strong className="text-[#432818] not-italic">nova versão</strong>.
              </p>
            </div>

            <div className="flex justify-center mt-6">
              <Button 
                variant="default" 
                size="lg"
                onClick={() => setShowIntro(false)}
                className="bg-[#B89B7A] text-white"
              >
                Continuar
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-8 space-y-6 bg-white shadow-lg border-[#B89B7A]/20 mb-10">
            <div className="relative">
              {/* Only display the title here, removing it from QuizQuestion */}
              <div className="mb-8">
                <h3 className="text-xl sm:text-2xl font-playfair text-center mb-2 text-[#432818]">
                  {strategicQuestions[currentQuestionIndex].title}
                </h3>
                <p className="text-[#1A1818]/50 text-center text-xs mt-1">
                  Selecione 1 opção para avançar
                </p>
              </div>

              <QuizQuestion
                key={`strategic-${currentQuestionIndex}`}
                question={strategicQuestions[currentQuestionIndex]}
                onAnswer={handleQuestionAnswer}
                currentAnswers={currentAnswersForQuestion}
                autoAdvance={true}
                hideTitle={true}
                onNextClick={handleNextClick}
              />
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
