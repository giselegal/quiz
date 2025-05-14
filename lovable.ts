
// This file provides the lovable component definition interface
export interface LovableProps {
  name: string;
  displayName: string;
  description: string;
  category: string;
  defaultProps: Record<string, any>;
  propsSchema: Record<string, any>;
  render: (props: any) => React.ReactNode;
}

export function defineLovable(config: LovableProps): any {
  return config;
}
