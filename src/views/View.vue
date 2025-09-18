<template>
  <div class="view">
    <div class="container-xl">
      <Header />
    </div>
    <div class="container">
      <Gradient />

      <!-- Завантаження -->
      <div v-if="loading" class="loading">
        Завантаження...
      </div>

      <!-- Помилка -->
      <div v-else-if="error" class="error">
        {{ error }}
      </div>

      <!-- Дані користувача -->
      <div v-else class="user">
        <div class="user_data">
          <div class="user_data-photo">{{ userData?.initials || 'N/A' }}</div>
          <div class="user_data-name">
            {{ userData?.name || 'Немає інформації' }}
          </div>
          <div class="user_data-desc">
            {{ getTranslatedDescription() || 'Немає інформації' }}
          </div>

          <!-- Соціальні мережі -->
          <ul v-if="hasSocialMedia" class="user_data-social">
            <li v-if="userData?.socialMedia?.whatsapp">
              <a :href="userData.socialMedia.whatsapp" target="_blank">
                <img src="../img/social/whatsapp.svg" alt="whatsapp">
              </a>
            </li>
            <li v-if="userData?.socialMedia?.instagram">
              <a :href="userData.socialMedia.instagram" target="_blank">
                <img src="../img/social/instagram.svg" alt="instagram">
              </a>
            </li>
            <li v-if="userData?.socialMedia?.facebook">
              <a :href="userData.socialMedia.facebook" target="_blank">
                <img src="../img/social/fb.svg" alt="facebook">
              </a>
            </li>
            <li v-if="userData?.socialMedia?.telegram">
              <a :href="userData.socialMedia.telegram" target="_blank">
                <img src="../img/social/linkedin.svg" alt="telegram">
              </a>
            </li>
          </ul>
        </div>

        <!-- Контакт -->
        <div v-if="hasContactInfo" class="user_section">
          <span class="user_section-title">{{ $t('sections.contact') }}</span>
          <ul class="user_list">
            <li v-if="userData?.contact?.phone" class="user_info">
              <img src="../img/icons/phone.svg" alt="phone">
              <div class="user_info-data">
                <p>{{ userData.contact.phone }}</p>
              </div>
            </li>
            <li v-if="userData?.contact?.email" class="user_info">
              <img src="../img/icons/email.svg" alt="email">
              <div class="user_info-data">
                <p>{{ userData.contact.email }}</p>
              </div>
            </li>
          </ul>
        </div>

        <!-- Місце роботи -->
        <div v-if="hasWorkplaceInfo" class="user_section">
          <span class="user_section-title">{{ $t('sections.workplace') }}</span>
          <ul class="user_list">
            <li v-if="userData?.workplace?.workInfo" class="user_info">
              <img src="../img/icons/work.svg" alt="work">
              <div class="user_info-data">
                <p>{{ userData.workplace.workInfo }}</p>
              </div>
            </li>
            <li v-if="userData?.workplace?.salaryRange" class="user_info">
              <img src="../img/icons/money.svg" alt="money">
              <div class="user_info-data">
                <p>{{ getTranslatedSalaryRangeText() }}</p>
                <span v-if="userData?.workplace?.incomeDocument">
                  {{ getTranslatedIncomeDocumentText() }}
                </span>
              </div>
            </li>
            <li v-if="userData?.workplace?.workDuration" class="user_info">
              <img src="../img/icons/time.svg" alt="time">
              <div class="user_info-data">
                <p>{{ getTranslatedWorkDurationText() }}</p>
              </div>
            </li>
          </ul>
        </div>

        <!-- Історія оренди -->
        <div v-if="hasRentalHistory" class="user_section">
          <span class="user_section-title">{{ $t('sections.rentalHistory') }}</span>
          <div class="user_history">
            <div v-for="(period, index) in userData.rentalHistory"
                 :class="{ 'user_history-last': index === userData.rentalHistory.length - 1 }"
                 :key="index">
              <span class="user_history-title">{{ getTranslatedPeriod(period) }}</span>
              <ul class="user_list">
                <li v-if="period?.address" class="user_info">
                  <img src="../img/icons/location.svg" alt="location">
                  <div class="user_info-data">
                    <p>{{ period.address }}</p>
                    <span v-if="period?.city">{{ getTranslatedLocationText(period.city) }}</span>
                  </div>
                </li>
                <li v-if="period?.landlordContact" class="user_info">
                  <img src="../img/icons/phone.svg" alt="phone">
                  <div class="user_info-data">
                    <p>{{ getTranslatedLandlordContactText(period.landlordContact) }}</p>
                  </div>
                </li>
                <li v-if="period?.rentalConfirmation" class="user_info">
                  <img src="../img/icons/money.svg" alt="money">
                  <div class="user_info-data">
                    <p>{{ getTranslatedRentalConfirmationText(period.rentalConfirmation) }}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Заглушка для історії оренди -->
        <div v-else class="user_section">
          <span class="user_section-title">{{ $t('sections.rentalHistory') }}</span>
          <div class="user_history">
            <span class="user_history-title">{{ getTranslatedRentalHistoryFallbackText() }}</span>
          </div>
        </div>

        <!-- Додаткова інформація -->
        <div v-if="hasAdditionalInfo" class="user_section">
          <span class="user_section-title">{{ $t('sections.additionalInfo') }}</span>
          <ul class="user_list">
            <li v-if="userData?.additionalInfo?.languages?.length > 0" class="user_info">
              <img src="../img/icons/language.svg" alt="language">
              <div class="user_info-data">
                <p>{{ getTranslatedLanguagesText() }}</p>
              </div>
            </li>
            <li v-if="userData?.additionalInfo?.hasPets !== null
                    && userData?.additionalInfo?.hasPets !== undefined" class="user_info">
              <img src="../img/icons/pets.svg" alt="pets">
              <div class="user_info-data">
                <p>{{ getTranslatedPetsText() }}</p>
              </div>
            </li>
            <li v-if="userData?.additionalInfo?.flatmates" class="user_info">
              <img src="../img/icons/flatmates.svg" alt="flatmates">
              <div class="user_info-data">
                <p>{{ getTranslatedFlatmatesText() }}</p>
              </div>
            </li>
            <li v-if="userData?.additionalInfo?.smoking !== null
                    && userData?.additionalInfo?.smoking !== undefined" class="user_info">
              <img src="../img/icons/smoke.svg" alt="smoke">
              <div class="user_info-data">
                <p>{{ getTranslatedSmokingText() }}</p>
              </div>
            </li>
            <li v-if="userData?.additionalInfo?.budget" class="user_info">
              <img src="../img/icons/money.svg" alt="money">
              <div class="user_info-data">
                <p>{{ getTranslatedBudgetText() }}</p>
              </div>
            </li>
            <li v-if="userData?.additionalInfo?.rentalDuration" class="user_info">
              <img src="../img/icons/time.svg" alt="time">
              <div class="user_info-data">
                <p>{{ getTranslatedRentalDurationText() }}</p>
              </div>
            </li>
            <li v-if="userData?.additionalInfo?.moveInDate" class="user_info">
              <img src="../img/icons/calendar.svg" alt="calendar">
              <div class="user_info-data">
                <p>{{ getTranslatedMoveInDateText() }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getUserByProfileId } from '@/services/userService';
import useUserDisplay from '@/composables/useUserDisplay';
import Header from '../components/Header.vue';
import Gradient from '../components/Gradient.vue';

export default {
  name: 'ViewUser',
  components: {
    Header,
    Gradient,
  },
  setup() {
    const { t } = useI18n();
    const route = useRoute();

    // Реактивні змінні
    const userData = ref(null);
    const loading = ref(true);
    const error = ref(null);

    // Використовуємо композабл для логіки відображення
    const {
      hasSocialMedia,
      hasContactInfo,
      hasWorkplaceInfo,
      hasAdditionalInfo,
      hasRentalHistory,
      getTranslatedDescription,
      getTranslatedLanguagesText,
      getTranslatedPetsText,
      getTranslatedFlatmatesText,
      getTranslatedSmokingText,
      getTranslatedBudgetText,
      getTranslatedRentalDurationText,
      getTranslatedMoveInDateText,
      getTranslatedSalaryRangeText,
      getTranslatedIncomeDocumentText,
      getTranslatedWorkDurationText,
      getTranslatedPeriod,
      getTranslatedLocationText,
      getTranslatedLandlordContactText,
      getTranslatedRentalConfirmationText,
      getTranslatedRentalHistoryFallbackText,
    } = useUserDisplay(userData, t);

    // Функція завантаження користувача
    const loadUser = async () => {
      try {
        loading.value = true;
        error.value = null;

        const { profileId } = route.params;

        if (!profileId) {
          error.value = 'Profile ID не вказано';
          return;
        }

        const user = await getUserByProfileId(profileId);

        if (user) {
          userData.value = user;
        } else {
          error.value = 'Користувача не знайдено';
        }
      } catch (err) {
        // eslint-disable-next-line
        console.error('Помилка завантаження користувача:', err);
        error.value = 'Помилка завантаження даних';
      } finally {
        loading.value = false;
      }
    };

    // Завантажуємо дані при монтуванні компонента
    onMounted(() => {
      loadUser();
    });

    return {
      userData,
      loading,
      error,
      hasSocialMedia,
      hasContactInfo,
      hasWorkplaceInfo,
      hasAdditionalInfo,
      hasRentalHistory,
      getTranslatedDescription,
      getTranslatedLanguagesText,
      getTranslatedPetsText,
      getTranslatedFlatmatesText,
      getTranslatedSmokingText,
      getTranslatedBudgetText,
      getTranslatedRentalDurationText,
      getTranslatedMoveInDateText,
      getTranslatedSalaryRangeText,
      getTranslatedIncomeDocumentText,
      getTranslatedWorkDurationText,
      getTranslatedPeriod,
      getTranslatedLocationText,
      getTranslatedLandlordContactText,
      getTranslatedRentalConfirmationText,
      getTranslatedRentalHistoryFallbackText,
    };
  },
};
</script>

<style lang="scss" scoped>
.view {
  width: 100%;
  height: 100%;
  background-color: $bg-grey !important;
}

.loading, .error {
  padding: 2rem;
  text-align: center;
  background-color: $bg-white;
  border-radius: 2rem;
  margin-top: 2rem;
}

.error {
  color: #e74c3c;
}
</style>
