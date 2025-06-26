
import React from 'react';
import InLeadEditor from '@/components/inlead-editor/InLeadEditor';

const InLeadEditorPage: React.FC = () => {
  return (
    <div className="inlead-editor-page h-screen overflow-hidden">
      <div className="h-full">
        <InLeadEditor />
      </div>
    </div>
  );
};

export default InLeadEditorPage;
