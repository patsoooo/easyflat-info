<template>
  <div class="section">
    <div class="section_heading">
      <div class="section_heading-top">
        <h4>Фінансова інформація</h4>
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
      <p>Додайте інформацію про ваше поточне місце роботи</p>
    </div>
    <div class="section_content">
      <FormGroup>
        <FormInput
          v-model="localCompany"
          placeholder="Назва компанії"
          @update:modelValue="handleCompanyChange"
        />
        <FormInput
          v-model="localPosition"
          placeholder="Ваша позиція"
          @update:modelValue="handlePositionChange"
        />
      </FormGroup>

      <FormRadioGroup title="Ваша зарплата">
        <FormRadio
          v-model="localSalaryRange"
          :options="salaryRangeOptions"
          @update:modelValue="handleSalaryRangeChange"
        />
      </FormRadioGroup>

      <FormGroup title="Які підтвердження з роботи ви можете надати орендодавцю?">
        <FormSelect
          v-model="localIncomeDocument"
          :options="incomeDocumentOptions"
          placeholder="Тип документу"
          @update:modelValue="handleIncomeDocumentChange"
        />
      </FormGroup>

      <FormRadioGroup title="Термін роботи">
        <FormRadio
          v-model="localWorkDuration"
          :options="workDurationOptions"
          @update:modelValue="handleWorkDurationChange"
        />
      </FormRadioGroup>
    </div>
  </div>
</template>

<script>
import { ref, inject, watch } from 'vue';
import {
  updateUser,
  getUserByProfileId,
  SALARY_RANGES,
  INCOME_DOCUMENTS,
  WORK_DURATION,
  generateWorkplaceInfo,
} from '@/services/userService';
import FormSelect from '@/components/form/FormSelect.vue';
import FormInput from '@/components/form/FormInput.vue';
import FormGroup from '@/components/form/FormGroup.vue';
import FormRadioGroup from '@/components/form/FormRadioGroup.vue';
import FormRadio from '@/components/form/FormRadio.vue';

export default {
  name: 'FinancialInformation',
  components: {
    FormSelect,
    FormInput,
    FormGroup,
    FormRadioGroup,
    FormRadio,
  },
  setup() {
    // Inject даних з батьківського компонента
    const userData = inject('userData', null);
    const updateUserData = inject('updateUserData', null);

    // Локальні стани для workplace полів
    const localCompany = ref('');
    const localPosition = ref('');
    const localSalaryRange = ref('');
    const localIncomeDocument = ref('');
    const localWorkDuration = ref('');

    const successMessage = ref('');
    const errorMessage = ref('');

    // Опції для селектів/радіо
    const salaryRangeOptions = Object.keys(SALARY_RANGES).map((key) => ({
      label: SALARY_RANGES[key].label,
      value: SALARY_RANGES[key].value,
    }));

    const incomeDocumentOptions = Object.keys(INCOME_DOCUMENTS).map((key) => ({
      label: INCOME_DOCUMENTS[key].label,
      value: INCOME_DOCUMENTS[key].value,
    }));

    const workDurationOptions = Object.keys(WORK_DURATION).map((key) => ({
      label: WORK_DURATION[key].label,
      value: WORK_DURATION[key].value,
    }));

    // Синхронізація з userData при зміні
    watch(() => userData?.value, (newUserData) => {
      if (newUserData?.workplace) {
        localCompany.value = newUserData.workplace.company || '';
        localPosition.value = newUserData.workplace.position || '';
        localSalaryRange.value = newUserData.workplace.salaryRange || '';
        localIncomeDocument.value = newUserData.workplace.incomeDocument || '';
        localWorkDuration.value = newUserData.workplace.workDuration || '';
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

    // Отримання поточних workplace даних
    const getCurrentWorkplace = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const user = await getUserByProfileId(currentUser.profileId);
        return user?.workplace || {
          company: null,
          position: null,
          salaryRange: null,
          incomeDocument: null,
          workDuration: null,
          workInfo: null,
        };
      } catch (error) {
        return {
          company: null,
          position: null,
          salaryRange: null,
          incomeDocument: null,
          workDuration: null,
          workInfo: null,
        };
      }
    };

    // Функція оновлення workplace
    const updateWorkplace = async (field, value) => {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (!currentUser.profileId) {
        showErrorMessage('Помилка: користувач не знайдений');
        return;
      }

      try {
        const currentWorkplace = await getCurrentWorkplace();
        const updatedWorkplace = {
          ...currentWorkplace,
          [field]: value || null,
        };

        // Автоматично генеруємо workInfo при зміні company або position
        if (field === 'company' || field === 'position') {
          updatedWorkplace.workInfo = generateWorkplaceInfo(
            field === 'company' ? value : localCompany.value,
            field === 'position' ? value : localPosition.value,
          );
        }

        await updateUser(currentUser.profileId, {
          workplace: updatedWorkplace,
        });

        showSuccessMessage();
      } catch (error) {
        console.error(`Помилка оновлення ${field}:`, error);
        showErrorMessage(`Помилка при збереженні ${field}`);
      }
    };

    // Обробники змін полів
    const handleCompanyChange = async (value) => {
      localCompany.value = value;

      // Оновлюємо дані в батьківському компоненті (для Preview)
      if (updateUserData) {
        updateUserData('workplace.company', value || null);
        // Автоматично оновлюємо workInfo для Preview
        const workInfo = generateWorkplaceInfo(value, localPosition.value);
        updateUserData('workplace.workInfo', workInfo);
      }

      await updateWorkplace('company', value);
    };

    const handlePositionChange = async (value) => {
      localPosition.value = value;

      // Оновлюємо дані в батьківському компоненті (для Preview)
      if (updateUserData) {
        updateUserData('workplace.position', value || null);
        // Автоматично оновлюємо workInfo для Preview
        const workInfo = generateWorkplaceInfo(localCompany.value, value);
        updateUserData('workplace.workInfo', workInfo);
      }

      await updateWorkplace('position', value);
    };

    const handleSalaryRangeChange = async (value) => {
      localSalaryRange.value = value;

      // Оновлюємо дані в батьківському компоненті (для Preview)
      if (updateUserData) {
        updateUserData('workplace.salaryRange', value || null);
      }

      await updateWorkplace('salaryRange', value);
    };

    const handleIncomeDocumentChange = async (value) => {
      localIncomeDocument.value = value;

      // Оновлюємо дані в батьківському компоненті (для Preview)
      if (updateUserData) {
        updateUserData('workplace.incomeDocument', value || null);
      }

      await updateWorkplace('incomeDocument', value);
    };

    const handleWorkDurationChange = async (value) => {
      localWorkDuration.value = value;

      // Оновлюємо дані в батьківському компоненті (для Preview)
      if (updateUserData) {
        updateUserData('workplace.workDuration', value || null);
      }

      await updateWorkplace('workDuration', value);
    };

    return {
      // Локальні стани
      localCompany,
      localPosition,
      localSalaryRange,
      localIncomeDocument,
      localWorkDuration,

      // Опції для селектів
      salaryRangeOptions,
      incomeDocumentOptions,
      workDurationOptions,

      // Повідомлення
      successMessage,
      errorMessage,

      // Обробники
      handleCompanyChange,
      handlePositionChange,
      handleSalaryRangeChange,
      handleIncomeDocumentChange,
      handleWorkDurationChange,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
