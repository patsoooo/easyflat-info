<template>
  <div class="form_family">
    <div class="form_family-content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FormFamily',
  props: {
    title: {
      type: String,
      default: '',
    },
  },
};
</script>
<style lang="scss">
.form_family {
  width: 100%;
  &-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }
}
</style>
