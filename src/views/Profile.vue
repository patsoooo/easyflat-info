<template>
  <Navigation />
  <div class="container-xl">
    <div class="wrapper">
      <div class="col-form">
        <div class="sections">
          <PersonalInfo
            :firstName="userData.firstName"
            :lastName="userData.lastName"
            @update:firstName="userData.firstName = $event"
            @update:lastName="userData.lastName = $event"
          />
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
import { reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getUserByProfileId } from '@/services/userService';
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

    // Дані користувача
    const userData = reactive({
      firstName: '',
      lastName: '',
    });

    // Завантаження даних користувача
    const loadUserData = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

        if (!currentUser.profileId) {
          router.push('/access');
          return;
        }

        const user = await getUserByProfileId(currentUser.profileId);

        if (user) {
          userData.firstName = user.firstName || '';
          userData.lastName = user.lastName || '';
        } else {
          console.error('Користувача не знайдено');
          router.push('/access');
        }
      } catch (error) {
        console.error('Помилка завантаження даних:', error);
      }
    };

    // Завантажуємо дані при монтуванні компонента
    onMounted(() => {
      loadUserData();
    });

    return {
      userData,
    };
  },
};
</script>
