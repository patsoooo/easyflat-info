<template>
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
          {{ userData?.description || 'Немає інформації' }}
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
        <span class="user_section-title">Контакт</span>
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

      <!-- Захаркоджені секції поки що -->
      <div v-if="hasWorkplaceInfo" class="user_section">
        <span class="user_section-title">Місце роботи</span>
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
              <p>{{ getSalaryDisplayText(userData.workplace.salaryRange) }}</p>
              <span v-if="userData?.workplace?.incomeDocument">
                {{ getIncomeDocumentDisplayText(userData.workplace.incomeDocument) }}
              </span>
            </div>
          </li>
          <li v-if="userData?.workplace?.workDuration" class="user_info">
            <img src="../img/icons/time.svg" alt="time">
            <div class="user_info-data">
              <p>{{ getWorkDurationDisplayText(userData.workplace.workDuration) }}</p>
            </div>
          </li>
        </ul>
      </div>

      <!-- Історія оренди -->
      <div v-if="hasRentalHistory" class="user_section">
        <span class="user_section-title">Історія оренди</span>
        <div class="user_history">
          <div v-for="(period, index) in userData.rentalHistory"
          :class="{ 'user_history-last': index === userData.rentalHistory.length - 1 }"
          :key="index">
            <span class="user_history-title">{{ period?.period || 'Невідомий період' }}</span>
            <ul class="user_list">
              <li v-if="period?.address" class="user_info">
                <img src="../img/icons/location.svg" alt="location">
                <div class="user_info-data">
                  <p>{{ period.address }}</p>
                  <span v-if="period?.location">{{ period.location }}</span>
                </div>
              </li>
              <li v-if="period?.landlordContactText" class="user_info">
                <img src="../img/icons/phone.svg" alt="phone">
                <div class="user_info-data">
                  <p>{{ period.landlordContactText }}</p>
                </div>
              </li>
              <li v-if="period?.rentalConfirmations?.length > 0" class="user_info">
                <img src="../img/icons/money.svg" alt="money">
                <div class="user_info-data">
                  <p v-for="confirmation in period.rentalConfirmations" :key="confirmation">
                    {{ getRentalConfirmationDisplayText(confirmation) }}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Якщо немає історії оренди, показуємо заглушку -->
      <div v-else class="user_section">
        <span class="user_section-title">Історія оренди</span>
        <div class="user_history">
          <span class="user_history-title">Інформація буде додана пізніше</span>
        </div>
      </div>

<!-- Додаткова інформація - показуємо тільки якщо є хоча б одне поле -->
      <div v-if="hasAdditionalInfo" class="user_section">
        <span class="user_section-title">Додаткова інформація</span>
        <ul class="user_list">
          <li v-if="userData?.additionalInfo?.languagesText" class="user_info">
            <img src="../img/icons/language.svg" alt="language">
            <div class="user_info-data">
              <p>{{ userData.additionalInfo.languagesText }}</p>
            </div>
          </li>
          <li v-if="userData?.additionalInfo?.petsText" class="user_info">
            <img src="../img/icons/pets.svg" alt="pets">
            <div class="user_info-data">
              <p>{{ userData.additionalInfo.petsText }}</p>
            </div>
          </li>
          <li v-if="userData?.additionalInfo?.flatmates" class="user_info">
            <img src="../img/icons/flatmates.svg" alt="flatmates">
            <div class="user_info-data">
              <p>{{ getFlatmatesDisplayText(userData.additionalInfo.flatmates) }}</p>
            </div>
          </li>
          <li v-if="userData?.additionalInfo?.smoking !== null
          && userData?.additionalInfo?.smoking !== undefined" class="user_info">
            <img src="../img/icons/smoke.svg" alt="smoke">
            <div class="user_info-data">
              <p>{{ userData.additionalInfo.smoking ? 'Палить' : 'Не палить' }}</p>
            </div>
          </li>
          <li v-if="userData?.additionalInfo?.budget" class="user_info">
            <img src="../img/icons/money.svg" alt="money">
            <div class="user_info-data">
              <p>Бюджет: {{ getBudgetDisplayText(userData.additionalInfo.budget) }}</p>
            </div>
          </li>
          <li v-if="userData?.additionalInfo?.rentalDuration" class="user_info">
            <img src="../img/icons/time.svg" alt="time">
            <div class="user_info-data">
              <p>{{ getRentalDurationDisplayText(userData.additionalInfo.rentalDuration) }}</p>
            </div>
          </li>
          <li v-if="userData?.additionalInfo?.moveInDateText" class="user_info">
            <img src="../img/icons/calendar.svg" alt="calendar">
            <div class="user_info-data">
              <p>{{ userData.additionalInfo.moveInDateText }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import {
  getUserByProfileId,
  SALARY_RANGES,
  INCOME_DOCUMENTS,
  WORK_DURATION,
  FLATMATE_OPTIONS,
  BUDGET_RANGES,
  RENTAL_DURATION,
  RENTAL_CONFIRMATIONS,
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
    const route = useRoute();

    // Реактивні змінні
    const userData = ref(null);
    const loading = ref(true);
    const error = ref(null);

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

    const getSalaryDisplayText = (salaryRange) => SALARY_RANGES[salaryRange]?.displayText || '';

    const getIncomeDocumentDisplayText = (incomeDocument) => INCOME_DOCUMENTS[incomeDocument]?.displayText || '';

    const getWorkDurationDisplayText = (workDuration) => WORK_DURATION[workDuration]?.displayText || '';

    const getFlatmatesDisplayText = (flatmates) => FLATMATE_OPTIONS[flatmates]?.displayText || '';

    const getBudgetDisplayText = (budget) => BUDGET_RANGES[budget]?.displayText || '';

    const getRentalDurationDisplayText = (rentalDuration) => RENTAL_DURATION[rentalDuration]?.displayText || '';

    const getRentalConfirmationDisplayText = (confirmation) => RENTAL_CONFIRMATIONS[confirmation]?.displayText || '';

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
      getSalaryDisplayText,
      getIncomeDocumentDisplayText,
      getWorkDurationDisplayText,
      getFlatmatesDisplayText,
      getBudgetDisplayText,
      getRentalDurationDisplayText,
      getRentalConfirmationDisplayText,
    };
  },
};
</script>

<style lang="scss">
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

.user {
  margin-bottom: 2rem;
  &_history {
    padding: 1.2rem 0;
    .user_list {
      margin-left: 3.6rem;
      position: relative;
      margin-bottom: 1.2rem;
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: -2.6rem;
        width: 0.16rem;
        height: 100%;
        background: $border-grey;
        border-radius: 10rem;
      }
    }
    &-title {
      display: block;
      @include text-15-medium;
      color: $text-grey-6;
      margin-left: 3.6rem;
      position: relative;
      margin-bottom: 1.2rem;
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: -3.6rem;
        display: inline-block;
        width: 2rem;
        height: 2rem;
        border: 0.16rem solid $border-grey;
        border-radius: 100%;
      }
    }
    .user_history-last {
      .user_list {
        &::after {
          content: none;
        }
      }
    }
  }
  &_data {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2.4rem 0;
    margin-bottom: 1.6rem;
    &-photo {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 12rem;
      height: 12rem;
      border-radius: 100%;
      background: rgba(0, 0, 0, 0.06);
      margin-bottom: 1.6rem;
      @include text-24-bold;
    }
    &-name {
      @include text-24-bold;
      color: $text-black;
      margin-bottom: .4rem;
    }
    &-desc {
      @include text-15-regular;
      color: $text-grey-6;
      margin-bottom: 2rem;
    }
    &-social {
      display: flex;
      align-items: center;
      li {
        padding: 0 0.8rem;
        a {
          width: 3.2rem;
          img {
            width: 100%;
          }
        }
      }
    }
  }
  &_section {
    padding: 1.6rem 1.6rem 1.2rem 2rem;
    background-color: $bg-white;
    border: .08rem solid $border-grey;
    border-radius: 1.6rem;
    margin-bottom: 1.6rem;
    &:last-child {
      margin-bottom: 0;
    }
    &-title {
      display: block;
      @include text-15-medium;
      color: $text-grey-6;
      margin-bottom: .8rem;
      &.history {
        margin-top: 3.2rem;
      }
    }
  }
  &_info {
    display: flex;
    align-items: center;
    padding: 1.2rem 0;
    &-data {
      span {
        @include text-13-regular;
        color: $text-grey-6;
      }
    }
    img {
      width: 2.4rem;
      margin-right: 1.2rem;
    }
    p {
      @include text-15-medium;
      color: $text-black;
    }
  }
}
</style>
