
import React from 'react';
import { LoadingState } from '../ui/loading-state';
import { motion } from 'framer-motion';
import QuizIntroLoading from './QuizIntroLoading';

interface LoadingManagerProps {
  isLoading: boolean;
  children?: React.ReactNode;
  message?: string;
  useQuizIntroLoading?: boolean;
}

/**
 * Gerenciador de estados de carregamento que utiliza o spinner padronizado
 * Pode usar o carregamento específico para QuizIntro ou o LoadingState genérico
 */
const LoadingManager: React.FC<LoadingManagerProps> = ({
  isLoading,
  children,
  message = 'Carregando o quiz...',
  useQuizIntroLoading = false
}) => {
  // If loading, show appropriate loading component
  if (isLoading) {
    return useQuizIntroLoading ? 
      <QuizIntroLoading /> : 
      <LoadingState message={message} spinnerSize="lg" />;
  }

  // When loaded, use framer-motion to smoothly fade in content
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

export default LoadingManager;
