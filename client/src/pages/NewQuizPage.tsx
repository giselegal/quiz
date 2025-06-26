import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuizRuntime } from "@/hooks/useQuizRuntime";
import { QuizElementRenderer } from "@/components/quiz/QuizElementRenderer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Edit, RefreshCw } from "lucide-react";

export const NewQuizPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    config,
    loading,
    error,
    currentStep,
    nextStep,
    previousStep,
    saveAnswer,
    hasEditorConfig,
  } = useQuizRuntime();

  const [formData, setFormData] = useState<Record<string, string>>({});

  // Handler para clique em botão
  const handleButtonClick = useCallback(
    (action: string) => {
      console.log("Botão clicado:", action);

      if (action === "next") {
        const moved = nextStep();
        if (!moved) {
          // Chegou ao final - ir para resultado
          navigate("/resultado");
        }
      } else if (action === "previous") {
        previousStep();
      } else if (action.startsWith("option-")) {
        const optionIndex = parseInt(action.split("-")[1]);
        const questionKey = currentStep?.id || "unknown";

        // Encontrar a opção selecionada e seus pontos
        const quizElement = currentStep?.elements.find(
          (el) => el.type === "quiz-options"
        );
        const selectedOption = quizElement?.content.options?.[optionIndex];

        if (selectedOption) {
          saveAnswer(
            questionKey,
            selectedOption.text,
            selectedOption.points || 0
          );
          console.log(
            `Resposta salva: ${selectedOption.text} (${selectedOption.points} pontos)`
          );

          // Avançar automaticamente após responder
          setTimeout(() => {
            const moved = nextStep();
            if (!moved) {
              navigate("/resultado");
            }
          }, 500);
        }
      }
    },
    [currentStep, nextStep, previousStep, saveAnswer, navigate]
  );

  // Handler para mudança em input
  const handleInputChange = useCallback(
    (name: string, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Salvar resposta imediatamente
      if (currentStep) {
        saveAnswer(`${currentStep.id}-${name}`, value);
      }
    },
    [currentStep, saveAnswer]
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <RefreshCw className="w-8 h-8 animate-spin text-purple-400 mx-auto" />
          <p className="text-white">Carregando quiz...</p>
        </div>
      </div>
    );
  }

  // Error state - sem configuração do editor
  if (error || !hasEditorConfig()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-6">
          <div className="text-6xl">⚙️</div>
          <h1 className="text-2xl font-bold text-white">
            Quiz não configurado
          </h1>
          <p className="text-zinc-300">
            {error ||
              "Nenhuma configuração de quiz foi encontrada. Configure o quiz no editor primeiro."}
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => navigate("/modern-editor")}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              Ir para o Editor
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="w-full border-zinc-700 text-white hover:bg-zinc-800"
            >
              Voltar ao Início
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz não iniciado
  if (!config || !currentStep) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-white">Erro ao carregar etapa do quiz</p>
          <Button onClick={() => window.location.reload()}>Recarregar</Button>
        </div>
      </div>
    );
  }

  const progress = ((config.currentStepIndex + 1) / config.totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-purple-900 to-violet-900">
      {/* Header com progresso */}
      <div className="sticky top-0 z-10 bg-black/20 backdrop-blur-lg border-b border-zinc-800">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-white font-semibold">{currentStep.name}</h1>
            <span className="text-zinc-400 text-sm">
              {config.currentStepIndex + 1} de {config.totalSteps}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="space-y-8">
          {/* Renderizar elementos da etapa atual */}
          {currentStep.elements.map((element) => (
            <QuizElementRenderer
              key={element.id}
              element={element}
              onButtonClick={handleButtonClick}
              onInputChange={handleInputChange}
              className="animate-fade-in"
            />
          ))}
        </div>

        {/* Navegação */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-zinc-800">
          <Button
            variant="outline"
            onClick={() => handleButtonClick("previous")}
            disabled={config.currentStepIndex === 0}
            className="border-zinc-700 text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          <div className="text-center">
            <p className="text-zinc-400 text-sm">
              Pontuação atual:{" "}
              <span className="text-purple-400 font-bold">{config.score}</span>
            </p>
          </div>

          <Button
            onClick={() => handleButtonClick("next")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {config.currentStepIndex === config.totalSteps - 1
              ? "Finalizar"
              : "Próximo"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Debug info (apenas em desenvolvimento) */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs">
          <div>
            Etapa: {config.currentStepIndex + 1}/{config.totalSteps}
          </div>
          <div>Elementos: {currentStep.elements.length}</div>
          <div>Pontos: {config.score}</div>
        </div>
      )}
    </div>
  );
};
