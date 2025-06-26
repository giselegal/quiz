
import React from 'react';
import LiveQuizEditor from '@/components/live-editor/LiveQuizEditor';

const VisualEditorPage: React.FC = () => {
  return (
    <div className="visual-editor-page h-screen overflow-hidden">
      <div className="h-full">
        <LiveQuizEditor />
      </div>
    </div>
  );
};

export default VisualEditorPage;
