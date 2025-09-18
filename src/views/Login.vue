<template>
  <div class="container">
    <div class="login">

      <div class="login__content">
        <div v-if="isLoading" class="login__loading">
          <p>{{ loadingMessage }}</p>
        </div>

        <div v-if="hasError" class="login__error">
          {{ errorMessage }}
        </div>

        <button
          @click="loginWithGoogle"
          :disabled="isLoading"
          class="btn btn--google"
          v-if="!isLoading"
        >
          <img src="../img/icons/build.svg" alt="Google" class="btn__icon" v-if="!isLoading">
          <span v-if="isLoading">Авторизація...</span>
          <span v-else>Увійти через Google</span>
        </button>

        <div class="login__divider" v-if="!isLoading">
          <span>або</span>
        </div>

        <div class="login__legacy" v-if="!isLoading">
          <label for="accessCode">Код доступу (застарілий метод)
          <input
            id="accessCode"
            v-model="accessCode"
            type="text"
            placeholder="123456"
            maxlength="6"
            @input="onCodeInput"
          />
          </label>
          <button
            @click="loginWithCode"
            :disabled="isLoading || accessCode.length !== 6"
            class="btn btn--secondary"
          >
            Увійти за кодом
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  signInWithGoogle,
  handleRedirectResult,
} from '@/services/authService';
import { getUserByAccessCode } from '@/services/userService';

export default {
  name: 'LoginApp',
  setup() {
    const router = useRouter();

    const isLoading = ref(false);
    const loadingMessage = ref('');
    const hasError = ref(false);
    const errorMessage = ref('');
    const accessCode = ref('');

    const showError = (message) => {
      hasError.value = true;
      errorMessage.value = message;
    };

    const clearError = () => {
      hasError.value = false;
      errorMessage.value = '';
    };

    const setLoading = (loading, message = 'Завантаження...') => {
      isLoading.value = loading;
      loadingMessage.value = message;
    };

    const handleUserLogin = (user) => {
      // Зберігаємо дані користувача
      localStorage.setItem('currentUser', JSON.stringify({
        profileId: user.id, // Використовуємо 'id' замість 'profileId' з об'єкта dbUser
        googleId: user.googleId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        photoURL: user.photoURL,
      }));

      // Переходимо до профілю
      router.push('/profile');
    };

    const loginWithGoogle = async () => {
      setLoading(true, 'Авторизація через Google...');
      clearError();

      try {
        const user = await signInWithGoogle();

        // Якщо user === null, це означає що використовується redirect
        if (user === null) {
          return;
        }

        handleUserLogin(user);
      } catch (error) {
        console.error('Помилка Google авторизації:', error);
        showError(error.message || 'Помилка при авторизації через Google');
      } finally {
        setLoading(false);
      }
    };

    // Перевіряємо redirect результат при завантаженні сторінки
    const checkRedirectResult = async () => {
      setLoading(true, 'Перевірка авторизації...');

      try {
        const user = await handleRedirectResult();

        if (user) {
          handleUserLogin(user);
          return;
        }
      } catch (error) {
        console.error('Помилка обробки redirect:', error);
        showError('Помилка при авторизації. Спробуйте ще раз.');
      } finally {
        setLoading(false);
      }
    };

    // Стара логіка для кодів доступу
    const onCodeInput = () => {
      clearError();
      accessCode.value = accessCode.value.replace(/\D/g, '');
    };

    const loginWithCode = async () => {
      if (accessCode.value.length !== 6) return;

      setLoading(true, 'Перевірка коду доступу...');
      clearError();

      try {
        const user = await getUserByAccessCode(accessCode.value);

        if (user) {
          localStorage.setItem('currentUser', JSON.stringify({
            profileId: user.id,
            accessCode: user.accessCode,
            firstName: user.firstName,
            lastName: user.lastName,
          }));

          router.push('/profile');
        } else {
          showError('Код доступу не знайдено');
        }
      } catch (error) {
        console.error('Помилка входу за кодом:', error);
        showError('Помилка при вході за кодом');
      } finally {
        setLoading(false);
      }
    };

    // Перевіряємо redirect результат при монтуванні
    onMounted(() => {
      checkRedirectResult();
    });

    return {
      isLoading,
      loadingMessage,
      hasError,
      errorMessage,
      accessCode,
      loginWithGoogle,
      onCodeInput,
      loginWithCode,
    };
  },
};
</script>
