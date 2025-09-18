import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// import { getAuth, connectAuthEmulator } from 'firebase/auth';

// Ваша конфігурація з Firebase Console
const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
};

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);

// Ініціалізація Firestore
const db = getFirestore(app);
const auth = getAuth(app);

// Підключення до emulator тільки в режимі розробки
// if (process.env.NODE_ENV === 'development' && !auth._config?.emulator?.url) {
//   connectAuthEmulator(auth, 'http://localhost:9099');
// }

export { auth };
export default db;
