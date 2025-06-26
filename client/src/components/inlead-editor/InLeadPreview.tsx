
import React from 'react';
import { EditorPage } from './InLeadEditor';

interface InLeadPreviewProps {
  page?: EditorPage;
}

const InLeadPreview: React.FC<InLeadPreviewProps> = ({ page }) => {
  return (
    <div className="p-6 bg-gray-100 min-h-full">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Preview</h2>
        {page?.elements && page.elements.length > 0 ? (
          <div className="space-y-4">
            {page.elements.map((element) => (
              <div key={element.id} className="border-b pb-4">
                <p className="text-sm text-gray-500 mb-2">
                  {element.type} - {element.id}
                </p>
                <div style={{
                  ...element.style,
                  textAlign: element.style.textAlign as 'left' | 'center' | 'right' | 'justify' | undefined
                }}>
                  {element.content.text || element.content.question || 'Preview content'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-20">
            <p>Nenhum elemento para visualizar.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InLeadPreview;
