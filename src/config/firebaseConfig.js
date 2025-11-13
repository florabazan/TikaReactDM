// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAWSTj25sOMKjE2b4ez6gWWdjZAHbcOFu0",
  authDomain: "tikareactdm.firebaseapp.com",
  projectId: "tikareactdm",
  storageBucket: "tikareactdm.firebasestorage.app",
  messagingSenderId: "36760752486",
  appId: "1:36760752486:web:9ddd57beb3a7e23b2838a7"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios que vas a usar
export const auth = getAuth(app);
export const db = getFirestore(app);