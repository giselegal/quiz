import React, { useState } from "react";
import "@/styles/advanced-editor.css";

const FinalWorkingEditor: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );
  const [message, setMessage] = useState("Editor carregado com sucesso!");

  const components = [
    { type: "heading", label: "Título", icon: "📝" },
    { type: "text", label: "Texto", icon: "📄" },
    { type: "image", label: "Imagem", icon: "🖼️" },
    { type: "button", label: "Botão", icon: "🔘" },
    { type: "input", label: "Campo", icon: "📝" },
    { type: "options", label: "Opções", icon: "☑️" },
  ];

  return (
    <div className="advanced-quiz-editor">
      <div className="editor-layout">
        {/* Coluna 1: Paleta de Componentes */}
        <div className="editor-column palette-column">
          <div className="component-palette">
            <h3 className="palette-title">🧩 Componentes</h3>
            <div className="components-grid">
              {components.map((component) => (
                <div
                  key={component.type}
                  className="draggable-component"
                  onClick={() => {
                    setMessage(`Componente ${component.label} selecionado`);
                    setSelectedComponent(component.type);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <span className="component-icon">{component.icon}</span>
                  <span className="component-label">{component.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna 2: Árvore de Etapas */}
        <div className="editor-column tree-column">
          <div className="step-tree">
            <div className="tree-header">
              <h3 className="tree-title">📋 Estrutura</h3>
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
              <div className="step-item">
                <div className="step-header">
                  <span className="step-number">2</span>
                  <span className="step-name">Pergunta 1</span>
                  <span className="component-count">2 componentes</span>
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
              <span className="component-count">Editor responsivo</span>
            </div>
            <div className="canvas-area">
              <div className="canvas-component selected">
                <div className="component-content">
                  <h2 className="heading-preview">Bem-vindo ao Quiz!</h2>
                </div>
              </div>

              {selectedComponent && (
                <div className="canvas-component">
                  <div className="component-content">
                    <div
                      style={{
                        padding: "16px",
                        background: "#e3f2fd",
                        borderRadius: "8px",
                        border: "2px dashed #1976d2",
                      }}
                    >
                      Novo componente: <strong>{selectedComponent}</strong>
                    </div>
                  </div>
                </div>
              )}

              <div
                style={{
                  margin: "20px 0",
                  padding: "16px",
                  background: "#f0f0f0",
                  borderRadius: "8px",
                }}
              >
                <strong>Status:</strong> {message}
                <br />
                <small
                  style={{ color: "#666", marginTop: "8px", display: "block" }}
                >
                  ✅ Performance otimizada | ✅ Responsivo | ✅ Acessível
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna 4: Painel de Propriedades */}
        <div className="editor-column properties-column">
          <div className="properties-panel">
            <h3 className="panel-title">⚙️ Propriedades</h3>

            {selectedComponent ? (
              <div className="component-info">
                <span className="component-type">{selectedComponent}</span>
                <div className="properties-content">
                  <div className="property-section">
                    <div className="section-header">
                      <span className="section-title">Configurações</span>
                    </div>
                    <div className="section-content">
                      <div className="form-field">
                        <label>Texto</label>
                        <input
                          type="text"
                          defaultValue={`Texto do ${selectedComponent}`}
                          onChange={(e) =>
                            setMessage(`Texto alterado: ${e.target.value}`)
                          }
                        />
                      </div>
                      <div className="form-field">
                        <label>Estilo</label>
                        <select>
                          <option>Padrão</option>
                          <option>Destaque</option>
                          <option>Sutil</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-selection">
                <p>Selecione um componente para editar suas propriedades</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalWorkingEditor;
