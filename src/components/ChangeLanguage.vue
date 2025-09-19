<template>
  <div class="language">
    <var-menu-select v-model="selectedLanguage" @update:model-value="handleLanguageChange">
      <div class="language_select">{{ getCurrentLanguageLabel() }}</div>

      <template #options>
        <var-menu-option
          v-for="lang in availableLanguages"
          :key="lang.code"
          :value="lang.code"
          :label="lang.label"
        />
      </template>
    </var-menu-select>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { changeLocale } from '@/i18n';

export default {
  name: 'ChangeLanguage',
  setup() {
    const { locale, t } = useI18n();

    // Доступні мови (можна зробити через переклади)
    const availableLanguages = computed(() => [
      { code: 'uk', label: t('languages.ukrainian') },
      { code: 'pl', label: t('languages.polish') },
      { code: 'en', label: t('languages.english') },
    ]);

    // Поточна вибрана мова
    const selectedLanguage = computed({
      get: () => locale.value,
      set: (newLocale) => {
        changeLocale(newLocale);
      },
    });

    // Отримати назву поточної мови
    const getCurrentLanguageLabel = () => {
      const currentLang = availableLanguages.value.find((lang) => lang.code === locale.value);
      return currentLang ? currentLang.label : 'Оберіть мову';
    };

    // Обробник зміни мови
    const handleLanguageChange = (newLocale) => {
      if (newLocale && ['uk', 'pl', 'en'].includes(newLocale)) {
        changeLocale(newLocale);
      }
    };

    return {
      selectedLanguage,
      availableLanguages,
      getCurrentLanguageLabel,
      handleLanguageChange,
    };
  },
};
</script>
