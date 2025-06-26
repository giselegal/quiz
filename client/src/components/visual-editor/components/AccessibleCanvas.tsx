import React, { useMemo, useCallback } from "react";
import { QuizComponent, QuizComponentProps, OptionChoice } from "../../../hooks/useQuizEditorState";

interface AccessibleCanvasProps {
  components: QuizComponent[];
  selectedComponentId: string | null;
  onComponentSelect: (componentId: string) => void;
  onComponentUpdate: (componentId: string, newProps: QuizComponentProps) => void;
  onComponentDelete: (componentId: string) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
}

const AccessibleCanvas: React.FC<AccessibleCanvasProps> = React.memo(({
  components,
  selectedComponentId,
  onComponentSelect,
  onComponentUpdate,
  onComponentDelete,
  onDrop,
  onDragOver,
}) => {
  // Memoizar componente selecionado para performance
  const selectedComponent = useMemo(() => 
    components.find(comp => comp.id === selectedComponentId),
    [components, selectedComponentId]
  );

  // Navegação entre componentes com teclado
  const navigateComponents = useCallback((direction: number) => {
    if (components.length === 0) return;
    
    const currentIndex = selectedComponentId 
      ? components.findIndex(comp => comp.id === selectedComponentId)
      : -1;
    
    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) nextIndex = components.length - 1;
    if (nextIndex >= components.length) nextIndex = 0;
    
    onComponentSelect(components[nextIndex].id);
  }, [components, selectedComponentId, onComponentSelect]);

  // Handler para navegação por teclado
  const handleKeyDown = useCallback((
    event: React.KeyboardEvent<HTMLDivElement>, 
    componentId: string
  ) => {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        onComponentSelect(componentId);
        break;
      case "Delete":
      case "Backspace":
        if (selectedComponentId === componentId) {
          event.preventDefault();
          onComponentDelete(componentId);
        }
        break;
      case "ArrowDown":
      case "ArrowUp":
        event.preventDefault();
        navigateComponents(event.key === "ArrowDown" ? 1 : -1);
        break;
    }
  }, [selectedComponentId, onComponentSelect, onComponentDelete, navigateComponents]);

  // Renderização otimizada de componente
  const renderComponent = useCallback((component: QuizComponent) => {
    const isSelected = selectedComponentId === component.id;
    
    return (
      <div
        key={component.id}
        className={`canvas-component ${component.type} ${isSelected ? "selected" : ""}`}
        role="button"
        tabIndex={0}
        aria-selected={isSelected}
        aria-label={`${getComponentTypeLabel(component.type)}: ${getComponentPreviewText(component)}`}
        onClick={() => onComponentSelect(component.id)}
        onKeyDown={(e) => handleKeyDown(e, component.id)}
      >
        <div className="component-content">
          {renderComponentContent(component)}
        </div>
        
        {isSelected && (
          <div className="component-controls" role="toolbar" aria-label="Controles do componente">
            <button
              className="delete-component-btn"
              onClick={(e) => {
                e.stopPropagation();
                onComponentDelete(component.id);
              }}
              aria-label={`Excluir ${getComponentTypeLabel(component.type)}`}
              title="Excluir Componente (Delete)"
            >
              🗑️
            </button>
          </div>
        )}
      </div>
    );
  }, [selectedComponentId, onComponentSelect, onComponentDelete, handleKeyDown]);

  // Função para obter rótulo do tipo de componente
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

  // Função para obter texto de preview para acessibilidade
  const getComponentPreviewText = (component: QuizComponent): string => {
    const { type, props } = component;
    switch (type) {
      case "heading":
      case "text":
        return props.text || "Sem texto";
      case "button":
        return props.buttonText || "Botão";
      case "input":
        return props.label || "Campo";
      case "options":
        return props.questionText || "Pergunta";
      case "alert":
        return props.alertMessage || "Alerta";
      case "image":
        return props.alt || "Imagem";
      default:
        return "Componente";
    }
  };

  // Renderização do conteúdo do componente (otimizada)
  const renderComponentContent = (component: QuizComponent) => {
    const { type, props } = component;

    switch (type) {
      case "heading":
        return (
          <h2 className="heading-preview">
            {props.text || "Título do Quiz"}
          </h2>
        );
      
      case "text":
        return (
          <p className="text-preview">
            {props.text || "Texto de exemplo"}
          </p>
        );
      
      case "image":
        return (
          <div className="image-preview">
            {props.src ? (
              <img 
                src={props.src as string} 
                alt={props.alt as string || "Imagem"} 
                style={{ maxWidth: "100%", height: "auto" }}
              />
            ) : (
              <div className="image-placeholder" role="img" aria-label="Placeholder de imagem">
                🖼️ Imagem
              </div>
            )}
          </div>
        );
      
      case "button":
        return (
          <button 
            className="button-preview"
            aria-label={`Preview do botão: ${props.buttonText || "Botão"}`}
            disabled
          >
            {props.buttonText || "Botão"}
          </button>
        );
      
      case "input":
        return (
          <div className="input-preview">
            <label>{props.label || "Campo"}</label>
            <input 
              type={props.inputType as string || "text"}
              placeholder={props.placeholder as string || "Digite aqui..."}
              aria-label={`Preview do campo: ${props.label || "Campo"}`}
              disabled
            />
          </div>
        );
      
      case "options":
        return (
          <div className="options-preview">
            <h4>{props.questionText || "Pergunta"}</h4>
            <div className="options-grid" role="list">
              {(props.choices as OptionChoice[] || []).map((choice, index) => (
                <div key={index} className="option-card" role="listitem">
                  {choice.image && (
                    <img 
                      src={choice.image} 
                      alt={choice.text}
                      className="option-image"
                    />
                  )}
                  <span>{choice.text}</span>
                </div>
              ))}
            </div>
          </div>
        );
      
      case "alert":
        return (
          <div 
            className={`alert-preview alert-${props.alertType || "info"}`}
            role="alert"
            aria-live="polite"
          >
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
                title="Preview do vídeo"
              />
            ) : (
              <div className="video-placeholder" role="img" aria-label="Placeholder de vídeo">
                📹 Vídeo
              </div>
            )}
          </div>
        );
      
      case "spacer":
        return (
          <div 
            className="spacer-preview"
            style={{ height: `${props.height || 20}px` }}
            role="separator"
            aria-label={`Espaçador de ${props.height || 20} pixels`}
          >
            <span>Espaçador ({props.height || 20}px)</span>
          </div>
        );
      
      default:
        return (
          <div className="unknown-component">
            Componente: {type}
          </div>
        );
    }
  };

  // Handler para drop com feedback de acessibilidade
  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    onDrop(event);
    // Anunciar para leitores de tela
    const componentType = event.dataTransfer.getData("component-type");
    if (componentType) {
      // Aqui você poderia usar uma biblioteca de anúncios para leitores de tela
      console.log(`Componente ${getComponentTypeLabel(componentType)} adicionado ao canvas`);
    }
  }, [onDrop]);

  return (
    <div className="canvas-container">
      <div className="canvas-header">
        <h3 className="canvas-title" id="canvas-title">🎨 Canvas</h3>
        <span className="component-count" aria-live="polite">
          {components.length} componente{components.length !== 1 ? "s" : ""}
        </span>
      </div>
      
      <div
        className="canvas-area"
        role="main"
        aria-labelledby="canvas-title"
        aria-describedby="canvas-instructions"
        onDrop={handleDrop}
        onDragOver={onDragOver}
        tabIndex={0}
      >
        <div id="canvas-instructions" className="sr-only">
          Área de edição do quiz. Use as setas para navegar entre componentes, Enter para selecionar, Delete para excluir.
        </div>
        
        {components.length === 0 ? (
          <div className="canvas-empty" role="status" aria-live="polite">
            <p>Arraste componentes da paleta para começar a criar seu quiz</p>
          </div>
        ) : (
          <div role="list" aria-label="Componentes do quiz">
            {components.map(renderComponent)}
          </div>
        )}
      </div>
    </div>
  );
});

AccessibleCanvas.displayName = "AccessibleCanvas";

export default AccessibleCanvas;
