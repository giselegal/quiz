
import * as LucideIcons from 'lucide-react';
import { ComponentType } from 'react';

/**
 * Formats kebab-case to PascalCase for Lucide icons
 */
export const formatIconName = (name: string): string => {
  if (!name) return '';
  return name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
};

/**
 * Safely imports a Lucide icon by name
 * @param iconName Name of the icon from lucide-react
 * @returns The icon component or null if not found
 */
export function dynamicIconImport(iconName: string): ComponentType<any> | null {
  if (!iconName) return null;
  
  // Check if the icon exists in lucide-react
  const formattedIconName = formatIconName(iconName);
  
  if (formattedIconName in LucideIcons) {
    // Type assertion to ensure TypeScript recognizes this as a valid component
    const IconComponent = LucideIcons[formattedIconName as keyof typeof LucideIcons] as ComponentType<any>;
    return IconComponent;
  }
  
  console.warn(`Icon "${iconName}" not found in lucide-react`);
  return null;
}

export default dynamicIconImport;
