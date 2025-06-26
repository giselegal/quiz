import { useState, useCallback, useRef, useEffect } from "react";

interface UndoRedoState<T> {
  past: T[];
  present: T;
  future: T[];
}

export const useUndoRedo = <T>(
  initialState: T,
  maxHistorySize: number = 50
) => {
  const [state, setState] = useState<UndoRedoState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  const lastSavedRef = useRef<T>(initialState);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Salvar estado com debounce para evitar muitas entradas no histórico
  const saveState = useCallback(
    (newState?: T) => {
      const stateToSave = newState || state.present;

      // Cancelar timeout anterior
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Criar novo timeout
      timeoutRef.current = setTimeout(() => {
        // Verificar se o estado realmente mudou
        if (
          JSON.stringify(stateToSave) !== JSON.stringify(lastSavedRef.current)
        ) {
          setState((prev) => {
            const newPast = [...prev.past, prev.present];

            // Limitar o tamanho do histórico
            if (newPast.length > maxHistorySize) {
              newPast.shift();
            }

            lastSavedRef.current = stateToSave;

            return {
              past: newPast,
              present: stateToSave,
              future: [],
            };
          });
        }
      }, 500); // Debounce de 500ms
    },
    [state.present, maxHistorySize]
  );

  // Undo
  const undo = useCallback(() => {
    setState((prev) => {
      if (prev.past.length === 0) return prev;

      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, prev.past.length - 1);

      lastSavedRef.current = previous;

      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future],
      };
    });
  }, []);

  // Redo
  const redo = useCallback(() => {
    setState((prev) => {
      if (prev.future.length === 0) return prev;

      const next = prev.future[0];
      const newFuture = prev.future.slice(1);

      lastSavedRef.current = next;

      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  // Verificar se pode fazer undo/redo
  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  // Atualizar estado atual
  const updatePresent = useCallback((newState: T) => {
    setState((prev) => ({
      ...prev,
      present: newState,
    }));
  }, []);

  // Limpar histórico
  const clearHistory = useCallback(() => {
    setState((prev) => ({
      past: [],
      present: prev.present,
      future: [],
    }));
    lastSavedRef.current = state.present;
  }, [state.present]);

  // Limpar timeout quando componente for desmontado
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Atualizar o presente quando o estado inicial mudar
  useEffect(() => {
    if (JSON.stringify(initialState) !== JSON.stringify(state.present)) {
      updatePresent(initialState);
    }
  }, [initialState, state.present, updatePresent]);

  return {
    state: state.present,
    canUndo,
    canRedo,
    undo,
    redo,
    saveState,
    updatePresent,
    clearHistory,
    historySize: state.past.length,
  };
};
