
import React from 'react';
import QuizOfferPage from '@/pages/QuizOfferPage';

const QuizOfferPageEditor: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Editor da Página de Quiz Offer</h1>
        <div className="border rounded-lg overflow-hidden bg-white">
          <QuizOfferPage />
        </div>
      </div>
    </div>
  );
};

export default QuizOfferPageEditor;
