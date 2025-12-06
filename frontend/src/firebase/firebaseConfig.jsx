import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getMessaging } from 'firebase/messaging';
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  measurementId:  import.meta.env.VITE_MESASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
const messaging = getMessaging(app);

const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider ,messaging};