
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Block } from '@/types/editor';

interface CustomCodeBlockEditorProps {
  block: Block;
  onUpdate: (content: any) => void;
}

const CustomCodeBlockEditor: React.FC<CustomCodeBlockEditorProps> = ({ block, onUpdate }) => {
  const [showWarning, setShowWarning] = useState(true);
  
  return (
    <div className="space-y-4">
      {showWarning && (
        <Alert variant="warning" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Cuidado ao inserir código HTML personalizado. Códigos incorretos podem causar problemas de renderização.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="custom-code">Código HTML Personalizado</Label>
        <Textarea
          id="custom-code"
          value={block.content.code || ''}
          onChange={(e) => onUpdate({ code: e.target.value })}
          placeholder="<div>Seu código HTML aqui</div>"
          className="font-mono text-sm min-h-[200px]"
        />
      </div>
    </div>
  );
};

export default CustomCodeBlockEditor;
