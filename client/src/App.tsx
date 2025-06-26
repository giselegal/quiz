import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import QuizPage from "@/components/QuizPage";
import QuizDescubraSeuEstilo from "@/pages/quiz-descubra-seu-estilo";
import ResultPage from "@/pages/ResultPage";
import UnifiedEditorPage from "@/pages/UnifiedEditorPage";
import ModernEditorPage from "@/pages/ModernEditorPage";
import CaktoEditorPage from "@/pages/CaktoEditorPage";
import EditorTest from "@/pages/EditorTest";
import QuizIntro from "@/components/QuizIntro";
import QuizOfferPageVisualEditor from "@/components/editors/QuizOfferPageVisualEditor";
import AdvancedQuizEditor from "@/components/visual-editor/AdvancedQuizEditor"
import CaktoQuizEditorPage from "@/pages/CaktoQuizEditorPage";
import CaktoQuizEditorSimple from "@/components/caktoquiz-editor/CaktoQuizEditorSimple";
import CaktoQuizEditorAdvanced from "@/components/caktoquiz-editor/CaktoQuizEditorAdvanced";
import CaktoQuizEditorReal from "@/components/caktoquiz-editor/CaktoQuizEditorReal";



import SimpleDragDropEditor from "@/components/visual-editor/SimpleDragDropEditor";

import EnhancedEditorSimple from "@/components/visual-editor/EnhancedEditorSimple";
import CaktoStyleEditor from "@/components/visual-editor/CaktoStyleEditor";
import QuizPreview from "@/components/QuizPreview";
import Teste1Page from "@/pages/Teste1Page";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { QuizConfigProvider } from "@/hooks/useQuizConfig";
import { QuizConfigTest } from "@/components/test/QuizConfigTest";
import { EditingFlowDemo } from "@/components/demo/EditingFlowDemo";
import "@/styles/quiz-dynamic-theme.css";
import { NewQuizPage } from "@/pages/NewQuizPage";
import PixelAnalysisPage from "@/pages/admin/PixelAnalysisPage";

// Atalhos flutuantes removidos conforme solicitação

function App() {
  console.log("🚀 App component rendering - Simplified SPA routes");

  return (
    <QuizConfigProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Rota principal - Quiz Intro */}
          <Route
            path="/"
            element={<Navigate to="/quiz-descubra-seu-estilo" replace />}
          />

          {/* Quiz principal */}
          <Route path="/quiz" element={<QuizPage />} />

          {/* Novo Quiz baseado no editor */}
          <Route path="/new-quiz" element={<NewQuizPage />} />

          {/* Quiz específico de estilo */}
          <Route
            path="/quiz-descubra-seu-estilo"
            element={<QuizDescubraSeuEstilo />}
          />
          <Route
            path="/descubra-seu-estilo"
            element={<QuizDescubraSeuEstilo />}
          />

          {/* Página de resultados */}
          <Route path="/resultado" element={<ResultPage />} />

          {/* Editor unificado */}
          <Route path="/unified-editor" element={<UnifiedEditorPage />} />

          {/* Editor Visual Quiz Offer */}
          <Route
            path="/quiz-offer-editor"
            element={<QuizOfferPageVisualEditor />}
          />

          {/* Novo Editor Visual Moderno */}
          <Route path="/modern-editor" element={<ModernEditorPage />} />
          <Route path="/editor" element={<ModernEditorPage />} />

          {/* Editor Visual Avançado - Modularizado CORRIGIDO */}
          <Route path="/advanced-editor" element={<AdvancedQuizEditor />} />
          
          {/* CaktoQuiz Editor Real */}
          <Route path="/cakto-editor" element={<CaktoQuizEditorReal />} />
          <Route path="/caktoquiz-editor-real" element={<CaktoQuizEditorReal />} />

          {/* NOVO: Enhanced Advanced Editor - Versão Melhorada */}
          <Route
            path="/enhanced-editor"
            element={
              <div className="min-h-screen bg-background">
                <EnhancedEditorSimple />
              </div>
            }
          />

          {/* NOVO: Editor no Estilo CaktoQuiz */}
          <Route
            path="/cakto-style-editor"
            element={<CaktoStyleEditor />}
          />



          {/* Página de Teste */}
          <Route path="/editor-test" element={<EditorTest />} />

          {/* NOVO: Editor Visual Modular Completo - SimpleDragDropEditor */}
          <Route
            path="/simple-editor"
            element={
              <div className="min-h-screen bg-background">
                <SimpleDragDropEditor />
              </div>
            }
          />

          {/* Rota removida - editor movido para deprecated */}

          {/* Rota removida - editor movido para deprecated */}

          {/* Editor Simples de Teste */}
          <Route
            path="/simple-working-editor"
            element={
              <div className="min-h-screen bg-background">
                <SimpleDragDropEditor />
              </div>
            }
          />

          {/* Rota removida - editor movido para deprecated */}

          {/* Teste simples do editor refatorado */}
          <Route
            path="/test-editor"
            element={
              <div className="min-h-screen bg-background">
                <div style={{ padding: "20px", textAlign: "center" }}>
                  <h1>Editor Refatorado - Teste</h1>
                  <p>Se você está vendo isso, o roteamento está funcionando!</p>
                  <div className="advanced-quiz-editor">
                    <div className="editor-layout">
                      <div className="editor-column">
                        <div style={{ padding: "20px" }}>Coluna 1</div>
                      </div>
                      <div className="editor-column">
                        <div style={{ padding: "20px" }}>Coluna 2</div>
                      </div>
                      <div className="editor-column">
                        <div style={{ padding: "20px" }}>Coluna 3</div>
                      </div>
                      <div className="editor-column">
                        <div style={{ padding: "20px" }}>Coluna 4</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          />

          {/* Editor funcionando - versão estática */}
          {/* Rota removida - editor movido para deprecated */}

          {/* Teste de Configuração - Apenas para desenvolvimento */}
          <Route path="/test-config" element={<QuizConfigTest />} />

          {/* Demo do Fluxo de Edição */}
          <Route path="/editing-demo" element={<EditingFlowDemo />} />

          {/* Nova Página do Quiz */}
          <Route path="/new-quiz" element={<NewQuizPage />} />

          {/* Página de Análise de Pixel - Admin */}
          <Route path="/admin/pixel-analysis" element={<PixelAnalysisPage />} />

          {/* Rota de Preview do Quiz */}
          <Route path="/quiz-preview" element={<QuizPreview />} />

          {/* NOVA: Rota de Teste1 - Modelo de Produção */}
          <Route path="/teste1" element={<Teste1Page />} />

          {/* 404 para rotas não encontradas */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>


      </div>
    </QuizConfigProvider>
  );
}

export default App;
