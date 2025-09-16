<template>
  <div class="form-select">
    <var-select
      :placeholder="placeholder"
      :multiple="multiple"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
    >
      <var-option
        v-for="option in options"
        :key="option.value"
        :label="option.label"
        :value="option.value"
      />
    </var-select>
  </div>
</template>
<script>
export default {
  props: {
    modelValue: {
      type: [String, Array],
      default: () => '',
    },
    placeholder: {
      type: String,
      default: 'Please select an option',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  emits: ['update:modelValue'],
};
</script>
<style lang="scss" scoped>
.form-select {
  width: 100%;
  max-width: 36.4rem;
}
.var-select {
  border-radius: 1.2rem;
  background-color: $bg-input;
}
:deep(.var-field-decorator__line) {
  display: none !important;
  visibility: hidden !important;
}

:deep(.var-field-decorator__middle) {
  margin-top: 2.4rem;
  margin-bottom: 1rem;
}

:deep(.var-field-decorator__placeholder) {
  color: $text-grey-6;
  left: 1.6rem;
  transform: translateY(-50%);
  top: 50%;
  transition: all 0.3s ease !important;
  @include text-15-medium;
  &.var-field-decorator--placeholder-hint {
    transform: translateY(-50%) translateX(0) scale(0.75) !important; // Виправляємо анімацію
    top: 1.6rem !important;
  }
}

:deep(.var-field-decorator__controller) {
  border: .16rem solid $bg-input !important;
  border-radius: 1.2rem !important;
  transition: border-color 0.3s ease !important;

  &:focus-within {
    border: .16rem solid $border-blue !important;
  }
}

:deep(.var-select__select) {
  padding: 0 1.6rem !important;
  height: auto;
}

:deep(.var-select__label) {
  @include text-15-medium;
  color: $text-black;
}
</style>
