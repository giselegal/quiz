import { replitChatTranslations, ReplitChatTranslationKey } from '@/constants/replitChatTranslations';

export const useReplitChatTranslation = () => {
  const t = (key: ReplitChatTranslationKey, params?: Record<string, any>): string => {
    let translation = replitChatTranslations[key] || key;
    
    // Substituir parâmetros na string de tradução
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(`{${paramKey}}`, String(value));
      });
    }
    
    return translation;
  };

  return { t };
};