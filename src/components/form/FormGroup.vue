<template>
  <div class="form_group">
    <h3 v-if="title" class="form_group-title">{{ title }}</h3>
    <div class="form_group-content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FormGroup',
  props: {
    title: {
      type: String,
      default: '',
    },
  },
};
</script>
<style lang="scss">
.form_group {
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

    // Кожен дочірній елемент займає 50% ширини мінус gap
    > * {
      flex: 1;
      min-width: calc(50% - 0.8rem);
      max-width: calc(50% - 0.8rem);
    }

    // Якщо елемент один в рядку, він має максимальну ширину 36.4rem
    > *:only-child {
      // min-width: auto;
      max-width: calc(50% - 1.6rem);
      flex: none;
    }
  }
}
</style>
