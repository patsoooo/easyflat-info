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
import {
  ref, onMounted, inject, watch,
} from 'vue';
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
  setup() {
    // Inject function from parent Profile.vue
    const updateUserData = inject('updateUserData', null);

    // Local states
    const localFirstName = ref('');
    const localLastName = ref('');
    const localGender = ref('male');
    const successMessage = ref('');
    const errorMessage = ref('');

    // Helper function to update preview immediately
    const updatePreviewData = () => {
      if (updateUserData) {
        updateUserData('firstName', localFirstName.value);
        updateUserData('lastName', localLastName.value);
        updateUserData('gender', localGender.value);
      }
    };

    // Watch all local states and update preview
    watch([localFirstName, localLastName, localGender], () => {
      updatePreviewData();
    });

    // Options for gender
    const genderOptions = Object.keys(GENDER).map((key) => ({
      label: GENDER[key].label,
      value: GENDER[key].value,
    }));

    // Load current user data
    const loadUserData = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (!currentUser.profileId) return;

        const user = await getUserByProfileId(currentUser.profileId);
        if (user) {
          localFirstName.value = user.firstName || '';
          localLastName.value = user.lastName || '';
          localGender.value = user.gender || 'male';

          // Update preview data after loading
          updatePreviewData();
        }
      } catch (error) {
        console.error('Помилка завантаження даних:', error);
        errorMessage.value = 'Помилка завантаження даних';
      }
    };

    // Success/error message functions
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

    // Field change handlers
    const handleFirstNameChange = async (value) => {
      localFirstName.value = value;
      // Preview updates automatically via watcher

      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (!currentUser.profileId) {
        showErrorMessage('Помилка: користувач не знайдений');
        return;
      }

      try {
        await updateUser(currentUser.profileId, { firstName: value });
        showSuccessMessage();
      } catch (error) {
        console.error('Помилка оновлення імені:', error);
        showErrorMessage('Помилка при збереженні імені');
      }
    };

    const handleLastNameChange = async (value) => {
      localLastName.value = value;
      // Preview updates automatically via watcher

      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (!currentUser.profileId) {
        showErrorMessage('Помилка: користувач не знайдений');
        return;
      }

      try {
        await updateUser(currentUser.profileId, { lastName: value });
        showSuccessMessage();
      } catch (error) {
        console.error('Помилка оновлення прізвища:', error);
        showErrorMessage('Помилка при збереженні прізвища');
      }
    };

    const handleGenderChange = async (value) => {
      localGender.value = value;
      // Preview updates automatically via watcher

      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (!currentUser.profileId) {
        showErrorMessage('Помилка: користувач не знайдений');
        return;
      }

      try {
        await updateUser(currentUser.profileId, { gender: value });
        showSuccessMessage();
      } catch (error) {
        console.error('Помилка оновлення статі:', error);
        showErrorMessage('Помилка при збереженні статі');
        loadUserData(); // Restore previous value
      }
    };

    // Load data on mount
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
