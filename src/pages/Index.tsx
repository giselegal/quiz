
import { useState, useEffect } from 'react';
import QuizIntro from '../components/QuizIntro';
import QuizPage from '../components/QuizPage';
import { useQuizContext } from '../context/QuizContext';
import { preloadCriticalImages } from '@/utils/images/preload-critical';
import usePerformanceMonitoring from '@/hooks/usePerformanceMonitoring';

const Index = () => {
  const [started, setStarted] = useState(false);
  const { startQuiz } = useQuizContext();
  
  // Use our performance monitoring hook
  usePerformanceMonitoring();

  // Preload critical images when the page loads
  useEffect(() => {
    // Preload intro images first with high priority
    const introImage = "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp";
    preloadCriticalImages([introImage], { quality: 95, timeout: 2000 });
    
    // Start preloading quiz images in background
    setTimeout(() => {
      const quizImages = [
        // Add your quiz images URLs here
      ];
      
      if (quizImages.length > 0) {
        preloadCriticalImages(quizImages, { 
          quality: 85, 
          batchSize: 3,
          timeout: 5000
        });
      }
    }, 2000);
  }, []);

  const handleStart = async (name: string) => {
    setStarted(true);
    console.log(`Quiz started by ${name}`);
    localStorage.setItem('userName', name);
    localStorage.setItem('quiz_start_time', Date.now().toString());
    
    // Preload quiz images when starting the quiz
    const strategicImages = [
      // Add your strategic images URLs here
    ];
    
    if (strategicImages.length > 0) {
      preloadCriticalImages(strategicImages, { quality: 80 });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {!started ? (
        <QuizIntro onStart={handleStart} />
      ) : (
        <QuizPage />
      )}
    </div>
  );
};

export default Index;
