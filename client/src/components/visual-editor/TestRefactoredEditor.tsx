import React, { useState, useCallback, useMemo } from "react";
import ComponentPalette from "./components/ComponentPalette";
import "@/styles/advanced-editor.css";

// Tipos simples inline para teste
interface QuizComponentProps {
  text?: string;
  [key: string]: unknown;
}

interface QuizComponent {
  id: string;
  type: string;
  props: QuizComponentProps;
}

interface Step {
  id: string;
  name: string;
  components: QuizComponent[];
}

const TestRefactoredEditor: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([
    {
      id: "step-1",
      name: "Boas-vindas",
      components: [
        {
          id: "comp-1",
          type: "heading",
          props: { text: "Bem-vindo ao Quiz!" },
        },
      ],
    },
  ]);

  const [currentStepId, setCurrentStepId] = useState<string>("step-1");

  const handleDragStart = useCallback(
    (event: React.DragEvent<HTMLDivElement>, componentType: string) => {
      event.dataTransfer.setData("component-type", componentType);
      console.log("Drag started:", componentType);
    },
    []
  );

  return (
    <div className="advanced-quiz-editor">
      <div className="editor-layout">
        {/* Coluna 1: Paleta de Componentes */}
        <div className="editor-column palette-column">
          <ComponentPalette onDragStart={handleDragStart} />
        </div>

        {/* Coluna 2: Árvore de Etapas */}
        <div className="editor-column tree-column">
          <div className="step-tree">
            <div className="tree-header">
              <h3 className="tree-title">📋 Estrutura do Quiz</h3>
              <button className="add-step-btn">+ Etapa</button>
            </div>
            <div className="steps-list">
              {steps.map((step, index) => (
                <div key={step.id} className="step-item active">
                  <div className="step-header">
                    <span className="step-number">{index + 1}</span>
                    <span className="step-name">{step.name}</span>
                    <span className="component-count">
                      {step.components.length} componente(s)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna 3: Canvas */}
        <div className="editor-column canvas-column">
          <div className="canvas-container">
            <div className="canvas-header">
              <h3 className="canvas-title">🎨 Canvas</h3>
              <span className="component-count">
                {steps.find((s) => s.id === currentStepId)?.components.length ||
                  0}{" "}
                componente(s)
              </span>
            </div>
            <div className="canvas-area">
              {steps
                .find((s) => s.id === currentStepId)
                ?.components.map((component) => (
                  <div key={component.id} className="canvas-component">
                    <div className="component-content">
                      <h2 className="heading-preview">
                        {component.props.text || "Componente"}
                      </h2>
                    </div>
                  </div>
                ))}
              <div
                style={{
                  margin: "20px",
                  padding: "20px",
                  background: "#f0f0f0",
                  borderRadius: "8px",
                }}
              >
                <strong>Status:</strong> Editor com ComponentPalette
                funcionando!
              </div>
            </div>
          </div>
        </div>

        {/* Coluna 4: Painel de Propriedades */}
        <div className="editor-column properties-column">
          <div className="properties-panel">
            <h3 className="panel-title">⚙️ Propriedades</h3>
            <div className="no-selection">
              <p>Selecione um componente para editar suas propriedades</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestRefactoredEditor;
