<template>
  <div class="section">
    <div class="section_heading">
      <div class="section_heading-top">
        <h4>{{ $t('additionalInfo.title') }}</h4>
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
      <p>{{ $t('additionalInfo.description') }}</p>
    </div>
    <div class="section_content">
      <FormCheckboxGroup :title="$t('additionalInfo.languages.title')">
        <FormCheckbox
          v-model="localLanguages"
          :options="languageOptions"
          @update:modelValue="handleLanguagesChange"
        />
      </FormCheckboxGroup>

      <FormGroup :title="$t('additionalInfo.pets.title')">
        <FormSelect
          v-model="localHasPets"
          :options="petOwnershipOptions"
          :placeholder="$t('additionalInfo.pets.hasPets')"
          @update:modelValue="handleHasPetsChange"
        />
        <FormSelect
          v-if="localHasPets === true || localHasPets === 'yes'"
          v-model="localPetTypes"
          :options="petTypeOptions"
          :multiple="true"
          :placeholder="$t('additionalInfo.pets.selectPets')"
          @update:modelValue="handlePetTypesChange"
        />
      </FormGroup>

      <FormGroup :title="$t('additionalInfo.flatmates.title')">
        <FormSelect
          v-model="localFlatmates"
          :options="flatmateOptions"
          :placeholder="$t('additionalInfo.flatmates.placeholder')"
          @update:modelValue="handleFlatmatesChange"
        />
      </FormGroup>

      <FormGroup :title="$t('additionalInfo.smoking.title')">
        <FormSelect
          v-model="localSmoking"
          :options="smokingOptions"
          :placeholder="$t('additionalInfo.smoking.placeholder')"
          @update:modelValue="handleSmokingChange"
        />
      </FormGroup>

      <FormRadioGroup :title="$t('additionalInfo.budget.title')">
        <FormRadio
          v-model="localBudget"
          :options="budgetOptions"
          @update:modelValue="handleBudgetChange"
        />
      </FormRadioGroup>

      <FormGroup :title="$t('additionalInfo.rentalDuration.title')">
        <FormSelect
          v-model="localRentalDuration"
          :options="rentalDurationOptions"
          :placeholder="$t('additionalInfo.rentalDuration.placeholder')"
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
  ref, onMounted, inject, watch, computed,
} from 'vue';
import { useI18n } from 'vue-i18n';
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
    const { t } = useI18n();

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

    // Options for selects/checkboxes/radios with translations
    const languageOptions = computed(() => Object.keys(LANGUAGES).map((key) => ({
      label: t(`additionalInfo.languages.${LANGUAGES[key].value}`),
      value: LANGUAGES[key].value,
    })));

    const petOwnershipOptions = computed(() => [
      { label: t('additionalInfo.pets.yes'), value: true },
      { label: t('additionalInfo.pets.no'), value: false },
    ]);

    const petTypeOptions = computed(() => Object.keys(PET_TYPES).map((key) => ({
      label: t(`additionalInfo.pets.${PET_TYPES[key].value}`),
      value: PET_TYPES[key].value,
    })));

    const flatmateOptions = computed(() => Object.keys(FLATMATE_OPTIONS).map((key) => ({
      label: t(`additionalInfo.flatmates.${FLATMATE_OPTIONS[key].value}`),
      value: FLATMATE_OPTIONS[key].value,
    })));

    const smokingOptions = computed(() => [
      { label: t('additionalInfo.smoking.yes'), value: true },
      { label: t('additionalInfo.smoking.no'), value: false },
    ]);

    const budgetOptions = computed(() => Object.keys(BUDGET_RANGES).map((key) => ({
      label: t(`additionalInfo.budget.${BUDGET_RANGES[key].value}`),
      value: BUDGET_RANGES[key].value,
    })));

    const rentalDurationOptions = computed(() => Object.keys(RENTAL_DURATION).map((key) => ({
      label: t(`additionalInfo.rentalDuration.${RENTAL_DURATION[key].value}`),
      value: RENTAL_DURATION[key].value,
    })));

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
        console.error('Помилка завантаження даних:', error);
        errorMessage.value = t('additionalInfo.messages.errorLoading');
      }
    };

    // Success/error message functions with translations
    const showSuccessMessage = () => {
      successMessage.value = t('additionalInfo.messages.saved');
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
        showErrorMessage('additionalInfo.messages.errorUserNotFound');
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
        console.error(`Помилка оновлення ${field}:`, error);
        showErrorMessage('additionalInfo.messages.errorSaving');
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
