
import React from 'react';
import * as LucideIcons from 'lucide-react';

/**
 * Safely imports a Lucide icon by name
 * @param iconName Name of the icon from lucide-react
 * @returns The icon component or null if not found
 */
export function dynamicIconImport(iconName: string): React.ComponentType<any> | null {
  if (!iconName) return null;
  
  // Check if the icon exists in lucide-react
  const formattedIconName = formatIconName(iconName);
  
  if (formattedIconName in LucideIcons) {
    const Icon = LucideIcons[formattedIconName as keyof typeof LucideIcons];
    return Icon as React.ComponentType<any>;
  }
  
  console.warn(`Icon "${iconName}" not found in lucide-react`);
  return null;
}

// Helper function to format kebab-case to PascalCase for Lucide icons
export const formatIconName = (name: string): string => {
  if (!name) return '';
  return name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
};

export default dynamicIconImport;
