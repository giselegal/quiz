import React from "react";
import QuizResult from "@/components/QuizResult";

export const ResultPage: React.FC = () => {
  // Get result directly from localStorage
  const getQuizResult = () => {
    try {
      const savedResult = localStorage.getItem('quizResult');
      if (savedResult) {
        return JSON.parse(savedResult);
      }
      return null;
    } catch (error) {
      console.error('Error loading quiz result:', error);
      return null;
    }
  };

  const result = getQuizResult();

  if (!result) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light text-[#2C2C2C] mb-4">
            Nenhum resultado encontrado
          </h1>
          <p className="text-[#4A4A4A] mb-6">
            Por favor, complete o quiz primeiro.
          </p>
          <a
            href="/quiz-descubra-seu-estilo"
            className="bg-[#8B4513] hover:bg-[#7A3E12] text-white px-8 py-3 rounded-full 
                     transition-all duration-300 inline-block"
          >
            Fazer Quiz
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <QuizResult
        primaryStyle={result.primaryStyle}
        secondaryStyles={result.secondaryStyles}
        previewMode={false}
        onReset={() => {
          localStorage.clear();
          window.location.href = "/quiz-descubra-seu-estilo";
        }}
      />
    </div>
  );
};

export default ResultPage;