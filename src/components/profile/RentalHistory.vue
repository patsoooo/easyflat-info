<template>
  <div class="section">
    <div class="section_heading">
      <div class="section_heading-top">
        <h4>Історія оренди</h4>
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
      <p>Додайте інформацію про попередні місця проживання</p>
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
                <p>Оренда {{ index + 1 }}</p>
                <span>Інформація про {{ index + 1 }} оренду</span>
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

            <FormGroup title="Інформація про житло">
              <FormInput
                v-model="period.street"
                placeholder="Адреса"
                @update:modelValue="updatePeriodField(index, 'street', $event)"
              />
              <FormSelect
                v-model="period.city"
                :options="cityOptions"
                placeholder="Місто"
                @update:modelValue="updatePeriodField(index, 'city', $event)"
              />
            </FormGroup>

            <FormFamily>
              <FormGroup title="Період проживання">
                <FormDatePicker
                  v-model="period.startDate"
                  placeholder="Дата початку оренди"
                  @update:modelValue="updateStartDate(index, $event)"
                />

                <FormDatePicker
                  v-if="!period.isCurrentlyRenting"
                  v-model="period.endDate"
                  placeholder="Дата закінчення оренди"
                  @update:modelValue="updateEndDate(index, $event)"
                />
              </FormGroup>
              <FormCheckbox
                v-model="period.isCurrentlyRentingArray"
                :options="[{ label: 'Орендую зараз', value: true }]"
                @update:modelValue="updateCurrentlyRenting(index, $event)"
              />
            </FormFamily>

            <FormGroup title="Які підтвердження про вчасні оплати ви можете надати?">
              <FormSelect
                v-model="period.rentalConfirmation"
                :options="rentalConfirmationOptions"
                placeholder="Тип документу"
                @update:modelValue="updatePeriodField(index, 'rentalConfirmation', $event)"
              />
            </FormGroup>

            <FormGroup title="Контакт з власником">
              <FormInput
                v-model="period.landlordContact"
                placeholder="Номер телефону або емейл"
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
        + Додати період оренди
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
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
    const localRentalHistory = ref([]);
    const editingIndex = ref(null); // Індекс поточного елементу що редагується
    const successMessage = ref('');
    const errorMessage = ref('');

    // Опції для селектів
    const cityOptions = Object.keys(CITIES).map((key) => ({
      label: CITIES[key].label,
      value: CITIES[key].value,
    }));

    const rentalConfirmationOptions = Object.keys(RENTAL_CONFIRMATIONS).map((key) => ({
      label: RENTAL_CONFIRMATIONS[key].label,
      value: RENTAL_CONFIRMATIONS[key].value,
    }));

    // Функція для конвертації дати в місяць/рік для Firebase
    const dateToMonthYear = (dateString) => {
      if (!dateString) return { month: null, year: null };
      const date = new Date(dateString);
      return {
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      };
    };

    // Функція для конвертації місяць/рік в дату для FormDatePicker
    const monthYearToDate = (month, year) => {
      if (!month || !year) return null;
      // Встановлюємо 1 число місяця
      return new Date(year, month - 1, 1).toISOString().split('T')[0];
    };

    // Завантаження поточних даних користувача
    const loadUserData = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (!currentUser.profileId) return;

        const user = await getUserByProfileId(currentUser.profileId);
        if (user && user.rentalHistory) {
          localRentalHistory.value = user.rentalHistory.map((period) => ({
            ...period,
            // Конвертуємо місяць/рік в дати для FormDatePicker
            startDate: monthYearToDate(period.startMonth, period.startYear),
            endDate: monthYearToDate(period.endMonth, period.endYear),
            // Для чекбокса потрібен масив
            isCurrentlyRentingArray: period.isCurrentlyRenting ? [true] : [],
          }));

          // Якщо є записи, показуємо форму для останнього
          if (localRentalHistory.value.length > 0) {
            editingIndex.value = localRentalHistory.value.length - 1;
          }
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

    // Функція оновлення rentalHistory
    const updateRentalHistory = async () => {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (!currentUser.profileId) {
        showErrorMessage('Помилка: користувач не знайдений');
        return;
      }

      try {
        // Підготовка даних для збереження
        const dataToSave = localRentalHistory.value.map((period) => {
          const {
            isCurrentlyRentingArray, startDate, endDate, ...periodData
          } = period;

          // Конвертуємо дати назад в місяць/рік для Firebase
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
        showSuccessMessage();
      } catch (error) {
        console.error('Помилка оновлення історії оренди:', error);
        showErrorMessage('Помилка при збереженні історії оренди');
        loadUserData(); // Відновлення попереднього значення
      }
    };

    // Редагування періоду (відкрити/закрити форму)
    const editPeriod = (index) => {
      // Якщо клікнули на той самий період що вже редагується - закриваємо
      if (editingIndex.value === index) {
        editingIndex.value = null;
      } else {
        // Інакше відкриваємо форму для вибраного періоду
        editingIndex.value = index;
      }
    };

    // Додавання нового періоду
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

      // Відкриваємо форму для нового періоду
      editingIndex.value = newIndex;
    };

    // Видалення періоду
    const removePeriod = async (index) => {
      localRentalHistory.value.splice(index, 1);

      // Якщо видаляємо період що редагується, закриваємо форму
      if (editingIndex.value === index) {
        editingIndex.value = null;
      } else if (editingIndex.value > index) {
        // Якщо видаляємо період перед тим що редагується, коригуємо індекс
        editingIndex.value -= 1;
      }

      await updateRentalHistory();
    };

    // Оновлення поля періоду
    const updatePeriodField = async (index, field, value) => {
      localRentalHistory.value[index][field] = value;
      await updateRentalHistory();
    };

    // Оновлення дати початку
    const updateStartDate = async (index, value) => {
      localRentalHistory.value[index].startDate = value;
      const { month, year } = dateToMonthYear(value);
      localRentalHistory.value[index].startMonth = month;
      localRentalHistory.value[index].startYear = year;
      await updateRentalHistory();
    };

    // Оновлення дати закінчення
    const updateEndDate = async (index, value) => {
      localRentalHistory.value[index].endDate = value;
      const { month, year } = dateToMonthYear(value);
      localRentalHistory.value[index].endMonth = month;
      localRentalHistory.value[index].endYear = year;
      await updateRentalHistory();
    };

    // Оновлення статусу поточної оренди
    const updateCurrentlyRenting = async (index, value) => {
      const isCurrentlyRenting = value.includes(true);
      localRentalHistory.value[index].isCurrentlyRenting = isCurrentlyRenting;
      localRentalHistory.value[index].isCurrentlyRentingArray = value;

      // Якщо орендує зараз, очищаємо дати закінчення
      if (isCurrentlyRenting) {
        localRentalHistory.value[index].endDate = null;
        localRentalHistory.value[index].endMonth = null;
        localRentalHistory.value[index].endYear = null;
      }

      await updateRentalHistory();
    };

    // Завантажуємо дані при монтуванні
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
