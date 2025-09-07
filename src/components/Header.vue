<template>
  <div class="header">
    <div class="header_logo">
      <img src="../img/logo-black.svg" alt="logo">
    </div>
    <p class="header_language">
      Українська
    </p>
  </div>
</template>
<script>
export default {
  name: 'HeaderApp',
};
</script>
<style lang="scss">
.header {
  height: 8rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &_language {
    @include text-15-semibold;
    color: $text-black;
  }
}
</style>
