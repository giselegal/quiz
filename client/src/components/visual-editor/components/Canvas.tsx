import React from "react";
import { QuizComponent, QuizComponentProps, OptionChoice } from "../types";

interface CanvasProps {
  components: QuizComponent[];
  selectedComponentId: string | null;
  onComponentSelect: (componentId: string) => void;
  onComponentUpdate: (
    componentId: string,
    newProps: QuizComponentProps
  ) => void;
  onComponentDelete: (componentId: string) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
}

const Canvas: React.FC<CanvasProps> = ({
  components,
  selectedComponentId,
  onComponentSelect,
  onComponentUpdate,
  onComponentDelete,
  onDrop,
  onDragOver,
}) => {
  const renderComponent = (component: QuizComponent) => {
    const isSelected = selectedComponentId === component.id;

    return (
      <div
        key={component.id}
        className={`canvas-component ${component.type} ${
          isSelected ? "selected" : ""
        }`}
        role="button"
        tabIndex={0}
        aria-label={`Componente ${component.type}. ${
          isSelected ? "Selecionado" : "Clique para selecionar"
        }`}
        aria-pressed={isSelected}
        onClick={() => onComponentSelect(component.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onComponentSelect(component.id);
          }
          if (e.key === "Delete" && isSelected) {
            e.preventDefault();
            onComponentDelete(component.id);
          }
        }}
      >
        <div className="component-content">
          {renderComponentContent(component)}
        </div>

        {isSelected && (
          <div
            className="component-controls"
            role="toolbar"
            aria-label="Ações do componente"
          >
            <button
              className="delete-component-btn"
              onClick={(e) => {
                e.stopPropagation();
                onComponentDelete(component.id);
              }}
              title="Excluir Componente"
              aria-label="Excluir componente"
            >
              {">"}
              🗑️
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderComponentContent = (component: QuizComponent) => {
    const { type, props } = component;

    switch (type) {
      case "heading":
        return (
          <h2 className="heading-preview">{props.text || "Título do Quiz"}</h2>
        );

      case "text":
        return (
          <p className="text-preview">{props.text || "Texto de exemplo"}</p>
        );

      case "image":
        return (
          <div className="image-preview">
            {props.src ? (
              <img
                src={props.src as string}
                alt={(props.alt as string) || "Imagem"}
                style={{ maxWidth: "100%", height: "auto" }}
              />
            ) : (
              <div className="image-placeholder">🖼️ Imagem</div>
            )}
          </div>
        );

      case "button":
        return (
          <button className="button-preview">
            {props.buttonText || "Botão"}
          </button>
        );

      case "input":
        return (
          <div className="input-preview">
            <label>{props.label || "Campo"}</label>
            <input
              type={(props.inputType as string) || "text"}
              placeholder={(props.placeholder as string) || "Digite aqui..."}
              disabled
            />
          </div>
        );

      case "options":
        return (
          <div className="options-preview">
            <h4>{props.questionText || "Pergunta"}</h4>
            <div className="options-grid">
              {((props.choices as OptionChoice[]) || []).map(
                (choice, index) => (
                  <div key={index} className="option-card">
                    {choice.image && (
                      <img
                        src={choice.image}
                        alt={choice.text}
                        className="option-image"
                      />
                    )}
                    <span>{choice.text}</span>
                  </div>
                )
              )}
            </div>
          </div>
        );

      case "alert":
        return (
          <div className={`alert-preview alert-${props.alertType || "info"}`}>
            {props.alertMessage || "Mensagem de alerta"}
          </div>
        );

      case "video":
        return (
          <div className="video-preview">
            {props.videoUrl ? (
              <iframe
                src={props.videoUrl as string}
                width="100%"
                height="200"
                frameBorder="0"
                allowFullScreen
              />
            ) : (
              <div className="video-placeholder">📹 Vídeo</div>
            )}
          </div>
        );

      case "spacer":
        return (
          <div
            className="spacer-preview"
            style={{ height: `${props.height || 20}px` }}
          >
            <span>Espaçador ({props.height || 20}px)</span>
          </div>
        );

      default:
        return <div className="unknown-component">Componente: {type}</div>;
    }
  };

  return (
    <div className="canvas-container">
      <div className="canvas-header">
        <h3 className="canvas-title">🎨 Canvas</h3>
        <span className="component-count">
          {components.length} componente(s)
        </span>
      </div>

      <div className="canvas-area" onDrop={onDrop} onDragOver={onDragOver}>
        {components.length === 0 ? (
          <div className="canvas-empty">
            <p>Arraste componentes aqui para começar</p>
          </div>
        ) : (
          components.map(renderComponent)
        )}
      </div>
    </div>
  );
};

export default Canvas;
