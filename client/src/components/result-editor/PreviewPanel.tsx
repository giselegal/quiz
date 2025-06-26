
import React from 'react';
import { StyleResult } from '@/types/quiz';
import { ResultPageConfig } from '@/types/resultPageConfig';
import QuizResult from '@/components/QuizResult';

interface PreviewPanelProps {
  resultPageConfig: ResultPageConfig;
  selectedStyle: StyleResult;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ resultPageConfig, selectedStyle }) => {
  // Create secondary styles to simulate the real result
  const secondaryStyles: StyleResult[] = [
    {
      category: selectedStyle.category === 'Natural' ? 'Clássico' : 'Natural',
      score: 10,
      percentage: 25
    },
    {
      category: selectedStyle.category === 'Contemporâneo' ? 'Elegante' : 'Contemporâneo',
      score: 5,
      percentage: 15
    }
  ];

  return (
    <div className="h-full overflow-auto bg-[#FAF9F7] p-4">
      <div className="border rounded-lg shadow-sm overflow-hidden">
        <div className="p-2 bg-gray-100 border-b flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
          <span className="text-xs text-gray-500 ml-2">Visualização</span>
        </div>
        
        <div className="overflow-auto h-[calc(100vh-180px)]">
          <QuizResult 
            primaryStyle={selectedStyle} 
            secondaryStyles={secondaryStyles}
          />
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;
