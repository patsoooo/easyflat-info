<template>
  <div class="section">
    <div class="section_heading">
      <div class="section_heading-top">
        <h4>{{ $t('statusInPoland.title') }}</h4>
        <div class="section_heading-top-mes">
          <!-- Success message -->
          <p v-if="successMessage" class="success-message">
            {{ successMessage }}
          </p>
          <!-- Error message -->
          <p v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </p>
        </div>
      </div>
      <p>{{ $t('statusInPoland.description') }}</p>
    </div>
    <div class="section_content">
      <FormGroup>
        <FormSelect
          v-model="localCitizenshipStatus"
          :options="citizenshipOptions"
          :placeholder="$t('statusInPoland.citizenshipStatus.placeholder')"
          @update:modelValue="handleCitizenshipChange"
        />
        <FormSelect
          v-model="localResidenceDocument"
          :options="residenceDocumentOptions"
          :placeholder="$t('statusInPoland.residenceDocument.placeholder')"
          @update:modelValue="handleResidenceDocumentChange"
        />
      </FormGroup>

      <FormRadioGroup :title="$t('statusInPoland.timeInPoland.title')">
        <FormRadio
          v-model="localTimeInPoland"
          :options="timeInPolandOptions"
          @update:modelValue="handleTimeInPolandChange"
        />
      </FormRadioGroup>
    </div>
  </div>
</template>

<script>
import {
  ref, inject, watch, computed,
} from 'vue';
import { useI18n } from 'vue-i18n';
import {
  updateUser,
  CITIZENSHIP_STATUS,
  TIME_IN_POLAND,
  RESIDENCE_DOCUMENTS,
  generateDescription,
} from '@/services/userService';
import FormSelect from '@/components/form/FormSelect.vue';
import FormRadioGroup from '@/components/form/FormRadioGroup.vue';
import FormGroup from '@/components/form/FormGroup.vue';
import FormRadio from '@/components/form/FormRadio.vue';

export default {
  name: 'StatusInPoland',
  components: {
    FormSelect,
    FormRadioGroup,
    FormGroup,
    FormRadio,
  },
  setup() {
    const { t } = useI18n();

    // Inject даних з батьківського компонента
    const userData = inject('userData', null);
    const updateUserData = inject('updateUserData', null);

    const localCitizenshipStatus = ref('');
    const localTimeInPoland = ref('');
    const localResidenceDocument = ref('');
    const successMessage = ref('');
    const errorMessage = ref('');

    // Опції для селектів з перекладами
    const citizenshipOptions = computed(() => Object.keys(CITIZENSHIP_STATUS).map((key) => ({
      label: t(`statusInPoland.citizenshipStatus.${CITIZENSHIP_STATUS[key].value}`),
      value: CITIZENSHIP_STATUS[key].value,
    })));

    const timeInPolandOptions = computed(() => Object.keys(TIME_IN_POLAND).map((key) => ({
      label: t(`statusInPoland.timeInPoland.${TIME_IN_POLAND[key].value}`),
      value: TIME_IN_POLAND[key].value,
    })));

    const residenceDocumentOptions = computed(() => Object.keys(RESIDENCE_DOCUMENTS).map((key) => ({
      label: t(`statusInPoland.residenceDocument.${RESIDENCE_DOCUMENTS[key].value}`),
      value: RESIDENCE_DOCUMENTS[key].value,
    })));

    // Синхронізація з userData при зміні
    watch(() => userData?.value, (newUserData) => {
      if (newUserData) {
        localCitizenshipStatus.value = newUserData.citizenshipStatus || 'foreigner';
        localTimeInPoland.value = newUserData.timeInPoland || 'less_than_1';
        localResidenceDocument.value = newUserData.residenceDocument || 'residence_card';
      }
    }, { immediate: true });

    // Показ повідомлень з перекладами
    const showSuccessMessage = () => {
      successMessage.value = t('statusInPoland.messages.saved');
      errorMessage.value = '';
      setTimeout(() => {
        successMessage.value = '';
      }, 2000);
    };

    const showErrorMessage = (messageKey) => {
      errorMessage.value = t(messageKey);
      successMessage.value = '';
      setTimeout(() => {
        errorMessage.value = '';
      }, 3000);
    };

    // Обробка зміни статусу громадянства
    const handleCitizenshipChange = async (value) => {
      localCitizenshipStatus.value = value;

      // Оновлюємо дані в батьківському компоненті (для Preview)
      if (updateUserData) {
        updateUserData('citizenshipStatus', value);
        // Оновлюємо опис автоматично
        const newDescription = generateDescription(value, localTimeInPoland.value);
        updateUserData('description', newDescription);
      }

      // Зберігаємо в базу даних
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (!currentUser.profileId) {
        showErrorMessage('statusInPoland.messages.errorUserNotFound');
        return;
      }

      try {
        await updateUser(currentUser.profileId, {
          citizenshipStatus: value,
          description: generateDescription(value, localTimeInPoland.value),
        });
        showSuccessMessage();
      } catch (error) {
        // eslint-disable-next-line
        console.error('Помилка оновлення статусу громадянства:', error);
        showErrorMessage('statusInPoland.messages.errorSavingCitizenship');
      }
    };

    // Обробка зміни часу в Польщі
    const handleTimeInPolandChange = async (value) => {
      localTimeInPoland.value = value;

      // Оновлюємо дані в батьківському компоненті (для Preview)
      if (updateUserData) {
        updateUserData('timeInPoland', value);
        // Оновлюємо опис автоматично
        const newDescription = generateDescription(localCitizenshipStatus.value, value);
        updateUserData('description', newDescription);
      }

      // Зберігаємо в базу даних
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (!currentUser.profileId) {
        showErrorMessage('statusInPoland.messages.errorUserNotFound');
        return;
      }

      try {
        await updateUser(currentUser.profileId, {
          timeInPoland: value,
          description: generateDescription(localCitizenshipStatus.value, value),
        });
        showSuccessMessage();
      } catch (error) {
        // eslint-disable-next-line
        console.error('Помилка оновлення часу в Польщі:', error);
        showErrorMessage('statusInPoland.messages.errorSavingTimeInPoland');
      }
    };

    // Обробка зміни документа перебування
    const handleResidenceDocumentChange = async (value) => {
      localResidenceDocument.value = value;

      // Оновлюємо дані в батьківському компоненті (для Preview)
      if (updateUserData) {
        updateUserData('residenceDocument', value);
      }

      // Зберігаємо в базу даних
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (!currentUser.profileId) {
        showErrorMessage('statusInPoland.messages.errorUserNotFound');
        return;
      }

      try {
        await updateUser(currentUser.profileId, { residenceDocument: value });
        showSuccessMessage();
      } catch (error) {
        // eslint-disable-next-line
        console.error('Помилка оновлення документа перебування:', error);
        showErrorMessage('statusInPoland.messages.errorSavingResidenceDocument');
      }
    };

    return {
      localCitizenshipStatus,
      localTimeInPoland,
      localResidenceDocument,
      citizenshipOptions,
      timeInPolandOptions,
      residenceDocumentOptions,
      successMessage,
      errorMessage,
      handleCitizenshipChange,
      handleTimeInPolandChange,
      handleResidenceDocumentChange,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
