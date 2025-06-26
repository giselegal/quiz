
import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface ComponentItemProps {
  type: string;
  label: string;
  icon: LucideIcon;
  onAdd: () => void;
}

export const ComponentItem: React.FC<ComponentItemProps> = ({
  type,
  label,
  icon: Icon,
  onAdd
}) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start text-[#8F7A6A] hover:text-[#432818] hover:bg-[#FAF9F7] h-8"
      onClick={onAdd}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </Button>
  );
};
