import db from '@/firebase/config';
import {
  doc, getDoc, setDoc, updateDoc, deleteDoc,
} from 'firebase/firestore';

// Константи для статусів
export const CITIZENSHIP_STATUS = {
  polish: {
    value: 'polish',
    label: 'Поляк',
    displayText: 'Поляк',
  },
  eu_citizen: {
    value: 'eu_citizen',
    label: 'Громадянин ЄС',
    displayText: 'Громадянин ЄС',
  },
  foreigner: {
    value: 'foreigner',
    label: 'Іноземець',
    displayText: 'Іноземець',
  },
};

export const TIME_IN_POLAND = {
  less_than_1: {
    value: 'less_than_1',
    label: 'Менше року',
    displayText: 'менше року в Польщі',
  },
  '2_to_4': {
    value: '2_to_4',
    label: '2-4 роки',
    displayText: 'від 2 до 4 років в Польщі',
  },
  '5_to_9': {
    value: '5_to_9',
    label: '5-9 років',
    displayText: 'від 5 до 9 років в Польщі',
  },
  '10_plus': {
    value: '10_plus',
    label: '10 і більше років',
    displayText: 'більше 10 років в Польщі',
  },
};

// Константи для зарплати
export const SALARY_RANGES = {
  under_4000: {
    value: 'under_4000',
    label: 'Менше 4000 zł',
    displayText: 'менше 4000 zł/місяць',
  },
  '4000_5000': {
    value: '4000_5000',
    label: '4000–5000 zł',
    displayText: '4000–5000 zł/місяць',
  },
  '5000_7000': {
    value: '5000_7000',
    label: '5000–7000 zł',
    displayText: '5000–7000 zł/місяць',
  },
  '7000_9000': {
    value: '7000_9000',
    label: '7000–9000 zł',
    displayText: '7000–9000 zł/місяць',
  },
  '9000_11000': {
    value: '9000_11000',
    label: '9000–11 000 zł',
    displayText: '9000–11 000 zł/місяць',
  },
  over_11000: {
    value: 'over_11000',
    label: 'Більше 11 000 zł',
    displayText: 'більше 11 000 zł/місяць',
  },
};

// Константи для документів про доходи
export const INCOME_DOCUMENTS = {
  salary_certificate: {
    value: 'salary_certificate',
    label: 'Довідка про зарплату',
    displayText: 'Орендар надасть довідку про зарплату',
  },
  salary_statements: {
    value: 'salary_statements',
    label: 'Роздруківки з зарплати за останні 3–6 місяців',
    displayText: 'Орендар надасть роздруківки з зарплати за останні 3–6 місяців',
  },
  bank_statement: {
    value: 'bank_statement',
    label: 'Виписка з банку',
    displayText: 'Орендар надасть виписку з банку',
  },
  pit11: {
    value: 'pit11',
    label: 'PIT-11',
    displayText: 'Орендар надасть PIT-11',
  },
  contract: {
    value: 'contract',
    label: 'Umowa zlecenie / umowa o dzieło',
    displayText: 'Орендар надасть umowa zlecenie / umowa o dzieło',
  },
};

// Константи для терміну роботи
export const WORK_DURATION = {
  under_1_year: {
    value: 'under_1_year',
    label: 'Менше 1 року',
    displayText: 'Працює менше 1 року',
  },
  '1_2_years': {
    value: '1_2_years',
    label: '1–2 роки',
    displayText: 'Працює від 1 до 2 років',
  },
  '3_5_years': {
    value: '3_5_years',
    label: '3–5 років',
    displayText: 'Працює від 3 до 5 років',
  },
  '6_plus_years': {
    value: '6_plus_years',
    label: '6+ років',
    displayText: 'Працює 6 або більше років',
  },
};

// Константи для мов
export const LANGUAGES = {
  polish: {
    value: 'polish',
    label: 'Польська',
    displayText: 'Польська',
  },
  english: {
    value: 'english',
    label: 'Англійська',
    displayText: 'Англійська',
  },
  spanish: {
    value: 'spanish',
    label: 'Іспанська',
    displayText: 'Іспанська',
  },
  ukrainian: {
    value: 'ukrainian',
    label: 'Українська',
    displayText: 'Українська',
  },
  russian: {
    value: 'russian',
    label: 'Російська',
    displayText: 'Російська',
  },
  german: {
    value: 'german',
    label: 'Німецька',
    displayText: 'Німецька',
  },
};

// Константи для домашніх тварин
export const PET_TYPES = {
  dog: {
    value: 'dog',
    label: 'Собака',
    displayText: 'собаку',
  },
  cat: {
    value: 'cat',
    label: 'Кіт',
    displayText: 'кота',
  },
  hamster: {
    value: 'hamster',
    label: 'Хомяк',
    displayText: 'хомяка',
  },
  parrot: {
    value: 'parrot',
    label: 'Папуга',
    displayText: 'папугу',
  },
  other: {
    value: 'other',
    label: 'Інше',
    displayText: 'домашню тварину',
  },
};

// Константи для співмешканців
export const FLATMATE_OPTIONS = {
  alone: {
    value: 'alone',
    label: 'Сам',
    displayText: 'Орендар шукає житло лише для себе',
  },
  with_partner: {
    value: 'with_partner',
    label: 'З партнером',
    displayText: 'Орендар шукає житло з партнером',
  },
  with_children: {
    value: 'with_children',
    label: 'З дітьми',
    displayText: 'Орендар шукає житло з дітьми',
  },
  with_family: {
    value: 'with_family',
    label: 'З сім\'єю (партнер + діти)',
    displayText: 'Орендар шукає житло з сім\'єю (партнер + діти)',
  },
  with_friends: {
    value: 'with_friends',
    label: 'З друзями/колегами',
    displayText: 'Орендар шукає житло з друзями/колегами',
  },
};

// Константи для бюджету
export const BUDGET_RANGES = {
  up_to_2500: {
    value: 'up_to_2500',
    label: 'До 2500 zł',
    displayText: 'до 2500 zł/місяць',
  },
  '2500_3500': {
    value: '2500_3500',
    label: '2500–3500 zł',
    displayText: '2500–3500 zł/місяць',
  },
  '3500_4500': {
    value: '3500_4500',
    label: '3500–4500 zł',
    displayText: '3500–4500 zł/місяць',
  },
  '4500_6000': {
    value: '4500_6000',
    label: '4500–6000 zł',
    displayText: '4500–6000 zł/місяць',
  },
  over_6000: {
    value: 'over_6000',
    label: 'Більше 6000 zł',
    displayText: 'більше 6000 zł/місяць',
  },
};

// Константи для терміну оренди
export const RENTAL_DURATION = {
  minimum_1_year: {
    value: 'minimum_1_year',
    label: 'Мінімум на рік',
    displayText: 'Оренда мінімум на рік',
  },
  '1_2_years': {
    value: '1_2_years',
    label: '1–2 роки',
    displayText: 'Оренда на 1–2 роки',
  },
  '3_4_years': {
    value: '3_4_years',
    label: '3–4 роки',
    displayText: 'Оренда на 3–4 роки',
  },
  '5_plus_years': {
    value: '5_plus_years',
    label: '5 і більше років',
    displayText: 'Оренда на 5 і більше років',
  },
};

// Константи для міст
export const CITIES = {
  warsaw: {
    value: 'warsaw',
    label: 'Варшава',
    displayText: 'Варшава, Польща',
  },
  krakow: {
    value: 'krakow',
    label: 'Краків',
    displayText: 'Краків, Польща',
  },
  lublin: {
    value: 'lublin',
    label: 'Люблін',
    displayText: 'Люблін, Польща',
  },
};

// Константи для підтвердження оренди
export const RENTAL_CONFIRMATIONS = {
  rental_contract: {
    value: 'rental_contract',
    label: 'Договір попередньої оренди',
    displayText: 'Орендар може надати договір попередньої оренди',
  },
  recommendation_letter: {
    value: 'recommendation_letter',
    label: 'Рекомендаційний лист від попереднього орендодавця',
    displayText: 'Орендар може надати рекомендаційний лист від попереднього орендодавця',
  },
  bank_confirmations: {
    value: 'bank_confirmations',
    label: 'Банківські підтвердження платежів за оренду',
    displayText: 'Орендар може надати банківські підтвердження платежів за оренду',
  },
};

// Константи для місяців
export const MONTHS = {
  1: 'Січень',
  2: 'Лютий',
  3: 'Березень',
  4: 'Квітень',
  5: 'Травень',
  6: 'Червень',
  7: 'Липень',
  8: 'Серпень',
  9: 'Вересень',
  10: 'Жовтень',
  11: 'Листопад',
  12: 'Грудень',
};

// Допоміжні функції валідації
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/[\s\-()]/g, ''));
};

// Генерація унікального ID профілю
export const generateProfileId = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const generateSegment = (length) => {
    let result = '';
    for (let i = 0; i < length; i += 1) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  return `${generateSegment(3)}-${generateSegment(4)}-${generateSegment(3)}`;
};

// Перевірка чи існує профіль з таким ID
export const checkProfileIdExists = async (profileId) => {
  try {
    const docRef = doc(db, 'users', profileId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    console.error('Помилка при перевірці ID:', error);
    return false;
  }
};

// Генерація унікального ID
export const generateUniqueProfileId = async () => {
  let profileId;
  let exists = true;

  while (exists) {
    profileId = generateProfileId();
    // eslint-disable-next-line no-await-in-loop
    exists = await checkProfileIdExists(profileId);
  }

  return profileId;
};

// Функція для генерації повного імені
export const generateFullName = (firstName, lastName) => {
  if (!firstName) return '';

  const trimmedFirstName = firstName.trim();
  const trimmedLastName = lastName ? lastName.trim() : '';

  if (trimmedLastName) {
    return `${trimmedFirstName} ${trimmedLastName}`;
  }

  return trimmedFirstName;
};

// Функція для генерації ініціалів
export const generateInitials = (firstName, lastName) => {
  if (!firstName) return 'N/A';

  const firstInitial = firstName.trim().charAt(0).toUpperCase();
  const lastInitial = lastName && lastName.trim()
    ? lastName.trim().charAt(0).toUpperCase()
    : '';

  if (lastInitial) {
    return `${firstInitial}${lastInitial}`;
  }

  return firstInitial;
};

// Функція для генерації опису
export const generateDescription = (citizenshipStatus, timeInPoland) => {
  const citizenshipText = CITIZENSHIP_STATUS[citizenshipStatus]?.displayText || '';
  const timeText = TIME_IN_POLAND[timeInPoland]?.displayText || '';

  if (!citizenshipText || !timeText) {
    return 'Інформація буде додана пізніше';
  }

  return `${citizenshipText}, ${timeText}`;
};

// Функція для генерації workplace інформації
export const generateWorkplaceInfo = (companyName, position) => {
  if (!companyName && !position) return null;

  const trimmedCompany = companyName ? companyName.trim() : '';
  const trimmedPosition = position ? position.trim() : '';

  if (trimmedCompany && trimmedPosition) {
    return `${trimmedCompany}, ${trimmedPosition}`;
  }

  if (trimmedCompany) {
    return trimmedCompany;
  }

  if (trimmedPosition) {
    return trimmedPosition;
  }

  return null;
};

// Функція для генерації тексту про мови
export const generateLanguagesText = (languages) => {
  if (!languages || !Array.isArray(languages) || languages.length === 0) {
    return null;
  }

  const languageNames = languages
    .map((lang) => LANGUAGES[lang]?.displayText)
    .filter(Boolean);

  if (languageNames.length === 0) return null;

  if (languageNames.length === 1) {
    return `Володіння мовами: ${languageNames[0]}`;
  }

  if (languageNames.length === 2) {
    return `Володіння мовами: ${languageNames[0]} і ${languageNames[1]}`;
  }

  const lastLanguage = languageNames.pop();
  return `Володіння мовами: ${languageNames.join(', ')} і ${lastLanguage}`;
};

// Функція для генерації тексту про домашніх тварин
export const generatePetsText = (hasPets, petTypes) => {
  if (hasPets === false || hasPets === 'no') {
    return 'Домашніх тварин немає';
  }

  if (hasPets === true || hasPets === 'yes') {
    if (!petTypes || !Array.isArray(petTypes) || petTypes.length === 0) {
      return 'Орендар має домашню тварину';
    }

    // Якщо тільки "other"
    if (petTypes.length === 1 && petTypes[0] === 'other') {
      return 'Орендар має домашню тварину';
    }

    // Якщо є конкретні тварини
    const specificPets = petTypes.filter((pet) => pet !== 'other');
    if (specificPets.length === 1) {
      const petText = PET_TYPES[specificPets[0]]?.displayText;
      return petText ? `Орендар має ${petText}` : 'Орендар має домашню тварину';
    }

    return 'Орендар має домашніх тварин';
  }

  return null;
};

// Функція для форматування дати заселення
export const formatMoveInDate = (dateString) => {
  if (!dateString) return null;

  try {
    const date = new Date(dateString);
    const months = [
      'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
      'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня',
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `Бажана дата заселення: ${day} ${month} ${year}`;
  } catch (error) {
    return null;
  }
};

// Функція для форматування періоду оренди
export const
  formatRentalPeriod = (startMonth, startYear, endMonth, endYear, isCurrentlyRenting) => {
    if (!startMonth || !startYear) return null;

    const startMonthName = MONTHS[parseInt(startMonth, 10)];
    if (!startMonthName) return null;

    const startText = `${startMonthName} ${startYear}`;

    if (isCurrentlyRenting) {
      return `${startText} - до зараз`;
    }

    if (endMonth && endYear) {
      const endMonthName = MONTHS[parseInt(endMonth, 10)];
      if (endMonthName) {
        return `${startText} - ${endMonthName} ${endYear}`;
      }
    }

    return startText;
  };

// Функція для генерації адреси з містом
export const generateAddressWithCity = (street, city) => {
  if (!street && !city) return null;

  const trimmedStreet = street ? street.trim() : '';
  const cityText = city ? CITIES[city]?.displayText : '';

  if (trimmedStreet && cityText) {
    return {
      address: trimmedStreet,
      location: cityText,
    };
  }

  if (trimmedStreet) {
    return {
      address: trimmedStreet,
      location: null,
    };
  }

  return null;
};

// Функція для форматування контакту орендодавця
export const formatLandlordContact = (contact) => {
  if (!contact) return null;

  const trimmedContact = contact.trim();

  // Перевіряємо чи це схоже на телефон
  const phoneRegex = /^\+?[\d\s\-()]+$/;
  if (phoneRegex.test(trimmedContact)) {
    return `Номер орендодавця: ${trimmedContact}`;
  }

  // Перевіряємо чи це схоже на email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(trimmedContact)) {
    return `Email орендодавця: ${trimmedContact}`;
  }

  return `Контакт орендодавця: ${trimmedContact}`;
};

// Отримати користувача за profileId
export const getUserByProfileId = async (profileId) => {
  try {
    const docRef = doc(db, 'users', profileId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Помилка при отриманні користувача:', error);
    throw error;
  }
};

// Створити користувача з унікальним ID
export const createUser = async (userData) => {
  try {
    const profileId = await generateUniqueProfileId();

    // Обробляємо дані користувача
    const firstName = userData.firstName || '';
    const lastName = userData.lastName || '';
    const citizenshipStatus = userData.citizenshipStatus || 'foreigner';
    const timeInPoland = userData.timeInPoland || 'less_than_1';

    const userDataWithDefaults = {
      firstName,
      lastName,
      name: generateFullName(firstName, lastName),
      initials: generateInitials(firstName, lastName),
      citizenshipStatus,
      timeInPoland,
      description: generateDescription(citizenshipStatus, timeInPoland),

      // Соціальні мережі
      socialMedia: userData.socialMedia || {
        whatsapp: null,
        instagram: null,
        facebook: null,
        telegram: null,
      },

      // Контакти
      contact: userData.contact || {
        phone: null,
        email: null,
      },

      // Місце роботи
      workplace: {
        company: userData.workplace?.company || null,
        position: userData.workplace?.position || null,
        workInfo: generateWorkplaceInfo(
          userData.workplace?.company,
          userData.workplace?.position,
        ),
        salaryRange: userData.workplace?.salaryRange || null,
        incomeDocument: userData.workplace?.incomeDocument || null,
        workDuration: userData.workplace?.workDuration || null,
      },

      rentalHistory: userData.rentalHistory ? userData.rentalHistory.map((period) => {
        const addressInfo = generateAddressWithCity(period.street, period.city);

        return {
          street: period.street || null,
          city: period.city || null,
          address: addressInfo?.address || null,
          location: addressInfo?.location || null,

          startMonth: period.startMonth || null,
          startYear: period.startYear || null,
          endMonth: period.endMonth || null,
          endYear: period.endYear || null,
          isCurrentlyRenting: period.isCurrentlyRenting || false,
          period: formatRentalPeriod(
            period.startMonth,
            period.startYear,
            period.endMonth,
            period.endYear,
            period.isCurrentlyRenting,
          ),

          landlordContact: period.landlordContact || null,
          landlordContactText: formatLandlordContact(period.landlordContact),

          rentalConfirmations: period.rentalConfirmations || [],
        };
      }) : [],

      additionalInfo: {
        languages: userData.additionalInfo?.languages || [],
        languagesText: generateLanguagesText(userData.additionalInfo?.languages),

        hasPets: userData.additionalInfo?.hasPets || false,
        petTypes: userData.additionalInfo?.petTypes || [],
        petsText: generatePetsText(
          userData.additionalInfo?.hasPets,
          userData.additionalInfo?.petTypes,
        ),

        flatmates: userData.additionalInfo?.flatmates || null,
        smoking: userData.additionalInfo?.smoking || false,
        budget: userData.additionalInfo?.budget || null,
        rentalDuration: userData.additionalInfo?.rentalDuration || null,
        moveInDate: userData.additionalInfo?.moveInDate || null,
        moveInDateText: formatMoveInDate(userData.additionalInfo?.moveInDate),
      },

      // Технічні дані
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    };

    const docRef = doc(db, 'users', profileId);
    await setDoc(docRef, userDataWithDefaults);

    return { profileId, ...userDataWithDefaults };
  } catch (error) {
    console.error('Помилка при створенні користувача:', error);
    throw error;
  }
};

// Оновити користувача
export const updateUser = async (profileId, updates) => {
  try {
    const docRef = doc(db, 'users', profileId);

    // Обробляємо оновлення полів які впливають на автогенерацію
    const processedUpdates = { ...updates };

    // Якщо оновлюємо ім'я чи прізвище, перерахуємо похідні поля
    if (updates.firstName !== undefined || updates.lastName !== undefined) {
      // Отримуємо поточні дані для правильного розрахунку
      const currentUser = await getUserByProfileId(profileId);

      const firstName = updates.firstName !== undefined
        ? updates.firstName
        : currentUser.firstName;
      const lastName = updates.lastName !== undefined
        ? updates.lastName
        : currentUser.lastName;

      processedUpdates.name = generateFullName(firstName, lastName);
      processedUpdates.initials = generateInitials(firstName, lastName);
    }

    // Якщо оновлюємо статус громадянства або час в Польщі, перерахуємо опис
    if (updates.citizenshipStatus !== undefined || updates.timeInPoland !== undefined) {
      const currentUser = await getUserByProfileId(profileId);

      const citizenshipStatus = updates.citizenshipStatus !== undefined
        ? updates.citizenshipStatus
        : currentUser.citizenshipStatus;
      const timeInPoland = updates.timeInPoland !== undefined
        ? updates.timeInPoland
        : currentUser.timeInPoland;

      processedUpdates.description = generateDescription(citizenshipStatus, timeInPoland);
    }

    // Якщо оновлюємо workplace, перерахуємо workInfo
    if (updates.workplace !== undefined) {
      const currentUser = await getUserByProfileId(profileId);

      const company = updates.workplace?.company !== undefined
        ? updates.workplace.company
        : currentUser.workplace?.company;
      const position = updates.workplace?.position !== undefined
        ? updates.workplace.position
        : currentUser.workplace?.position;

      if (!processedUpdates.workplace) {
        processedUpdates.workplace = { ...currentUser.workplace };
      }
      processedUpdates.workplace.workInfo = generateWorkplaceInfo(company, position);
    }

    // Якщо оновлюємо additionalInfo, перерахуємо тексти
    if (updates.additionalInfo !== undefined) {
      const currentUser = await getUserByProfileId(profileId);

      if (!processedUpdates.additionalInfo) {
        processedUpdates.additionalInfo = {
          ...currentUser.additionalInfo,
          ...updates.additionalInfo,
        };
      }

      // Перерахуємо languagesText
      if (updates.additionalInfo.languages !== undefined) {
        processedUpdates.additionalInfo.languagesText = generateLanguagesText(
          updates.additionalInfo.languages,
        );
      }

      // Перерахуємо petsText
      if (updates.additionalInfo.hasPets !== undefined
        || updates.additionalInfo.petTypes !== undefined) {
        const hasPets = updates.additionalInfo.hasPets !== undefined
          ? updates.additionalInfo.hasPets
          : currentUser.additionalInfo?.hasPets;
        const petTypes = updates.additionalInfo.petTypes !== undefined
          ? updates.additionalInfo.petTypes
          : currentUser.additionalInfo?.petTypes;

        processedUpdates.additionalInfo.petsText = generatePetsText(hasPets, petTypes);
      }

      // Перерахуємо moveInDateText
      if (updates.additionalInfo.moveInDate !== undefined) {
        processedUpdates.additionalInfo.moveInDateText = formatMoveInDate(
          updates.additionalInfo.moveInDate,
        );
      }
    }

    // Якщо оновлюємо rentalHistory, перерахуємо всі тексти
    if (updates.rentalHistory !== undefined) {
      processedUpdates.rentalHistory = updates.rentalHistory.map((period) => {
        const addressInfo = generateAddressWithCity(period.street, period.city);

        return {
          ...period,
          address: addressInfo?.address || null,
          location: addressInfo?.location || null,
          period: formatRentalPeriod(
            period.startMonth,
            period.startYear,
            period.endMonth,
            period.endYear,
            period.isCurrentlyRenting,
          ),
          landlordContactText: formatLandlordContact(period.landlordContact),
        };
      });
    }

    processedUpdates.updatedAt = new Date().toISOString();

    await updateDoc(docRef, processedUpdates);
    return true;
  } catch (error) {
    console.error('Помилка при оновленні користувача:', error);
    throw error;
  }
};

// Видалити користувача
export const deleteUser = async (profileId) => {
  try {
    const docRef = doc(db, 'users', profileId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Помилка при видаленні користувача:', error);
    throw error;
  }
};

// Валідація даних користувача
export const validateUserData = (userData) => {
  const errors = [];

  if (!userData.firstName || userData.firstName.trim().length === 0) {
    errors.push('Ім\'я є обов\'язковим полем');
  }

  if (!userData.citizenshipStatus || !CITIZENSHIP_STATUS[userData.citizenshipStatus]) {
    errors.push('Необхідно вибрати статус громадянства');
  }

  if (!userData.timeInPoland || !TIME_IN_POLAND[userData.timeInPoland]) {
    errors.push('Необхідно вказати час перебування в Польщі');
  }

  if (userData.contact?.email && !isValidEmail(userData.contact.email)) {
    errors.push('Невірний формат email');
  }

  if (userData.contact?.phone && !isValidPhone(userData.contact.phone)) {
    errors.push('Невірний формат телефону');
  }

  return errors;
};
