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
import { ref, onMounted } from 'vue';
import {
  updateUser,
  getUserByProfileId,
  CITIZENSHIP_STATUS,
  TIME_IN_POLAND,
  RESIDENCE_DOCUMENTS,
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
    const localCitizenshipStatus = ref('');
    const localTimeInPoland = ref('');
    const localResidenceDocument = ref('');
    const successMessage = ref('');
    const errorMessage = ref('');

    // Опції для громадянства
    const citizenshipOptions = Object.keys(CITIZENSHIP_STATUS).map((key) => ({
      label: CITIZENSHIP_STATUS[key].label,
      value: CITIZENSHIP_STATUS[key].value,
    }));

    // Опції для часу в Польщі
    const timeInPolandOptions = Object.keys(TIME_IN_POLAND).map((key) => ({
      label: TIME_IN_POLAND[key].label,
      value: TIME_IN_POLAND[key].value,
    }));

    // Опції для документів
    const residenceDocumentOptions = Object.keys(RESIDENCE_DOCUMENTS).map((key) => ({
      label: RESIDENCE_DOCUMENTS[key].label,
      value: RESIDENCE_DOCUMENTS[key].value,
    }));

    // Завантаження поточних даних користувача
    const loadUserData = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (!currentUser.profileId) return;

        const user = await getUserByProfileId(currentUser.profileId);
        if (user) {
          localCitizenshipStatus.value = user.citizenshipStatus || 'foreigner';
          localTimeInPoland.value = user.timeInPoland || 'less_than_1';
          localResidenceDocument.value = user.residenceDocument || 'residence_card';
        }
      } catch (error) {
        console.error('Помилка завантаження даних:', error);
        errorMessage.value = 'Помилка завантаження даних';
      }
    };

    // Показ повідомлення про успіх
    const showSuccessMessage = () => {
      successMessage.value = 'Збережено';
      errorMessage.value = '';
      setTimeout(() => {
        successMessage.value = '';
      }, 2000);
    };

    // Показ повідомлення про помилку
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

      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (!currentUser.profileId) {
        showErrorMessage('Помилка: користувач не знайдений');
        return;
      }

      try {
        await updateUser(currentUser.profileId, { citizenshipStatus: value });
        showSuccessMessage();
      } catch (error) {
        console.error('Помилка оновлення статусу громадянства:', error);
        showErrorMessage('Помилка при збереженні статусу громадянства');
        // Відновлення попереднього значення при помилці
        loadUserData();
      }
    };

    // Обробка зміни часу в Польщі
    const handleTimeInPolandChange = async (value) => {
      localTimeInPoland.value = value;

      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (!currentUser.profileId) {
        showErrorMessage('Помилка: користувач не знайдений');
        return;
      }

      try {
        await updateUser(currentUser.profileId, { timeInPoland: value });
        showSuccessMessage();
      } catch (error) {
        console.error('Помилка оновлення часу в Польщі:', error);
        showErrorMessage('Помилка при збереженні часу в Польщі');
        // Відновлення попереднього значення при помилці
        loadUserData();
      }
    };

    // Обробка зміни документа перебування
    const handleResidenceDocumentChange = async (value) => {
      localResidenceDocument.value = value;

      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (!currentUser.profileId) {
        showErrorMessage('Помилка: користувач не знайдений');
        return;
      }

      try {
        await updateUser(currentUser.profileId, { residenceDocument: value });
        showSuccessMessage();
      } catch (error) {
        console.error('Помилка оновлення документа перебування:', error);
        showErrorMessage('Помилка при збереженні документа перебування');
        // Відновлення попереднього значення при помилці
        loadUserData();
      }
    };

    // Завантажуємо дані при монтуванні
    onMounted(() => {
      loadUserData();
    });

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
