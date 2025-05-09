import { useState, useEffect } from 'react';
import QuizIntro from '../components/QuizIntro';
import QuizPage from '../components/QuizPage';
import { useQuizContext } from '../context/QuizContext';
import { useAuth } from '../context/AuthContext';
import { trackLeadGeneration, trackQuizStart, captureUTMParameters } from '@/utils/analytics';
import { useUtmParameters } from '@/hooks/useUtmParameters';
import { LoadingState } from '@/components/ui/loading-state';

const HomePage = () => {
  const [started, setStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { startQuiz } = useQuizContext();
  const { login } = useAuth();
  const { captureUtmParameters, utmParams } = useUtmParameters();

  // Defer non-critical initialization
  useEffect(() => {
    // Register the time of start for calculating the quiz completion time later
    localStorage.setItem('page_load_time', Date.now().toString());
    
    // Execute critical tasks immediately
    captureUTMParameters();
    
    // Defer non-critical tasks
    const timer = setTimeout(() => {
      import('@/utils/analytics').then(analytics => {
        analytics.initFacebookPixel();
      });
      
      // Log UTM parameters if they exist
      if (Object.keys(utmParams).length > 0) {
        console.log('UTM parameters on page load:', utmParams);
        
        // Check if user came from a Facebook campaign
        if (utmParams.source === 'facebook' || utmParams.fbclid) {
          console.log('User came from Facebook campaign');
        }
      }
      
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [utmParams]);

  const handleStart = async (name: string, email?: string) => {
    setStarted(true);
    login(name);
    
    // Save the official quiz start timestamp
    localStorage.setItem('quiz_start_time', Date.now().toString());
    
    // Track quiz start with user data and UTM parameters
    trackQuizStart(name, email);
    
    // If email was provided, register as lead
    if (email) {
      trackLeadGeneration(email);
    }
    
    console.log(`Quiz started by ${name}${email ? ` (${email})` : ''}`);
    localStorage.setItem('userName', name);
    if (email) localStorage.setItem('userEmail', email);
  };

  if (isLoading) {
    return <LoadingState message="Carregando quiz..." />;
  }

  return (
    <div className="bg-background">
      {!started ? (
        <QuizIntro onStart={handleStart} />
      ) : (
        <QuizPage />
      )}
    </div>
  );
};

export default HomePage;
