import db from '@/firebase/config';
import {
  doc, getDoc, setDoc, updateDoc, deleteDoc,
} from 'firebase/firestore';

// Отримати користувача за username
export const getUserByUsername = async (username) => {
  try {
    const docRef = doc(db, 'users', username);
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

// Створити або оновити користувача
export const saveUser = async (username, userData) => {
  try {
    const docRef = doc(db, 'users', username);
    await setDoc(docRef, userData, { merge: true });
    return true;
  } catch (error) {
    console.error('Помилка при збереженні користувача:', error);
    throw error;
  }
};

// Оновити користувача
export const updateUser = async (username, updates) => {
  try {
    const docRef = doc(db, 'users', username);
    await updateDoc(docRef, updates);
    return true;
  } catch (error) {
    console.error('Помилка при оновленні користувача:', error);
    throw error;
  }
};

// Видалити користувача
export const deleteUser = async (username) => {
  try {
    const docRef = doc(db, 'users', username);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Помилка при видаленні користувача:', error);
    throw error;
  }
};
