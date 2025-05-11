
import React, { useState, useEffect } from 'react';
import { captureUTMParameters, trackPageView } from '@/utils/analytics';
import { useRouter } from 'next/router';
import QuizOfferHero from '@/components/quiz-offer/QuizOfferHero';
import QuizOfferCTA from '@/components/quiz-offer/QuizOfferCTA';
import QuizOfferTestimonials from '@/components/quiz-offer/QuizOfferTestimonials';
import QuizOfferBenefits from '@/components/quiz-offer/QuizOfferBenefits';
import QuizOfferFAQ from '@/components/quiz-offer/QuizOfferFAQ';
import EmbeddedQuizPreview from '@/components/quiz-offer/EmbeddedQuizPreview';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface QuizOfferPageProps {
  // Add any specific props here
}

export const QuizOfferPage: React.FC<QuizOfferPageProps> = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Capture UTM parameters and track page view on component mount
  useEffect(() => {
    // Capture any UTM parameters
    captureUTMParameters();
    
    // Track page view
    trackPageView('quiz-offer');
  }, []);
  
  const handleStartMainQuiz = () => {
    setLoading(true);
    // Navigate to the main quiz
    router.push('/');
  };
  
  const handlePurchase = () => {
    setLoading(true);
    // Navigate to purchase page
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#FBF8F4]">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <LoadingSpinner size="lg" className="text-white" />
        </div>
      )}
      
      {/* Hero Section with CTA */}
      <QuizOfferHero onStartQuiz={handleStartMainQuiz} />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Left Column - 3/5 */}
          <div className="md:col-span-3 space-y-12 md:space-y-16">
            {/* Benefits Section */}
            <QuizOfferBenefits />
            
            {/* Testimonials */}
            <QuizOfferTestimonials />
            
            {/* FAQ Section */}
            <QuizOfferFAQ />
          </div>
          
          {/* Right Column - 2/5 */}
          <div className="md:col-span-2 space-y-8 md:sticky md:top-24 self-start">
            {/* Purchase CTA Card */}
            <QuizOfferCTA onPurchase={handlePurchase} />
            
            {/* Quiz Preview */}
            <EmbeddedQuizPreview onStartQuiz={handleStartMainQuiz} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizOfferPage;
