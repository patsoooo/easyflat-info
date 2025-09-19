<template>
  <Navigation />
  <div class="container-sm">
    <div class="settings">
      <div class="settings_heading">
        <h4>Налаштування профілю</h4>
        <p>Інформація про ваш профіль</p>
      </div>
      <ul class="settings_list">
        <li class="settings_item">
          <div class="settings_left">
            <div class="settings_icon account">
              <img
                :src="getAuthProviderIcon()"
                :alt="getAuthProviderName()"
              >
            </div>
            <div class="settings_data">
              <p>Спосіб входу</p>
              <span>{{ getAuthProviderText() }}</span>
            </div>
          </div>
        </li>
        <li class="settings_item">
          <div class="settings_left">
            <div class="settings_icon">
              <img src="../img/icons/link.svg" alt="link">
            </div>
            <div class="settings_data">
              <p>Адреса профілю</p>
              <span>{{ getProfileUrl() }}</span>
            </div>
          </div>
          <div class="settings_right">
            <button class="copy" @click="copyProfileUrl">
              {{ isCopied ? 'Скопійовано' : 'Копіювати' }}
            </button>
          </div>
        </li>
        <li class="settings_item">
          <div class="settings_left">
            <div class="settings_icon">
              <img src="../img/icons/eye.svg" alt="eye">
            </div>
            <div class="settings_data">
              <p>Видимість профілю</p>
              <span>{{ isVisible ? 'Ваш профіль доступний для перегляду' :
              'Ваш профіль прихований від інших' }}</span>
            </div>
          </div>
          <div class="settings_right">
            <FormSwitch
              v-model="isVisible"
              @update:modelValue="toggleVisibility"
              :disabled="isUpdatingVisibility"
            />
          </div>
        </li>
        <li class="settings_item">
          <div class="settings_left">
            <div class="settings_icon delete">
              <img src="../img/icons/delete.svg" alt="delete">
            </div>
            <div class="settings_data">
              <p>Видалити профіль</p>
              <span>Видаліть акаунт назавжди</span>
            </div>
          </div>
          <div class="settings_right">
             <button class="delete" @click="showDeleteConfirm">Видалити</button>
          </div>
        </li>
        <li class="settings_logout">
          <button
            @click="handleLogout"
            :disabled="isLoading"
            >
            <span v-if="isLoading">Виходжу...</span>
            <span v-else>Вийти з профілю</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
  <PopupDelete
    v-model:show="showDeletePopup"
    :is-loading="isDeletingAccount"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Navigation from '@/components/profile/Navigation.vue';
import FormSwitch from '@/components/form/FormSwitch.vue';
import { signOutUser } from '@/services/authService';
import { getUserByProfileId, updateProfileVisibility, softDeleteUser } from '@/services/userService';
import PopupDelete from '@/components/popup/PopupDelete.vue';

// Import auth provider icons
import GoogleIcon from '../img/icons/google.svg';
import FacebookIcon from '../img/icons/facebook.svg';

export default {
  name: 'SettingsApp',
  components: {
    Navigation,
    FormSwitch,
    PopupDelete,
  },
  setup() {
    const router = useRouter();
    const currentUser = ref(null);
    const userData = ref(null);
    const isLoading = ref(false);
    const isLoadingUser = ref(true);
    const isCopied = ref(false);
    const isVisible = ref(false);
    const isUpdatingVisibility = ref(false);
    const showDeletePopup = ref(false);
    const isDeletingAccount = ref(false);

    // Завантаження поточного користувача з localStorage
    const loadCurrentUser = () => {
      const stored = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (stored.profileId) {
        currentUser.value = stored;
        return stored;
      }
      return null;
    };

    // Завантаження повних даних користувача з бази
    const loadUserData = async () => {
      try {
        isLoadingUser.value = true;
        const user = loadCurrentUser();

        if (user && user.profileId) {
          const fullUserData = await getUserByProfileId(user.profileId);
          if (fullUserData) {
            userData.value = fullUserData;
            // Встановлюємо стан видимості
            isVisible.value = fullUserData.visible || false;
          }
        }
      } catch (error) {
        console.error('Помилка при завантаженні даних користувача:', error);
      } finally {
        isLoadingUser.value = false;
      }
    };

    // Визначення способу авторизації
    const getAuthProviderName = () => {
      if (userData.value?.googleId) {
        return 'google';
      }
      // В майбутньому додамо Facebook
      // if (userData.value?.facebookId) {
      //   return 'facebook';
      // }
      return 'unknown';
    };

    // Іконка провайдера авторизації
    const getAuthProviderIcon = () => {
      const provider = getAuthProviderName();
      switch (provider) {
        case 'google':
          return GoogleIcon;
        case 'facebook':
          return FacebookIcon;
        default:
          return FacebookIcon; // тимчасово Facebook для невідомого способу
      }
    };

    // Текст про спосіб входу
    const getAuthProviderText = () => {
      const provider = getAuthProviderName();
      const email = userData.value?.email || userData.value?.contact?.email || '';

      switch (provider) {
        case 'google':
          return `Google Account: ${email}`;
        case 'facebook':
          return `Facebook Account: ${email}`; // для майбутнього
        default:
          return 'Невідомий спосіб входу';
      }
    };

    // URL профілю
    const getProfileUrl = () => {
      if (currentUser.value?.profileId) {
        return `easyflat.me/${currentUser.value.profileId}`;
      }
      return '';
    };

    // Копіювання URL профілю
    const copyProfileUrl = async () => {
      const url = getProfileUrl();
      if (url) {
        try {
          await navigator.clipboard.writeText(url);
          isCopied.value = true;

          // Повертаємо текст назад через 5 секунд
          setTimeout(() => {
            isCopied.value = false;
          }, 2000);
        } catch (error) {
          console.error('Помилка при копіюванні:', error);
        }
      }
    };

    // Функція для зміни видимості профілю
    const toggleVisibility = async (newVisibility) => {
      if (!currentUser.value?.profileId || isUpdatingVisibility.value) return;

      try {
        isUpdatingVisibility.value = true;
        await updateProfileVisibility(currentUser.value.profileId, newVisibility);

        // Оновлюємо локальні дані
        isVisible.value = newVisibility;
        if (userData.value) {
          userData.value.visible = newVisibility;
        }
      } catch (error) {
        console.error('Помилка при зміні видимості:', error);
        // Повертаємо попередній стан при помилці
        isVisible.value = !newVisibility;
      } finally {
        isUpdatingVisibility.value = false;
      }
    };

    // Показати popup видалення
    const showDeleteConfirm = () => {
      showDeletePopup.value = true;
    };

    // Підтвердження видалення
    const confirmDelete = async () => {
      if (!currentUser.value?.profileId || isDeletingAccount.value) return;

      try {
        isDeletingAccount.value = true;
        await softDeleteUser(currentUser.value.profileId);

        // Очищаємо localStorage та виходимо
        await signOutUser();
        router.push('/');
      } catch (error) {
        console.error('Помилка при видаленні акаунту:', error);
      } finally {
        isDeletingAccount.value = false;
        showDeletePopup.value = false;
      }
    };

    // Скасування видалення
    const cancelDelete = () => {
      showDeletePopup.value = false;
    };

    // Функція виходу з профілю
    const handleLogout = async () => {
      isLoading.value = true;

      try {
        await signOutUser();
        router.push('/login');
      } catch (error) {
        console.error('Помилка при виході:', error);
      } finally {
        isLoading.value = false;
      }
    };

    // Завантажуємо дані при монтуванні
    onMounted(() => {
      loadUserData();
    });

    return {
      currentUser,
      userData,
      isLoading,
      isLoadingUser,
      isCopied,
      isVisible,
      isUpdatingVisibility,
      getAuthProviderName,
      getAuthProviderIcon,
      getAuthProviderText,
      getProfileUrl,
      copyProfileUrl,
      toggleVisibility,
      handleLogout,
      showDeletePopup,
      isDeletingAccount,
      showDeleteConfirm,
      confirmDelete,
      cancelDelete,
    };
  },
};
</script>

<style lang="scss" scoped>
.settings {
  padding-top: 12rem;
  &_heading {
    margin-bottom: 2.4rem;
    h4 {
      @include text-24-bold;
      margin-bottom: .4rem;
    }
    p {
      @include text-13-regular;
      color: $text-grey-6;
    }
  }
  &_item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 1.6rem;
    margin-bottom: 1.6rem;
    border-bottom: .1rem solid $border-form;
    &:last-child {
      margin-bottom: 0;
      border-bottom: none;
    }
  }
  &_logout {
    margin-top: 4.4rem;
    button {
      border: none;
      background-color: transparent;
      @include text-15-medium;
      color: $text-black;
    }
  }
  &_left {
    display: flex;
    align-items: center;
    gap: 1.2rem;
  }
  &_icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4.4rem;
    height: 4.4rem;
    background: $bg-blue-12;
    border-radius: 100%;
    border: .1rem solid $border-blue-12;
    &.account {
      background-color: $btn-gray;
      border: .1rem solid $border-grey-12;
    }
    &.delete {
      background-color: $btn-red;
      border: .1rem solid $btn-red;
    }
    img {
      width: 2.4rem;
    }
  }
  &_data {
    p {
      @include text-15-medium;
    }
    span {
      @include text-13-regular;
      color: $text-grey-6;
    }
  }
  &_right {
    button {
      border: none;
      background-color: transparent;
      @include text-13-medium;
      &.delete {
        color: $text-red;
      }
      &.copy {
        color: $text-blue;
      }
    }
  }
}
</style>
