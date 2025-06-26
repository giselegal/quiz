
import { useState, useCallback } from 'react';
import { QuizComponentType, QuizComponentData } from '@/types/quizBuilder';
import { getDefaultData } from '@/utils/quizComponentDefaults';

export const useQuizComponents = () => {
  const [components, setComponents] = useState<QuizComponentData[]>([]);

  const initializeComponents = useCallback((initialComponents: QuizComponentData[]) => {
    setComponents(initialComponents);
  }, []);

  const addComponent = useCallback((type: QuizComponentType, stageId?: string): string => {
    const newComponent: QuizComponentData = {
      id: `component-${Date.now()}`,
      type,
      order: components.filter(c => c.stageId === stageId).length,
      stageId: stageId,
      data: getDefaultData(type),
      style: {
        paddingY: '16',
        paddingX: '16',
        backgroundColor: '',
        textColor: '',
        borderRadius: '0' // Changed from number to string to match the QuizComponentStyle interface
      }
    };

    setComponents(prev => [...prev, newComponent]);
    return newComponent.id;
  }, [components]);

  const updateComponent = useCallback((id: string, updates: Partial<QuizComponentData>) => {
    setComponents(prev => 
      prev.map(component => 
        component.id === id 
          ? { 
              ...component, 
              ...updates,
              data: updates.data ? { ...component.data, ...updates.data } : component.data,
              style: updates.style ? { ...component.style, ...updates.style } : component.style
            } 
          : component
      )
    );
  }, []);

  const deleteComponent = useCallback((id: string) => {
    setComponents(prev => {
      const filteredComponents = prev.filter(component => component.id !== id);
      
      const stageId = prev.find(c => c.id === id)?.stageId;
      
      if (stageId) {
        return filteredComponents.map(component => {
          if (component.stageId === stageId) {
            const stageComponents = filteredComponents.filter(c => c.stageId === stageId);
            const index = stageComponents.indexOf(component);
            return { ...component, order: index };
          }
          return component;
        });
      }
      
      return filteredComponents;
    });
  }, []);

  const moveComponent = useCallback((draggedId: string, targetId: string) => {
    setComponents(prev => {
      const draggedComponent = prev.find(c => c.id === draggedId);
      const targetComponent = prev.find(c => c.id === targetId);
      
      if (!draggedComponent || !targetComponent || draggedComponent.stageId !== targetComponent.stageId) {
        return prev;
      }
      
      const stageComponents = prev.filter(c => c.stageId === draggedComponent.stageId);
      const draggedIndex = stageComponents.findIndex(c => c.id === draggedId);
      const targetIndex = stageComponents.findIndex(c => c.id === targetId);
      
      if (draggedIndex === -1 || targetIndex === -1) return prev;
      
      const newStageComponents = [...stageComponents];
      const [removedComponent] = newStageComponents.splice(draggedIndex, 1);
      newStageComponents.splice(targetIndex, 0, removedComponent);
      
      const updatedStageComponents = newStageComponents.map((component, index) => ({
        ...component,
        order: index
      }));
      
      return prev.map(component => {
        if (component.stageId === draggedComponent.stageId) {
          const updatedComponent = updatedStageComponents.find(c => c.id === component.id);
          return updatedComponent || component;
        }
        return component;
      });
    });
  }, []);

  return {
    components,
    addComponent,
    updateComponent,
    deleteComponent,
    moveComponent,
    initializeComponents
  };
};
