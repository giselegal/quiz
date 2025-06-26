
import { useCallback } from 'react';
import { EditorConfig } from '@/types/editor';
import { EditorTemplateActions } from '@/types/editorActions';

export const useEditorTemplates = (
  config: EditorConfig,
  setConfig: (config: EditorConfig) => void
): EditorTemplateActions => {
  const saveAsTemplate = useCallback((name: string) => {
    const templates = JSON.parse(localStorage.getItem('editorTemplates') || '{}');
    templates[name] = config;
    localStorage.setItem('editorTemplates', JSON.stringify(templates));
  }, [config]);

  const loadTemplate = useCallback((name: string) => {
    const templates = JSON.parse(localStorage.getItem('editorTemplates') || '{}');
    if (templates[name]) {
      setConfig(templates[name]);
      return true;
    }
    return false;
  }, [setConfig]);

  return {
    saveAsTemplate,
    loadTemplate
  };
};
