
import { useCallback } from 'react';
import { EditorConfig } from '@/types/editor';
import { EditorThemeActions } from '@/types/editorActions';

export const useEditorTheme = (
  config: EditorConfig,
  setConfig: (config: EditorConfig) => void
): EditorThemeActions => {
  const updateTheme = useCallback((theme: Partial<EditorConfig['globalStyles']>) => {
    setConfig({
      ...config,
      globalStyles: {
        ...config.globalStyles,
        ...theme
      }
    });
  }, [config, setConfig]);

  return { updateTheme };
};
