
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ComponentItemProps {
  type: string;
  label: string;
  icon: LucideIcon;
  description: string;
  onSelect: (componentType: string) => void;
}

export const ComponentItem: React.FC<ComponentItemProps> = ({
  type,
  label,
  icon: Icon,
  description,
  onSelect
}) => {
  return (
    <Button
      variant="ghost"
      className="w-full h-auto p-3 flex items-center gap-3 hover:bg-gray-100 border border-transparent hover:border-gray-200 rounded-lg justify-start"
      onClick={() => onSelect(type)}
    >
      <Icon className="w-5 h-5 text-gray-600 flex-shrink-0" />
      <div className="text-left flex-1">
        <div className="text-sm font-medium text-gray-900">{label}</div>
        <div className="text-xs text-gray-500">{description}</div>
      </div>
    </Button>
  );
};
