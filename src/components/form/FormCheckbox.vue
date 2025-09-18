<template>
  <div class="form-checkbox">
    <var-checkbox-group v-model="selectedValues" @change="handleChange">
      <var-checkbox
        v-for="option in options"
        :key="option.value"
        :checked-value="option.value"
      >
        {{ option.label }}
      </var-checkbox>
    </var-checkbox-group>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'FormCheckbox',
  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
    options: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const selectedValues = ref(props.modelValue);

    // Синхронізація з props.modelValue
    watch(() => props.modelValue, (newValue) => {
      selectedValues.value = newValue;
    });

    // Обробка зміни значень
    const handleChange = (value) => {
      selectedValues.value = value;
      emit('update:modelValue', value);
    };

    return {
      selectedValues,
      handleChange,
    };
  },
};
</script>

<style lang="scss" scoped>
:deep(.var-checkbox-group--horizontal) {
  gap: 1.2rem;
}
:deep(.var-checkbox__text) {
  @include text-15-medium;
  color: $text-black;
}
:deep(.var-checkbox--checked) {
  color: $bg-blue;
}
:deep(.var-checkbox__action) {
  padding: .4rem;
}
</style>
