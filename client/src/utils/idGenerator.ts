
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const generateDeterministicId = (prefix: string, ...parts: string[]): string => {
  const hash = parts.join('-').replace(/[^a-zA-Z0-9-]/g, '');
  return `${prefix}-${hash}`;
};

export const generateComponentId = (stepId: string, componentType: string, order: number): string => {
  // Garantir IDs únicos e determinísticos baseados no stepId, tipo e ordem
  const cleanStepId = stepId.replace(/[^a-zA-Z0-9-]/g, '');
  const cleanType = componentType.replace(/[^a-zA-Z0-9-]/g, '');
  return `${cleanStepId}-${cleanType}-${order}`;
};

export const extractQuestionIdFromStepId = (stepId: string): string | null => {
  // Extrair ID da questão do stepId para correspondência de dados
  const questionMatch = stepId.match(/step-question-(\d+)/);
  if (questionMatch) return questionMatch[1];
  
  const strategicMatch = stepId.match(/step-strategic-(.+)/);
  if (strategicMatch) return strategicMatch[1];
  
  return null;
};

export const normalizeStepId = (stepId: string): string => {
  // Normalizar IDs para garantir consistência
  return stepId.toLowerCase().replace(/[^a-z0-9-]/g, '');
};
