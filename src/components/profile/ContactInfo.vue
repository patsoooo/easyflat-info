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
import { ref, onMounted } from 'vue';
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

    // Завантаження поточних даних користувача
    const loadUserData = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (!currentUser.profileId) return;

        const user = await getUserByProfileId(currentUser.profileId);
        if (user) {
          // Контактні дані
          localPhone.value = user.contact?.phone || '';
          localEmail.value = user.contact?.email || '';

          // Соціальні мережі
          localFacebook.value = user.socialMedia?.facebook || '';
          localInstagram.value = user.socialMedia?.instagram || '';
          localTelegram.value = user.socialMedia?.telegram || '';
          localWhatsapp.value = user.socialMedia?.whatsapp || '';
        }
      } catch (error) {
        console.error('Помилка завантаження даних:', error);
        errorMessage.value = 'Помилка завантаження даних';
      }
    };

    // Показ повідомлення про успіх
    const showSuccessMessage = () => {
      successMessage.value = 'Збережено';
      errorMessage.value = '';
      setTimeout(() => {
        successMessage.value = '';
      }, 2000);
    };

    // Показ повідомлення про помилку
    const showErrorMessage = (message) => {
      errorMessage.value = message;
      successMessage.value = '';
      setTimeout(() => {
        errorMessage.value = '';
      }, 3000);
    };

    // Валідація email
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    // Валідація телефону
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
        console.error(`Помилка оновлення ${field}:`, error);
        showErrorMessage(`Помилка при збереженні ${field}`);
        loadUserData(); // Відновлення попереднього значення
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
        console.error(`Помилка оновлення ${field}:`, error);
        showErrorMessage(`Помилка при збереженні ${field}`);
        loadUserData(); // Відновлення попереднього значення
      }
    };

    // Обробники змін контактних даних
    const handlePhoneChange = async (value) => {
      localPhone.value = value;

      if (value && !isValidPhone(value)) {
        showErrorMessage('Невірний формат номера телефону');
        return;
      }

      await updateContact('phone', value);
    };

    const handleEmailChange = async (value) => {
      localEmail.value = value;

      if (value && !isValidEmail(value)) {
        showErrorMessage('Невірний формат email');
        return;
      }

      await updateContact('email', value);
    };

    // Обробники змін соціальних мереж
    const handleFacebookChange = async (value) => {
      localFacebook.value = value;
      await updateSocialMedia('facebook', value);
    };

    const handleInstagramChange = async (value) => {
      localInstagram.value = value;
      await updateSocialMedia('instagram', value);
    };

    const handleTelegramChange = async (value) => {
      localTelegram.value = value;
      await updateSocialMedia('telegram', value);
    };

    const handleWhatsappChange = async (value) => {
      localWhatsapp.value = value;
      await updateSocialMedia('whatsapp', value);
    };

    // Завантажуємо дані при монтуванні
    onMounted(() => {
      loadUserData();
    });

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
