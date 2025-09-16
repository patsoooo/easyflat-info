<template>
  <div class="container">

    <div class="access-code">

      <div class="access-code__form">
        <div class="form-group">
          <label for="accessCode" class="form-label">
            Код доступу
          <input
            id="accessCode"
            v-model="accessCode"
            type="text"
            class="form-input"
            :class="{ 'error': hasError }"
            placeholder="123456"
            maxlength="6"
            @input="onCodeInput"
          />
          <div v-if="hasError" class="form-error">
            {{ errorMessage }}
          </div>
          </label>
        </div>

        <div class="access-code__actions">
          <button
            @click="loginWithCode"
            :disabled="isLoading || accessCode.length !== 6"
            class="btn btn--primary"
          >
            <span v-if="isLoading">Перевірка...</span>
            <span v-else>Увійти</span>
          </button>

          <div class="access-code__divider">або</div>

          <button
            @click="createNewProfile"
            :disabled="isLoading"
            class="btn btn--secondary"
          >
            <span v-if="isCreating">Створення...</span>
            <span v-else>Створити новий профіль</span>
          </button>
        </div>
      </div>

      <!-- Показати код після створення -->
      <div v-if="newAccessCode" class="access-code__success">
        <h3>Ваш код доступу створено!</h3>
        <div class="access-code__code">{{ newAccessCode }}</div>
        <p>Збережіть цей код - він потрібен для входу в ваш профіль</p>
        <button @click="proceedToProfile" class="btn btn--primary">
          Перейти до профілю
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getUserByAccessCode, createUserWithAccessCode } from '@/services/userService';

export default {
  name: 'AccessCode',
  setup() {
    const router = useRouter();

    const accessCode = ref('');
    const hasError = ref(false);
    const errorMessage = ref('');
    const isLoading = ref(false);
    const isCreating = ref(false);
    const newAccessCode = ref('');
    const newProfileId = ref('');

    // Очистка помилок при вводі
    const onCodeInput = () => {
      hasError.value = false;
      errorMessage.value = '';

      // Автоматично підставляти тільки цифри
      accessCode.value = accessCode.value.replace(/\D/g, '');
    };

    // Вхід за кодом
    const loginWithCode = async () => {
      if (accessCode.value.length !== 6) return;

      isLoading.value = true;
      hasError.value = false;

      try {
        const user = await getUserByAccessCode(accessCode.value);

        if (user) {
          // Зберігаємо дані користувача в localStorage для демо режиму
          localStorage.setItem('currentUser', JSON.stringify({
            profileId: user.id,
            accessCode: user.accessCode,
            firstName: user.firstName,
            lastName: user.lastName,
          }));

          // Переходимо до профілю
          router.push('/profile');
        } else {
          hasError.value = true;
          errorMessage.value = 'Код доступу не знайдено';
        }
      } catch (error) {
        console.error('Помилка входу:', error);
        hasError.value = true;
        errorMessage.value = 'Помилка при вході. Спробуйте ще раз.';
      } finally {
        isLoading.value = false;
      }
    };

    // Створення нового профілю
    const createNewProfile = async () => {
      isCreating.value = true;

      try {
        const result = await createUserWithAccessCode();

        newAccessCode.value = result.accessCode;
        newProfileId.value = result.profileId;

        // Зберігаємо дані користувача в localStorage
        localStorage.setItem('currentUser', JSON.stringify({
          profileId: result.profileId,
          accessCode: result.accessCode,
          firstName: result.firstName,
          lastName: result.lastName,
        }));
      } catch (error) {
        console.error('Помилка створення профілю:', error);
        hasError.value = true;
        errorMessage.value = 'Помилка при створенні профілю. Спробуйте ще раз.';
      } finally {
        isCreating.value = false;
      }
    };

    // Перехід до профілю після створення
    const proceedToProfile = () => {
      router.push('/profile');
    };

    return {
      accessCode,
      hasError,
      errorMessage,
      isLoading,
      isCreating,
      newAccessCode,
      onCodeInput,
      loginWithCode,
      createNewProfile,
      proceedToProfile,
    };
  },
};
</script>
