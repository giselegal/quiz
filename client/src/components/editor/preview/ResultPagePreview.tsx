
import React from 'react';
import { StyleResult } from '@/types/quiz';
import { ResultPageConfig } from '@/types/resultPageConfig';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultPagePreviewProps {
  primaryStyle: StyleResult;
  config: ResultPageConfig;
  onSectionSelect: (sectionId: string) => void;
  selectedSection: string | null;
}

export const ResultPagePreview: React.FC<ResultPagePreviewProps> = ({
  primaryStyle,
  config,
  onSectionSelect,
  selectedSection
}) => {
  const [viewMode, setViewMode] = React.useState<'desktop' | 'mobile'>('desktop');
  const [isPreviewing, setIsPreviewing] = React.useState(false);

  return (
    <div className="h-full flex flex-col bg-[#FAF9F7]">
      {/* Preview Toolbar */}
      <div className="border-b border-[#B89B7A]/20 p-4 bg-white flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode('desktop')}
            className={viewMode === 'desktop' ? 'bg-[#FAF9F7]' : ''}
          >
            <Monitor className="w-4 h-4 mr-2" />
            Desktop
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode('mobile')}
            className={viewMode === 'mobile' ? 'bg-[#FAF9F7]' : ''}
          >
            <Smartphone className="w-4 h-4 mr-2" />
            Mobile
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsPreviewing(!isPreviewing)}
        >
          <Eye className="w-4 h-4 mr-2" />
          {isPreviewing ? 'Editar' : 'Visualizar'}
        </Button>
      </div>

      {/* Preview Content */}
      <div className={cn(
        "flex-1 overflow-auto p-8",
        viewMode === 'mobile' && 'max-w-md mx-auto'
      )}>
        <div className="min-h-full space-y-8">
          {/* Header Section */}
          <section
            className={cn(
              "p-6 bg-white rounded-lg border-2",
              !isPreviewing && "border-dashed cursor-pointer hover:bg-[#FAF9F7]",
              !isPreviewing && selectedSection === 'header' && "border-[#B89B7A]",
              !isPreviewing && !selectedSection && "border-[#B89B7A]/20"
            )}
            onClick={() => !isPreviewing && onSectionSelect('header')}
          >
            <h1 className="text-2xl font-playfair text-center text-[#432818]">
              {config.header.content.title || 'Seu Resultado'}
            </h1>
          </section>

          {/* Main Content Section */}
          <section
            className={cn(
              "p-6 bg-white rounded-lg border-2",
              !isPreviewing && "border-dashed cursor-pointer hover:bg-[#FAF9F7]",
              !isPreviewing && selectedSection === 'mainContent' && "border-[#B89B7A]",
              !isPreviewing && !selectedSection && "border-[#B89B7A]/20"
            )}
            onClick={() => !isPreviewing && onSectionSelect('mainContent')}
          >
            {/* Style preview content */}
          </section>

          {/* Sales Offer Section */}
          <section
            className={cn(
              "p-6 bg-white rounded-lg border-2",
              !isPreviewing && "border-dashed cursor-pointer hover:bg-[#FAF9F7]",
              !isPreviewing && selectedSection === 'offer' && "border-[#B89B7A]",
              !isPreviewing && !selectedSection && "border-[#B89B7A]/20"
            )}
            onClick={() => !isPreviewing && onSectionSelect('offer')}
          >
            {/* Offer content preview */}
          </section>
        </div>
      </div>
    </div>
  );
};
