<template>
  <div class="section">
    <div class="section_heading">
      <div class="section_heading-top">
        <h4>Персональна інформація</h4>
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
      <p>Так буде виглядати ваш профіль на сайті</p>
    </div>
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
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { updateUser } from '@/services/userService';
import FormInput from '@/components/form/FormInput.vue';
import FormGroup from '@/components/form/FormGroup.vue';

export default {
  name: 'PersonalInfo',
  components: {
    FormInput,
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
    const successMessage = ref('');
    const errorMessage = ref('');

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
      setTimeout(() => {
        successMessage.value = '';
      }, 5000);
    };

    // Автоматичне збереження імені
    const handleFirstNameChange = async (value) => {
      localFirstName.value = value;
      emit('update:firstName', value);

      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (!currentUser.profileId) return;

      try {
        await updateUser(currentUser.profileId, { firstName: value });
        showSuccessMessage();
        errorMessage.value = '';
      } catch (error) {
        console.error('Помилка оновлення імені:', error);
        errorMessage.value = 'Помилка при збереженні імені';
      }
    };

    // Автоматичне збереження прізвища
    const handleLastNameChange = async (value) => {
      localLastName.value = value;
      emit('update:lastName', value);

      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (!currentUser.profileId) return;

      try {
        await updateUser(currentUser.profileId, { lastName: value });
        showSuccessMessage();
        errorMessage.value = '';
      } catch (error) {
        console.error('Помилка оновлення прізвища:', error);
        errorMessage.value = 'Помилка при збереженні прізвища';
      }
    };

    return {
      localFirstName,
      localLastName,
      successMessage,
      errorMessage,
      handleFirstNameChange,
      handleLastNameChange,
    };
  },
};
</script>
