<template>
  <div class="header">
    <div class="header_logo">
      <img src="../img/logo-black.svg" alt="logo">
    </div>
    <div class="header_language">
      <label for="language-select" class="visually-hidden">
        <select
        id="language-select"
        v-model="currentLocale"
        @change="handleLanguageChange"
        class="header_language-select"
        aria-labelledby="language-select-label"
      >
        <option value="uk">{{ $t('languages.ukrainian') }}</option>
        <option value="pl">{{ $t('languages.polish') }}</option>
        <option value="en">{{ $t('languages.english') }}</option>
      </select>
      </label>
    </div>
  </div>
</template>
<script>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { changeLocale } from '../i18n';

export default {
  name: 'HeaderApp',
  setup() {
    const { locale } = useI18n();

    // Поточна мова
    const currentLocale = computed({
      get: () => locale.value,
      set: (newLocale) => {
        changeLocale(newLocale);
      },
    });

    // Обробник зміни мови
    const handleLanguageChange = (event) => {
      const newLocale = event.target.value;
      changeLocale(newLocale);
    };

    return {
      currentLocale,
      handleLanguageChange,
    };
  },
};
</script>
<style lang="scss">
.header {
  height: 8rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &_language {
    @include text-15-semibold;
    color: $text-black;
  }
  &_logo {
    img {
      height: 2.4rem;
    }
  }
}
</style>
