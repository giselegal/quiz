import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface EnhancedDropZoneProps {
  onDrop: (e: React.DragEvent, index?: number) => void;
  onDragOver?: (e: React.DragEvent, index?: number) => void;
  index?: number;
  isEmpty?: boolean;
  isActive?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const EnhancedDropZone: React.FC<EnhancedDropZoneProps> = ({
  onDrop,
  onDragOver,
  index,
  isEmpty = false,
  isActive = false,
  className,
  children
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    onDragOver?.(e, index);
  }, [onDragOver, index]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(e, index);
  }, [onDrop, index]);

  if (isEmpty) {
    return (
      <div
        className={cn(
          'relative rounded-lg border-2 border-dashed border-gray-300 bg-transparent transition-all duration-300',
          'min-h-[120px] flex items-center justify-center my-4',
          isDragOver && 'border-blue-500 bg-blue-50 shadow-lg ring-4 ring-blue-100',
          className
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Drop indicator line */}
        {isDragOver && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 z-10 shadow-lg" />
        )}
        
        <div className={cn(
          'flex flex-col items-center gap-2 text-gray-400 transition-colors duration-300',
          isDragOver && 'text-blue-500'
        )}>
          <div className={cn(
            'flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 transition-all duration-300',
            isDragOver && 'bg-blue-100 transform scale-110'
          )}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          {isDragOver && (
            <span className="text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-300">
              Drop component here
            </span>
          )}
        </div>
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative rounded-lg transition-all duration-300',
        isActive && 'bg-blue-50/20 border border-dashed border-blue-300 my-2 min-h-[40px] flex items-center justify-center',
        isDragOver && 'bg-blue-50',
        className
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Drop indicator line for between components */}
      {isDragOver && !isEmpty && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 z-10 shadow-lg" />
      )}
      {children}
    </div>
  );
};

export default EnhancedDropZone;