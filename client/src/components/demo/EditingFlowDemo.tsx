import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useQuizStyles,
  useQuizTheme,
  useQuizConfig,
} from "@/hooks/useQuizConfig";
import { Palette, Eye, Save, Download, ArrowRight } from "lucide-react";

/**
 * Demonstração Visual do Fluxo de Edição
 * Mostra como a edição no editor afeta o quiz em tempo real
 */
export const EditingFlowDemo: React.FC = () => {
  const { cssVariables, theme } = useQuizStyles();
  const { updateTheme } = useQuizTheme();
  const { state, exportConfig } = useQuizConfig();
  const [showPreview, setShowPreview] = useState(true);

  const handleColorChange = (colorKey: keyof typeof theme, value: string) => {
    updateTheme({ [colorKey]: value });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🎨 Como Funciona a Edição no Quiz Editor
          </h1>
          <p className="text-lg text-gray-600">
            Veja como suas mudanças no editor se refletem instantaneamente no
            quiz
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* PAINEL DE EDIÇÃO */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                1. Painel de Edição (Editor)
              </CardTitle>
              <p className="text-sm text-gray-600">
                Edite as configurações e veja as mudanças aplicadas
                instantaneamente
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Controles de Cor */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm">Cores do Tema</h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Cor Primária</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="color"
                        value={theme.primaryColor}
                        onChange={(e) =>
                          handleColorChange("primaryColor", e.target.value)
                        }
                        className="w-12 h-8 p-1 cursor-pointer"
                      />
                      <span className="text-xs text-gray-500 font-mono">
                        {theme.primaryColor}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">Cor de Fundo</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="color"
                        value={theme.backgroundColor}
                        onChange={(e) =>
                          handleColorChange("backgroundColor", e.target.value)
                        }
                        className="w-12 h-8 p-1 cursor-pointer"
                      />
                      <span className="text-xs text-gray-500 font-mono">
                        {theme.backgroundColor}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">Cor do Texto</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="color"
                        value={theme.textColor}
                        onChange={(e) =>
                          handleColorChange("textColor", e.target.value)
                        }
                        className="w-12 h-8 p-1 cursor-pointer"
                      />
                      <span className="text-xs text-gray-500 font-mono">
                        {theme.textColor}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">Cor Secundária</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="color"
                        value={theme.secondaryColor}
                        onChange={(e) =>
                          handleColorChange("secondaryColor", e.target.value)
                        }
                        className="w-12 h-8 p-1 cursor-pointer"
                      />
                      <span className="text-xs text-gray-500 font-mono">
                        {theme.secondaryColor}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status da Sincronização */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Sincronização Ativa</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {state.isDirty
                    ? "Salvando mudanças..."
                    : "Configurações salvas"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Versão: {state.current.version}
                </p>
              </div>

              {/* Ações Rápidas */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Ações Rápidas</h4>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      updateTheme({
                        primaryColor: "#FF6B6B",
                        backgroundColor: "#FFF5E6",
                        textColor: "#2D3748",
                      });
                    }}
                  >
                    Tema Coral
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      updateTheme({
                        primaryColor: "#4ECDC4",
                        backgroundColor: "#F0F8FF",
                        textColor: "#1A202C",
                      });
                    }}
                  >
                    Tema Turquesa
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PREVIEW DO QUIZ */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                2. Preview do Quiz (Tempo Real)
              </CardTitle>
              <p className="text-sm text-gray-600">
                Veja como o quiz aparece com suas configurações
              </p>
            </CardHeader>
            <CardContent>
              {/* Simulação do Quiz */}
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 space-y-4"
                style={cssVariables}
              >
                <div className="text-center space-y-4">
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: "var(--quiz-text-color)" }}
                  >
                    Descubra Seu Estilo
                  </h2>

                  <p
                    className="text-base"
                    style={{ color: "var(--quiz-text-secondary-color)" }}
                  >
                    Complete o quiz e descubra qual é o seu estilo predominante
                  </p>

                  <div className="w-full max-w-sm mx-auto">
                    <Input
                      placeholder="Digite seu nome..."
                      className="mb-4"
                      style={{
                        backgroundColor: "var(--quiz-bg-color)",
                        borderColor: "var(--quiz-primary-color)",
                        color: "var(--quiz-text-color)",
                      }}
                    />

                    <Button
                      className="w-full"
                      style={{
                        backgroundColor: "var(--quiz-primary-color)",
                        color: "var(--quiz-bg-color)",
                        borderRadius: "var(--quiz-border-radius)",
                      }}
                    >
                      Começar Quiz
                    </Button>
                  </div>

                  <div
                    className="mt-6 p-4 rounded-lg"
                    style={{
                      backgroundColor: "var(--quiz-primary-color)",
                      opacity: 0.1,
                    }}
                  >
                    <p
                      className="text-sm"
                      style={{ color: "var(--quiz-text-color)" }}
                    >
                      💡 Esta é uma prévia de como seu quiz aparecerá
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FLUXO DE SINCRONIZAÇÃO */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="w-5 h-5" />
              3. Fluxo de Sincronização Inteligente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                  1
                </div>
                <h4 className="font-semibold text-sm mb-1">Edição</h4>
                <p className="text-xs text-gray-600">
                  Você muda uma cor no editor
                </p>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                  2
                </div>
                <h4 className="font-semibold text-sm mb-1">Context Update</h4>
                <p className="text-xs text-gray-600">
                  React Context atualiza o estado
                </p>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                  3
                </div>
                <h4 className="font-semibold text-sm mb-1">CSS Variables</h4>
                <p className="text-xs text-gray-600">
                  Variáveis CSS são atualizadas
                </p>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                  4
                </div>
                <h4 className="font-semibold text-sm mb-1">Quiz Atualizado</h4>
                <p className="text-xs text-gray-600">
                  Todos os componentes refletem a mudança
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Tecnologias Envolvidas:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  React Context
                </span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                  CSS Variables
                </span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  localStorage
                </span>
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">
                  TypeScript
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
