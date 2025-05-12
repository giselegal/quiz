
import * as LucideIcons from 'lucide-react';

/**
 * Safely imports a Lucide icon by name
 * @param iconName Name of the icon from lucide-react
 * @returns The icon component or null if not found
 */
export function dynamicIconImport(iconName: string): React.ComponentType<any> | null {
  if (!iconName) return null;
  
  // Check if the icon exists in lucide-react
  if (iconName in LucideIcons) {
    return LucideIcons[iconName as keyof typeof LucideIcons];
  }
  
  console.warn(`Icon "${iconName}" not found in lucide-react`);
  return null;
}

export default dynamicIconImport;
