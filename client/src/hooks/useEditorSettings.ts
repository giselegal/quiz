import { useState, useCallback, useEffect } from "react";

export interface EditorSettings {
  viewportMode: "desktop" | "tablet" | "mobile";
  isPreviewMode: boolean;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  autoSave: boolean;
  autoSaveInterval: number;
}

const DEFAULT_SETTINGS: EditorSettings = {
  viewportMode: "desktop",
  isPreviewMode: false,
  showGrid: true,
  snapToGrid: true,
  gridSize: 10,
  autoSave: true,
  autoSaveInterval: 5000,
};

const SETTINGS_KEY = "modern-editor-settings";

export const useEditorSettings = () => {
  const [settings, setSettings] = useState<EditorSettings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error("Erro ao carregar configurações do editor:", error);
    }
    return DEFAULT_SETTINGS;
  });

  const updateSettings = useCallback((updates: Partial<EditorSettings>) => {
    setSettings((prev) => {
      const newSettings = { ...prev, ...updates };
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
      } catch (error) {
        console.error("Erro ao salvar configurações do editor:", error);
      }
      return newSettings;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.removeItem(SETTINGS_KEY);
    } catch (error) {
      console.error("Erro ao limpar configurações do editor:", error);
    }
  }, []);

  // Funções de conveniência
  const setViewportMode = useCallback(
    (mode: EditorSettings["viewportMode"]) => {
      updateSettings({ viewportMode: mode });
    },
    [updateSettings]
  );

  const togglePreviewMode = useCallback(() => {
    updateSettings({ isPreviewMode: !settings.isPreviewMode });
  }, [settings.isPreviewMode, updateSettings]);

  const toggleGrid = useCallback(() => {
    updateSettings({ showGrid: !settings.showGrid });
  }, [settings.showGrid, updateSettings]);

  const toggleSnapToGrid = useCallback(() => {
    updateSettings({ snapToGrid: !settings.snapToGrid });
  }, [settings.snapToGrid, updateSettings]);

  const setGridSize = useCallback(
    (size: number) => {
      updateSettings({ gridSize: Math.max(5, Math.min(50, size)) });
    },
    [updateSettings]
  );

  const toggleAutoSave = useCallback(() => {
    updateSettings({ autoSave: !settings.autoSave });
  }, [settings.autoSave, updateSettings]);

  const setAutoSaveInterval = useCallback(
    (interval: number) => {
      updateSettings({ autoSaveInterval: Math.max(1000, interval) });
    },
    [updateSettings]
  );

  // Estilos para diferentes viewports
  const getViewportStyles = useCallback(() => {
    const baseStyles = {
      transition: "all 0.3s ease-in-out",
      margin: "0 auto",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    };

    switch (settings.viewportMode) {
      case "mobile":
        return {
          ...baseStyles,
          width: "375px",
          minHeight: "667px",
        };
      case "tablet":
        return {
          ...baseStyles,
          width: "768px",
          minHeight: "1024px",
        };
      case "desktop":
      default:
        return {
          ...baseStyles,
          width: "100%",
          minHeight: "600px",
        };
    }
  }, [settings.viewportMode]);

  const getGridStyles = useCallback(() => {
    if (!settings.showGrid) return {};

    return {
      backgroundImage: `
        linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
      `,
      backgroundSize: `${settings.gridSize}px ${settings.gridSize}px`,
    };
  }, [settings.showGrid, settings.gridSize]);

  return {
    settings,
    updateSettings,
    resetSettings,
    setViewportMode,
    togglePreviewMode,
    toggleGrid,
    toggleSnapToGrid,
    setGridSize,
    toggleAutoSave,
    setAutoSaveInterval,
    getViewportStyles,
    getGridStyles,
  };
};
