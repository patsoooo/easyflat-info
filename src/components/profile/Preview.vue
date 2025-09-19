<template>
  <div class="preview">
    <div class="preview_top">
      <ul class="preview_actions">
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <ul class="preview_tabs">
        <li class="preview_tab">
          <div class="preview_tab-icon"></div>
          <div class="preview_tab-address"></div>
        </li>
        <li class="preview_tab">
          <div class="preview_tab-icon"></div>
          <div class="preview_tab-address"></div>
        </li>
      </ul>
    </div>
    <div class="preview_search">
      <div class="preview_search-input">
        <div class="preview_search-input-icon"></div>
        <div class="preview_search-input-address"></div>
      </div>
    </div>
    <div class="preview_tablet">
      <div class="preview_gradient"></div>
      <img src="../../img/logo-small.svg" alt="logo" class="preview_logo">
      <div class="user">
        <div class="user_data">
          <!-- Реальні дані з inject -->
          <div class="user_data-photo">{{ userData?.initials || 'NA' }}</div>
          <div class="user_data-name">
            {{ getSimpleGenderText() }}
            {{ userData?.name || 'Введіть ім\'я...' }}
          </div>
          <div class="user_data-desc">
            {{ getSimpleDescription() || 'Оберіть статус і час перебування в Польщі' }}
          </div>

          <!-- Соціальні мережі - показуємо тільки якщо є дані -->
          <ul v-if="hasSocialMedia" class="user_data-social">
            <li v-if="userData?.socialMedia?.whatsapp">
              <a :href="userData.socialMedia.whatsapp" target="_blank">
                <img src="../../img/social/whatsapp.svg" alt="whatsapp">
              </a>
            </li>
            <li v-if="userData?.socialMedia?.instagram">
              <a :href="userData.socialMedia.instagram" target="_blank">
                <img src="../../img/social/instagram.svg" alt="instagram">
              </a>
            </li>
            <li v-if="userData?.socialMedia?.facebook">
              <a :href="userData.socialMedia.facebook" target="_blank">
                <img src="../../img/social/fb.svg" alt="facebook">
              </a>
            </li>
            <li v-if="userData?.socialMedia?.telegram">
              <a :href="userData.socialMedia.telegram" target="_blank">
                <img src="../../img/social/linkedin.svg" alt="telegram">
              </a>
            </li>
          </ul>
        </div>

        <!-- Контакт - показуємо тільки якщо є дані -->
        <div v-if="hasContactInfo" class="user_section">
          <span class="user_section-title">Контакт</span>
          <ul class="user_list">
            <li v-if="userData?.contact?.phone" class="user_info">
              <img src="../../img/icons/phone.svg" alt="phone">
              <div class="user_info-data">
                <p>{{ userData.contact.phone }}</p>
              </div>
            </li>
            <li v-if="userData?.contact?.email" class="user_info">
              <img src="../../img/icons/email.svg" alt="email">
              <div class="user_info-data">
                <p>{{ userData.contact.email }}</p>
              </div>
            </li>
          </ul>
        </div>

        <!-- Місце роботи - показуємо тільки якщо є дані -->
        <div v-if="hasWorkplaceInfo" class="user_section">
          <span class="user_section-title">Місце роботи</span>
          <ul class="user_list">
            <li v-if="userData?.workplace?.workInfo" class="user_info">
              <img src="../../img/icons/work.svg" alt="work">
              <div class="user_info-data">
                <p>{{ userData.workplace.workInfo }}</p>
              </div>
            </li>
            <li v-if="userData?.workplace?.salaryRange" class="user_info">
              <img src="../../img/icons/money.svg" alt="money">
              <div class="user_info-data">
                <p>{{ getSimpleSalaryRangeText() }}</p>
                <span v-if="userData?.workplace?.incomeDocument">
                  {{ getSimpleIncomeDocumentText() }}
                </span>
              </div>
            </li>
            <li v-if="userData?.workplace?.workDuration" class="user_info">
              <img src="../../img/icons/time.svg" alt="time">
              <div class="user_info-data">
                <p>{{ getSimpleWorkDurationText() }}</p>
              </div>
            </li>
          </ul>
        </div>

        <!-- Історія оренди -->
        <div v-if="hasRentalHistory" class="user_section">
          <span class="user_section-title">Історія оренди</span>
          <div class="user_history">
            <div
              v-for="(period, index) in userData.rentalHistory"
              :class="{ 'user_history-last': index === userData.rentalHistory.length - 1 }"
              :key="index"
            >
              <span class="user_history-title">{{ getSimpleRentalPeriodText(period) }}</span>
              <ul class="user_list">
                <li v-if="period?.address" class="user_info">
                  <img src="../../img/icons/location.svg" alt="location">
                  <div class="user_info-data">
                    <p>{{ period.address }}</p>
                    <span v-if="period?.city">{{ getSimpleCityText(period.city) }}</span>
                  </div>
                </li>
                <li v-if="period?.landlordContact" class="user_info">
                  <img src="../../img/icons/phone.svg" alt="phone">
                  <div class="user_info-data">
                    <p>{{ getSimpleLandlordContactText(period.landlordContact) }}</p>
                  </div>
                </li>
                <li v-if="period?.rentalConfirmation" class="user_info">
                  <img src="../../img/icons/money.svg" alt="money">
                  <div class="user_info-data">
                    <p>{{ getSimpleRentalConfirmationText(period.rentalConfirmation) }}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Додаткова інформація -->
        <div v-if="hasAdditionalInfo" class="user_section">
          <span class="user_section-title">Додаткова інформація</span>
          <ul class="user_list">
            <li v-if="userData?.additionalInfo?.languages?.length > 0" class="user_info">
              <img src="../../img/icons/language.svg" alt="language">
              <div class="user_info-data">
                <p>{{ getSimpleLanguagesText() }}</p>
              </div>
            </li>
            <li v-if="userData?.additionalInfo?.hasPets !== null
            && userData?.additionalInfo?.hasPets !== undefined" class="user_info">
              <img src="../../img/icons/pets.svg" alt="pets">
              <div class="user_info-data">
                <p>{{ getSimplePetsText() }}</p>
              </div>
            </li>
            <li v-if="userData?.additionalInfo?.flatmates" class="user_info">
              <img src="../../img/icons/flatmates.svg" alt="flatmates">
              <div class="user_info-data">
                <p>{{ getSimpleFlatmatesText() }}</p>
              </div>
            </li>
            <li v-if="userData?.additionalInfo?.smoking !== null
            && userData?.additionalInfo?.smoking !== undefined" class="user_info">
              <img src="../../img/icons/smoke.svg" alt="smoke">
              <div class="user_info-data">
                <p>{{ getSimpleSmokingText() }}</p>
              </div>
            </li>
            <li v-if="userData?.additionalInfo?.budget" class="user_info">
              <img src="../../img/icons/money.svg" alt="money">
              <div class="user_info-data">
                <p>{{ getSimpleBudgetText() }}</p>
              </div>
            </li>
            <li v-if="userData?.additionalInfo?.rentalDuration" class="user_info">
              <img src="../../img/icons/time.svg" alt="time">
              <div class="user_info-data">
                <p>{{ getSimpleRentalDurationText() }}</p>
              </div>
            </li>
            <li v-if="userData?.additionalInfo?.moveInDate" class="user_info">
              <img src="../../img/icons/calendar.svg" alt="calendar">
              <div class="user_info-data">
                <p>{{ getSimpleMoveInDateText() }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { inject } from 'vue';
import useUserDisplay from '@/composables/useUserDisplay';

export default {
  name: 'PreviewProfile',
  setup() {
    // Inject даних з батьківського компонента
    const userData = inject('userData', null);

    // Використовуємо композабл для логіки відображення (без i18n для Preview)
    const {
      hasSocialMedia,
      hasContactInfo,
      hasWorkplaceInfo,
      hasAdditionalInfo,
      hasRentalHistory,
      getSimpleDescription,
      getSimpleGenderText,
      getSimpleLanguagesText,
      getSimplePetsText,
      getSimpleFlatmatesText,
      getSimpleSmokingText,
      getSimpleBudgetText,
      getSimpleRentalDurationText,
      getSimpleMoveInDateText,
      getSimpleSalaryRangeText,
      getSimpleIncomeDocumentText,
      getSimpleWorkDurationText,
      getSimpleRentalPeriodText,
      getSimpleCityText,
      getSimpleLandlordContactText,
      getSimpleRentalConfirmationText,
    } = useUserDisplay(userData); // Передаємо без t функції

    return {
      userData,
      hasSocialMedia,
      hasContactInfo,
      hasWorkplaceInfo,
      hasAdditionalInfo,
      hasRentalHistory,
      getSimpleDescription,
      getSimpleGenderText,
      getSimpleLanguagesText,
      getSimplePetsText,
      getSimpleFlatmatesText,
      getSimpleSmokingText,
      getSimpleBudgetText,
      getSimpleRentalDurationText,
      getSimpleMoveInDateText,
      getSimpleSalaryRangeText,
      getSimpleIncomeDocumentText,
      getSimpleWorkDurationText,
      getSimpleRentalPeriodText,
      getSimpleCityText,
      getSimpleLandlordContactText,
      getSimpleRentalConfirmationText,
    };
  },
};
</script>

<style lang="scss" scoped>
.preview {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 20rem);
  box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 3px 10px;
  border-radius: 1.6rem;
  &_top {
    width: 100%;
    height: 4.4rem !important;
    display: flex;
    align-items: center;
    background-color: $skeleton-bg;
    border-radius: 1.6rem 1.6rem 0 0;
    padding: .8rem 0 0 1.6rem;
  }
  &_actions {
    display: flex;
    align-items: center;
    margin-right: 1.2rem;
    li {
      background-color: $skeleton-text;
      width: 1.4rem;
      height: 1.4rem;
      border-radius: 100%;
      margin-right: .6rem;
    }
  }
  &_tabs {
    display: flex;
    align-items: center;
    overflow: hidden;
  }
  &_tab {
    height: 3.6rem;
    min-width: 18rem;
    display: flex;
    align-items: center;
    border-radius: 1.2rem 1.2rem 0 0;
    background-color: $bg-white;
    padding-left: 1.2rem;
    &-icon {
      background: $skeleton-text;
      width: 1.6rem;
      height: 1.6rem;
      border-radius: .4rem;
      margin-right: .8rem;
    }
    &-address {
      background: $skeleton-text;
      width: 8rem;
      height: 1.2rem;
      border-radius: .4rem;
    }
    &:last-child {
      opacity: .4;
    }
  }
  &_search {
    width: 100%;
    padding: .8rem 1.2rem;
    border-bottom: .1rem solid $border-form;
    &-input {
      display: flex;
      align-items: center;
      background-color: $skeleton-search;
      border-radius: .8rem;
      padding: .8rem 1.2rem;
      &-icon {
        background: $skeleton-text;
        width: 1.6rem;
        height: 1.6rem;
        border-radius: .4rem;
        margin-right: .8rem;
      }
      &-address {
        background: $skeleton-text;
        width: 8rem;
        height: 1.2rem;
        border-radius: .4rem;
      }
    }
  }
  &_tablet {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    border-radius: 0 0 1.6rem 1.6rem;
    position: relative;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  &_gradient {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 20rem;
    background: linear-gradient(180deg, #D6E0FF 0%, #fff 100%);
  }
  &_logo {
    position: absolute;
    top: 1.6rem;
    left: 1.6rem;
    height: 2.4rem;
    z-index: 1;
  }
}
</style>
