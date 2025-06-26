
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface InlineTextEditorProps {
  value: string;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
  onChange?: (value: string) => void;
}

export default function InlineTextEditor({
  value,
  placeholder,
  className,
  multiline = false,
  onChange
}: InlineTextEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (onChange) {
      onChange(currentValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setCurrentValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return multiline ? (
      <textarea
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          "resize-none bg-transparent",
          className
        )}
        autoFocus
        rows={3}
      />
    ) : (
      <input
        type="text"
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          "bg-transparent",
          className
        )}
        autoFocus
      />
    );
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "cursor-text min-h-[1.5rem]",
        className
      )}
    >
      {value || placeholder}
    </div>
  );
}
