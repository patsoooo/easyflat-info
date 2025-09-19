<template>
  <div class="section">
    <div class="section_heading">
      <div class="section_heading-top">
        <h4>{{ $t('personalInfo.title') }}</h4>
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
      <p>{{ $t('personalInfo.description') }}</p>
    </div>
    <div class="section_content">
      <FormGroup>
        <FormInput
          v-model="localFirstName"
          :placeholder="$t('personalInfo.firstName')"
          @update:modelValue="handleFirstNameChange"
        />
        <FormInput
          v-model="localLastName"
          :placeholder="$t('personalInfo.lastName')"
          @update:modelValue="handleLastNameChange"
        />
      </FormGroup>
      <FormGroup :title="$t('personalInfo.gender.title')">
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
  ref, onMounted, inject, watch, computed,
} from 'vue';
import { useI18n } from 'vue-i18n';
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
    const { t } = useI18n();

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

    // Options for gender with translations
    const genderOptions = computed(() => Object.keys(GENDER).map((key) => ({
      label: t(`personalInfo.gender.${GENDER[key].value}`),
      value: GENDER[key].value,
    })));

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
        errorMessage.value = t('personalInfo.messages.errorLoading');
      }
    };

    // Success/error message functions
    const showSuccessMessage = () => {
      successMessage.value = t('personalInfo.messages.saved');
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

    // Field change handlers
    const handleFirstNameChange = async (value) => {
      localFirstName.value = value;
      // Preview updates automatically via watcher

      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (!currentUser.profileId) {
        showErrorMessage('personalInfo.messages.errorUserNotFound');
        return;
      }

      try {
        await updateUser(currentUser.profileId, { firstName: value });
        showSuccessMessage();
      } catch (error) {
        console.error('Помилка оновлення імені:', error);
        showErrorMessage('personalInfo.messages.errorSavingFirstName');
      }
    };

    const handleLastNameChange = async (value) => {
      localLastName.value = value;
      // Preview updates automatically via watcher

      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (!currentUser.profileId) {
        showErrorMessage('personalInfo.messages.errorUserNotFound');
        return;
      }

      try {
        await updateUser(currentUser.profileId, { lastName: value });
        showSuccessMessage();
      } catch (error) {
        console.error('Помилка оновлення прізвища:', error);
        showErrorMessage('personalInfo.messages.errorSavingLastName');
      }
    };

    const handleGenderChange = async (value) => {
      localGender.value = value;
      // Preview updates automatically via watcher

      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (!currentUser.profileId) {
        showErrorMessage('personalInfo.messages.errorUserNotFound');
        return;
      }

      try {
        await updateUser(currentUser.profileId, { gender: value });
        showSuccessMessage();
      } catch (error) {
        console.error('Помилка оновлення статі:', error);
        showErrorMessage('personalInfo.messages.errorSavingGender');
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
