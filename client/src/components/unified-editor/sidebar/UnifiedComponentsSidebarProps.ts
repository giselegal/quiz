
export interface UnifiedComponentsSidebarProps {
  onComponentSelect: (type: string) => void;
  activeTab?: 'quiz' | 'result' | 'sales';
  activeStageType?: string | null;
}
