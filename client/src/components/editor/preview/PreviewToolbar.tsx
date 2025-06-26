
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Monitor, Smartphone } from 'lucide-react';

interface PreviewToolbarProps {
  viewMode: 'desktop' | 'mobile';
  isPreviewing: boolean;
  onViewModeChange: (mode: 'desktop' | 'mobile') => void;
  onPreviewToggle: () => void;
}

export const PreviewToolbar: React.FC<PreviewToolbarProps> = ({
  viewMode,
  isPreviewing,
  onViewModeChange,
  onPreviewToggle
}) => {
  return (
    <div className="border-b border-[#B89B7A]/20 p-4 bg-white flex items-center justify-between">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewModeChange('desktop')}
          className={viewMode === 'desktop' ? 'bg-[#FAF9F7]' : ''}
        >
          <Monitor className="w-4 h-4 mr-2" />
          Desktop
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewModeChange('mobile')}
          className={viewMode === 'mobile' ? 'bg-[#FAF9F7]' : ''}
        >
          <Smartphone className="w-4 h-4 mr-2" />
          Mobile
        </Button>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onPreviewToggle}
      >
        <Eye className="w-4 h-4 mr-2" />
        {isPreviewing ? 'Editar' : 'Visualizar'}
      </Button>
    </div>
  );
};
