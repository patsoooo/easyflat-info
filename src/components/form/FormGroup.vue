<template>
  <div class="form-group">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'FormGroup',
};
</script>
<style lang="scss">
.form-group {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
