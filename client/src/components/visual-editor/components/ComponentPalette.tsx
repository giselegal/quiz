import React, { memo } from "react";

interface ComponentPaletteProps {
  onDragStart: (
    event: React.DragEvent<HTMLDivElement>,
    componentType: string
  ) => void;
}

const ComponentPalette: React.FC<ComponentPaletteProps> = memo(
  ({ onDragStart }) => {
    const components = [
      {
        type: "heading",
        label: "Título",
        icon: "📝",
        description: "Adicionar um título ao quiz",
      },
      {
        type: "text",
        label: "Texto",
        icon: "📄",
        description: "Adicionar parágrafo de texto",
      },
      {
        type: "image",
        label: "Imagem",
        icon: "🖼️",
        description: "Inserir uma imagem",
      },
      {
        type: "button",
        label: "Botão",
        icon: "🔘",
        description: "Botão de ação",
      },
      {
        type: "input",
        label: "Campo de Entrada",
        icon: "📝",
        description: "Campo para entrada de dados",
      },
      {
        type: "options",
        label: "Múltipla Escolha",
        icon: "☑️",
        description: "Opções de resposta",
      },
      {
        type: "alert",
        label: "Alerta",
        icon: "⚠️",
        description: "Mensagem de alerta",
      },
      {
        type: "video",
        label: "Vídeo",
        icon: "📹",
        description: "Incorporar vídeo",
      },
      {
        type: "carousel",
        label: "Carrossel",
        icon: "🎠",
        description: "Galeria de imagens",
      },
      {
        type: "spacer",
        label: "Espaçador",
        icon: "⬜",
        description: "Espaço em branco",
      },
      {
        type: "testimonials",
        label: "Depoimentos",
        icon: "💬",
        description: "Citações e depoimentos",
      },
    ];

    const handleKeyDown = (
      event: React.KeyboardEvent<HTMLDivElement>,
      componentType: string
    ) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        // Simular drag start para usuários de teclado
        console.log(`Componente ${componentType} selecionado via teclado`);
      }
    };

    return (
      <div
        className="component-palette"
        role="region"
        aria-label="Paleta de componentes do quiz"
      >
        <h3 className="palette-title" id="components-title">
          🧩 Componentes
        </h3>
        <div
          className="components-grid"
          role="list"
          aria-labelledby="components-title"
        >
          {components.map((component) => (
            <div
              key={component.type}
              className="draggable-component"
              role="listitem"
              tabIndex={0}
              draggable
              aria-label={`${component.label}: ${component.description}`}
              onDragStart={(e) => onDragStart(e, component.type)}
              onKeyDown={(e) => handleKeyDown(e, component.type)}
            >
              <span className="component-icon" aria-hidden="true">
                {component.icon}
              </span>
              <span className="component-label">{component.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

export default ComponentPalette;
