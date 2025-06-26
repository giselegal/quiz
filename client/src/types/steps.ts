
export interface Step {
  id: string;
  title: string;
  type: 'quiz' | 'result' | 'offer';
  order: number;
  elements?: string[]; // IDs of elements belonging to this step
}

export interface StepConfig {
  showInNavigation: boolean;
  allowDeletion: boolean;
  allowDuplication: boolean;
  minSteps: number;
  maxSteps?: number;
}
