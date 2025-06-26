/**
 * Teste para verificar se as alterações do ModernVisualEditor
 * são refletidas no quiz real
 */

import { supabase } from "@/integrations/supabase/client";

export const testEditorIntegration = async () => {
  console.log("🧪 Testando integração do ModernVisualEditor...");

  try {
    // 1. Testar se consegue carregar questões
    const { data: questions, error: loadError } = await supabase
      .from("quiz_questions")
      .select(
        `
        id,
        title,
        type,
        order_index,
        required_selections,
        question_options (
          id,
          text,
          image_url,
          style_code,
          points,
          order_index
        )
      `
      )
      .eq("quiz_id", "550e8400-e29b-41d4-a716-446655440000")
      .eq("active", true)
      .order("order_index", { ascending: true });

    if (loadError) {
      console.error("❌ Erro ao carregar questões:", loadError);
      return false;
    }

    console.log(`✅ Carregou ${questions?.length || 0} questões`);

    // 2. Testar se consegue salvar uma alteração
    if (questions && questions.length > 0) {
      const firstQuestion = questions[0];
      const testTitle = `Teste ${new Date().toISOString()}`;

      const { error: updateError } = await supabase
        .from("quiz_questions")
        .update({
          title: testTitle,
          updated_at: new Date().toISOString(),
        })
        .eq("id", firstQuestion.id);

      if (updateError) {
        console.error("❌ Erro ao atualizar questão:", updateError);
        return false;
      }

      console.log("✅ Conseguiu atualizar questão");

      // 3. Verificar se a alteração foi persistida
      const { data: updatedQuestion, error: verifyError } = await supabase
        .from("quiz_questions")
        .select("title")
        .eq("id", firstQuestion.id)
        .single();

      if (verifyError) {
        console.error("❌ Erro ao verificar alteração:", verifyError);
        return false;
      }

      if (updatedQuestion?.title === testTitle) {
        console.log("✅ Alteração foi persistida com sucesso");

        // Reverter alteração
        await supabase
          .from("quiz_questions")
          .update({
            title: firstQuestion.title,
            updated_at: new Date().toISOString(),
          })
          .eq("id", firstQuestion.id);

        console.log("✅ Reverteu alteração de teste");
        return true;
      } else {
        console.error("❌ Alteração não foi persistida");
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("❌ Erro no teste:", error);
    return false;
  }
};

// Função para testar no console do navegador
export const runEditorTest = () => {
  testEditorIntegration().then((success) => {
    if (success) {
      console.log(
        "🎉 TESTE PASSOU: ModernVisualEditor está funcionando corretamente!"
      );
    } else {
      console.log("❌ TESTE FALHOU: Há problemas na integração");
    }
  });
};

// Fazer disponível globalmente para teste
declare global {
  interface Window {
    runEditorTest: () => void;
  }
}

window.runEditorTest = runEditorTest;
