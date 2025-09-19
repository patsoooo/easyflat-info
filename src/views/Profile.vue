<template>
  <Navigation />
  <div class="container-xl">
    <div class="wrapper">
      <div class="col-form">
        <div class="sections">
          <PersonalInfo/>
          <StatusInPoland />
          <ContactInfo />
          <FinancialInformation />
          <RentalHistory />
          <AdditionalInformation />
        </div>
      </div>
      <div class="col-preview">
        <Preview />
      </div>
    </div>
  </div>
</template>

<script>
import {
  reactive, onMounted, provide, computed,
} from 'vue';
import { useRouter } from 'vue-router';
import { getUserByProfileId, generateFullName, generateInitials } from '@/services/userService';
import PersonalInfo from '@/components/profile/PersonalInfo.vue';
import FinancialInformation from '@/components/profile/FinancialInformation.vue';
import StatusInPoland from '@/components/profile/StatusInPoland.vue';
import ContactInfo from '@/components/profile/ContactInfo.vue';
import AdditionalInformation from '@/components/profile/AdditionalInformation.vue';
import RentalHistory from '@/components/profile/RentalHistory.vue';
import Navigation from '@/components/profile/Navigation.vue';
import Preview from '@/components/profile/Preview.vue';

export default {
  name: 'ProfileView',
  components: {
    PersonalInfo,
    Navigation,
    Preview,
    StatusInPoland,
    FinancialInformation,
    ContactInfo,
    AdditionalInformation,
    RentalHistory,
  },
  setup() {
    const router = useRouter();

    // Повні дані користувача
    const userData = reactive({
      // Базові поля
      firstName: '',
      lastName: '',
      name: '',
      initials: '',
      citizenshipStatus: 'foreigner',
      timeInPoland: 'less_than_1',
      gender: 'male',
      residenceDocument: 'residence_card',
      description: '',

      // Контакти
      contact: {
        phone: null,
        email: null,
      },

      // Соціальні мережі
      socialMedia: {
        whatsapp: null,
        instagram: null,
        facebook: null,
        telegram: null,
      },

      // Робота
      workplace: {
        company: null,
        position: null,
        workInfo: null,
        salaryRange: null,
        incomeDocument: null,
        workDuration: null,
      },

      // Історія оренди
      rentalHistory: [],

      // Додаткова інформація
      additionalInfo: {
        languages: [],
        languagesText: null,
        hasPets: false,
        petTypes: [],
        petsText: null,
        flatmates: null,
        smoking: false,
        budget: null,
        rentalDuration: null,
        moveInDate: null,
        moveInDateText: null,
      },
    });

    // Computed властивості для автоматичного оновлення
    const computedUserData = computed(() => ({
      ...userData,
      name: generateFullName(userData.firstName, userData.lastName),
      initials: generateInitials(userData.firstName, userData.lastName),
    }));

    // Функція оновлення даних (визначаємо перед використанням)
    function updateUserData(field, value) {
      // Підтримка nested fields (наприклад, 'contact.phone')
      const keys = field.split('.');
      let target = userData;

      for (let i = 0; i < keys.length - 1; i += 1) {
        target = target[keys[i]];
      }

      target[keys[keys.length - 1]] = value;
      // eslint-disable-next-line
      console.log(`Оновлено ${field}:`, value);
    }

    // Provide дані для дочірніх компонентів
    provide('userData', computedUserData);
    provide('updateUserData', updateUserData);

    // Завантаження даних користувача
    const loadUserData = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

        if (!currentUser.profileId) {
          router.push('/login');
          return;
        }

        const user = await getUserByProfileId(currentUser.profileId);

        if (user) {
          // Копіюємо всі дані в reactive об'єкт
          Object.assign(userData, {
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            citizenshipStatus: user.citizenshipStatus || '',
            timeInPoland: user.timeInPoland || '',
            gender: user.gender || '',
            description: user.description || '',
            contact: user.contact || { phone: null, email: null },
            socialMedia: user.socialMedia || {
              whatsapp: null,
              instagram: null,
              facebook: null,
              telegram: null,
            },
            workplace: user.workplace || {
              company: null,
              position: null,
              workInfo: null,
              salaryRange: null,
              incomeDocument: null,
              workDuration: null,
            },
            rentalHistory: user.rentalHistory || [],
            additionalInfo: user.additionalInfo || {
              languages: [],
              languagesText: null,
              hasPets: false,
              petTypes: [],
              petsText: null,
              flatmates: null,
              smoking: false,
              budget: null,
              rentalDuration: null,
              moveInDate: null,
              moveInDateText: null,
            },
          });
          // eslint-disable-next-line
          console.log('Всі дані користувача завантажено:', user);
        } else {
          // eslint-disable-next-line
          console.error('Користувача не знайдено');
          router.push('/login');
        }
      } catch (error) {
        // eslint-disable-next-line
        console.error('Помилка завантаження даних:', error);
      }
    };

    onMounted(() => {
      loadUserData();
    });

    return {
      userData,
      updateUserData,
    };
  },
};
</script>
