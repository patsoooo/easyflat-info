import { computed } from 'vue';
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
} from '@/services/userService';

/**
 * Композабл для відображення даних користувача
 * @param {Ref} userData - Реактивна змінна з даними користувача
 * @param {Function} t - Функція перекладу i18n (опціонально)
 */
export default function useUserDisplay(userData, t = null) {
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

  // Функції для простого тексту (без i18n)
  const getSimpleDescription = () => {
    if (!userData.value) return '';

    const citizenshipText = CITIZENSHIP_STATUS[userData.value.citizenshipStatus]?.displayText || '';
    const timeText = TIME_IN_POLAND[userData.value.timeInPoland]?.displayText || '';

    return `${citizenshipText}, ${timeText}`;
  };

  const getSimpleLanguagesText = () => {
    if (!userData.value?.additionalInfo?.languages) return '';
    return generateLanguagesText(userData.value.additionalInfo.languages);
  };

  const getSimplePetsText = () => {
    if (!userData.value?.additionalInfo) return '';
    return generatePetsText(
      userData.value.additionalInfo.hasPets,
      userData.value.additionalInfo.petTypes,
    );
  };

  const getSimpleFlatmatesText = () => {
    if (!userData.value?.additionalInfo?.flatmates) return '';
    return FLATMATE_OPTIONS[userData.value.additionalInfo.flatmates]?.displayText || '';
  };

  const getSimpleSmokingText = () => {
    if (userData.value?.additionalInfo?.smoking === null
        || userData.value?.additionalInfo?.smoking === undefined) return '';
    return userData.value.additionalInfo.smoking ? 'Курить' : 'Не курить';
  };

  const getSimpleBudgetText = () => {
    if (!userData.value?.additionalInfo?.budget) return '';
    const budgetText = BUDGET_RANGES[userData.value.additionalInfo.budget]?.displayText || '';
    return `Бюджет: ${budgetText}`;
  };

  const getSimpleRentalDurationText = () => {
    if (!userData.value?.additionalInfo?.rentalDuration) return '';
    return RENTAL_DURATION[userData.value.additionalInfo.rentalDuration]?.displayText || '';
  };

  const getSimpleMoveInDateText = () => {
    if (!userData.value?.additionalInfo?.moveInDate) return '';
    return formatMoveInDate(userData.value.additionalInfo.moveInDate);
  };

  const getSimpleSalaryRangeText = () => {
    if (!userData.value?.workplace?.salaryRange) return '';
    return SALARY_RANGES[userData.value.workplace.salaryRange]?.displayText || '';
  };

  const getSimpleIncomeDocumentText = () => {
    if (!userData.value?.workplace?.incomeDocument) return '';
    return INCOME_DOCUMENTS[userData.value.workplace.incomeDocument]?.displayText || '';
  };

  const getSimpleWorkDurationText = () => {
    if (!userData.value?.workplace?.workDuration) return '';
    return WORK_DURATION[userData.value.workplace.workDuration]?.displayText || '';
  };

  const getSimpleRentalPeriodText = (period) => formatRentalPeriod(
    period.startMonth,
    period.startYear,
    period.endMonth,
    period.endYear,
    period.isCurrentlyRenting,
  );

  const getSimpleCityText = (city) => CITIES[city]?.displayText || '';

  const getSimpleLandlordContactText = (contact) => formatLandlordContact(contact);

  const getSimpleRentalConfirmationText = (confirmation) => RENTAL_CONFIRMATIONS[confirmation]?.displayText || '';

  return {
    // Computed властивості
    hasSocialMedia,
    hasContactInfo,
    hasWorkplaceInfo,
    hasAdditionalInfo,
    hasRentalHistory,

    // Функції з перекладами (для View.vue)
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

    // Функції без перекладів (для Preview.vue)
    getSimpleDescription,
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
