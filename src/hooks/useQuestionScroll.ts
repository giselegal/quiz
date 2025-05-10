import { useCallback } from 'react';

export const useQuestionScroll = () => {
  const scrollToQuestion = useCallback((questionId: string) => {
    // Scroll no título da questão, não no container
    const titleElement = document.getElementById(`question-title-${questionId}`);
    if (titleElement) {
      titleElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    // Fallback: scroll no container da questão
    const questionElement = document.getElementById(`question-${questionId}`);
    if (questionElement) {
      questionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return { scrollToQuestion };
};
