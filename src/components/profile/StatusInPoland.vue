<template>
  <div class="section">
    <div class="section_heading">
      <div class="section_heading-top">
        <h4>Інформація про побут</h4>
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
      <p>Ваш статус громадянства та час перебування в Польщі</p>
    </div>
    <div class="section_content">
      <FormGroup>
        <FormSelect
          v-model="localCitizenshipStatus"
          :options="citizenshipOptions"
          placeholder="Оберіть статус громадянства"
          @update:modelValue="handleCitizenshipChange"
        />
        <FormSelect
          v-model="localResidenceDocument"
          :options="residenceDocumentOptions"
          placeholder="Документ"
          @update:modelValue="handleResidenceDocumentChange"
        />
      </FormGroup>

      <FormRadioGroup title="Термін перебування в Польщі">
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
  ref, inject, watch,
} from 'vue';
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
    // Inject даних з батьківського компонента
    const userData = inject('userData', null);
    const updateUserData = inject('updateUserData', null);

    const localCitizenshipStatus = ref('');
    const localTimeInPoland = ref('');
    const localResidenceDocument = ref('');
    const successMessage = ref('');
    const errorMessage = ref('');

    // Опції для селектів
    const citizenshipOptions = Object.keys(CITIZENSHIP_STATUS).map((key) => ({
      label: CITIZENSHIP_STATUS[key].label,
      value: CITIZENSHIP_STATUS[key].value,
    }));

    const timeInPolandOptions = Object.keys(TIME_IN_POLAND).map((key) => ({
      label: TIME_IN_POLAND[key].label,
      value: TIME_IN_POLAND[key].value,
    }));

    const residenceDocumentOptions = Object.keys(RESIDENCE_DOCUMENTS).map((key) => ({
      label: RESIDENCE_DOCUMENTS[key].label,
      value: RESIDENCE_DOCUMENTS[key].value,
    }));

    // Синхронізація з userData при зміні
    watch(() => userData?.value, (newUserData) => {
      if (newUserData) {
        localCitizenshipStatus.value = newUserData.citizenshipStatus || 'foreigner';
        localTimeInPoland.value = newUserData.timeInPoland || 'less_than_1';
        localResidenceDocument.value = newUserData.residenceDocument || 'residence_card';
      }
    }, { immediate: true });

    // Показ повідомлень
    const showSuccessMessage = () => {
      successMessage.value = 'Збережено';
      errorMessage.value = '';
      setTimeout(() => {
        successMessage.value = '';
      }, 2000);
    };

    const showErrorMessage = (message) => {
      errorMessage.value = message;
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
        showErrorMessage('Помилка: користувач не знайдений');
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
        showErrorMessage('Помилка при збереженні статусу громадянства');
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
        showErrorMessage('Помилка: користувач не знайдений');
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
        showErrorMessage('Помилка при збереженні часу в Польщі');
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
        showErrorMessage('Помилка: користувач не знайдений');
        return;
      }

      try {
        await updateUser(currentUser.profileId, { residenceDocument: value });
        showSuccessMessage();
      } catch (error) {
        // eslint-disable-next-line
        console.error('Помилка оновлення документа перебування:', error);
        showErrorMessage('Помилка при збереженні документа перебування');
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
