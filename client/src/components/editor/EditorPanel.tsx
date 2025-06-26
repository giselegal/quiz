
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface EditorGroupProps {
  title: string;
  children: React.ReactNode;
}

export const EditorGroup: React.FC<EditorGroupProps> = ({ title, children }) => {
  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-sm text-gray-700">{title}</h4>
      {children}
    </div>
  );
};

interface EditorFieldProps {
  label: string;
  children: React.ReactNode;
}

export const EditorField: React.FC<EditorFieldProps> = ({ label, children }) => {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-gray-600">{label}</Label>
      {children}
    </div>
  );
};

interface ColorPickerFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const ColorPickerField: React.FC<ColorPickerFieldProps> = ({ 
  label, 
  value, 
  onChange 
}) => {
  return (
    <EditorField label={label}>
      <div className="flex gap-2">
        <Input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-8 p-0 border-0"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
          placeholder="#000000"
        />
      </div>
    </EditorField>
  );
};

interface EditorSectionProps {
  title: string;
  children: React.ReactNode;
}

export const EditorSection: React.FC<EditorSectionProps> = ({ title, children }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Separator className="flex-1" />
        <h3 className="font-semibold text-sm text-gray-800">{title}</h3>
        <Separator className="flex-1" />
      </div>
      {children}
    </div>
  );
};

interface QuickActionsProps {
  onSave?: () => void;
  onReset?: () => void;
  onPreview?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ 
  onSave, 
  onReset, 
  onPreview 
}) => {
  return (
    <div className="flex gap-2">
      {onSave && (
        <Button size="sm" onClick={onSave}>
          Salvar
        </Button>
      )}
      {onPreview && (
        <Button size="sm" variant="outline" onClick={onPreview}>
          Preview
        </Button>
      )}
      {onReset && (
        <Button size="sm" variant="destructive" onClick={onReset}>
          Reset
        </Button>
      )}
    </div>
  );
};
