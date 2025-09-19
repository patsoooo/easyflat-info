import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
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
  getTranslatedGender,
  CITIZENSHIP_STATUS,
  TIME_IN_POLAND,
  SALARY_RANGES,
  INCOME_DOCUMENTS,
  WORK_DURATION,
  FLATMATE_OPTIONS,
  BUDGET_RANGES,
  RENTAL_DURATION,
  CITIES,
  RENTAL_CONFIRMATIONS,
  formatRentalPeriod,
  formatLandlordContact,
  generateLanguagesText,
  generatePetsText,
  formatMoveInDate,
  generateGenderText,
} from '@/services/userService';

/**
 * Композабл для відображення даних користувача
 * @param {Ref} userData - Реактивна змінна з даними користувача
 * @param {Function} tProp - Функція перекладу i18n (опціонально, для ViewUser.vue)
 */
export default function useUserDisplay(userData, tProp = null) {
  // Отримуємо t функцію з useI18n якщо не передана ззовні
  let t = tProp;
  if (!t) {
    try {
      const i18n = useI18n();
      t = i18n.t;
    } catch (error) {
      // Якщо useI18n недоступний, t залишається null
      t = null;
    }
  }

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

  // Функції для перекладеного тексту (з i18n)
  const getTranslatedDescription = () => {
    if (!userData.value || !t) return '';

    const citizenshipText = getTranslatedCitizenship(userData.value.citizenshipStatus, t);
    const timeText = getTranslatedTimeInPoland(userData.value.timeInPoland, t);

    return `${citizenshipText}, ${timeText}`;
  };

  const getTranslatedLanguagesText = () => {
    if (!userData.value?.additionalInfo?.languages || !t) return '';
    return generateTranslatedLanguagesText(userData.value.additionalInfo.languages, t);
  };

  const getTranslatedPetsText = () => {
    if (!userData.value?.additionalInfo || !t) return '';
    return generateTranslatedPetsText(
      userData.value.additionalInfo.hasPets,
      userData.value.additionalInfo.petTypes,
      t,
    );
  };

  const getTranslatedFlatmatesText = () => {
    if (!userData.value?.additionalInfo?.flatmates || !t) return '';
    return getTranslatedFlatmates(userData.value.additionalInfo.flatmates, t);
  };

  const getTranslatedSmokingText = () => {
    if (userData.value?.additionalInfo?.smoking === null
        || userData.value?.additionalInfo?.smoking === undefined || !t) return '';
    return getTranslatedSmoking(userData.value.additionalInfo.smoking, t);
  };

  const getTranslatedBudgetText = () => {
    if (!userData.value?.additionalInfo?.budget || !t) return '';
    return getTranslatedBudget(userData.value.additionalInfo.budget, t);
  };

  const getTranslatedRentalDurationText = () => {
    if (!userData.value?.additionalInfo?.rentalDuration || !t) return '';
    return getTranslatedRentalDuration(userData.value.additionalInfo.rentalDuration, t);
  };

  const getTranslatedMoveInDateText = () => {
    if (!userData.value?.additionalInfo?.moveInDate || !t) return '';
    return generateTranslatedMoveInDate(userData.value.additionalInfo.moveInDate, t);
  };

  const getTranslatedSalaryRangeText = () => {
    if (!userData.value?.workplace?.salaryRange || !t) return '';
    return getTranslatedSalaryRange(userData.value.workplace.salaryRange, t);
  };

  const getTranslatedIncomeDocumentText = () => {
    if (!userData.value?.workplace?.incomeDocument || !t) return '';
    return getTranslatedIncomeDocument(userData.value.workplace.incomeDocument, t);
  };

  const getTranslatedWorkDurationText = () => {
    if (!userData.value?.workplace?.workDuration || !t) return '';
    return getTranslatedWorkDuration(userData.value.workplace.workDuration, t);
  };

  const getTranslatedPeriod = (period) => {
    if (!t) return '';
    return generateTranslatedRentalPeriod(
      period.startMonth,
      period.startYear,
      period.endMonth,
      period.endYear,
      period.isCurrentlyRenting,
      t,
    );
  };

  const getTranslatedLocationText = (city) => {
    if (!t) return '';
    return getTranslatedCity(city, t);
  };

  const getTranslatedLandlordContactText = (contact) => {
    if (!t) return '';
    return generateTranslatedLandlordContact(contact, t);
  };

  const getTranslatedRentalConfirmationText = (confirmation) => {
    if (!t) return '';
    return getTranslatedRentalConfirmation(confirmation, t);
  };

  const getTranslatedRentalHistoryFallbackText = () => {
    if (!t) return '';
    return getTranslatedRentalHistoryFallback(t);
  };

  const getTranslatedGenderText = () => {
    if (!userData.value?.gender || !t) return '';
    return getTranslatedGender(userData.value.gender, t);
  };

  // ОНОВЛЕНІ функції для простого тексту (тепер ТЕОБЖ з i18n)
  const getSimpleDescription = () => {
    if (!userData.value) return '';

    // Якщо є i18n, використовуємо переклади
    if (t) {
      const citizenshipText = getTranslatedCitizenship(userData.value.citizenshipStatus, t);
      const timeText = getTranslatedTimeInPoland(userData.value.timeInPoland, t);
      return `${citizenshipText}, ${timeText}`;
    }

    // Fallback до статичних констант
    const citizenshipText = CITIZENSHIP_STATUS[userData.value.citizenshipStatus]?.displayText || '';
    const timeText = TIME_IN_POLAND[userData.value.timeInPoland]?.displayText || '';
    return `${citizenshipText}, ${timeText}`;
  };

  const getSimpleGenderText = () => {
    if (!userData.value?.gender) return '';

    if (t) {
      return getTranslatedGender(userData.value.gender, t);
    }

    return generateGenderText(userData.value.gender);
  };

  const getSimpleLanguagesText = () => {
    if (!userData.value?.additionalInfo?.languages) return '';

    if (t) {
      return generateTranslatedLanguagesText(userData.value.additionalInfo.languages, t);
    }

    return generateLanguagesText(userData.value.additionalInfo.languages);
  };

  const getSimplePetsText = () => {
    if (!userData.value?.additionalInfo) return '';

    if (t) {
      return generateTranslatedPetsText(
        userData.value.additionalInfo.hasPets,
        userData.value.additionalInfo.petTypes,
        t,
      );
    }

    return generatePetsText(
      userData.value.additionalInfo.hasPets,
      userData.value.additionalInfo.petTypes,
    );
  };

  const getSimpleFlatmatesText = () => {
    if (!userData.value?.additionalInfo?.flatmates) return '';

    if (t) {
      return getTranslatedFlatmates(userData.value.additionalInfo.flatmates, t);
    }

    return FLATMATE_OPTIONS[userData.value.additionalInfo.flatmates]?.displayText || '';
  };

  const getSimpleSmokingText = () => {
    if (userData.value?.additionalInfo?.smoking === null
        || userData.value?.additionalInfo?.smoking === undefined) return '';

    if (t) {
      return getTranslatedSmoking(userData.value.additionalInfo.smoking, t);
    }

    return userData.value.additionalInfo.smoking ? 'Курить' : 'Не курить';
  };

  const getSimpleBudgetText = () => {
    if (!userData.value?.additionalInfo?.budget) return '';

    if (t) {
      return getTranslatedBudget(userData.value.additionalInfo.budget, t);
    }

    const budgetText = BUDGET_RANGES[userData.value.additionalInfo.budget]?.displayText || '';
    return `Бюджет: ${budgetText}`;
  };

  const getSimpleRentalDurationText = () => {
    if (!userData.value?.additionalInfo?.rentalDuration) return '';

    if (t) {
      return getTranslatedRentalDuration(userData.value.additionalInfo.rentalDuration, t);
    }

    return RENTAL_DURATION[userData.value.additionalInfo.rentalDuration]?.displayText || '';
  };

  const getSimpleMoveInDateText = () => {
    if (!userData.value?.additionalInfo?.moveInDate) return '';

    if (t) {
      return generateTranslatedMoveInDate(userData.value.additionalInfo.moveInDate, t);
    }

    return formatMoveInDate(userData.value.additionalInfo.moveInDate);
  };

  const getSimpleSalaryRangeText = () => {
    if (!userData.value?.workplace?.salaryRange) return '';

    if (t) {
      return getTranslatedSalaryRange(userData.value.workplace.salaryRange, t);
    }

    return SALARY_RANGES[userData.value.workplace.salaryRange]?.displayText || '';
  };

  const getSimpleIncomeDocumentText = () => {
    if (!userData.value?.workplace?.incomeDocument) return '';

    if (t) {
      return getTranslatedIncomeDocument(userData.value.workplace.incomeDocument, t);
    }

    return INCOME_DOCUMENTS[userData.value.workplace.incomeDocument]?.displayText || '';
  };

  const getSimpleWorkDurationText = () => {
    if (!userData.value?.workplace?.workDuration) return '';

    if (t) {
      return getTranslatedWorkDuration(userData.value.workplace.workDuration, t);
    }

    return WORK_DURATION[userData.value.workplace.workDuration]?.displayText || '';
  };

  const getSimpleRentalPeriodText = (period) => {
    if (t) {
      return generateTranslatedRentalPeriod(
        period.startMonth,
        period.startYear,
        period.endMonth,
        period.endYear,
        period.isCurrentlyRenting,
        t,
      );
    }

    return formatRentalPeriod(
      period.startMonth,
      period.startYear,
      period.endMonth,
      period.endYear,
      period.isCurrentlyRenting,
    );
  };

  const getSimpleCityText = (city) => {
    if (t) {
      return getTranslatedCity(city, t);
    }

    return CITIES[city]?.displayText || '';
  };

  const getSimpleLandlordContactText = (contact) => {
    if (t) {
      return generateTranslatedLandlordContact(contact, t);
    }

    return formatLandlordContact(contact);
  };

  const getSimpleRentalConfirmationText = (confirmation) => {
    if (t) {
      return getTranslatedRentalConfirmation(confirmation, t);
    }

    return RENTAL_CONFIRMATIONS[confirmation]?.displayText || '';
  };

  return {
    // Computed властивості
    hasSocialMedia,
    hasContactInfo,
    hasWorkplaceInfo,
    hasAdditionalInfo,
    hasRentalHistory,

    // Функції з перекладами (для View.vue)
    getTranslatedDescription,
    getTranslatedGenderText,
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

    // Функції які тепер ТАКОЖ використовують i18n (для Preview.vue)
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
}
