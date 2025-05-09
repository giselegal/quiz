
import { StyleResult, QuizResult } from '@/types/quiz';
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

export const useQuiz = () => {
  const [primaryStyle, setPrimaryStyle] = useState<StyleResult | null>(null);
  const [secondaryStyles, setSecondaryStyles] = useState<StyleResult[]>([]);
  const [isSubmittingResults, setIsSubmittingResults] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    try {
      const savedResult = localStorage.getItem('quizResult');
      if (savedResult) {
        const parsedResult = JSON.parse(savedResult) as QuizResult;
        setPrimaryStyle(parsedResult.primaryStyle);
        setSecondaryStyles(parsedResult.secondaryStyles || []);
      } else {
        console.log('No quiz result found in localStorage');
        // If we're in development or on the editor page, use mock data
        if (window.location.href.includes('/admin/editor') || process.env.NODE_ENV === 'development') {
          console.log('Using mock data for editor');
          setPrimaryStyle({
            category: 'Romântico',
            score: 8,
            percentage: 30
          });
          setSecondaryStyles([
            {
              category: 'Sexy',
              score: 7,
              percentage: 26
            },
            {
              category: 'Dramático',
              score: 4,
              percentage: 15
            }
          ]);
        }
      }
    } catch (error) {
      console.error('Error loading quiz result:', error);
    }
  }, []);

  const startQuiz = async (name: string, email: string, quizId: string) => {
    try {
      console.log(`Starting quiz for ${name} (${email}) with quiz ID ${quizId}`);
      return { id: '1', name, email };
    } catch (error) {
      toast({
        title: "Erro ao iniciar o quiz",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const submitAnswers = async (
    answers: Array<{ questionId: string; optionId: string; points: number }>
  ) => {
    try {
      console.log('Submitting answers:', answers);
    } catch (error) {
      toast({
        title: "Erro ao salvar respostas",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const submitResults = async (results: QuizResult, clickOrder: string[]) => {
    try {
      setIsSubmittingResults(true);
      console.log("Results submitted:", results);
      
      // Save results to localStorage
      localStorage.setItem('quizResult', JSON.stringify(results));
      
      // Update state
      setPrimaryStyle(results.primaryStyle);
      setSecondaryStyles(results.secondaryStyles || []);
      
      // Implement tie-breaking logic based on click order
      if (results.secondaryStyles.length > 1) {
        results.secondaryStyles.sort((a, b) => {
          if (a.score === b.score) {
            return clickOrder.indexOf(a.category) - clickOrder.indexOf(b.category);
          }
          return b.score - a.score;
        });
      }
      
      // Start preloading results page images
      // (we'll handle this in the transition component)
      
      return true; // Return success flag instead of redirecting
    } catch (error) {
      toast({
        title: "Erro ao salvar resultados",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
      setIsSubmittingResults(false);
      throw error;
    }
  };
  
  const navigateToResults = () => {
    navigate('/resultado');
  };
  
  return {
    primaryStyle,
    secondaryStyles,
    isSubmittingResults,
    startQuiz,
    submitAnswers,
    submitResults,
    navigateToResults
  };
};

export default useQuiz;
