
import { useState, useEffect } from 'react';
import QuizIntro from '../components/QuizIntro';
import QuizPage from '../components/QuizPage';
import { useQuizContext } from '../context/QuizContext';
import { preloadCriticalImages } from '@/utils/imageManager';

const Index = () => {
  const [started, setStarted] = useState(false);
  const { startQuiz } = useQuizContext();

  // Preload critical images when the page loads
  useEffect(() => {
    // Preload intro images first
    preloadCriticalImages('intro');
  }, []);

  const handleStart = async (name: string) => {
    setStarted(true);
    console.log(`Quiz started by ${name}`);
    localStorage.setItem('userName', name);
    
    // Preload quiz images when starting the quiz
    preloadCriticalImages('quiz');
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
