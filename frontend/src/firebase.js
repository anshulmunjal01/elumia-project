// frontend/src/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Import getAuth if you are using Firebase Authentication
import { getFirestore } from 'firebase/firestore'; // Import if you are using Firestore
// import { getStorage } from 'firebase/storage'; // Import if you are using Firebase Storage

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID // This is optional
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig); // Export 'app' directly here

// Initialize Firebase services that you need
export const auth = getAuth(app); // Export 'auth' directly here
export const db = getFirestore(app); // Export 'db' directly here

// No need for a separate 'export { app, db };' statement at the end,
// as all desired variables are already exported above.