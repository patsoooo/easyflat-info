<template>
  <var-popup v-model:show="localShow">
    <div class="popup">
      <h5>Видалити аккаунт?</h5>
      <p>Цю дію неможливо буде відмінити</p>
      <div class="popup-buttons">
        <button class="btn-delete" @click="$emit('confirm')" :disabled="isLoading">
          <span v-if="isLoading">Видаляю...</span>
          <span v-else>Так, видалити</span>
        </button>
        <button class="btn-cancel" @click="$emit('cancel')" :disabled="isLoading">
          Ні
        </button>
      </div>
    </div>
  </var-popup>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'PopupDelete',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['confirm', 'cancel', 'update:show'],
  setup(props, { emit }) {
    const localShow = computed({
      get() {
        return props.show;
      },
      set(value) {
        emit('update:show', value);
      },
    });

    return {
      localShow,
    };
  },
};
</script>

<style lang="scss">
</style>
