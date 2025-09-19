<template>
  <div class="section">
    <div class="section_heading">
      <div class="section_heading-top">
        <h4>{{ $t('rentalFormHistory.title') }}</h4>
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
      <p>{{ $t('rentalFormHistory.description') }}</p>
    </div>

    <div class="section_content">
      <!-- Список існуючих записів історії оренди -->
      <div v-if="localRentalHistory.length > 0" class="periods">
        <div
          v-for="(period, index) in localRentalHistory"
          :key="index"
          class="period"
        >
          <div class="period_top">
            <div class="period_left">
              <div class="period_top-icon">
                <img src="../../img/icons/build.svg" alt="build">
              </div>
              <div class="period_top-info">
                <p>{{ $t('rentalFormHistory.rental') }} {{ index + 1 }}</p>
                <span>{{ $t('rentalFormHistory.rentalInfo', { number: index + 1 }) }}</span>
              </div>
            </div>
            <div class="period_right">
              <button
                @click="editPeriod(index)"
                class="circle-btn"
                type="button"
              >
                <img src="../../img/icons/edit.svg" alt="edit">
              </button>
              <button
                @click="removePeriod(index)"
                class="circle-btn red"
                type="button"
              >
                <img src="../../img/icons/delete.svg" alt="delete">
              </button>
            </div>
          </div>

          <!-- Форма показується тільки для періоду що редагується -->
          <div v-if="editingIndex === index" class="period_form">

            <FormGroup :title="$t('rentalFormHistory.housing.title')">
              <FormInput
                v-model="period.street"
                :placeholder="$t('rentalFormHistory.housing.address')"
                @update:modelValue="updatePeriodField(index, 'street', $event)"
              />
              <FormSelect
                v-model="period.city"
                :options="cityOptions"
                :placeholder="$t('rentalFormHistory.housing.city')"
                @update:modelValue="updatePeriodField(index, 'city', $event)"
              />
            </FormGroup>

            <FormFamily>
              <FormGroup :title="$t('rentalFormHistory.period.title')">
                <FormDatePicker
                  v-model="period.startDate"
                  :placeholder="$t('rentalFormHistory.period.startDate')"
                  @update:modelValue="updateStartDate(index, $event)"
                />

                <FormDatePicker
                  v-if="!period.isCurrentlyRenting"
                  v-model="period.endDate"
                  :placeholder="$t('rentalFormHistory.period.endDate')"
                  @update:modelValue="updateEndDate(index, $event)"
                />
              </FormGroup>
              <FormCheckbox
                v-model="period.isCurrentlyRentingArray"
                :options="[{ label: $t('rentalFormHistory.period.currentlyRenting'), value: true }]"
                @update:modelValue="updateCurrentlyRenting(index, $event)"
              />
            </FormFamily>

            <FormGroup :title="$t('rentalFormHistory.confirmation.title')">
              <FormSelect
                v-model="period.rentalConfirmation"
                :options="rentalConfirmationOptions"
                :placeholder="$t('rentalFormHistory.confirmation.placeholder')"
                @update:modelValue="updatePeriodField(index, 'rentalConfirmation', $event)"
              />
            </FormGroup>

            <FormGroup :title="$t('rentalFormHistory.landlordContact.title')">
              <FormInput
                v-model="period.landlordContact"
                :placeholder="$t('rentalFormHistory.landlordContact.placeholder')"
                @update:modelValue="updatePeriodField(index, 'landlordContact', $event)"
              />
            </FormGroup>

          </div>
        </div>
      </div>

      <!-- Кнопка додавання нового періоду -->
      <button
        @click="addNewPeriod"
        class="btn transparent"
        type="button"
      >
        {{ $t('rentalFormHistory.addPeriod') }}
      </button>
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
  CITIES,
  RENTAL_CONFIRMATIONS,
} from '@/services/userService';
import FormInput from '@/components/form/FormInput.vue';
import FormGroup from '@/components/form/FormGroup.vue';
import FormFamily from '@/components/form/FormFamily.vue';
import FormSelect from '@/components/form/FormSelect.vue';
import FormCheckbox from '@/components/form/FormCheckbox.vue';
import FormDatePicker from '@/components/form/FormDatePicker.vue';

export default {
  name: 'RentalHistory',
  components: {
    FormInput,
    FormGroup,
    FormFamily,
    FormSelect,
    FormCheckbox,
    FormDatePicker,
  },
  setup() {
    const { t } = useI18n();

    // Inject functions from parent Profile.vue
    const updateUserData = inject('updateUserData', null);

    const localRentalHistory = ref([]);
    const editingIndex = ref(null);
    const successMessage = ref('');
    const errorMessage = ref('');

    // Options for selects with translations
    const cityOptions = computed(() => Object.keys(CITIES).map((key) => ({
      label: t(`rentalFormHistory.cities.${CITIES[key].value}`),
      value: CITIES[key].value,
    })));

    const rentalConfirmationOptions = computed(
      () => Object.keys(RENTAL_CONFIRMATIONS).map((key) => ({
        label: t(`rentalFormHistory.confirmation.${RENTAL_CONFIRMATIONS[key].value}`),
        value: RENTAL_CONFIRMATIONS[key].value,
      })),
    );

    // Watch local rental history and update parent for preview
    watch(localRentalHistory, (newValue) => {
      if (updateUserData) {
        // Convert the local data format to the format expected by Preview
        const previewData = newValue.map((period) => ({
          ...period,
          // Ensure we have the processed fields that Preview expects
          address: period.street || null,
          city: period.city || null,
          startMonth: period.startMonth || null,
          startYear: period.startYear || null,
          endMonth: period.endMonth || null,
          endYear: period.endYear || null,
          isCurrentlyRenting: period.isCurrentlyRenting || false,
          landlordContact: period.landlordContact || null,
          rentalConfirmation: period.rentalConfirmation || null,
        }));

        updateUserData('rentalHistory', previewData);
      }
    }, { deep: true });

    // Helper function to update preview immediately
    const updatePreviewData = () => {
      if (updateUserData) {
        const previewData = localRentalHistory.value.map((period) => ({
          ...period,
          address: period.street || null,
          city: period.city || null,
        }));
        updateUserData('rentalHistory', previewData);
      }
    };

    // Date conversion functions
    const dateToMonthYear = (dateString) => {
      if (!dateString) return { month: null, year: null };
      const date = new Date(dateString);
      return {
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      };
    };

    const monthYearToDate = (month, year) => {
      if (!month || !year) return null;
      return new Date(year, month - 1, 1).toISOString().split('T')[0];
    };

    // Load user data
    const loadUserData = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (!currentUser.profileId) return;

        const user = await getUserByProfileId(currentUser.profileId);
        if (user && user.rentalHistory) {
          localRentalHistory.value = user.rentalHistory.map((period) => ({
            ...period,
            startDate: monthYearToDate(period.startMonth, period.startYear),
            endDate: monthYearToDate(period.endMonth, period.endYear),
            isCurrentlyRentingArray: period.isCurrentlyRenting ? [true] : [],
          }));

          // Update preview data immediately after loading
          updatePreviewData();

          if (localRentalHistory.value.length > 0) {
            editingIndex.value = localRentalHistory.value.length - 1;
          }
        }
      } catch (error) {
        console.error('Помилка завантаження даних:', error);
        errorMessage.value = t('rentalFormHistory.messages.errorLoading');
      }
    };

    // Success/error message functions with translations
    const showSuccessMessage = () => {
      successMessage.value = t('rentalFormHistory.messages.saved');
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

    // Update rental history in database
    const updateRentalHistory = async () => {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (!currentUser.profileId) {
        showErrorMessage('rentalFormHistory.messages.errorUserNotFound');
        return;
      }

      try {
        const dataToSave = localRentalHistory.value.map((period) => {
          const {
            isCurrentlyRentingArray, startDate, endDate, ...periodData
          } = period;

          const startDateData = dateToMonthYear(startDate);
          const endDateData = dateToMonthYear(endDate);

          return {
            ...periodData,
            startMonth: startDateData.month,
            startYear: startDateData.year,
            endMonth: endDateData.month,
            endYear: endDateData.year,
          };
        });

        await updateUser(currentUser.profileId, {
          rentalHistory: dataToSave,
        });

        // Update preview after successful save
        updatePreviewData();
        showSuccessMessage();
      } catch (error) {
        console.error('Помилка оновлення історії оренди:', error);
        showErrorMessage('rentalFormHistory.messages.errorSaving');
        loadUserData(); // Restore previous value
      }
    };

    // Edit period
    const editPeriod = (index) => {
      if (editingIndex.value === index) {
        editingIndex.value = null;
      } else {
        editingIndex.value = index;
      }
    };

    // Add new period
    const addNewPeriod = () => {
      const newIndex = localRentalHistory.value.length;
      localRentalHistory.value.push({
        street: '',
        city: '',
        startDate: null,
        endDate: null,
        startMonth: null,
        startYear: null,
        endMonth: null,
        endYear: null,
        isCurrentlyRenting: false,
        isCurrentlyRentingArray: [],
        landlordContact: '',
        rentalConfirmation: '',
      });

      editingIndex.value = newIndex;
      // Preview will update automatically via watcher
    };

    // Remove period
    const removePeriod = async (index) => {
      localRentalHistory.value.splice(index, 1);

      if (editingIndex.value === index) {
        editingIndex.value = null;
      } else if (editingIndex.value > index) {
        editingIndex.value -= 1;
      }

      await updateRentalHistory();
    };

    // Update period field
    const updatePeriodField = async (index, field, value) => {
      localRentalHistory.value[index][field] = value;

      // Update preview immediately for better UX
      updatePreviewData();

      // Then save to database
      await updateRentalHistory();
    };

    // Update start date
    const updateStartDate = async (index, value) => {
      localRentalHistory.value[index].startDate = value;
      const { month, year } = dateToMonthYear(value);
      localRentalHistory.value[index].startMonth = month;
      localRentalHistory.value[index].startYear = year;

      // Update preview immediately
      updatePreviewData();

      await updateRentalHistory();
    };

    // Update end date
    const updateEndDate = async (index, value) => {
      localRentalHistory.value[index].endDate = value;
      const { month, year } = dateToMonthYear(value);
      localRentalHistory.value[index].endMonth = month;
      localRentalHistory.value[index].endYear = year;

      // Update preview immediately
      updatePreviewData();

      await updateRentalHistory();
    };

    // Update currently renting status
    const updateCurrentlyRenting = async (index, value) => {
      const isCurrentlyRenting = value.includes(true);
      localRentalHistory.value[index].isCurrentlyRenting = isCurrentlyRenting;
      localRentalHistory.value[index].isCurrentlyRentingArray = value;

      if (isCurrentlyRenting) {
        localRentalHistory.value[index].endDate = null;
        localRentalHistory.value[index].endMonth = null;
        localRentalHistory.value[index].endYear = null;
      }

      // Update preview immediately
      updatePreviewData();

      await updateRentalHistory();
    };

    // Load data on mount
    onMounted(() => {
      loadUserData();
    });

    return {
      localRentalHistory,
      editingIndex,
      cityOptions,
      rentalConfirmationOptions,
      successMessage,
      errorMessage,
      editPeriod,
      addNewPeriod,
      removePeriod,
      updatePeriodField,
      updateStartDate,
      updateEndDate,
      updateCurrentlyRenting,
    };
  },
};
</script>

<style lang="scss" scoped>
.periods {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.period {
  padding: 1.6rem;
  border-radius: 1.6rem;
  border: .12rem solid $border-grey-8;

  &_top {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 4.4rem;
      height: 4.4rem;
      background-color: $bg-blue-12;
      border-radius: 100%;
      margin-right: 1.2rem;

      img {
        width: 2.4rem;
      }
    }

    &-info {
      display: flex;
      flex-direction: column;

      p {
        @include text-15-semibold;
        color: $text-black;
        margin: 0;
      }

      span {
        @include text-13-regular;
        color: $text-grey-6;
      }
    }
  }

  &_left {
    display: flex;
    align-items: center;
  }

  &_right {
    display: flex;
    gap: 1.2rem;
  }

  &_form {
    display: flex;
    flex-direction: column;
    gap: 3.2rem;
    margin-top: 2rem;
    animation: slideDown 0.3s ease-out;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
