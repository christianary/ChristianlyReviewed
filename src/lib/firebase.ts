import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBKifWRxRY1fpmyzmS_27jbzPgvUATVjS8",
  authDomain: "christianly-reviewed.firebaseapp.com",
  projectId: "christianly-reviewed",
  storageBucket: "christianly-reviewed.firebasestorage.app",
  messagingSenderId: "872156122522",
  appId: "1:872156122522:web:cf810c2f88d1bb591cfe23",
  measurementId: "G-M1YBRZBS8Q"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);