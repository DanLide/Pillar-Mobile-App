import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { MMKWStorageService } from 'src/services';

import en_US from './locale_en_US.json';
import fr_CA from './locale_fr_CA.json';

const defaultLanguage = 'en_US';
export const languages = ['en_US', 'fr_CA'];

export const initI18n = () => {
  const lng = MMKWStorageService.getRecord('language') || defaultLanguage;

  i18n.use(initReactI18next).init({
    lng,
    compatibilityJSON: 'v3',
    resources: {
      en_US: {
        translation: en_US,
      },
      fr_CA: {
        translation: fr_CA,
      },
    },
  });
};
