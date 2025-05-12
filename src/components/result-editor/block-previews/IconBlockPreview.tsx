
import React from 'react';
import { Block } from '@/types/editor';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react'; // Default icon
import { formatIconName } from '@/utils/dynamicIconImport';

interface IconBlockPreviewProps {
  block: Block;
}

const IconBlockPreview: React.FC<IconBlockPreviewProps> = ({ block }) => {
  const { content = {}, style = {} } = block;
  const { iconName, size, color, alignment } = content;
  
  // Get the icon component or use Star as default
  const IconComponent = React.useMemo(() => {
    if (!iconName || typeof iconName !== 'string') {
      return Star; // Default icon
    }
    
    const formattedName = formatIconName(iconName);
    return (LucideIcons[formattedName as keyof typeof LucideIcons] as React.ComponentType<any>) || Star;
  }, [iconName]);
  
  // Calculate the icon size
  const iconSize = size ? parseInt(size) : 24;
  const iconColor = color || 'currentColor';
  
  // Get alignment class
  const alignmentClass = {
    'left': 'justify-start',
    'center': 'justify-center',
    'right': 'justify-end'
  }[alignment || 'center'] || 'justify-center';

  return (
    <div 
      className={cn(
        "flex w-full py-4", 
        alignmentClass
      )}
      style={style}
    >
      <IconComponent 
        size={iconSize} 
        color={iconColor} 
        strokeWidth={1.5}
      />
    </div>
  );
};

export default IconBlockPreview;
