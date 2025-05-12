
import React from 'react';
import { Block } from '@/types/editor';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconBlockPreviewProps {
  block: Block;
}

const IconBlockPreview: React.FC<IconBlockPreviewProps> = ({ block }) => {
  const { content = {}, style = {} } = block;
  const { iconName, size, color, alignment } = content;
  
  // Safely get the icon component or use a default
  const getIconComponent = (): React.ElementType => {
    if (!iconName || typeof iconName !== 'string') {
      return LucideIcons.Star; // Default icon
    }
    
    // Format the icon name to PascalCase for Lucide
    const formattedName = iconName
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join('');
    
    // Return the icon component or default to Star if not found
    return (LucideIcons[formattedName as keyof typeof LucideIcons] || LucideIcons.Star) as React.ElementType;
  };
  
  // Get the icon component
  const IconComponent = getIconComponent();
  
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
