<template>
  <div class="form-radio">
    <var-radio-group v-model="selectedValue" @change="handleChange">
      <var-radio
        v-for="option in options"
        :key="option.value"
        :checked-value="option.value"
      >
        {{ option.label }}
      </var-radio>
    </var-radio-group>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'FormRadio',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const selectedValue = ref(props.modelValue);

    // Синхронізація з props.modelValue
    watch(() => props.modelValue, (newValue) => {
      selectedValue.value = newValue;
    });

    // Обробка зміни значення
    const handleChange = (value) => {
      selectedValue.value = value;
      emit('update:modelValue', value);
    };

    return {
      selectedValue,
      handleChange,
    };
  },
};
</script>

<style lang="scss" scoped>
:deep(.var-radio-group--horizontal) {
  gap: 1.6rem;
}

:deep(.var-radio__action) {
  padding: .4rem;
}

:deep(.var-radio__text) {
  @include text-15-medium;
  color: $text-black;
}
:deep(.var-radio-group--horizontal) {
  gap: 1.2rem;
}
</style>
