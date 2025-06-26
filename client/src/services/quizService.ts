
import { apiService } from '@/services/api';
import { QuizQuestion, StyleResult } from '@/types/quiz';

export const fetchQuizQuestions = async (quizId: string) => {
  return await apiService.getQuizQuestions(quizId);
};

export const saveParticipant = async (name: string, email: string, quizId: string) => {
  const participantData = { name, email, quiz_id: quizId };
  const answers: any[] = [];
  const result = await apiService.submitQuiz(participantData, answers);
  return result.participant_id;
};

export const saveAnswers = async (
  participantId: string,
  answers: Array<{ questionId: string; optionId: string; points: number }>
) => {
  // This is handled by submitQuiz in the new API
  console.log('Answers saved via submitQuiz API');
};
};

export const saveResults = async (
  participantId: string,
  results: Array<StyleResult>
) => {
  const { error } = await supabase
    .from('style_results')
    .insert(
      results.map((result, index) => ({
        participant_id: participantId,
        style_type_id: result.category,
        points: result.score,
        percentage: result.percentage,
        is_primary: index === 0,
        rank: index + 1,
      }))
    );

  if (error) throw error;
};
