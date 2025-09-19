<template>
  <div class="header">
    <div class="header_logo">
      <img src="../img/logo-small.svg" alt="logo">
    </div>
    <div class="header_language">
      <ChangeLanguage />
    </div>
  </div>
</template>
<script>
import ChangeLanguage from '@/components/ChangeLanguage.vue';

export default {
  name: 'HeaderApp',
  components: {
    ChangeLanguage,
  },
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
  &_logo {
    img {
      height: 2.4rem;
    }
  }
}
</style>
