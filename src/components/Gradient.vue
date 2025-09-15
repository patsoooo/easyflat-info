<template>
  <div class="gradient">
  </div>
</template>
<script>
export default {
  name: 'GradientApp',
};
</script>
<style lang="scss">
.gradient {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 38.4rem;
  background: linear-gradient(180deg, #C8DEFD 0%, #F6F6F6 100%);
}
</style>
