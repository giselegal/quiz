import { useEffect, useCallback, useRef, useState } from "react";
import { Block } from "@/types/editor";

interface UseAutoSaveProps {
  blocks: Block[];
  onSave?: () => void;
  autoSaveInterval?: number; // em millisegundos
  storageKey?: string;
}

interface AutoSaveState {
  lastSaved: Date | null;
  isDirty: boolean;
  isSaving: boolean;
  saveIndicator: string;
}

export function useAutoSave({
  blocks,
  onSave,
  autoSaveInterval = 5000, // 5 segundos
  storageKey = "enhanced_editor_auto_save",
}: UseAutoSaveProps) {
  const [state, setState] = useState<AutoSaveState>({
    lastSaved: null,
    isDirty: false,
    isSaving: false,
    saveIndicator: "Salvo",
  });

  const blocksRef = useRef<Block[]>(blocks);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSaveDataRef = useRef<string>("");

  // Update blocks reference
  useEffect(() => {
    blocksRef.current = blocks;
  }, [blocks]);

  // Auto-save function
  const performAutoSave = useCallback(async () => {
    const currentData = JSON.stringify(blocksRef.current);

    // Don't save if data hasn't changed
    if (currentData === lastSaveDataRef.current) {
      return;
    }

    setState((prev) => ({
      ...prev,
      isSaving: true,
      saveIndicator: "Salvando...",
    }));

    try {
      // Save to localStorage
      localStorage.setItem(storageKey, currentData);
      localStorage.setItem(`${storageKey}_timestamp`, new Date().toISOString());

      // Call external save function if provided
      if (onSave) {
        await onSave();
      }

      lastSaveDataRef.current = currentData;

      setState((prev) => ({
        ...prev,
        lastSaved: new Date(),
        isDirty: false,
        isSaving: false,
        saveIndicator: "Salvo automaticamente",
      }));
    } catch (error) {
      console.error("Erro no auto-save:", error);
      setState((prev) => ({
        ...prev,
        isSaving: false,
        saveIndicator: "Erro ao salvar",
      }));
    }
  }, [onSave, storageKey]);

  // Detect changes and schedule auto-save
  useEffect(() => {
    const currentData = JSON.stringify(blocks);

    if (currentData !== lastSaveDataRef.current) {
      setState((prev) => ({
        ...prev,
        isDirty: true,
        saveIndicator: "Alterações não salvas",
      }));

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Schedule auto-save
      timeoutRef.current = setTimeout(() => {
        performAutoSave();
      }, autoSaveInterval);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [blocks, autoSaveInterval, performAutoSave]);

  // Manual save function
  const saveNow = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    performAutoSave();
  }, [performAutoSave]);

  // Load from localStorage
  const loadFromStorage = useCallback(() => {
    try {
      const savedData = localStorage.getItem(storageKey);
      const savedTimestamp = localStorage.getItem(`${storageKey}_timestamp`);

      if (savedData && savedTimestamp) {
        const blocks = JSON.parse(savedData);
        const timestamp = new Date(savedTimestamp);

        return {
          blocks,
          timestamp,
          hasData: true,
        };
      }
    } catch (error) {
      console.error("Erro ao carregar dados salvos:", error);
    }

    return {
      blocks: [],
      timestamp: null,
      hasData: false,
    };
  }, [storageKey]);

  // Clear saved data
  const clearStorage = useCallback(() => {
    localStorage.removeItem(storageKey);
    localStorage.removeItem(`${storageKey}_timestamp`);

    setState((prev) => ({
      ...prev,
      lastSaved: null,
      isDirty: false,
      saveIndicator: "Dados limpos",
    }));
  }, [storageKey]);

  return {
    ...state,
    saveNow,
    loadFromStorage,
    clearStorage,
    hasUnsavedChanges: state.isDirty,
  };
}

export default useAutoSave;
