<template>
  <div class="section">
    <div class="section_heading">
      <div class="section_heading-top">
        <h4>Персональна інформація</h4>
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
      <p>Так буде виглядати ваш профіль на сайті</p>
    </div>
    <div class="section_content">
      <FormGroup>
        <FormInput
          v-model="localFirstName"
          placeholder="Ім'я"
          @update:modelValue="handleFirstNameChange"
        />
        <FormInput
          v-model="localLastName"
          placeholder="Прізвище"
          @update:modelValue="handleLastNameChange"
        />
      </FormGroup>
      <FormGroup title="Ваша стать">
        <FormRadio
          v-model="localGender"
          :options="genderOptions"
          @update:modelValue="handleGenderChange"
        />
      </FormGroup>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import { updateUser, getUserByProfileId, GENDER } from '@/services/userService';
import FormInput from '@/components/form/FormInput.vue';
import FormRadio from '@/components/form/FormRadio.vue';
import FormGroup from '@/components/form/FormGroup.vue';

export default {
  name: 'PersonalInfo',
  components: {
    FormInput,
    FormRadio,
    FormGroup,
  },
  props: {
    firstName: {
      type: String,
      default: '',
    },
    lastName: {
      type: String,
      default: '',
    },
  },
  emits: ['update:firstName', 'update:lastName'],
  setup(props, { emit }) {
    const localFirstName = ref(props.firstName);
    const localLastName = ref(props.lastName);
    const localGender = ref('male'); // дефолтне значення
    const successMessage = ref('');
    const errorMessage = ref('');

    // Опції для статі
    const genderOptions = Object.keys(GENDER).map((key) => ({
      label: GENDER[key].label,
      value: GENDER[key].value,
    }));

    // Завантаження поточних даних користувача
    const loadUserData = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (!currentUser.profileId) return;

        const user = await getUserByProfileId(currentUser.profileId);
        if (user) {
          localGender.value = user.gender || 'male';
        }
      } catch (error) {
        // eslint-disable-next-line
        console.error('Помилка завантаження даних:', error);
        errorMessage.value = 'Помилка завантаження даних';
      }
    };

    // Оновлюємо локальні значення коли змінюються пропси
    watch(() => props.firstName, (newValue) => {
      localFirstName.value = newValue;
    });

    watch(() => props.lastName, (newValue) => {
      localLastName.value = newValue;
    });

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

    // Автоматичне збереження імені
    const handleFirstNameChange = async (value) => {
      localFirstName.value = value;
      emit('update:firstName', value);

      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (!currentUser.profileId) {
        showErrorMessage('Помилка: користувач не знайдений');
        return;
      }

      try {
        await updateUser(currentUser.profileId, { firstName: value });
        showSuccessMessage();
      } catch (error) {
        // eslint-disable-next-line
        console.error('Помилка оновлення імені:', error);
        showErrorMessage('Помилка при збереженні імені');
      }
    };

    // Автоматичне збереження прізвища
    const handleLastNameChange = async (value) => {
      localLastName.value = value;
      emit('update:lastName', value);

      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (!currentUser.profileId) {
        showErrorMessage('Помилка: користувач не знайдений');
        return;
      }

      try {
        await updateUser(currentUser.profileId, { lastName: value });
        showSuccessMessage();
      } catch (error) {
        // eslint-disable-next-line
        console.error('Помилка оновлення прізвища:', error);
        showErrorMessage('Помилка при збереженні прізвища');
      }
    };

    // Обробка зміни статі
    const handleGenderChange = async (value) => {
      localGender.value = value;

      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (!currentUser.profileId) {
        showErrorMessage('Помилка: користувач не знайдений');
        return;
      }

      try {
        await updateUser(currentUser.profileId, { gender: value });
        showSuccessMessage();
      } catch (error) {
        // eslint-disable-next-line
        console.error('Помилка оновлення статі:', error);
        showErrorMessage('Помилка при збереженні статі');
        // Відновлення попереднього значення при помилці
        loadUserData();
      }
    };

    // Завантажуємо дані при монтуванні
    onMounted(() => {
      loadUserData();
    });

    return {
      localFirstName,
      localLastName,
      localGender,
      genderOptions,
      successMessage,
      errorMessage,
      handleFirstNameChange,
      handleLastNameChange,
      handleGenderChange,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
