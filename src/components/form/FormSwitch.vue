<template>
  <div class="form-switch">
    <var-switch
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<script>
export default {
  name: 'FormSwitch',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
};
</script>

<style lang="scss" scoped>
// Додайте стилі для switch якщо потрібно
</style>
