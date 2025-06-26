import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Monitor, Smartphone, Tablet, ZoomIn, ZoomOut, RotateCcw, Grid3X3, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EnhancedCanvasProps {
  children: React.ReactNode;
  onDragOver?: (e: React.DragEvent, index?: number) => void;
  onDrop?: (e: React.DragEvent, index?: number) => void;
  dragOverIndex?: number;
  isEmpty?: boolean;
  className?: string;
}

type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export const EnhancedCanvas: React.FC<EnhancedCanvasProps> = ({
  children,
  onDragOver,
  onDrop,
  dragOverIndex,
  isEmpty = false,
  className
}) => {
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Viewport dimensions
  const getViewportStyles = () => {
    const baseStyles = {
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: `scale(${zoom / 100})`,
      transformOrigin: 'top center',
      margin: '0 auto',
      position: 'relative' as const,
    };

    switch (viewportMode) {
      case 'mobile':
        return { ...baseStyles, maxWidth: '375px', minHeight: '667px' };
      case 'tablet':
        return { ...baseStyles, maxWidth: '768px', minHeight: '1024px' };
      default:
        return { ...baseStyles, maxWidth: '1200px', minHeight: '800px' };
    }
  };

  // Enhanced drag handlers with visual feedback
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    // Only deactivate if leaving the canvas entirely
    if (!canvasRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragActive(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    onDragOver?.(e);
  }, [onDragOver]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    onDrop?.(e);
  }, [onDrop]);

  // Zoom controls
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleZoomReset = () => setZoom(100);

  // Grid toggle
  const toggleGrid = () => setShowGrid(prev => !prev);

  return (
    <div className="enhanced-canvas-container h-full flex flex-col bg-gray-50">
      {/* Canvas Toolbar - Removido */}
      {/* Canvas Area */}
      <div className="flex-1 overflow-auto p-6 relative pl-[0px] pr-[0px]">
        {/* Grid Background */}
        {showGrid && (
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, #e2e8f0 1px, transparent 1px),
                linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
        )}

        {/* Canvas Content */}
        <div
          ref={canvasRef}
          className={cn(
            'canvas-content bg-white shadow-lg rounded-lg overflow-hidden relative',
            isDragActive && 'canvas-drag-active',
            isEmpty && 'canvas-empty',
            showGrid && 'canvas-grid-snap',
            className
          )}
          style={getViewportStyles()}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* Empty State */}
          {isEmpty && (
            <div className="canvas-empty-indicator">
              <div className="canvas-empty-content">
                <div className="canvas-empty-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <path d="m12 8-4 4 4 4"/>
                    <path d="m16 12H8"/>
                  </svg>
                </div>
                <p className="canvas-empty-text">Drag components here to start building</p>
              </div>
            </div>
          )}

          {/* Drop Zones */}
          {isDragActive && !isEmpty && (
            <div className="canvas-drop-indicators">
              <div className="drop-indicator drop-indicator-top" />
              <div className="drop-indicator drop-indicator-bottom" />
            </div>
          )}

          {/* Content */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default EnhancedCanvas;