import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EditorElement } from "@/types/editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { replacePlaceholderUrl } from "@/utils/localPlaceholders";

interface EditableElementProps {
  element: EditorElement;
  isSelected: boolean;
  onSelect: () => void;
}

export const EditableElement: React.FC<EditableElementProps> = ({
  element,
  isSelected,
  onSelect,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const renderContent = () => {
    switch (element.type) {
      case "heading": {
        const headingContent = element.content as {
          text: string;
          level: number;
        };
        const HeadingTag = `h${
          headingContent.level || 1
        }` as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag
            className="min-w-full text-3xl font-bold text-center"
            style={element.styles}
          >
            {headingContent.text || "Título"}
          </HeadingTag>
        );
      }

      case "text": {
        const textContent = element.content as { text: string };
        return (
          <p className="min-w-full text-base" style={element.styles}>
            {textContent.text || "Texto"}
          </p>
        );
      }

      case "image": {
        const imageContent = element.content as {
          src: string;
          alt: string;
          width?: number;
          height?: number;
        };
        return (
          <div className="grid">
            <div className="text-lg">
              <div className="text-lg flex items-center justify-center">
                <img
                  src={
                    replacePlaceholderUrl(imageContent.src) ||
                    replacePlaceholderUrl(
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='480' viewBox='0 0 640 480'%3E%3Crect width='640' height='480' fill='%23f0f0f0'/%3E%3Ctext x='320' y='240' font-family='Arial, sans-serif' font-size='20' fill='%23999' text-anchor='middle' dominant-baseline='middle'%3EImagem%3C/text%3E%3C/svg%3E"
                    )
                  }
                  width={imageContent.width || 640}
                  height={imageContent.height || 480}
                  alt={imageContent.alt || "Imagem"}
                  className="object-cover w-full h-auto rounded-lg max-w-96"
                  style={element.styles}
                />
              </div>
            </div>
          </div>
        );
      }

      case "button": {
        const buttonContent = element.content as {
          text: string;
          action: string;
        };
        return (
          <Button className="min-w-full h-14" style={element.styles}>
            {buttonContent.text || "Continuar"}
          </Button>
        );
      }

      case "input": {
        const inputContent = element.content as {
          label: string;
          placeholder: string;
          type: string;
          required: boolean;
          name: string;
        };
        return (
          <div className="grid w-full items-center gap-1.5">
            <Label className="text-sm font-medium leading-none">
              {inputContent.label || "CAMPO"}{" "}
              {inputContent.required && <span>*</span>}
            </Label>
            <Input
              className="flex h-10 w-full rounded-md border border-input bg-background text-base text-left p-4"
              placeholder={inputContent.placeholder || "Digite aqui..."}
              type={inputContent.type || "text"}
              style={element.styles}
            />
          </div>
        );
      }

      case "spacer": {
        const spacerContent = element.content as { height: number };
        return (
          <div
            className="w-full bg-transparent"
            style={{
              height: `${spacerContent.height || 50}px`,
              ...element.styles,
            }}
          />
        );
      }

      case "video": {
        const videoContent = element.content as {
          src: string;
          autoplay: boolean;
          controls: boolean;
        };
        return (
          <div className="w-full">
            <video
              src={
                replacePlaceholderUrl(videoContent.src) ||
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%23f0f0f0'/%3E%3Ctext x='320' y='180' font-family='Arial, sans-serif' font-size='20' fill='%23999' text-anchor='middle' dominant-baseline='middle'%3EVideo%3C/text%3E%3C/svg%3E"
              }
              controls={videoContent.controls !== false}
              autoPlay={videoContent.autoplay || false}
              className="w-full h-auto rounded-lg"
              style={element.styles}
            >
              Seu navegador não suporta vídeos.
            </video>
          </div>
        );
      }

      default:
        return <div>Elemento não reconhecido</div>;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, flexBasis: "100%" }}
      {...attributes}
      {...listeners}
      className={`group/canvas-item max-w-full canvas-item min-h-[1.25rem] relative self-auto mr-auto cursor-pointer ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
    >
      <div
        className={`min-h-[1.25rem] min-w-full relative self-auto box-border customizable-gap group-hover/canvas-item:border-2 border-dashed hover:border-2 border-blue-500 rounded-md ${
          isSelected ? "border-2 border-blue-500" : ""
        }`}
      >
        {renderContent()}
      </div>
    </div>
  );
};
