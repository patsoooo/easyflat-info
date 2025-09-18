<template>
  <div class="form-datepicker">
    <div
      class="form-datepicker_input"
      @click="openDatePicker"
      @keydown.enter="openDatePicker"
      @keydown.space="openDatePicker"
      tabindex="0"
      role="button"
      aria-label="Відкрити календар для вибору дати"
    >
      <span>{{ placeholder }}</span>
      <p>{{ formattedDate }}</p>
    </div>
    <div
      v-show="showDatePicker"
      class="datepicker-dropdown"
    >
      <var-date-picker
        v-model="internalDate"
        elevation
        :locale="'en-US'"
        @change="onDateChange"
      />
    </div>
  </div>
</template>

<script>
import {
  ref, computed, watch, onMounted, onUnmounted,
} from 'vue';

export default {
  name: 'FormDatePicker',
  props: {
    modelValue: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: 'Бажана дата заселення',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const internalDate = ref(props.modelValue);
    const showDatePicker = ref(false);

    // Синхронізація з props.modelValue
    watch(() => props.modelValue, (newValue) => {
      internalDate.value = newValue;
    });

    const formattedDate = computed(() => {
      if (!internalDate.value) {
        return 'День/Місяць/Рік';
      }

      const dateObj = new Date(internalDate.value);
      const day = dateObj.getDate().toString().padStart(2, '0');
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const year = dateObj.getFullYear();

      return `${day}/${month}/${year}`;
    });

    const openDatePicker = (event) => {
      // Запобігаємо стандартній поведінці для space key
      if (event && event.key === ' ') {
        event.preventDefault();
      }

      // Перемикаємо видимість date picker'а
      showDatePicker.value = !showDatePicker.value;
    };

    const onDateChange = (newDate) => {
      internalDate.value = newDate;
      emit('update:modelValue', newDate);
      // Закриваємо picker після вибору дати
      showDatePicker.value = false;
    };

    // Закриття dropdown при кліку поза ним
    const handleClickOutside = (event) => {
      const datepickerElement = event.target.closest('.form-datepicker');
      if (!datepickerElement && showDatePicker.value) {
        showDatePicker.value = false;
      }
    };

    // Додаємо/видаляємо event listener для кліків поза компонентом
    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    return {
      internalDate,
      showDatePicker,
      formattedDate,
      openDatePicker,
      onDateChange,
    };
  },
};
</script>

<style lang="scss" scoped>
.form-datepicker {
  position: relative;
}
.form-datepicker_input {
  cursor: pointer;
  background-color: $bg-input;
  border-radius: 1.2rem;
  padding: .8rem 1.6rem 1rem;
  span {
    @include text-11-medium;
    color: $text-grey-6;
  }
  p {
    @include text-15-medium;
    color: $text-black;
    margin-top: .4rem;
  }
  &:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }
  &:focus:not(:focus-visible) {
    outline: none;
  }
}

.datepicker-dropdown {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1000;
  margin-bottom: .5rem; /* Невеликий відступ від input'а */
  min-width: 100%; /* Мінімальна ширина як у input'а */
}
</style>
