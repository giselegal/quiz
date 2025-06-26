
import React from 'react';
import { EditorPage, EditorElement } from './InLeadEditor';

interface InLeadCanvasProps {
  page?: EditorPage;
  selectedElementId?: string | null;
  onSelectElement: (elementId: string) => void;
  onUpdateElement: (elementId: string, updates: Partial<EditorElement>) => void;
}

const InLeadCanvas: React.FC<InLeadCanvasProps> = ({
  page,
  selectedElementId,
  onSelectElement,
  onUpdateElement
}) => {
  const renderElement = (element: EditorElement) => {
    const isSelected = selectedElementId === element.id;
    const baseStyle = {
      cursor: 'pointer',
      position: 'relative' as const,
      margin: element.style.margin || '0',
      outline: isSelected ? '2px solid #3b82f6' : 'none',
      ...element.style
    };

    // Fix textAlign type casting
    const textAlign = element.style.textAlign as 'left' | 'center' | 'right' | 'justify' | undefined;

    switch (element.type) {
      case 'heading':
        const HeadingTag = (element.content.level as keyof JSX.IntrinsicElements) || 'h1';
        return (
          <HeadingTag
            key={element.id}
            style={{ ...baseStyle, textAlign }}
            onClick={() => onSelectElement(element.id)}
          >
            {element.content.text || 'Heading'}
          </HeadingTag>
        );

      case 'text':
        return (
          <p
            key={element.id}
            style={{ ...baseStyle, textAlign }}
            onClick={() => onSelectElement(element.id)}
          >
            {element.content.text || 'Text'}
          </p>
        );

      case 'image':
        return (
          <img
            key={element.id}
            src={element.content.src}
            alt={element.content.alt || ''}
            style={{
              maxWidth: '100%',
              height: 'auto',
              ...baseStyle,
              textAlign
            }}
            onClick={() => onSelectElement(element.id)}
          />
        );

      case 'button':
        return (
          <button
            key={element.id}
            style={{
              border: 'none',
              cursor: 'pointer',
              color: 'white',
              ...baseStyle,
              textAlign
            }}
            onClick={() => onSelectElement(element.id)}
          >
            {element.content.text || 'Button'}
          </button>
        );

      case 'form':
        return (
          <form
            key={element.id}
            style={{ ...baseStyle, textAlign }}
            onClick={() => onSelectElement(element.id)}
          >
            {element.content.fields?.map((field, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  required={field.required}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
              </div>
            ))}
          </form>
        );

      case 'video':
        return (
          <video
            key={element.id}
            controls
            style={{ ...baseStyle, textAlign }}
            onClick={() => onSelectElement(element.id)}
          >
            <source src={element.content.url} />
            Your browser does not support the video tag.
          </video>
        );

      case 'quiz-question':
        return (
          <div
            key={element.id}
            style={{ ...baseStyle, textAlign }}
            onClick={() => onSelectElement(element.id)}
          >
            <h3>{element.content.question}</h3>
            {element.content.options?.map((option, index) => (
              <div key={index} style={{ margin: '8px 0' }}>
                <input type="radio" name={`question-${element.id}`} id={`option-${index}`} />
                <label htmlFor={`option-${index}`} style={{ marginLeft: '8px' }}>
                  {option}
                </label>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-white min-h-full">
      <div className="max-w-4xl mx-auto">
        {page?.elements.map(renderElement)}
        {(!page || page.elements.length === 0) && (
          <div className="text-gray-500 text-center py-20">
            <p>Canvas vazio. Arraste componentes da barra lateral para começar.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InLeadCanvas;
