
import React, { useState } from 'react';
import QuizIntro from '@/components/QuizIntro';
import QuizPage from '@/components/QuizPage';

const HomePage: React.FC = () => {
  const [showQuiz, setShowQuiz] = useState(false);

  const handleStart = (nome: string, email?: string) => {
    console.log('Quiz started by:', nome, email);
    setShowQuiz(true);
  };

  return (
    <div>
      {showQuiz ? <QuizPage /> : <QuizIntro onStart={handleStart} />}
    </div>
  );
};

export default HomePage;
