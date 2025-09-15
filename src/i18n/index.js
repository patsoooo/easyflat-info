import { createI18n } from 'vue-i18n';
import translations from '../locales/index';

const saveLocale = (locale) => {
  localStorage.setItem('preferredLocale', locale);
};

const getSavedLocale = () => {
  // Спочатку перевіряємо чи є збережена мова
  const saved = localStorage.getItem('preferredLocale');
  if (saved && ['uk', 'pl', 'en'].includes(saved)) {
    return saved;
  }

  // Якщо немає збереженої мови, визначаємо мову браузера
  const browserLang = (navigator.language || navigator.userLanguage).toLowerCase();

  // Перевіряємо мову браузера та повертаємо відповідну локаль
  if (browserLang.startsWith('pl')) return 'pl';
  if (browserLang.startsWith('en')) return 'en';
  if (browserLang.startsWith('uk') || browserLang.startsWith('ru')) return 'uk';

  // За замовчуванням українська
  return 'uk';
};

const i18n = createI18n({
  legacy: false,
  locale: getSavedLocale(),
  fallbackLocale: 'uk',
  messages: translations,
});

export const changeLocale = (newLocale) => {
  if (['uk', 'pl', 'en'].includes(newLocale)) {
    i18n.global.locale.value = newLocale;
    saveLocale(newLocale);
  }
};

export default i18n;
