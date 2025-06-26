
import { QuizQuestion } from '@/types/quiz';
import { selfPerceptionQuestions } from './questions/selfPerceptionQuestions';
import { styleExperienceQuestions } from './questions/styleExperienceQuestions';
import { purchaseIntentQuestions } from './questions/purchaseIntentQuestions';
import { desiredOutcomesQuestions } from './questions/desiredOutcomesQuestions';

export const strategicQuestions: QuizQuestion[] = [
  ...selfPerceptionQuestions,    // Questões strategic-1 e strategic-2
  ...styleExperienceQuestions,   // Questões strategic-3 e strategic-4
  ...purchaseIntentQuestions,    // Questões strategic-5 e strategic-6
  ...desiredOutcomesQuestions    // Questão strategic-7
];
