import { useState, useEffect } from 'react';
import { translationService } from '../services/translationService';

export const useTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const changeLanguage = (languageCode: string) => {
    setCurrentLanguage(languageCode);
    translationService.setLanguage(languageCode);
  };

  const t = (key: string): string => {
    return translationService.translate(key);
  };

  return {
    currentLanguage,
    changeLanguage,
    t
  };
};