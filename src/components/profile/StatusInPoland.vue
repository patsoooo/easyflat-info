<template>
  <div class="section">
    <div class="section_heading">
      <div class="section_heading-top">
        <h4>Інформація про побут</h4>
        <div class="section_heading-top-mes">
          <!-- Success message -->
          <p v-if="successMessage">
            {{ successMessage }}
          </p>
          <!-- Error message -->
          <p v-if="errorMessage">
            {{ errorMessage }}
          </p>
        </div>
      </div>
      <p>Ваш статус громадянства та час перебування в Польщі</p>
    </div>
    <FormGroup>
      <FormSelect
        v-model="localCitizenshipStatus"
        :options="citizenshipOptions"
        placeholder="Статус громадянства"
        @update:modelValue="handleCitizenshipChange"
      />
    </FormGroup>

    <!-- Time in Poland Radio Buttons -->
    <!-- <div class="time-in-poland">
      <h5 class="time-in-poland__title">Час перебування в Польщі</h5>
      <div class="time-in-poland__options">
        <label
          v-for="option in timeInPolandOptions"
          :key="option.value"
          class="radio-option"
        >
          <input
            type="radio"
            :value="option.value"
            v-model="localTimeInPoland"
            @change="handleTimeInPolandChange"
            class="radio-option__input"
          />
          <span class="radio-option__label">{{ option.label }}</span>
        </label>
      </div>
    </div> -->
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import {
  updateUser, getUserByProfileId, CITIZENSHIP_STATUS, TIME_IN_POLAND,
} from '@/services/userService';
import FormSelect from '@/components/form/FormSelect.vue';
import FormGroup from '@/components/form/FormGroup.vue';

export default {
  name: 'StatusInPoland',
  components: {
    FormSelect,
    FormGroup,
  },
  setup() {
    const localCitizenshipStatus = ref('');
    const localTimeInPoland = ref('');
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

    // Завантаження поточних даних користувача
    const loadUserData = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (!currentUser.profileId) return;

        const user = await getUserByProfileId(currentUser.profileId);
        if (user) {
          localCitizenshipStatus.value = user.citizenshipStatus || 'foreigner';
          localTimeInPoland.value = user.timeInPoland || 'less_than_1';
        }
      } catch (error) {
        console.error('Помилка завантаження даних:', error);
      }
    };

    // Показ повідомлення про успіх
    const showSuccessMessage = () => {
      successMessage.value = 'Збережено';
      setTimeout(() => {
        successMessage.value = '';
      }, 2000);
    };

    // Обробка зміни статусу громадянства
    const handleCitizenshipChange = async (value) => {
      localCitizenshipStatus.value = value;

      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (!currentUser.profileId) return;

      try {
        await updateUser(currentUser.profileId, { citizenshipStatus: value });
        showSuccessMessage();
        errorMessage.value = '';
      } catch (error) {
        console.error('Помилка оновлення статусу громадянства:', error);
        errorMessage.value = 'Помилка при збереженні статусу громадянства';
      }
    };

    // Обробка зміни часу в Польщі
    const handleTimeInPolandChange = async () => {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (!currentUser.profileId) return;

      try {
        await updateUser(currentUser.profileId, { timeInPoland: localTimeInPoland.value });
        showSuccessMessage();
        errorMessage.value = '';
      } catch (error) {
        console.error('Помилка оновлення часу в Польщі:', error);
        errorMessage.value = 'Помилка при збереженні часу в Польщі';
      }
    };

    // Завантажуємо дані при монтуванні
    onMounted(() => {
      loadUserData();
    });

    return {
      localCitizenshipStatus,
      localTimeInPoland,
      citizenshipOptions,
      timeInPolandOptions,
      successMessage,
      errorMessage,
      handleCitizenshipChange,
      handleTimeInPolandChange,
    };
  },
};
</script>
