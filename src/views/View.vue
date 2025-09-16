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
            {{ translatedDescription || 'Немає інформації' }}
          </div>

          <!-- Соціальні мережі - показуємо тільки якщо є хоча б одна -->
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

        <!-- Контакт - показуємо тільки якщо є телефон або email -->
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

        <!-- Якщо немає історії оренди, показуємо заглушку -->
        <div v-else class="user_section">
          <span class="user_section-title">{{ $t('sections.rentalHistory') }}</span>
          <div class="user_history">
            <span class="user_history-title">{{ getTranslatedRentalHistoryFallbackText() }}</span>
          </div>
        </div>

  <!-- Додаткова інформація - показуємо тільки якщо є хоча б одне поле -->
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
                <p>{{ getTranslatedFlmatmatesText() }}</p>
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
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import {
  getTranslatedCitizenship,
  getTranslatedTimeInPoland,
  generateTranslatedLanguagesText,
  generateTranslatedPetsText,
  generateTranslatedMoveInDate,
  getTranslatedFlatmates,
  getTranslatedSmoking,
  getTranslatedBudget,
  getTranslatedRentalDuration,
  getTranslatedSalaryRange,
  getTranslatedIncomeDocument,
  getTranslatedWorkDuration,
  generateTranslatedRentalPeriod,
  generateTranslatedLandlordContact,
  getTranslatedCity,
  getTranslatedRentalConfirmation,
  getTranslatedRentalHistoryFallback,
  getUserByProfileId,
  FLATMATE_OPTIONS,
  BUDGET_RANGES,
  RENTAL_DURATION,
} from '@/services/userService';
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

    const translatedDescription = computed(() => {
      if (!userData.value) return '';

      const citizenshipText = getTranslatedCitizenship(userData.value.citizenshipStatus, t);
      const timeText = getTranslatedTimeInPoland(userData.value.timeInPoland, t);

      return `${citizenshipText}, ${timeText}`;
    });

    const getTranslatedLanguagesText = () => {
      if (!userData.value?.additionalInfo?.languages) return '';
      return generateTranslatedLanguagesText(userData.value.additionalInfo.languages, t);
    };

    const getTranslatedPetsText = () => {
      if (!userData.value?.additionalInfo) return '';
      return generateTranslatedPetsText(
        userData.value.additionalInfo.hasPets,
        userData.value.additionalInfo.petTypes,
        t,
      );
    };

    const getTranslatedFlmatmatesText = () => {
      if (!userData.value?.additionalInfo?.flatmates) return '';
      return getTranslatedFlatmates(userData.value.additionalInfo.flatmates, t);
    };

    const getTranslatedSmokingText = () => {
      if (userData.value?.additionalInfo?.smoking === null || userData.value?.additionalInfo?.smoking === undefined) return '';
      return getTranslatedSmoking(userData.value.additionalInfo.smoking, t);
    };

    const getTranslatedBudgetText = () => {
      if (!userData.value?.additionalInfo?.budget) return '';
      return getTranslatedBudget(userData.value.additionalInfo.budget, t);
    };

    const getTranslatedRentalDurationText = () => {
      if (!userData.value?.additionalInfo?.rentalDuration) return '';
      return getTranslatedRentalDuration(userData.value.additionalInfo.rentalDuration, t);
    };

    const getTranslatedMoveInDateText = () => {
      if (!userData.value?.additionalInfo?.moveInDate) return '';
      return generateTranslatedMoveInDate(userData.value.additionalInfo.moveInDate, t);
    };

    const getTranslatedSalaryRangeText = () => {
      if (!userData.value?.workplace?.salaryRange) return '';
      return getTranslatedSalaryRange(userData.value.workplace.salaryRange, t);
    };

    const getTranslatedIncomeDocumentText = () => {
      if (!userData.value?.workplace?.incomeDocument) return '';
      return getTranslatedIncomeDocument(userData.value.workplace.incomeDocument, t);
    };

    const getTranslatedWorkDurationText = () => {
      if (!userData.value?.workplace?.workDuration) return '';
      return getTranslatedWorkDuration(userData.value.workplace.workDuration, t);
    };

    const getTranslatedPeriod = (period) => generateTranslatedRentalPeriod(
      period.startMonth,
      period.startYear,
      period.endMonth,
      period.endYear,
      period.isCurrentlyRenting,
      t,
    );

    const getTranslatedLocationText = (city) => getTranslatedCity(city, t);
    // eslint-disable-next-line
    const getTranslatedLandlordContactText = (contact) => generateTranslatedLandlordContact(contact, t);
    // eslint-disable-next-line
    const getTranslatedRentalConfirmationText = (confirmation) => getTranslatedRentalConfirmation(confirmation, t);

    const getTranslatedRentalHistoryFallbackText = () => getTranslatedRentalHistoryFallback(t);

    // Computed властивості для перевірки наявності даних
    const hasSocialMedia = computed(() => {
      if (!userData.value?.socialMedia) return false;
      const social = userData.value.socialMedia;
      return social.whatsapp || social.instagram || social.facebook || social.telegram;
    });

    const hasContactInfo = computed(() => {
      if (!userData.value?.contact) return false;
      return userData.value.contact.phone || userData.value.contact.email;
    });

    const hasWorkplaceInfo = computed(() => {
      if (!userData.value?.workplace) return false;
      const { workplace } = userData.value;
      return workplace.workInfo || workplace.salaryRange || workplace.workDuration;
    });

    const hasAdditionalInfo = computed(() => {
      if (!userData.value?.additionalInfo) return false;
      const info = userData.value.additionalInfo;
      return info.languagesText
         || info.petsText
         || info.flatmates
         || (info.smoking !== null && info.smoking !== undefined)
         || info.budget
         || info.rentalDuration
         || info.moveInDateText;
    });

    const hasRentalHistory = computed(() => userData.value?.rentalHistory
         && Array.isArray(userData.value.rentalHistory)
         && userData.value.rentalHistory.length > 0);

    const getFlatmatesDisplayText = (flatmates) => FLATMATE_OPTIONS[flatmates]?.displayText || '';

    const getBudgetDisplayText = (budget) => BUDGET_RANGES[budget]?.displayText || '';

    const getRentalDurationDisplayText = (rentalDuration) => RENTAL_DURATION[rentalDuration]?.displayText || '';

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

        console.log('Завантаження користувача:', profileId);
        const user = await getUserByProfileId(profileId);

        if (user) {
          userData.value = user;
          console.log('Користувач завантажений:', user);
        } else {
          error.value = 'Користувача не знайдено';
        }
      } catch (err) {
        console.error('Помилка завантаження користувача:', err);
        error.value = 'Помилка завантаження даних';
      } finally {
        loading.value = false;
      }
    };

    // Викликаємо завантаження при монтуванні компонента
    onMounted(() => {
      loadUser();
    });

    // Повертаємо все, що потрібно в template
    return {
      userData,
      loading,
      error,
      loadUser,
      hasSocialMedia,
      hasContactInfo,
      hasWorkplaceInfo,
      hasAdditionalInfo,
      hasRentalHistory,
      getFlatmatesDisplayText,
      getBudgetDisplayText,
      getRentalDurationDisplayText,
      translatedDescription,
      getTranslatedLanguagesText,
      getTranslatedPetsText,
      getTranslatedFlmatmatesText,
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
