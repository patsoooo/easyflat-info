<template>
  <div class="form_checkboxgroup">
    <h3 v-if="title" class="form_checkboxgroup-title">{{ title }}</h3>
    <div class="form_checkboxgroup-content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FormCheckboxGroup',
  props: {
    title: {
      type: String,
      default: '',
    },
  },
};
</script>
<style lang="scss">
.form_checkboxgroup {
  width: 100%;

  &-title {
    @include text-13-medium;
    color: $text-black;
    margin-bottom: 1.2rem;
  }

  &-content {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 1.6rem;
  }
}
</style>
