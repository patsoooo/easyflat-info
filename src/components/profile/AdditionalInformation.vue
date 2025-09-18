<template>
  <div class="section">
    <div class="section_heading">
      <div class="section_heading-top">
        <h4>Додаткова інформація</h4>
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
      <p>Розкажіть більше про себе, щоб орендодавці краще вас знали</p>
    </div>
    <div class="section_content">
      <FormCheckboxGroup title="Мови, якими ви володієте">
        <FormCheckbox
          v-model="localLanguages"
          :options="languageOptions"
          @update:modelValue="handleLanguagesChange"
        />
      </FormCheckboxGroup>

      <FormGroup title="Домашні тварини">
        <FormSelect
          v-model="localHasPets"
          :options="petOwnershipOptions"
          placeholder="У вас є домашні тварини"
          @update:modelValue="handleHasPetsChange"
        />
        <FormSelect
          v-if="localHasPets === true || localHasPets === 'yes'"
          v-model="localPetTypes"
          :options="petTypeOptions"
          :multiple="true"
          placeholder="Виберіть тварин, які у вас є"
          @update:modelValue="handlePetTypesChange"
        />
      </FormGroup>

      <FormGroup title="Інформація про співмешканців">
        <FormSelect
          v-model="localFlatmates"
          :options="flatmateOptions"
          placeholder="З ким ви будете орендувати житло"
          @update:modelValue="handleFlatmatesChange"
        />
      </FormGroup>

      <FormGroup title="Шкідливі звички">
        <FormSelect
          v-model="localSmoking"
          :options="smokingOptions"
          placeholder="Ви палите?"
          @update:modelValue="handleSmokingChange"
        />
      </FormGroup>

      <FormRadioGroup title="Ваш бюджет на житло">
        <FormRadio
          v-model="localBudget"
          :options="budgetOptions"
          @update:modelValue="handleBudgetChange"
        />
      </FormRadioGroup>

      <FormGroup title="Термін оренди">
        <FormSelect
          v-model="localRentalDuration"
          :options="rentalDurationOptions"
          placeholder="Термін"
          @update:modelValue="handleRentalDurationChange"
        />
        <FormDatePicker
          v-model="localMoveInDate"
          @update:modelValue="handleMoveInDateChange"
        />
      </FormGroup>
    </div>
  </div>
</template>

<script>
import {
  ref, onMounted, inject, watch,
} from 'vue';
import {
  updateUser,
  getUserByProfileId,
  LANGUAGES,
  PET_TYPES,
  FLATMATE_OPTIONS,
  BUDGET_RANGES,
  RENTAL_DURATION,
} from '@/services/userService';
import FormSelect from '@/components/form/FormSelect.vue';
import FormGroup from '@/components/form/FormGroup.vue';
import FormCheckboxGroup from '@/components/form/FormCheckboxGroup.vue';
import FormRadioGroup from '@/components/form/FormRadioGroup.vue';
import FormRadio from '@/components/form/FormRadio.vue';
import FormCheckbox from '@/components/form/FormCheckbox.vue';
import FormDatePicker from '@/components/form/FormDatePicker.vue';

export default {
  name: 'AdditionalInformation',
  components: {
    FormSelect,
    FormGroup,
    FormCheckboxGroup,
    FormRadioGroup,
    FormRadio,
    FormCheckbox,
    FormDatePicker,
  },
  setup() {
    // Inject function from parent Profile.vue
    const updateUserData = inject('updateUserData', null);

    // Local states for additionalInfo fields
    const localLanguages = ref([]);
    const localHasPets = ref(false);
    const localPetTypes = ref([]);
    const localFlatmates = ref('');
    const localSmoking = ref(false);
    const localBudget = ref('');
    const localRentalDuration = ref('');
    const localMoveInDate = ref(null);

    const successMessage = ref('');
    const errorMessage = ref('');

    // Helper function to update preview immediately
    const updatePreviewData = () => {
      if (updateUserData) {
        updateUserData('additionalInfo', {
          languages: localLanguages.value,
          hasPets: localHasPets.value,
          petTypes: localPetTypes.value,
          flatmates: localFlatmates.value,
          smoking: localSmoking.value,
          budget: localBudget.value,
          rentalDuration: localRentalDuration.value,
          moveInDate: localMoveInDate.value,
        });
      }
    };

    // Watch all local states and update preview
    watch([
      localLanguages,
      localHasPets,
      localPetTypes,
      localFlatmates,
      localSmoking,
      localBudget,
      localRentalDuration,
      localMoveInDate,
    ], () => {
      updatePreviewData();
    }, { deep: true });

    // Options for selects/checkboxes/radios
    const languageOptions = Object.keys(LANGUAGES).map((key) => ({
      label: LANGUAGES[key].label,
      value: LANGUAGES[key].value,
    }));

    const petOwnershipOptions = [
      { label: 'Так', value: true },
      { label: 'Ні', value: false },
    ];

    const petTypeOptions = Object.keys(PET_TYPES).map((key) => ({
      label: PET_TYPES[key].label,
      value: PET_TYPES[key].value,
    }));

    const flatmateOptions = Object.keys(FLATMATE_OPTIONS).map((key) => ({
      label: FLATMATE_OPTIONS[key].label,
      value: FLATMATE_OPTIONS[key].value,
    }));

    const smokingOptions = [
      { label: 'Так', value: true },
      { label: 'Ні', value: false },
    ];

    const budgetOptions = Object.keys(BUDGET_RANGES).map((key) => ({
      label: BUDGET_RANGES[key].label,
      value: BUDGET_RANGES[key].value,
    }));

    const rentalDurationOptions = Object.keys(RENTAL_DURATION).map((key) => ({
      label: RENTAL_DURATION[key].label,
      value: RENTAL_DURATION[key].value,
    }));

    // Load current user data
    const loadUserData = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (!currentUser.profileId) return;

        const user = await getUserByProfileId(currentUser.profileId);
        if (user && user.additionalInfo) {
          const info = user.additionalInfo;
          localLanguages.value = info.languages || [];
          localHasPets.value = info.hasPets || false;
          localPetTypes.value = info.petTypes || [];
          localFlatmates.value = info.flatmates || '';
          localSmoking.value = info.smoking || false;
          localBudget.value = info.budget || '';
          localRentalDuration.value = info.rentalDuration || '';
          localMoveInDate.value = info.moveInDate || null;

          // Update preview data after loading
          updatePreviewData();
        }
      } catch (error) {
        // eslint-disable-next-line
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

    // Get current additionalInfo data
    const getCurrentAdditionalInfo = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const user = await getUserByProfileId(currentUser.profileId);
        return user?.additionalInfo || {
          languages: [],
          languagesText: null,
          hasPets: false,
          petTypes: [],
          petsText: null,
          flatmates: null,
          smoking: false,
          budget: null,
          rentalDuration: null,
          moveInDate: null,
          moveInDateText: null,
        };
      } catch (error) {
        return {
          languages: [],
          languagesText: null,
          hasPets: false,
          petTypes: [],
          petsText: null,
          flatmates: null,
          smoking: false,
          budget: null,
          rentalDuration: null,
          moveInDate: null,
          moveInDateText: null,
        };
      }
    };

    // Update additionalInfo function
    const updateAdditionalInfo = async (field, value) => {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (!currentUser.profileId) {
        showErrorMessage('Помилка: користувач не знайдений');
        return;
      }

      try {
        await updateUser(currentUser.profileId, {
          additionalInfo: {
            ...await getCurrentAdditionalInfo(),
            [field]: value,
          },
        });
        showSuccessMessage();
      } catch (error) {
        // eslint-disable-next-line
        console.error(`Помилка оновлення ${field}:`, error);
        showErrorMessage(`Помилка при збереженні ${field}`);
        loadUserData(); // Restore previous value
      }
    };

    // Field change handlers
    const handleLanguagesChange = async (value) => {
      localLanguages.value = value;
      // Preview updates automatically via watcher
      await updateAdditionalInfo('languages', value);
    };

    const handleHasPetsChange = async (value) => {
      localHasPets.value = value;

      // If selected "No", clear pet types
      if (value === false || value === 'no') {
        localPetTypes.value = [];
        await updateAdditionalInfo('petTypes', []);
      }

      // Preview updates automatically via watcher
      await updateAdditionalInfo('hasPets', value);
    };

    const handlePetTypesChange = async (value) => {
      localPetTypes.value = value;
      // Preview updates automatically via watcher
      await updateAdditionalInfo('petTypes', value);
    };

    const handleFlatmatesChange = async (value) => {
      localFlatmates.value = value;
      // Preview updates automatically via watcher
      await updateAdditionalInfo('flatmates', value);
    };

    const handleSmokingChange = async (value) => {
      localSmoking.value = value;
      // Preview updates automatically via watcher
      await updateAdditionalInfo('smoking', value);
    };

    const handleBudgetChange = async (value) => {
      localBudget.value = value;
      // Preview updates automatically via watcher
      await updateAdditionalInfo('budget', value);
    };

    const handleRentalDurationChange = async (value) => {
      localRentalDuration.value = value;
      // Preview updates automatically via watcher
      await updateAdditionalInfo('rentalDuration', value);
    };

    const handleMoveInDateChange = async (value) => {
      localMoveInDate.value = value;
      // Preview updates automatically via watcher

      // Convert date to ISO format for saving
      const isoDate = value ? new Date(value).toISOString().split('T')[0] : null;
      await updateAdditionalInfo('moveInDate', isoDate);
    };

    // Load data on mount
    onMounted(() => {
      loadUserData();
    });

    return {
      // Local states
      localLanguages,
      localHasPets,
      localPetTypes,
      localFlatmates,
      localSmoking,
      localBudget,
      localRentalDuration,
      localMoveInDate,

      // Options for selects
      languageOptions,
      petOwnershipOptions,
      petTypeOptions,
      flatmateOptions,
      smokingOptions,
      budgetOptions,
      rentalDurationOptions,

      // Messages
      successMessage,
      errorMessage,

      // Handlers
      handleLanguagesChange,
      handleHasPetsChange,
      handlePetTypesChange,
      handleFlatmatesChange,
      handleSmokingChange,
      handleBudgetChange,
      handleRentalDurationChange,
      handleMoveInDateChange,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
