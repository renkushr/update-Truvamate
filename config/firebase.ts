import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDzn6L0F-w_o4KJN-_jPBYOLKaLlpgk1f4",
  authDomain: "truvamate-9e0fa.firebaseapp.com",
  projectId: "truvamate-9e0fa",
  storageBucket: "truvamate-9e0fa.firebasestorage.app",
  messagingSenderId: "896181893176",
  appId: "1:896181893176:web:cb4a98e430ef1921fa8ecd",
  measurementId: "G-14CMG00HGS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser environment)
let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}
export { analytics };

// Auth providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

export default app;
