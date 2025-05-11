
import React, { useEffect } from 'react';
import { useQuizContext } from '../context/QuizContext';
import { useRouter } from 'next/router';
import ResultStyleCard from '../components/result/ResultStyleCard';
import ResultActionButtons from '../components/result/ResultActionButtons';
import { trackButtonClick } from '../utils/analytics';

// Define StyleResult type with imageUrl
interface StyleResult {
  category: string;
  percentage: number;
  score: number;
  imageUrl?: string; // Add the missing imageUrl property
}

interface ResultPageProps {
  // Add any props if needed
}

const ResultPage: React.FC<ResultPageProps> = () => {
  const { quizState } = useQuizContext();
  const router = useRouter();
  
  // Example style result data
  const styleResults: StyleResult[] = [
    { 
      category: 'Contemporâneo', 
      percentage: 50, 
      score: 15,
      imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1687095491/style-quiz/contemporaneo-6_riqfun.jpg'
    },
    { 
      category: 'Romântico', 
      percentage: 30, 
      score: 9,
      imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1687095492/style-quiz/romantico-6_nkahb3.jpg'
    },
    { 
      category: 'Elegante', 
      percentage: 20, 
      score: 6,
      imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1687095491/style-quiz/elegante-6_u1ghdr.jpg'
    }
  ];
  
  // Sort results by percentage (highest first)
  const sortedResults = [...styleResults].sort((a, b) => b.percentage - a.percentage);
  
  // Primary style is the highest percentage
  const primaryStyle = sortedResults[0];
  
  // Secondary styles are the rest
  const secondaryStyles = sortedResults.slice(1);

  // Effect for analytics
  useEffect(() => {
    // Track result page view
    if (primaryStyle) {
      // Call trackResultView with primaryStyle.category
    }
  }, [primaryStyle]);

  // Handle restart quiz
  const handleRestartQuiz = () => {
    trackButtonClick('restart-quiz', 'Refazer o Quiz', 'result-page');
    router.push('/');
  };
  
  // Handle view style guide
  const handleViewStyleGuide = () => {
    trackButtonClick('view-style-guide', 'Ver Guia de Estilo', 'result-page');
    router.push('/style-guide');
  };

  // Handle share result
  const handleShareResult = () => {
    trackButtonClick('share-result', 'Compartilhar Resultado', 'result-page');
    // Implement share functionality
  };

  return (
    <div className="min-h-screen bg-[#FBF8F4] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-playfair font-bold text-[#432818] mb-2">
            Seu Estilo Predominante
          </h1>
          <p className="text-[#432818] opacity-80">
            Baseado nas suas respostas, analisamos seu perfil de estilo
          </p>
        </div>
        
        {/* Primary Style Result */}
        {primaryStyle && (
          <div className="mb-8">
            <h2 className="font-playfair text-xl text-[#432818] mb-3">
              Estilo Principal: <span className="font-bold">{primaryStyle.category}</span>
            </h2>
            <ResultStyleCard
              styleCategory={primaryStyle.category}
              percentage={primaryStyle.percentage}
              isPrimary={true}
              imageUrl={primaryStyle.imageUrl}
            />
          </div>
        )}
        
        {/* Secondary Style Results */}
        {secondaryStyles.length > 0 && (
          <div className="mb-8">
            <h2 className="font-playfair text-xl text-[#432818] mb-3">
              Estilos Secundários
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {secondaryStyles.map((style, index) => (
                <ResultStyleCard
                  key={`${style.category}-${index}`}
                  styleCategory={style.category}
                  percentage={style.percentage}
                  isPrimary={false}
                  imageUrl={style.imageUrl}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <ResultActionButtons
          onRestartQuiz={handleRestartQuiz}
          onViewStyleGuide={handleViewStyleGuide}
          onShareResult={handleShareResult}
        />
      </div>
    </div>
  );
};

export default ResultPage;
