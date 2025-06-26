import React, { useState } from "react";
import { QuizComponentProps, OptionChoice } from "../types";

interface PropertiesPanelProps {
  selectedComponent: {
    id: string;
    type: string;
    props: QuizComponentProps;
  } | null;
  onPropsUpdate: (newProps: QuizComponentProps) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedComponent,
  onPropsUpdate,
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["basic"])
  );

  if (!selectedComponent) {
    return (
      <div className="properties-panel">
        <h3 className="panel-title">⚙️ Propriedades</h3>
        <div className="no-selection">
          <p>Selecione um componente para editar suas propriedades</p>
        </div>
      </div>
    );
  }

  const { type, props } = selectedComponent;

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const updateProp = (key: string, value: unknown) => {
    onPropsUpdate({ ...props, [key]: value });
  };

  const updateChoiceImage = (choiceIndex: number, imageUrl: string) => {
    const choices = [...(props.choices || [])];
    choices[choiceIndex] = { ...choices[choiceIndex], image: imageUrl };
    updateProp("choices", choices);
  };

  const updateChoiceScore = (choiceIndex: number, score: number) => {
    const choices = [...(props.choices || [])];
    choices[choiceIndex] = { ...choices[choiceIndex], scoreValue: score };
    updateProp("choices", choices);
  };

  const renderSection = (
    title: string,
    key: string,
    content: React.ReactNode
  ) => {
    const isExpanded = expandedSections.has(key);

    return (
      <div className="property-section">
        <div className="section-header" onClick={() => toggleSection(key)}>
          <span className="section-title">{title}</span>
          <span className={`expand-icon ${isExpanded ? "expanded" : ""}`}>
            ▼
          </span>
        </div>
        {isExpanded && <div className="section-content">{content}</div>}
      </div>
    );
  };

  const renderBasicProps = () => (
    <>
      {(type === "heading" || type === "text") && (
        <div className="form-field">
          <label>Texto</label>
          <textarea
            value={props.text || ""}
            onChange={(e) => updateProp("text", e.target.value)}
            rows={3}
          />
        </div>
      )}

      {type === "image" && (
        <>
          <div className="form-field">
            <label>URL da Imagem</label>
            <input
              type="url"
              value={props.src || ""}
              onChange={(e) => updateProp("src", e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>
          <div className="form-field">
            <label>Texto Alternativo</label>
            <input
              type="text"
              value={props.alt || ""}
              onChange={(e) => updateProp("alt", e.target.value)}
            />
          </div>
          {props.src && (
            <div className="image-preview">
              <img src={props.src} alt={props.alt || "Preview"} />
            </div>
          )}
        </>
      )}

      {type === "button" && (
        <>
          <div className="form-field">
            <label>Texto do Botão</label>
            <input
              type="text"
              value={props.buttonText || ""}
              onChange={(e) => updateProp("buttonText", e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Estilo</label>
            <select
              value={props.buttonStyle || "primary"}
              onChange={(e) => updateProp("buttonStyle", e.target.value)}
            >
              <option value="primary">Primário</option>
              <option value="secondary">Secundário</option>
              <option value="outline">Contorno</option>
              <option value="ghost">Fantasma</option>
            </select>
          </div>
        </>
      )}

      {type === "input" && (
        <>
          <div className="form-field">
            <label>Rótulo</label>
            <input
              type="text"
              value={props.label || ""}
              onChange={(e) => updateProp("label", e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Placeholder</label>
            <input
              type="text"
              value={props.placeholder || ""}
              onChange={(e) => updateProp("placeholder", e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Tipo</label>
            <select
              value={props.inputType || "text"}
              onChange={(e) => updateProp("inputType", e.target.value)}
            >
              <option value="text">Texto</option>
              <option value="email">Email</option>
              <option value="number">Número</option>
              <option value="tel">Telefone</option>
            </select>
          </div>
          <div className="form-field checkbox">
            <label>
              <input
                type="checkbox"
                checked={props.required || false}
                onChange={(e) => updateProp("required", e.target.checked)}
              />
              Campo obrigatório
            </label>
          </div>
        </>
      )}

      {type === "options" && (
        <>
          <div className="form-field">
            <label>Texto da Pergunta</label>
            <textarea
              value={props.questionText || ""}
              onChange={(e) => updateProp("questionText", e.target.value)}
              rows={2}
            />
          </div>
          <div className="form-field">
            <label>Tipo de Seleção</label>
            <select
              value={props.selectionType || "single"}
              onChange={(e) => updateProp("selectionType", e.target.value)}
            >
              <option value="single">Seleção Única</option>
              <option value="multiple">Seleção Múltipla</option>
            </select>
          </div>

          {props.selectionType === "multiple" && (
            <>
              <div className="form-field">
                <label>Mínimo de Seleções</label>
                <input
                  type="number"
                  min="1"
                  value={props.minSelections || 1}
                  onChange={(e) =>
                    updateProp("minSelections", parseInt(e.target.value))
                  }
                />
              </div>
              <div className="form-field">
                <label>Máximo de Seleções</label>
                <input
                  type="number"
                  min="1"
                  value={props.maxSelections || 3}
                  onChange={(e) =>
                    updateProp("maxSelections", parseInt(e.target.value))
                  }
                />
              </div>
            </>
          )}
        </>
      )}

      {type === "spacer" && (
        <div className="form-field">
          <label>Altura (px)</label>
          <input
            type="number"
            min="10"
            max="500"
            value={props.height || 20}
            onChange={(e) => updateProp("height", parseInt(e.target.value))}
          />
        </div>
      )}
    </>
  );

  const renderOptionsProps = () => {
    if (type !== "options") return null;

    return (
      <div className="options-editor">
        <div className="options-header">
          <h4>Opções de Resposta</h4>
          <button
            className="add-option-btn"
            onClick={() => {
              const newChoice = { text: "Nova opção", value: "new_option" };
              updateProp("choices", [...(props.choices || []), newChoice]);
            }}
          >
            + Adicionar
          </button>
        </div>

        {(props.choices || []).map((choice, index) => (
          <div key={index} className="option-editor">
            <div className="option-header">
              <span>Opção {index + 1}</span>
              <button
                className="remove-option-btn"
                onClick={() => {
                  const newChoices = props.choices?.filter(
                    (_, i) => i !== index
                  );
                  updateProp("choices", newChoices);
                }}
              >
                🗑️
              </button>
            </div>

            <div className="form-field">
              <label>Texto</label>
              <input
                type="text"
                value={choice.text}
                onChange={(e) => {
                  const choices = [...(props.choices || [])];
                  choices[index] = { ...choices[index], text: e.target.value };
                  updateProp("choices", choices);
                }}
              />
            </div>

            <div className="form-field">
              <label>Imagem (URL)</label>
              <input
                type="url"
                value={choice.image || ""}
                onChange={(e) => updateChoiceImage(index, e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            {choice.image && (
              <div className="option-image-preview">
                <img src={choice.image} alt={choice.text} />
              </div>
            )}

            <div className="form-field">
              <label>Pontuação</label>
              <input
                type="number"
                value={choice.scoreValue || 0}
                onChange={(e) =>
                  updateChoiceScore(index, parseInt(e.target.value) || 0)
                }
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="properties-panel">
      <h3 className="panel-title">⚙️ Propriedades</h3>
      <div className="component-info">
        <span className="component-type">{type}</span>
      </div>

      <div className="properties-content">
        {renderSection("Básico", "basic", renderBasicProps())}
        {type === "options" &&
          renderSection("Opções", "options", renderOptionsProps())}
      </div>
    </div>
  );
};

export default PropertiesPanel;
