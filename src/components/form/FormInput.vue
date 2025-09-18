<template>
  <div class="form-input">
    <var-input
      :placeholder="placeholder"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
    />
  </div>
</template>
<script>
export default {
  name: 'FormInput',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: 'Please enter text',
    },
  },
  emits: ['update:modelValue'],
  setup() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.form-input {
  width: 100%;
  // max-width: 36.4rem;
}
.var-input {
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

:deep(.var-input__input) {
  padding: 0 1.6rem !important;
  height: auto;
  @include text-15-medium;
  color: $text-black;
}
</style>
