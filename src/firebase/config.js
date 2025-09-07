import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Ваша конфігурація з Firebase Console
const firebaseConfig = {
  apiKey: 'AIzaSyDL0DD5WahfEfCRWp2oXFZU0hs-n8-5nbo',
  authDomain: 'easyflat-a6789.firebaseapp.com',
  projectId: 'easyflat-a6789',
  storageBucket: 'easyflat-a6789.firebasestorage.app',
  messagingSenderId: '360086913641',
  appId: '1:360086913641:web:70ac8aacedc85c1936d8f8',
};

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);

// Ініціалізація Firestore
const db = getFirestore(app);

export default db;
