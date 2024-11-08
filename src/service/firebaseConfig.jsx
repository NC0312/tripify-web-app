// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB0WLGK6dGMcW4npANdWjHYpmnyELp3wTI",
  authDomain: "tripify-68dd1.firebaseapp.com",
  projectId: "tripify-68dd1",
  storageBucket: "tripify-68dd1.firebasestorage.app",
  messagingSenderId: "454134816597",
  appId: "1:454134816597:web:a29cbd63e92de4dc92d9dc",
  measurementId: "G-H6L1CFKQLH"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db=getFirestore(app);