import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';
import { auth } from '@/firebase/config';
import {
  getUserByGoogleId,
  createUserWithGoogleAuth,
} from '@/services/userService';

const googleProvider = new GoogleAuthProvider();

// Додаємо додаткові налаштування для Google провайдера
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Функція для визначення чи потрібно використовувати redirect замість popup
const shouldUseRedirect = () => /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const signInWithGoogle = async () => {
  try {
    // eslint-disable-next-line
    console.log('Початок Google авторизації...');
    let result;
    let user;

    if (shouldUseRedirect()) {
      // eslint-disable-next-line
      console.log('Використовуємо redirect авторизацію');
      await signInWithRedirect(auth, googleProvider);
      return null;
    }
    // eslint-disable-next-line
    console.log('Використовуємо popup авторизацію');
    try {
      result = await signInWithPopup(auth, googleProvider);
      user = result.user;
      // eslint-disable-next-line
      console.log('Popup авторизація успішна:', user.uid);
    } catch (popupError) {
      // eslint-disable-next-line
      console.warn('Popup заблокований, код помилки:', popupError.code);
      // eslint-disable-next-line
      console.warn('Повідомлення помилки:', popupError.message);

      if (popupError.code === 'auth/popup-blocked'
            || popupError.code === 'auth/popup-closed-by-user') {
        // eslint-disable-next-line
        console.log('Переходимо на redirect авторизацію');
        await signInWithRedirect(auth, googleProvider);
        return null;
      }
      throw popupError;
    }

    if (!user) {
      throw new Error('Не вдалося отримати дані користувача');
    }
    // eslint-disable-next-line
    console.log('Перевіряємо користувача в базі даних:', user.uid);
    // Перевіряємо чи існує користувач у нашій базі
    let dbUser = await getUserByGoogleId(user.uid);

    if (!dbUser) {
      // eslint-disable-next-line
      console.log('Створюємо нового користувача');
      // Створюємо нового користувача
      dbUser = await createUserWithGoogleAuth({
        googleId: user.uid,
        email: user.email,
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
        photoURL: user.photoURL,
      });
    } else {
      // eslint-disable-next-line
      console.log('Користувач знайдений в базі даних');
    }
    // eslint-disable-next-line
    console.log('Авторизація завершена успішно');
    return dbUser;
  } catch (error) {
    // eslint-disable-next-line
    console.error('Детальна помилка авторизації:', error);
    // eslint-disable-next-line
    console.error('Код помилки:', error.code);
    // eslint-disable-next-line
    console.error('Повідомлення:', error.message);

    // Обробляємо різні типи помилок
    if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup заблокований браузером. Спробуйте ще раз.');
    } else if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Авторизація скасована користувачем');
    } else if (error.code === 'auth/cancelled-popup-request') {
      throw new Error('Попередній запит авторизації ще виконується');
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('Помилка мережі. Перевірте інтернет-з\'єднання.');
    } else if (error.code === 'auth/unauthorized-domain') {
      throw new Error('Домен не авторизований в Firebase Console');
    }

    throw error;
  }
};

// Функція для обробки результату redirect авторизації
export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);

    if (!result) {
      return null; // Немає redirect результату
    }

    const { user } = result;

    // Перевіряємо чи існує користувач у нашій базі
    let dbUser = await getUserByGoogleId(user.uid);

    if (!dbUser) {
      // Створюємо нового користувача
      dbUser = await createUserWithGoogleAuth({
        googleId: user.uid,
        email: user.email,
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
        photoURL: user.photoURL,
      });
    }

    return dbUser;
  } catch (error) {
    // eslint-disable-next-line
    console.error('Помилка обробки redirect результату:', error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem('currentUser');
  } catch (error) {
    // eslint-disable-next-line
    console.error('Помилка виходу:', error);
    throw error;
  }
};

export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);

// Функція для отримання поточного користувача
export const getCurrentUser = () => auth.currentUser;
