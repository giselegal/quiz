import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface InlineEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
  element?: 'h1' | 'h2' | 'h3' | 'p' | 'div';
  style?: React.CSSProperties;
}

const InlineEditor: React.FC<InlineEditorProps> = ({
  value,
  onChange,
  placeholder = 'Clique para editar...',
  className = '',
  multiline = false,
  element = 'div',
  style = {}
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const editorRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && editorRef.current) {
      editorRef.current.focus();
      editorRef.current.select();
    }
  }, [isEditing]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onChange(currentValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      setIsEditing(false);
      onChange(currentValue);
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setCurrentValue(value); // Reset to original value
    }
  };

  const Element = element as keyof JSX.IntrinsicElements;

  if (isEditing) {
    return multiline ? (
      <textarea
        ref={editorRef as React.RefObject<HTMLTextAreaElement>}
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          'w-full min-h-[60px] resize-none border border-blue-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500',
          className
        )}
        style={style}
        rows={Math.max(3, currentValue.split('\n').length)}
      />
    ) : (
      <input
        ref={editorRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          'w-full border border-blue-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500',
          className
        )}
        style={style}
      />
    );
  }

  return (
    <Element
      onClick={handleClick}
      className={cn(
        'cursor-pointer hover:bg-blue-50 hover:border hover:border-blue-200 rounded p-1 transition-colors min-h-[1.5em]',
        !currentValue && 'text-gray-400',
        className
      )}
      style={style}
    >
      {currentValue || placeholder}
    </Element>
  );
};

export default InlineEditor;
