import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCp7IuYnV4a1TlYIQY551YIyKdY6m8E1v8",
  authDomain: "tcrrewards.firebaseapp.com",
  projectId: "tcrrewards",
  storageBucket: "tcrrewards.firebasestorage.app",
  messagingSenderId: "870679743104",
  appId: "1:870679743104:web:496efda04f045f12857465",
  measurementId: "G-YBM8HZ930Y",
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);
export const auth = getAuth(app);

export default app;