
import { useCallback } from 'react';

export const useQuestionScroll = () => {
  const scrollToQuestion = useCallback((questionId: string) => {
    const questionElement = document.getElementById(`question-${questionId}`);
    if (questionElement) {
      questionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  return { scrollToQuestion };
};
