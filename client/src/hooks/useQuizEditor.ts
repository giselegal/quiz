import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QuizQuestion, QuizOption } from "@/types/quiz";
import { QuizConfig } from "@/types/quiz-config";
import { toast } from "@/hooks/use-toast";

export const useQuizEditor = () => {
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const saveQuestion = useCallback(
    async (question: QuizQuestion): Promise<boolean> => {
      try {
        setSaving(true);

        // Converter ID para order_index
        const orderIndex = question.id.startsWith("strategic-")
          ? parseInt(question.id.replace("strategic-", "")) + 10
          : parseInt(question.id);

        // Atualizar a questão
        const { error: questionError } = await supabase
          .from("quiz_questions")
          .upsert({
            id: `q${orderIndex}`, // ID único baseado no order_index
            quiz_id: "550e8400-e29b-41d4-a716-446655440000",
            title: question.title,
            type: question.type,
            order_index: orderIndex,
            required_selections: question.multiSelect || 1,
            active: true,
            updated_at: new Date().toISOString(),
          });

        if (questionError) {
          throw questionError;
        }

        // Atualizar as opções
        for (const [index, option] of question.options.entries()) {
          const { error: optionError } = await supabase
            .from("question_options")
            .upsert({
              id: option.id || `q${orderIndex}_opt${index + 1}`,
              question_id: `q${orderIndex}`,
              text: option.text,
              image_url: option.imageUrl,
              style_code: option.styleCategory || "",
              points: option.points || 0,
              order_index: index + 1,
              updated_at: new Date().toISOString(),
            });

          if (optionError) {
            throw optionError;
          }
        }

        setLastSaved(new Date());
        toast({
          title: "✅ Questão salva",
          description: `Questão "${question.title}" foi salva com sucesso`,
        });

        return true;
      } catch (error) {
        console.error("Erro ao salvar questão:", error);
        toast({
          title: "❌ Erro ao salvar",
          description:
            error instanceof Error
              ? error.message
              : "Erro desconhecido ao salvar questão",
          variant: "destructive",
        });
        return false;
      } finally {
        setSaving(false);
      }
    },
    []
  );

  const saveQuizConfig = useCallback(
    async (config: QuizConfig): Promise<boolean> => {
      try {
        setSaving(true);

        // Salvar configuração do quiz
        const { error } = await supabase.from("quiz_configs").upsert({
          id: "550e8400-e29b-41d4-a716-446655440000",
          config: config,
          updated_at: new Date().toISOString(),
        });

        if (error) {
          throw error;
        }

        setLastSaved(new Date());
        toast({
          title: "✅ Configuração salva",
          description: "Configurações do quiz foram salvas com sucesso",
        });

        return true;
      } catch (error) {
        console.error("Erro ao salvar configuração:", error);
        toast({
          title: "❌ Erro ao salvar configuração",
          description:
            error instanceof Error
              ? error.message
              : "Erro desconhecido ao salvar configuração",
          variant: "destructive",
        });
        return false;
      } finally {
        setSaving(false);
      }
    },
    []
  );

  const autoSave = useCallback(
    async (
      questions: QuizQuestion[],
      config?: QuizConfig
    ): Promise<boolean> => {
      try {
        setSaving(true);
        let allSuccess = true;

        // Salvar todas as questões
        for (const question of questions) {
          const success = await saveQuestion(question);
          if (!success) allSuccess = false;
        }

        // Salvar configuração se fornecida
        if (config) {
          const success = await saveQuizConfig(config);
          if (!success) allSuccess = false;
        }

        if (allSuccess) {
          toast({
            title: "✅ Auto-salvamento concluído",
            description: "Todas as alterações foram salvas automaticamente",
          });
        }

        return allSuccess;
      } catch (error) {
        console.error("Erro no auto-salvamento:", error);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [saveQuestion, saveQuizConfig]
  );

  const validateQuiz = useCallback(
    (
      questions: QuizQuestion[]
    ): {
      isValid: boolean;
      errors: string[];
    } => {
      const errors: string[] = [];

      // Validar se todas as questões têm título
      questions.forEach((question, index) => {
        if (!question.title.trim()) {
          errors.push(`Questão ${index + 1}: Título é obrigatório`);
        }

        if (question.options.length < 2) {
          errors.push(`Questão ${index + 1}: Deve ter pelo menos 2 opções`);
        }

        question.options.forEach((option, optIndex) => {
          if (!option.text.trim()) {
            errors.push(
              `Questão ${index + 1}, Opção ${optIndex + 1}: Texto é obrigatório`
            );
          }
        });
      });

      return {
        isValid: errors.length === 0,
        errors,
      };
    },
    []
  );

  return {
    saving,
    lastSaved,
    saveQuestion,
    saveQuizConfig,
    autoSave,
    validateQuiz,
  };
};
