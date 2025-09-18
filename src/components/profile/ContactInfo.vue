<template>
  <div class="section">
    <div class="section_heading">
      <div class="section_heading-top">
        <h4>Контакт з вами</h4>
        <div class="section_heading-top-mes">
          <!-- Success message -->
          <p v-if="successMessage" class="success-message">
            {{ successMessage }}
          </p>
          <!-- Error message -->
          <p v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </p>
        </div>
      </div>
      <p>Як з вами можна зв'язатися</p>
    </div>
    <div class="section_content">
      <FormGroup>
        <FormInput
          v-model="localPhone"
          placeholder="Ваш номер телефону"
          @update:modelValue="handlePhoneChange"
        />
        <FormInput
          v-model="localEmail"
          placeholder="Ваш емейл"
          type="email"
          @update:modelValue="handleEmailChange"
        />
      </FormGroup>

      <FormGroup title="Соціальні мережі">
        <FormInput
          v-model="localFacebook"
          placeholder="Посилання на Facebook"
          @update:modelValue="handleFacebookChange"
        />
        <FormInput
          v-model="localInstagram"
          placeholder="Посилання на Instagram"
          @update:modelValue="handleInstagramChange"
        />
        <FormInput
          v-model="localTelegram"
          placeholder="Посилання на Telegram"
          @update:modelValue="handleTelegramChange"
        />
        <FormInput
          v-model="localWhatsapp"
          placeholder="Номер Whatsapp"
          @update:modelValue="handleWhatsappChange"
        />
      </FormGroup>
    </div>
  </div>
</template>

<script>
import { ref, inject, watch } from 'vue';
import { updateUser, getUserByProfileId } from '@/services/userService';
import FormGroup from '@/components/form/FormGroup.vue';
import FormInput from '@/components/form/FormInput.vue';

export default {
  name: 'ContactInfo',
  components: {
    FormInput,
    FormGroup,
  },
  setup() {
    // Inject даних з батьківського компонента
    const userData = inject('userData', null);
    const updateUserData = inject('updateUserData', null);

    // Локальні стани для контактів
    const localPhone = ref('');
    const localEmail = ref('');

    // Локальні стани для соціальних мереж
    const localFacebook = ref('');
    const localInstagram = ref('');
    const localTelegram = ref('');
    const localWhatsapp = ref('');

    const successMessage = ref('');
    const errorMessage = ref('');

    // Синхронізація з userData при зміні
    watch(() => userData?.value, (newUserData) => {
      if (newUserData) {
        // Контактні дані
        localPhone.value = newUserData.contact?.phone || '';
        localEmail.value = newUserData.contact?.email || '';

        // Соціальні мережі
        localFacebook.value = newUserData.socialMedia?.facebook || '';
        localInstagram.value = newUserData.socialMedia?.instagram || '';
        localTelegram.value = newUserData.socialMedia?.telegram || '';
        localWhatsapp.value = newUserData.socialMedia?.whatsapp || '';
      }
    }, { immediate: true });

    // Показ повідомлень
    const showSuccessMessage = () => {
      successMessage.value = 'Збережено';
      errorMessage.value = '';
      setTimeout(() => {
        successMessage.value = '';
      }, 2000);
    };

    const showErrorMessage = (message) => {
      errorMessage.value = message;
      successMessage.value = '';
      setTimeout(() => {
        errorMessage.value = '';
      }, 3000);
    };

    // Валідація
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const isValidPhone = (phone) => {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      return phoneRegex.test(phone.replace(/[\s\-()]/g, ''));
    };

    // Отримання поточних контактних даних
    const getCurrentContact = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const user = await getUserByProfileId(currentUser.profileId);
        return user?.contact || { phone: null, email: null };
      } catch (error) {
        return { phone: null, email: null };
      }
    };

    // Отримання поточних даних соціальних мереж
    const getCurrentSocialMedia = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const user = await getUserByProfileId(currentUser.profileId);
        return user?.socialMedia || {
          facebook: null,
          instagram: null,
          telegram: null,
          whatsapp: null,
        };
      } catch (error) {
        return {
          facebook: null, instagram: null, telegram: null, whatsapp: null,
        };
      }
    };

    // Функція оновлення контакту
    const updateContact = async (field, value) => {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (!currentUser.profileId) {
        showErrorMessage('Помилка: користувач не знайдений');
        return;
      }

      try {
        await updateUser(currentUser.profileId, {
          contact: {
            ...await getCurrentContact(),
            [field]: value || null,
          },
        });
        showSuccessMessage();
      } catch (error) {
        // eslint-disable-next-line
        console.error(`Помилка оновлення ${field}:`, error);
        showErrorMessage(`Помилка при збереженні ${field}`);
      }
    };

    // Функція оновлення соціальних мереж
    const updateSocialMedia = async (field, value) => {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (!currentUser.profileId) {
        showErrorMessage('Помилка: користувач не знайдений');
        return;
      }

      try {
        await updateUser(currentUser.profileId, {
          socialMedia: {
            ...await getCurrentSocialMedia(),
            [field]: value || null,
          },
        });
        showSuccessMessage();
      } catch (error) {
        // eslint-disable-next-line
        console.error(`Помилка оновлення ${field}:`, error);
        showErrorMessage(`Помилка при збереженні ${field}`);
      }
    };

    // Обробники змін контактних даних
    const handlePhoneChange = async (value) => {
      localPhone.value = value;

      // Оновлюємо дані в батьківському компоненті (для Preview)
      if (updateUserData) {
        updateUserData('contact.phone', value || null);
      }

      if (value && !isValidPhone(value)) {
        showErrorMessage('Невірний формат номера телефону');
        return;
      }

      await updateContact('phone', value);
    };

    const handleEmailChange = async (value) => {
      localEmail.value = value;

      // Оновлюємо дані в батьківському компоненті (для Preview)
      if (updateUserData) {
        updateUserData('contact.email', value || null);
      }

      if (value && !isValidEmail(value)) {
        showErrorMessage('Невірний формат email');
        return;
      }

      await updateContact('email', value);
    };

    // Обробники змін соціальних мереж
    const handleFacebookChange = async (value) => {
      localFacebook.value = value;

      // Оновлюємо дані в батьківському компоненті (для Preview)
      if (updateUserData) {
        updateUserData('socialMedia.facebook', value || null);
      }

      await updateSocialMedia('facebook', value);
    };

    const handleInstagramChange = async (value) => {
      localInstagram.value = value;

      // Оновлюємо дані в батьківському компоненті (для Preview)
      if (updateUserData) {
        updateUserData('socialMedia.instagram', value || null);
      }

      await updateSocialMedia('instagram', value);
    };

    const handleTelegramChange = async (value) => {
      localTelegram.value = value;

      // Оновлюємо дані в батьківському компоненті (для Preview)
      if (updateUserData) {
        updateUserData('socialMedia.telegram', value || null);
      }

      await updateSocialMedia('telegram', value);
    };

    const handleWhatsappChange = async (value) => {
      localWhatsapp.value = value;

      // Оновлюємо дані в батьківському компоненті (для Preview)
      if (updateUserData) {
        updateUserData('socialMedia.whatsapp', value || null);
      }

      await updateSocialMedia('whatsapp', value);
    };

    return {
      // Контактні дані
      localPhone,
      localEmail,

      // Соціальні мережі
      localFacebook,
      localInstagram,
      localTelegram,
      localWhatsapp,

      // Повідомлення
      successMessage,
      errorMessage,

      // Обробники
      handlePhoneChange,
      handleEmailChange,
      handleFacebookChange,
      handleInstagramChange,
      handleTelegramChange,
      handleWhatsappChange,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
