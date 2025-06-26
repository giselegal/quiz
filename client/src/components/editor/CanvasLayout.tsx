
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit3 } from 'lucide-react';

interface CanvasLayoutProps {
  children: React.ReactNode;
}

export const CanvasLayout: React.FC<CanvasLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#fffaf7] flex flex-col">
      {children}
    </div>
  );
};

interface CanvasHeaderProps {
  logoUrl?: string;
  progress?: number;
  onBackClick?: () => void;
}

export const CanvasHeader: React.FC<CanvasHeaderProps> = ({ 
  logoUrl, 
  progress = 0, 
  onBackClick 
}) => {
  return (
    <div className="grid gap-4 opacity-100 mb-6 p-4">
      <div className="flex flex-row w-full h-auto justify-center relative">
        <Button 
          onClick={onBackClick}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ghost hover:bg-primary hover:text-foreground h-10 w-10 absolute left-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex flex-col w-full customizable-width justify-start items-center gap-4">
          {logoUrl && (
            <img 
              width="96" 
              height="96" 
              className="max-w-24 object-cover" 
              alt="Logo" 
              src={logoUrl}
            />
          )}
          
          <div 
            role="progressbar" 
            className="relative w-full overflow-hidden rounded-full bg-zinc-300 h-2"
          >
            <div 
              data-state="indeterminate" 
              data-max="100" 
              className="progress h-full w-full flex-1 bg-primary transition-all" 
              style={{ 
                transform: `translateX(-${100 - progress}%)`
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CanvasContentProps {
  children: React.ReactNode;
}

export const CanvasContent: React.FC<CanvasContentProps> = ({ children }) => {
  return (
    <div className="container mx-auto px-4 py-8 w-full max-w-5xl flex-1">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {children}
      </div>
    </div>
  );
};

export const CanvasFooter: React.FC = () => {
  return (
    <div className="p-4 text-center text-sm text-gray-500">
      Quiz Editor
    </div>
  );
};

interface EditableHeadingCanvasProps {
  id: string;
  text: string;
  isSelected: boolean;
  onSelect: () => void;
  onTextChange: (text: string) => void;
  className?: string;
}

export const EditableHeadingCanvas: React.FC<EditableHeadingCanvasProps> = ({
  id,
  text,
  isSelected,
  onSelect,
  onTextChange,
  className
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [tempText, setTempText] = React.useState(text);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setTempText(text);
  };

  const handleSave = () => {
    onTextChange(tempText);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setTempText(text);
      setIsEditing(false);
    }
  };

  return (
    <div 
      className={`relative p-2 rounded ${isSelected ? 'ring-2 ring-blue-500' : ''} ${className || ''}`}
      onClick={onSelect}
    >
      {isSelected && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded">
          <Edit3 className="w-3 h-3 inline mr-1" />
          Título
        </div>
      )}
      
      {isEditing ? (
        <input
          type="text"
          value={tempText}
          onChange={(e) => setTempText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyPress}
          className="w-full text-center text-3xl font-bold font-playfair text-[#432818] bg-transparent border-b-2 border-blue-500 outline-none"
          autoFocus
        />
      ) : (
        <h1 
          className="min-w-full font-bold text-center leading-tight text-[#432818] text-3xl font-playfair cursor-pointer hover:bg-yellow-100 rounded p-2"
          onDoubleClick={handleDoubleClick}
          style={{ 
            fontFamily: '"Playfair Display", serif',
            fontSize: '1.875rem',
            lineHeight: '1.4',
            marginBottom: '1.5rem'
          }}
        >
          {text}
        </h1>
      )}
    </div>
  );
};

interface EditableSpacerCanvasProps {
  id: string;
  isSelected: boolean;
  onSelect: () => void;
  height?: number;
}

export const EditableSpacerCanvas: React.FC<EditableSpacerCanvasProps> = ({
  id,
  isSelected,
  onSelect,
  height = 24
}) => {
  return (
    <div 
      className={`relative cursor-pointer ${isSelected ? 'bg-blue-50 border-2 border-dashed border-blue-500' : 'hover:bg-gray-50 border-2 border-dashed border-transparent'}`}
      style={{ height: `${height}px` }}
      onClick={onSelect}
    >
      {isSelected && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
          Espaçador ({height}px)
        </div>
      )}
    </div>
  );
};

interface EditableOptionsCanvasProps {
  id: string;
  options: Array<{
    id: string;
    label: string;
    text: string;
    imageUrl?: string;
    alt?: string;
  }>;
  isSelected: boolean;
  onSelect: () => void;
  onOptionClick: (optionId: string) => void;
  onOptionUpdate?: (optionId: string, field: string, value: any) => void;
  onConfigureOption?: (optionId: string) => void;
  columns?: number;
}

export const EditableOptionsCanvas: React.FC<EditableOptionsCanvasProps> = ({
  id,
  options,
  isSelected,
  onSelect,
  onOptionClick,
  onOptionUpdate,
  onConfigureOption,
  columns = 2
}) => {
  const hasImages = options.some(option => option.imageUrl);

  return (
    <div 
      className={`relative p-4 rounded ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onSelect}
    >
      {isSelected && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded">
          <Edit3 className="w-3 h-3 inline mr-1" />
          Opções
        </div>
      )}
      
      <div className={hasImages ? `grid grid-cols-1 md:grid-cols-${columns} gap-4` : 'flex flex-col gap-3'}>
        {options.map((option) => (
          <div
            key={option.id}
            className="p-4 border border-[#B89B7A]/30 rounded-lg hover:border-[#B89B7A] transition-colors cursor-pointer"
            onClick={() => onOptionClick(option.id)}
            onDoubleClick={() => onConfigureOption?.(option.id)}
          >
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
              <span className="text-[#432818] font-medium">
                {option.text}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface EditableButtonCanvasProps {
  id: string;
  text: string;
  isSelected: boolean;
  onSelect: () => void;
  onClick: () => void;
  onTextChange: (text: string) => void;
}

export const EditableButtonCanvas: React.FC<EditableButtonCanvasProps> = ({
  id,
  text,
  isSelected,
  onSelect,
  onClick,
  onTextChange
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [tempText, setTempText] = React.useState(text);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setTempText(text);
  };

  const handleSave = () => {
    onTextChange(tempText);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setTempText(text);
      setIsEditing(false);
    }
  };

  return (
    <div 
      className={`relative p-4 rounded ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onSelect}
    >
      {isSelected && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded">
          <Edit3 className="w-3 h-3 inline mr-1" />
          Botão
        </div>
      )}
      
      <div className="mt-8 text-center">
        {isEditing ? (
          <input
            type="text"
            value={tempText}
            onChange={(e) => setTempText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyPress}
            className="bg-[#B89B7A] text-white px-8 py-3 rounded-lg font-medium border-2 border-blue-500 outline-none"
            autoFocus
          />
        ) : (
          <button 
            className="bg-[#B89B7A] text-white px-8 py-3 rounded-lg hover:bg-[#9F8A6B] transition-colors"
            onClick={onClick}
            onDoubleClick={handleDoubleClick}
          >
            {text}
          </button>
        )}
      </div>
    </div>
  );
};
