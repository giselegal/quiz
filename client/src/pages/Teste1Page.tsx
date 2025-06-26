import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, Edit, Download, Globe } from "lucide-react";

interface QuizFunnel {
  id: string;
  title: string;
  description: string;
  pages: Array<{
    id: string;
    title: string;
    type: string;
    components: Array<{
      id: string;
      type: string;
      data: Record<string, unknown>;
    }>;
  }>;
  config: {
    domain?: string;
    seo?: {
      title?: string;
      description?: string;
      keywords?: string;
    };
    pixel?: {
      facebookPixelId?: string;
      googleAnalyticsId?: string;
    };
    utm?: Record<string, string>;
    scoring?: Record<string, unknown>;
    results?: Record<string, unknown>;
  };
  createdAt: string;
  updatedAt: string;
}

const Teste1Page = () => {
  const navigate = useNavigate();
  const [savedFunnel, setSavedFunnel] = useState<QuizFunnel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carregar dados salvos do editor
    const loadSavedData = () => {
      try {
        const funnelData = localStorage.getItem("quiz_funnel_config");
        const configData = localStorage.getItem("quiz_config");
        const editorData = localStorage.getItem("quiz_editor_data");

        if (editorData) {
          const parsed = JSON.parse(editorData);
          setSavedFunnel(parsed);
        } else if (funnelData && configData) {
          const funnel = JSON.parse(funnelData);
          const config = JSON.parse(configData);
          setSavedFunnel({
            id: "quiz-1",
            title: funnel.title || "Quiz Descubra Seu Estilo",
            description:
              funnel.description || "Quiz personalizado criado no editor",
            pages: funnel.pages || [],
            config: config,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedData();
  }, []);

  const handlePreview = () => {
    // Ir para a rota de preview do quiz
    navigate("/quiz-preview");
  };

  const handleEdit = () => {
    // Voltar ao editor
    navigate("/simple-editor");
  };

  const handlePublish = () => {
    // Simular processo de publicação
    alert(
      "🚀 Processo de publicação iniciado!\n\n" +
        "1. Validando configurações...\n" +
        "2. Gerando build de produção...\n" +
        "3. Publicando no domínio configurado...\n\n" +
        "O quiz será publicado em breve!"
    );
  };

  const handleExport = () => {
    // Exportar configurações
    if (savedFunnel) {
      const dataStr = JSON.stringify(savedFunnel, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `quiz-config-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando modelo de produção...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/simple-editor")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Editor
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Modelo de Produção - Teste1
              </h1>
              <p className="text-gray-600">
                Visualize como será o quiz publicado
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Rota de Teste
            </Badge>
            <Button
              onClick={() => navigate("/simple-editor")}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>

        {/* Dinâmica de Funcionamento */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Como Funciona a Dinâmica de Publicação
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800">
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">🛠️ No Editor:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Você cria/edita o quiz no SimpleDragDropEditor</li>
                    <li>• Clica em "Salvar" - dados vão para localStorage</li>
                    <li>• Pode visualizar em tempo real na aba "Preview"</li>
                    <li>
                      • Configura domínio, SEO, pixels na aba "Configurações"
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">🚀 Na Publicação:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Clica em "Publicar" no editor</li>
                    <li>• Sistema gera build de produção</li>
                    <li>• Deploy automático via GitHub Actions</li>
                    <li>• Quiz fica disponível no domínio configurado</li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-blue-200 pt-4">
                <h4 className="font-semibold mb-2">📊 Fluxo Completo:</h4>
                <div className="flex items-center gap-2 text-sm">
                  <span className="bg-blue-200 px-2 py-1 rounded">Editor</span>
                  <span>→</span>
                  <span className="bg-green-200 px-2 py-1 rounded">
                    Preview (/quiz-preview)
                  </span>
                  <span>→</span>
                  <span className="bg-yellow-200 px-2 py-1 rounded">
                    Teste (/teste1)
                  </span>
                  <span>→</span>
                  <span className="bg-purple-200 px-2 py-1 rounded">
                    Produção (domínio configurado)
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status do Quiz */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>📊 Status do Quiz</CardTitle>
            </CardHeader>
            <CardContent>
              {savedFunnel ? (
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-green-700">
                      ✅ Quiz Configurado
                    </p>
                    <p className="text-sm text-gray-600">{savedFunnel.title}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Páginas:</p>
                      <p className="text-gray-600">
                        {savedFunnel.pages?.length || 0}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Última atualização:</p>
                      <p className="text-gray-600">
                        {savedFunnel.updatedAt
                          ? new Date(savedFunnel.updatedAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Domínio configurado:</p>
                    <p className="text-gray-600">
                      {savedFunnel.config?.domain || "Não configurado"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-yellow-700">⚠️ Nenhum quiz configurado</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Vá ao editor para criar seu quiz
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🔧 Ações Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  onClick={handlePreview}
                  className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Eye className="w-4 h-4" />
                  Visualizar Preview
                </Button>

                <Button
                  onClick={handleEdit}
                  variant="outline"
                  className="w-full flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Editar Quiz
                </Button>

                <Button
                  onClick={handleExport}
                  variant="outline"
                  className="w-full flex items-center gap-2"
                  disabled={!savedFunnel}
                >
                  <Download className="w-4 h-4" />
                  Exportar Configuração
                </Button>

                <Button
                  onClick={handlePublish}
                  className="w-full flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  disabled={!savedFunnel}
                >
                  <Globe className="w-4 h-4" />
                  Publicar em Produção
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detalhes da Configuração */}
        {savedFunnel && (
          <Card>
            <CardHeader>
              <CardTitle>⚙️ Detalhes da Configuração</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">SEO</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Título:</span>
                      <p className="text-gray-600">
                        {savedFunnel.config?.seo?.title || "Não configurado"}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Descrição:</span>
                      <p className="text-gray-600">
                        {savedFunnel.config?.seo?.description ||
                          "Não configurado"}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Tracking</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Facebook Pixel:</span>
                      <p className="text-gray-600">
                        {savedFunnel.config?.pixel?.facebookPixelId ||
                          "Não configurado"}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Google Analytics:</span>
                      <p className="text-gray-600">
                        {savedFunnel.config?.pixel?.googleAnalyticsId ||
                          "Não configurado"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Teste1Page;
