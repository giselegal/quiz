import { chatTranslations, ChatTranslationKey } from '@/constants/chatTranslations';

export const useChatTranslation = () => {
  const t = (key: ChatTranslationKey, params?: Record<string, any>): string => {
    let translation = chatTranslations[key] || key;
    
    // Replace parameters in translation string
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(`{${paramKey}}`, String(value));
      });
    }
    
    return translation;
  };

  return { t };
};