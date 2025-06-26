import React, { useState } from "react";
import "@/styles/advanced-editor.css";

const WorkingRefactoredEditor: React.FC = () => {
  const [message, setMessage] = useState("Editor carregado com sucesso!");

  return (
    <div className="advanced-quiz-editor">
      <div className="editor-layout">
        {/* Coluna 1: Paleta de Componentes */}
        <div className="editor-column palette-column">
          <div className="component-palette">
            <h3 className="palette-title">🧩 Componentes</h3>
            <div className="components-grid">
              {["heading", "text", "image", "button", "input", "options"].map(
                (type) => (
                  <div
                    key={type}
                    className="draggable-component"
                    onClick={() => setMessage(`Componente ${type} selecionado`)}
                  >
                    <span className="component-icon">📝</span>
                    <span className="component-label">{type}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Coluna 2: Árvore de Etapas */}
        <div className="editor-column tree-column">
          <div className="step-tree">
            <div className="tree-header">
              <h3 className="tree-title">📋 Estrutura do Quiz</h3>
              <button
                className="add-step-btn"
                onClick={() => setMessage("Nova etapa adicionada!")}
              >
                + Etapa
              </button>
            </div>
            <div className="steps-list">
              <div className="step-item active">
                <div className="step-header">
                  <span className="step-number">1</span>
                  <span className="step-name">Boas-vindas</span>
                  <span className="component-count">1 componente</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna 3: Canvas */}
        <div className="editor-column canvas-column">
          <div className="canvas-container">
            <div className="canvas-header">
              <h3 className="canvas-title">🎨 Canvas</h3>
              <span className="component-count">1 componente</span>
            </div>
            <div className="canvas-area">
              <div className="canvas-component selected">
                <div className="component-content">
                  <h2 className="heading-preview">Bem-vindo ao Quiz!</h2>
                </div>
              </div>
              <div
                style={{
                  margin: "20px",
                  padding: "20px",
                  background: "#f0f0f0",
                  borderRadius: "8px",
                }}
              >
                <strong>Status:</strong> {message}
                <br />
                <button
                  onClick={() =>
                    setMessage("Editor funcionando perfeitamente!")
                  }
                  style={{
                    marginTop: "10px",
                    padding: "8px 16px",
                    background: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  Testar Interação
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna 4: Painel de Propriedades */}
        <div className="editor-column properties-column">
          <div className="properties-panel">
            <h3 className="panel-title">⚙️ Propriedades</h3>
            <div className="component-info">
              <span className="component-type">heading</span>
            </div>
            <div className="properties-content">
              <div className="property-section">
                <div className="section-header">
                  <span className="section-title">Básico</span>
                  <span className="expand-icon expanded">▼</span>
                </div>
                <div className="section-content">
                  <div className="form-field">
                    <label>Texto</label>
                    <textarea
                      value="Bem-vindo ao Quiz!"
                      onChange={(e) =>
                        setMessage(`Texto alterado: ${e.target.value}`)
                      }
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkingRefactoredEditor;
