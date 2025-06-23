import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC2sK7IJ4z8d0szMetR3JXzLLcsYA-TnpA",
  authDomain: "cardwise-8dc3e.firebaseapp.com",
  projectId: "cardwise-8dc3e",
  storageBucket: "cardwise-8dc3e.firebasestorage.app",
  messagingSenderId: "227980010595",
  appId: "1:227980010595:web:89f04a12afeea442ba0456",
  measurementId: "G-Z5EZC0FWDJ"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
