<template>
  <Navigation />
  <div class="container-xl">
    <div class="test">
      <p>Код: <strong>{{ currentAccessCode }}</strong></p>
    <button
    @click="handleLogout"
    :disabled="isLoading"
    >
    <span v-if="isLoading">Виходжу...</span>
    <span v-else>Вийти</span>
    </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Navigation from '@/components/profile/Navigation.vue';

export default {
  name: 'SettingsApp',
  components: {
    Navigation,
  },
  setup() {
    const router = useRouter();
    const currentAccessCode = ref('');
    const isLoading = ref(false);

    // Завантаження поточного коду доступу
    const loadCurrentUser = () => {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (currentUser.accessCode) {
        currentAccessCode.value = currentUser.accessCode;
      }
    };

    // Функція виходу з профілю
    const handleLogout = async () => {
      isLoading.value = true;

      try {
        // Симулюємо затримку для UX
        await new Promise((resolve) => { setTimeout(resolve, 800); });

        // Очищаємо localStorage
        localStorage.removeItem('currentUser');

        // Перенаправляємо на сторінку входу
        router.push('/access');
      } catch (error) {
        console.error('Помилка при виході:', error);
      } finally {
        isLoading.value = false;
      }
    };

    // Завантажуємо дані при монтуванні
    onMounted(() => {
      loadCurrentUser();
    });

    return {
      currentAccessCode,
      isLoading,
      handleLogout,
    };
  },
};
</script>

<style lang="scss" scoped>
.test {
  padding-top: 16rem;
}
</style>
