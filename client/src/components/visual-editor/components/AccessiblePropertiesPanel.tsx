import React, { useState, useCallback, useMemo } from "react";
import {
  QuizComponentProps,
  OptionChoice,
} from "../../../hooks/useQuizEditorState";

interface AccessiblePropertiesPanelProps {
  selectedComponent: {
    id: string;
    type: string;
    props: QuizComponentProps;
  } | null;
  onPropsUpdate: (newProps: QuizComponentProps) => void;
}

interface ValidationError {
  field: string;
  message: string;
}

const AccessiblePropertiesPanel: React.FC<AccessiblePropertiesPanelProps> =
  React.memo(({ selectedComponent, onPropsUpdate }) => {
    const [expandedSections, setExpandedSections] = useState<Set<string>>(
      new Set(["basic"])
    );
    const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
      []
    );

    // Memoizar componente selecionado
    const componentData = useMemo(() => {
      if (!selectedComponent) return null;
      return {
        type: selectedComponent.type,
        props: selectedComponent.props,
        typeLabel: getComponentTypeLabel(selectedComponent.type),
      };
    }, [selectedComponent]);

    // Validação de props
    const validateProps = useCallback(
      (key: string, value: unknown): ValidationError[] => {
        const errors: ValidationError[] = [];

        switch (key) {
          case "src":
            if (typeof value === "string" && value && !isValidUrl(value)) {
              errors.push({ field: key, message: "URL da imagem inválida" });
            }
            break;
          case "videoUrl":
            if (typeof value === "string" && value && !isValidUrl(value)) {
              errors.push({ field: key, message: "URL do vídeo inválida" });
            }
            break;
          case "height":
            if (typeof value === "number" && (value < 1 || value > 1000)) {
              errors.push({
                field: key,
                message: "Altura deve estar entre 1 e 1000 pixels",
              });
            }
            break;
          case "maxSelections":
            if (typeof value === "number" && value < 1) {
              errors.push({
                field: key,
                message: "Máximo de seleções deve ser pelo menos 1",
              });
            }
            break;
          case "minSelections":
            if (typeof value === "number" && value < 1) {
              errors.push({
                field: key,
                message: "Mínimo de seleções deve ser pelo menos 1",
              });
            }
            break;
        }

        return errors;
      },
      []
    );

    // Helper para validar URLs
    const isValidUrl = (url: string): boolean => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    // Helper para obter rótulo do tipo
    const getComponentTypeLabel = (type: string): string => {
      const labels: Record<string, string> = {
        heading: "Título",
        text: "Texto",
        image: "Imagem",
        button: "Botão",
        input: "Campo de entrada",
        options: "Múltipla escolha",
        alert: "Alerta",
        video: "Vídeo",
        spacer: "Espaçador",
      };
      return labels[type] || type;
    };

    // Toggle de seções
    const toggleSection = useCallback((section: string) => {
      setExpandedSections((prev) => {
        const newExpanded = new Set(prev);
        if (newExpanded.has(section)) {
          newExpanded.delete(section);
        } else {
          newExpanded.add(section);
        }
        return newExpanded;
      });
    }, []);

    // Update de propriedades com validação
    const updateProp = useCallback(
      (key: string, value: unknown) => {
        if (!selectedComponent) return;

        const errors = validateProps(key, value);
        setValidationErrors((prev) => {
          const filtered = prev.filter((err) => err.field !== key);
          return [...filtered, ...errors];
        });

        onPropsUpdate({ ...selectedComponent.props, [key]: value });
      },
      [selectedComponent, validateProps, onPropsUpdate]
    );

    // Handlers específicos para arrays
    const updateChoiceImage = useCallback(
      (choiceIndex: number, imageUrl: string) => {
        if (!selectedComponent) return;
        const choices = [...(selectedComponent.props.choices || [])];
        choices[choiceIndex] = { ...choices[choiceIndex], image: imageUrl };
        updateProp("choices", choices);
      },
      [selectedComponent, updateProp]
    );

    const updateChoiceScore = useCallback(
      (choiceIndex: number, score: number) => {
        if (!selectedComponent) return;
        const choices = [...(selectedComponent.props.choices || [])];
        choices[choiceIndex] = { ...choices[choiceIndex], scoreValue: score };
        updateProp("choices", choices);
      },
      [selectedComponent, updateProp]
    );

    const addChoice = useCallback(() => {
      if (!selectedComponent) return;
      const newChoice = { text: "Nova opção", value: "new_option" };
      updateProp("choices", [
        ...(selectedComponent.props.choices || []),
        newChoice,
      ]);
    }, [selectedComponent, updateProp]);

    const removeChoice = useCallback(
      (index: number) => {
        if (!selectedComponent) return;
        const newChoices = selectedComponent.props.choices?.filter(
          (_, i) => i !== index
        );
        updateProp("choices", newChoices);
      },
      [selectedComponent, updateProp]
    );

    // Renderização de seção
    const renderSection = useCallback(
      (title: string, key: string, content: React.ReactNode) => {
        const isExpanded = expandedSections.has(key);

        return (
          <div className="property-section">
            <button
              className="section-header"
              onClick={() => toggleSection(key)}
              aria-expanded={isExpanded}
              aria-controls={`section-${key}`}
            >
              <span className="section-title">{title}</span>
              <span
                className={`expand-icon ${isExpanded ? "expanded" : ""}`}
                aria-hidden="true"
              >
                ▼
              </span>
            </button>
            {isExpanded && (
              <div
                id={`section-${key}`}
                className="section-content"
                role="region"
                aria-labelledby={`section-${key}-header`}
              >
                {content}
              </div>
            )}
          </div>
        );
      },
      [expandedSections, toggleSection]
    );

    // Campo de formulário com validação
    const renderFormField = useCallback(
      (
        label: string,
        id: string,
        element: React.ReactNode,
        required = false,
        description?: string
      ) => {
        const fieldErrors = validationErrors.filter((err) => err.field === id);
        const hasError = fieldErrors.length > 0;

        return (
          <div className={`form-field ${hasError ? "error" : ""}`}>
            <label htmlFor={id} className={required ? "required" : ""}>
              {label}
              {required && <span aria-label="obrigatório"> *</span>}
            </label>
            {description && (
              <div className="field-description" id={`${id}-desc`}>
                {description}
              </div>
            )}
            {React.cloneElement(element as React.ReactElement, {
              id,
              "aria-describedby": `${description ? `${id}-desc ` : ""}${
                hasError ? `${id}-error` : ""
              }`.trim(),
              "aria-invalid": hasError,
            })}
            {hasError && (
              <div className="field-error" id={`${id}-error`} role="alert">
                {fieldErrors[0].message}
              </div>
            )}
          </div>
        );
      },
      [validationErrors]
    );

    if (!componentData) {
      return (
        <div className="properties-panel">
          <h3 className="panel-title">⚙️ Propriedades</h3>
          <div className="no-selection" role="status">
            <p>Selecione um componente para editar suas propriedades</p>
          </div>
        </div>
      );
    }

    const { type, props, typeLabel } = componentData;

    // Renderização das propriedades básicas
    const renderBasicProps = () => (
      <>
        {(type === "heading" || type === "text") &&
          renderFormField(
            "Texto",
            "text-input",
            <textarea
              value={props.text || ""}
              onChange={(e) => updateProp("text", e.target.value)}
              rows={3}
              placeholder={`Digite o ${
                type === "heading" ? "título" : "texto"
              }...`}
            />,
            true,
            `Conteúdo principal do ${typeLabel.toLowerCase()}`
          )}

        {type === "image" && (
          <>
            {renderFormField(
              "URL da Imagem",
              "image-src",
              <input
                type="url"
                value={props.src || ""}
                onChange={(e) => updateProp("src", e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
              />,
              true,
              "Endereço web da imagem a ser exibida"
            )}
            {renderFormField(
              "Texto Alternativo",
              "image-alt",
              <input
                type="text"
                value={props.alt || ""}
                onChange={(e) => updateProp("alt", e.target.value)}
                placeholder="Descrição da imagem"
              />,
              true,
              "Descrição da imagem para acessibilidade"
            )}
            {props.src && (
              <div
                className="image-preview"
                role="img"
                aria-label="Preview da imagem"
              >
                <img src={props.src} alt={props.alt || "Preview"} />
              </div>
            )}
          </>
        )}

        {type === "button" && (
          <>
            {renderFormField(
              "Texto do Botão",
              "button-text",
              <input
                type="text"
                value={props.buttonText || ""}
                onChange={(e) => updateProp("buttonText", e.target.value)}
                placeholder="Clique aqui"
              />,
              true
            )}
            {renderFormField(
              "Estilo",
              "button-style",
              <select
                value={props.buttonStyle || "primary"}
                onChange={(e) => updateProp("buttonStyle", e.target.value)}
              >
                <option value="primary">Primário</option>
                <option value="secondary">Secundário</option>
                <option value="outline">Contorno</option>
                <option value="ghost">Fantasma</option>
              </select>
            )}
          </>
        )}

        {type === "spacer" &&
          renderFormField(
            "Altura",
            "spacer-height",
            <input
              type="number"
              min="1"
              max="1000"
              value={props.height || 20}
              onChange={(e) => updateProp("height", parseInt(e.target.value))}
            />,
            false,
            "Altura do espaçador em pixels (1-1000)"
          )}
      </>
    );

    // Renderização das opções
    const renderOptionsProps = () => {
      if (type !== "options") return null;

      return (
        <div className="options-editor">
          <div className="options-header">
            <h4>Opções de Resposta</h4>
            <button
              className="add-option-btn"
              onClick={addChoice}
              aria-label="Adicionar nova opção de resposta"
            >
              + Adicionar
            </button>
          </div>

          <div role="list" aria-label="Lista de opções de resposta">
            {(props.choices || []).map((choice, index) => (
              <div key={index} className="option-editor" role="listitem">
                <div className="option-header">
                  <span>Opção {index + 1}</span>
                  <button
                    className="remove-option-btn"
                    onClick={() => removeChoice(index)}
                    aria-label={`Remover opção ${index + 1}`}
                  >
                    🗑️
                  </button>
                </div>

                {renderFormField(
                  "Texto da Opção",
                  `option-text-${index}`,
                  <input
                    type="text"
                    value={choice.text}
                    onChange={(e) => {
                      const choices = [...(props.choices || [])];
                      choices[index] = {
                        ...choices[index],
                        text: e.target.value,
                      };
                      updateProp("choices", choices);
                    }}
                    placeholder="Texto da opção"
                  />,
                  true
                )}

                {renderFormField(
                  "Imagem (Opcional)",
                  `option-image-${index}`,
                  <input
                    type="url"
                    value={choice.image || ""}
                    onChange={(e) => updateChoiceImage(index, e.target.value)}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />,
                  false,
                  "URL da imagem para esta opção"
                )}

                {choice.image && (
                  <div className="option-image-preview">
                    <img src={choice.image} alt={choice.text} />
                  </div>
                )}

                {renderFormField(
                  "Pontuação",
                  `option-score-${index}`,
                  <input
                    type="number"
                    value={choice.scoreValue || 0}
                    onChange={(e) =>
                      updateChoiceScore(index, parseInt(e.target.value) || 0)
                    }
                  />,
                  false,
                  "Valor de pontuação para esta opção"
                )}
              </div>
            ))}
          </div>
        </div>
      );
    };

    return (
      <div className="properties-panel">
        <div className="panel-header">
          <h3 className="panel-title">⚙️ Propriedades</h3>
          {validationErrors.length > 0 && (
            <div className="validation-summary" role="alert" aria-live="polite">
              {validationErrors.length} erro
              {validationErrors.length !== 1 ? "s" : ""} encontrado
              {validationErrors.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        <div className="component-info">
          <span
            className="component-type"
            aria-label={`Tipo de componente: ${typeLabel}`}
          >
            {typeLabel}
          </span>
        </div>

        <div className="properties-content" role="tablist">
          {renderSection("Propriedades Básicas", "basic", renderBasicProps())}
          {type === "options" &&
            renderSection(
              "Opções de Resposta",
              "options",
              renderOptionsProps()
            )}
        </div>
      </div>
    );
  });

AccessiblePropertiesPanel.displayName = "AccessiblePropertiesPanel";

export default AccessiblePropertiesPanel;
