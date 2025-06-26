import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, Edit3 } from "lucide-react";

interface ImageOption {
  id: string;
  label: string;
  text: string;
  imageUrl?: string;
  alt?: string;
}

interface EditableImageOptionsProps {
  id: string;
  options: ImageOption[];
  isSelected: boolean;
  onSelect: () => void;
  onOptionClick: (optionId: string) => void;
  onOptionUpdate?: (optionId: string, field: string, value: any) => void;
  onConfigureOption?: (optionId: string) => void;
  columns?: number;
}

export const EditableImageOptions: React.FC<EditableImageOptionsProps> = ({
  id,
  options,
  isSelected,
  onSelect,
  onOptionClick,
  onOptionUpdate,
  onConfigureOption,
  columns = 2,
}) => {
  const hasImages = options.some((option) => option.imageUrl);

  return (
    <div
      className={`relative p-4 rounded ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
      onClick={onSelect}
    >
      {isSelected && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
          <Edit3 className="w-3 h-3" />
          Opções com Imagem
        </div>
      )}

      <div
        className={
          hasImages
            ? `grid grid-cols-1 md:grid-cols-${columns} gap-4`
            : "flex flex-col gap-3"
        }
      >
        {options.map((option) => (
          <EditableImageOption
            key={option.id}
            option={option}
            isSelected={isSelected}
            onOptionClick={() => onOptionClick(option.id)}
            onOptionUpdate={onOptionUpdate}
            onConfigureOption={() => onConfigureOption?.(option.id)}
          />
        ))}
      </div>
    </div>
  );
};

interface EditableImageOptionProps {
  option: ImageOption;
  isSelected: boolean;
  onOptionClick: () => void;
  onOptionUpdate?: (optionId: string, field: string, value: any) => void;
  onConfigureOption?: () => void;
}

const EditableImageOption: React.FC<EditableImageOptionProps> = ({
  option,
  isSelected,
  onOptionClick,
  onOptionUpdate,
  onConfigureOption,
}) => {
  const [isEditingText, setIsEditingText] = React.useState(false);
  const [tempText, setTempText] = React.useState(option.text);

  const handleTextDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingText(true);
    setTempText(option.text);
  };

  const handleTextSave = () => {
    onOptionUpdate?.(option.id, "text", tempText);
    setIsEditingText(false);
  };

  const handleTextKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTextSave();
    } else if (e.key === "Escape") {
      setTempText(option.text);
      setIsEditingText(false);
    }
  };

  return (
    <div className="relative group">
      <div
        className="p-4 border border-[#B89B7A]/30 rounded-lg hover:border-[#B89B7A] transition-colors cursor-pointer"
        onClick={onOptionClick}
      >
        {isSelected && (
          <Button
            size="sm"
            variant="outline"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            onClick={(e) => {
              e.stopPropagation();
              onConfigureOption?.();
            }}
          >
            <Settings className="w-3 h-3" />
          </Button>
        )}

        {option.imageUrl && (
          <img
            src={option.imageUrl}
            alt={option.alt || option.text}
            className="w-full h-32 object-cover rounded mb-3"
          />
        )}

        <div className="flex items-center">
          <span className="font-semibold text-[#432818] mr-3">
            {option.label})
          </span>

          {isEditingText ? (
            <Input
              value={tempText}
              onChange={(e) => setTempText(e.target.value)}
              onBlur={handleTextSave}
              onKeyDown={handleTextKeyPress}
              className="flex-1 text-sm"
              autoFocus
            />
          ) : (
            <span
              className="text-[#432818] font-medium hover:bg-yellow-100 rounded px-1 cursor-text"
              onDoubleClick={handleTextDoubleClick}
            >
              {option.text}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

interface ImageOptionEditorProps {
  option: ImageOption;
  onUpdate: (field: string, value: any) => void;
  onClose: () => void;
}

export const ImageOptionEditor: React.FC<ImageOptionEditorProps> = ({
  option,
  onUpdate,
  onClose,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Editar Opção {option.label}</h3>
        <Button size="sm" variant="outline" onClick={onClose}>
          Fechar
        </Button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Texto da Opção</label>
        <Input
          value={option.text}
          onChange={(e) => onUpdate("text", e.target.value)}
          placeholder="Digite o texto da opção"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">URL da Imagem</label>
        <Input
          value={option.imageUrl || ""}
          onChange={(e) => onUpdate("imageUrl", e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Texto Alternativo
        </label>
        <Input
          value={option.alt || ""}
          onChange={(e) => onUpdate("alt", e.target.value)}
          placeholder="Descrição da imagem"
        />
      </div>

      {option.imageUrl && (
        <div>
          <label className="block text-sm font-medium mb-1">Preview</label>
          <img
            src={option.imageUrl}
            alt={option.alt || option.text}
            className="w-full h-32 object-cover rounded border"
            onError={(e) => {
              e.currentTarget.src =
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDIwMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTI4IiBmaWxsPSIjY2NjIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPkVycm88L3RleHQ+Cjwvc3ZnPg==";
            }}
          />
        </div>
      )}
    </div>
  );
};
