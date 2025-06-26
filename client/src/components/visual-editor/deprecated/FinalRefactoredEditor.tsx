import React from "react";
import "@/styles/advanced-editor.css";

const FinalRefactoredEditor: React.FC = () => {
  return (
    <div className="advanced-quiz-editor">
      <div className="editor-layout">
        {/* Paleta de Componentes */}
        <div className="editor-column palette-column">
          <div className="component-palette">
            <h2 className="palette-title">Componentes</h2>
            <div className="components-grid">
              <div className="draggable-component">
                <span className="component-icon">📝</span>
                <span className="component-label">Título</span>
              </div>
              <div className="draggable-component">
                <span className="component-icon">📄</span>
                <span className="component-label">Texto</span>
              </div>
              <div className="draggable-component">
                <span className="component-icon">🖼️</span>
                <span className="component-label">Imagem</span>
              </div>
              <div className="draggable-component">
                <span className="component-icon">🔘</span>
                <span className="component-label">Botão</span>
              </div>
              <div className="draggable-component">
                <span className="component-icon">📝</span>
                <span className="component-label">Campo</span>
              </div>
              <div className="draggable-component">
                <span className="component-icon">☑️</span>
                <span className="component-label">Opções</span>
              </div>
              <div className="draggable-component">
                <span className="component-icon">⚠️</span>
                <span className="component-label">Alerta</span>
              </div>
              <div className="draggable-component">
                <span className="component-icon">🎥</span>
                <span className="component-label">Vídeo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Árvore de Etapas */}
        <div className="editor-column tree-column">
          <div className="step-tree">
            <div className="tree-header">
              <h2 className="tree-title">Etapas do Quiz</h2>
              <button className="add-step-btn">+ Adicionar Etapa</button>
            </div>
            <div className="steps-list">
              <div className="step-item active">
                <div className="step-header">
                  <div className="step-number">1</div>
                  <span className="step-name">Pergunta Inicial</span>
                  <span className="component-count">3 componentes</span>
                </div>
                <div className="step-actions">
                  <button className="step-action-btn">✏️ Editar</button>
                  <button className="step-action-btn">📋 Duplicar</button>
                  <button className="step-action-btn delete">🗑️ Excluir</button>
                </div>
              </div>
              <div className="step-item">
                <div className="step-header">
                  <div className="step-number">2</div>
                  <span className="step-name">Pergunta Secundária</span>
                  <span className="component-count">2 componentes</span>
                </div>
                <div className="step-actions">
                  <button className="step-action-btn">✏️ Editar</button>
                  <button className="step-action-btn">📋 Duplicar</button>
                  <button className="step-action-btn delete">🗑️ Excluir</button>
                </div>
              </div>
              <div className="step-item">
                <div className="step-header">
                  <div className="step-number">3</div>
                  <span className="step-name">Resultado</span>
                  <span className="component-count">1 componente</span>
                </div>
                <div className="step-actions">
                  <button className="step-action-btn">✏️ Editar</button>
                  <button className="step-action-btn">📋 Duplicar</button>
                  <button className="step-action-btn delete">🗑️ Excluir</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Canvas Principal */}
        <div className="editor-column canvas-column">
          <div className="canvas-container">
            <div className="canvas-header">
              <h2 className="canvas-title">
                Área de Trabalho - Pergunta Inicial
              </h2>
              <div className="canvas-actions">
                <button className="toolbar-btn secondary">🔍 Preview</button>
                <button className="toolbar-btn secondary">📱 Mobile</button>
                <button className="toolbar-btn">💾 Salvar</button>
              </div>
            </div>
            <div className="canvas-area">
              {/* Exemplo de componentes no canvas */}
              <div className="canvas-component selected">
                <div className="component-controls">
                  <button className="delete-component-btn">×</button>
                </div>
                <div className="heading-preview">
                  Qual é o seu estilo de decoração preferido?
                </div>
              </div>

              <div className="canvas-component">
                <div className="component-controls">
                  <button className="delete-component-btn">×</button>
                </div>
                <div className="text-preview">
                  Escolha a opção que mais representa o seu gosto pessoal para
                  decoração de ambientes.
                </div>
              </div>

              <div className="canvas-component">
                <div className="component-controls">
                  <button className="delete-component-btn">×</button>
                </div>
                <div className="options-preview">
                  <h4>Opções de Resposta:</h4>
                  <div className="options-grid">
                    <div className="option-card">
                      <div
                        className="option-image"
                        style={{
                          background: "#f0f0f0",
                          height: "60px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        🏛️
                      </div>
                      Clássico
                    </div>
                    <div className="option-card">
                      <div
                        className="option-image"
                        style={{
                          background: "#f0f0f0",
                          height: "60px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        🏢
                      </div>
                      Moderno
                    </div>
                    <div className="option-card">
                      <div
                        className="option-image"
                        style={{
                          background: "#f0f0f0",
                          height: "60px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        🌿
                      </div>
                      Rústico
                    </div>
                    <div className="option-card">
                      <div
                        className="option-image"
                        style={{
                          background: "#f0f0f0",
                          height: "60px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        ✨
                      </div>
                      Minimalista
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="canvas-empty"
                style={{
                  marginTop: "20px",
                  padding: "20px",
                  border: "2px dashed #dee2e6",
                }}
              >
                <p>Arraste mais componentes aqui para continuar construindo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Painel de Propriedades */}
        <div className="editor-column properties-column">
          <div className="properties-panel">
            <h2 className="panel-title">Propriedades</h2>
            <div className="component-info">
              <div className="component-type">TÍTULO SELECIONADO</div>
            </div>
            <div className="properties-content">
              <div className="property-section">
                <div className="section-header">
                  <span className="section-title">📝 Conteúdo</span>
                  <span className="expand-icon">▼</span>
                </div>
                <div className="section-content">
                  <div className="form-field">
                    <label>Texto do Título</label>
                    <input
                      type="text"
                      defaultValue="Qual é o seu estilo de decoração preferido?"
                      className="form-input"
                    />
                  </div>
                  <div className="form-field">
                    <label>Subtítulo (opcional)</label>
                    <input
                      type="text"
                      placeholder="Digite um subtítulo..."
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              <div className="property-section">
                <div className="section-header">
                  <span className="section-title">🎨 Estilo</span>
                  <span className="expand-icon">▼</span>
                </div>
                <div className="section-content">
                  <div className="form-field">
                    <label>Tamanho da Fonte</label>
                    <select className="form-select">
                      <option>Pequeno (18px)</option>
                      <option>Médio (24px)</option>
                      <option selected>Grande (32px)</option>
                      <option>Extra Grande (40px)</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Alinhamento</label>
                    <select className="form-select">
                      <option>Esquerda</option>
                      <option selected>Centro</option>
                      <option>Direita</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Cor do Texto</label>
                    <input
                      type="color"
                      defaultValue="#333333"
                      className="form-input"
                      style={{ height: "40px" }}
                    />
                  </div>
                </div>
              </div>

              <div className="property-section">
                <div className="section-header">
                  <span className="section-title">📐 Layout</span>
                  <span className="expand-icon">▼</span>
                </div>
                <div className="section-content">
                  <div className="form-field">
                    <label>Margem Superior</label>
                    <input
                      type="number"
                      defaultValue="20"
                      className="form-input"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="form-field">
                    <label>Margem Inferior</label>
                    <input
                      type="number"
                      defaultValue="20"
                      className="form-input"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="form-field checkbox">
                    <input type="checkbox" id="full-width" />
                    <label htmlFor="full-width">Largura total</label>
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

export default FinalRefactoredEditor;
