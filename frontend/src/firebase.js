// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-ac280.firebaseapp.com",
  projectId: "mern-estate-ac280",
  storageBucket: "mern-estate-ac280.appspot.com",
  messagingSenderId: "103582895090",
  appId: "1:103582895090:web:757d6fb5ae63cf087bf96b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);