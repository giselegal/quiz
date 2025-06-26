
import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { QuizQuestion, QuizOption } from '@/types/quiz';

interface SupabaseQuizQuestion {
  id: string;
  title: string;
  type: string;
  order_index: number;
  required_selections: number;
  question_options: SupabaseQuizOption[];
}

interface SupabaseQuizOption {
  id: string;
  text: string;
  image_url?: string;
  style_code: string;
  points: number;
  order_index: number;
}

export const useSupabaseQuestions = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [strategicQuestions, setStrategicQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      
      // Buscar questões regulares (1-10) e estratégicas (11-17)
      const questionsData = await apiService.getQuizQuestions('550e8400-e29b-41d4-a716-446655440000');

      if (questionsData) {
        // Separar questões regulares das estratégicas
        const regularQuestions: QuizQuestion[] = [];
        const strategicQuestions: QuizQuestion[] = [];

        questionsData.forEach((q: SupabaseQuizQuestion) => {
          const options: QuizOption[] = q.question_options
            .sort((a, b) => a.order_index - b.order_index)
            .map(opt => ({
              id: opt.id,
              text: opt.text,
              imageUrl: opt.image_url,
              styleCategory: opt.style_code,
              points: opt.points
            }));

          const question: QuizQuestion = {
            id: q.order_index.toString(), // Usar order_index como ID para compatibilidade
            title: q.title,
            type: q.type as 'image' | 'text' | 'both',
            options,
            multiSelect: q.required_selections
          };

          if (q.order_index <= 10) {
            regularQuestions.push(question);
          } else {
            // Para questões estratégicas, ajustar o ID para o formato esperado
            const strategicId = `strategic-${q.order_index - 10}`;
            strategicQuestions.push({
              ...question,
              id: strategicId
            });
          }
        });

        setQuestions(regularQuestions);
        setStrategicQuestions(strategicQuestions);
        
        console.log(`✅ Loaded ${regularQuestions.length} regular questions and ${strategicQuestions.length} strategic questions from Supabase`);
      }
    } catch (err: any) {
      console.error('❌ Error loading questions from Supabase:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    questions,
    strategicQuestions,
    loading,
    error,
    refetch: loadQuestions
  };
};
