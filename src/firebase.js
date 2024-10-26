// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD8HCeAzgsA0ndcKyaZOg-rvEzifx42JgE",
  authDomain: "sudorku-96c3a.firebaseapp.com",
  projectId: "sudorku-96c3a",
  storageBucket: "sudorku-96c3a.appspot.com",
  messagingSenderId: "189182082824",
  appId: "1:189182082824:web:feac6da17684df50e9f6bd",
  measurementId: "G-HJDHY4TB88"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log("Firestore initialized successfully:", db); 
export { db };
