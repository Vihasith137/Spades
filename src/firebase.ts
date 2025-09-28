import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your Firebase config (Project Settings → SDK setup & config)
const firebaseConfig = {
  apiKey: "AIzaSyAP0zs9kF3DtWjNt-l7JNpy6f1vpyTgay0",
  authDomain: "spades-ac08c.firebaseapp.com",
  projectId: "spades-ac08c",
  storageBucket: "spades-ac08c.firebasestorage.app",
  messagingSenderId: "357923723767",
  appId: "1:357923723767:web:371c05ecbca0ccfe15b6f2"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
