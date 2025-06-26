
import React from "react";
import {
  useQuizConfig,
  useQuizTheme,
  useQuizStyles,
} from "@/hooks/useQuizConfig";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const QuizConfigTest: React.FC = () => {
  const { state, exportConfig } = useQuizConfig();
  const { theme, updateTheme } = useQuizTheme();
  const { cssVariables } = useQuizStyles();

  const testColorChange = async () => {
    await updateTheme({
      primaryColor: "#FF6B6B",
      backgroundColor: "#FFF5E6",
      textColor: "#2D3748",
    });
    console.log("Cores alteradas:", {
      primaryColor: "#FF6B6B",
      backgroundColor: "#FFF5E6",
    });
  };

  const testColorChange2 = async () => {
    await updateTheme({
      primaryColor: "#4ECDC4",
      backgroundColor: "#F0F8FF",
      textColor: "#1A202C",
    });
    console.log("Cores alteradas:", {
      primaryColor: "#4ECDC4",
      backgroundColor: "#F0F8FF",
    });
  };

  const handleExport = () => {
    const configData = exportConfig();
    const configJson = JSON.stringify(configData, null, 2);
    navigator.clipboard.writeText(configJson);
    console.log("Configuração exportada para clipboard:", configJson);
  };

  return (
    <div className="p-8 space-y-6" style={cssVariables}>
      <Card className="p-6">
        <h2
          className="text-2xl font-bold mb-4"
          style={{ color: "var(--quiz-primary-color)" }}
        >
          Teste de Sincronização Inteligente
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Estado Atual</h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Cor Primária:</strong> {theme.primaryColor}
              </p>
              <p>
                <strong>Cor de Fundo:</strong> {theme.backgroundColor}
              </p>
              <p>
                <strong>Cor do Texto:</strong> {theme.textColor}
              </p>
              <p>
                <strong>Dirty:</strong> {state?.isDirty ? "Sim" : "Não"}
              </p>
              <p>
                <strong>Loading:</strong> {state?.isLoading ? "Sim" : "Não"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Ações de Teste</h3>
            <div className="flex flex-wrap gap-2">
              <Button onClick={testColorChange} size="sm">
                Teste Coral
              </Button>
              <Button onClick={testColorChange2} size="sm">
                Teste Turquesa
              </Button>
              <Button onClick={handleExport} size="sm" variant="outline">
                Exportar
              </Button>
            </div>
          </div>
        </div>

        <div
          className="mt-6 p-4 rounded-lg"
          style={{
            backgroundColor: "var(--quiz-primary-color)",
            color: "var(--quiz-bg-color)",
          }}
        >
          <p className="text-center font-medium">
            Este painel muda de cor automaticamente quando você altera as
            configurações!
          </p>
        </div>
      </Card>
    </div>
  );
};
