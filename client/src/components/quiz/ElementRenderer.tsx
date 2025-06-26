
import React from "react";
import { EditorElement } from "@/types/editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ElementRendererProps {
  element: EditorElement;
  onAction?: (action: string, data?: unknown) => void;
}

// Type guards for different content types
const isHeadingContent = (content: any): content is { text: string; level?: number } => {
  return content && typeof content.text === 'string';
};

const isTextContent = (content: any): content is { text: string } => {
  return content && typeof content.text === 'string';
};

const isButtonContent = (content: any): content is { text: string; action?: string } => {
  return content && typeof content.text === 'string';
};

const isInputContent = (content: any): content is { 
  label?: string; 
  type?: string; 
  placeholder?: string; 
  required?: boolean; 
  name?: string; 
} => {
  return content && typeof content === 'object';
};

const isImageContent = (content: any): content is { src: string; alt?: string } => {
  return content && typeof content.src === 'string';
};

const isVideoContent = (content: any): content is { 
  src: string; 
  controls?: boolean; 
  autoplay?: boolean; 
} => {
  return content && typeof content.src === 'string';
};

const isSpacerContent = (content: any): content is { height?: number } => {
  return content && typeof content === 'object';
};

export const ElementRenderer: React.FC<ElementRendererProps> = ({
  element,
  onAction,
}) => {
  const handleAction = (action: string, data?: unknown) => {
    if (onAction) {
      onAction(action, data);
    }
  };

  const getStyles = () => {
    const styles: React.CSSProperties = {};

    if (element.styles?.color) {
      styles.color = element.styles.color;
    }

    if (element.styles?.backgroundColor) {
      styles.backgroundColor = element.styles.backgroundColor;
    }

    if (element.styles?.fontSize) {
      styles.fontSize = `${element.styles.fontSize}px`;
    }

    if (element.styles?.fontWeight) {
      styles.fontWeight = element.styles.fontWeight;
    }

    if (element.styles?.textAlign) {
      styles.textAlign = element.styles.textAlign;
    }

    if (element.styles?.padding) {
      styles.padding = `${element.styles.padding}px`;
    }

    if (element.styles?.margin) {
      styles.margin = `${element.styles.margin}px`;
    }

    if (element.styles?.borderRadius) {
      styles.borderRadius = `${element.styles.borderRadius}px`;
    }

    return styles;
  };

  switch (element.type) {
    case "heading": {
      if (!isHeadingContent(element.content)) {
        return <div>Invalid heading content</div>;
      }
      const HeadingTag = `h${element.content.level || 1}` as keyof JSX.IntrinsicElements;
      return (
        <HeadingTag style={getStyles()} className="font-bold">
          {element.content.text}
        </HeadingTag>
      );
    }

    case "text":
      if (!isTextContent(element.content)) {
        return <div>Invalid text content</div>;
      }
      return (
        <p style={getStyles()} className="text-base">
          {element.content.text}
        </p>
      );

    case "button":
      if (!isButtonContent(element.content)) {
        return <div>Invalid button content</div>;
      }
      return (
        <Button
          style={getStyles()}
          onClick={() =>
            handleAction(element.content.action || "next", element.content)
          }
          className="w-full"
        >
          {element.content.text}
        </Button>
      );

    case "input":
      if (!isInputContent(element.content)) {
        return <div>Invalid input content</div>;
      }
      return (
        <div className="space-y-2">
          {element.content.label && (
            <Label htmlFor={element.id}>{element.content.label}</Label>
          )}
          <Input
            id={element.id}
            type={element.content.type || "text"}
            placeholder={element.content.placeholder}
            required={element.content.required}
            name={element.content.name}
            style={getStyles()}
            onChange={(e) =>
              handleAction("input-change", {
                name: element.content.name,
                value: e.target.value,
              })
            }
          />
        </div>
      );

    case "image":
      if (!isImageContent(element.content)) {
        return <div>Invalid image content</div>;
      }
      return (
        <img
          src={element.content.src}
          alt={element.content.alt || ''}
          style={getStyles()}
          className="max-w-full h-auto"
        />
      );

    case "video":
      if (!isVideoContent(element.content)) {
        return <div>Invalid video content</div>;
      }
      return (
        <video
          src={element.content.src}
          controls={element.content.controls}
          autoPlay={element.content.autoplay}
          style={getStyles()}
          className="max-w-full h-auto"
        />
      );

    case "spacer":
      if (!isSpacerContent(element.content)) {
        return <div>Invalid spacer content</div>;
      }
      return (
        <div
          style={{
            height: `${element.content.height || 50}px`,
            ...getStyles(),
          }}
        />
      );

    default:
      return (
        <div
          style={getStyles()}
          className="p-4 border border-dashed border-gray-300 text-center text-gray-500"
        >
          Elemento desconhecido: {element.type}
        </div>
      );
  }
};
