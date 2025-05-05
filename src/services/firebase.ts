import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';

const firebaseConfig = {
  apiKey: "AIzaSyCNOiKrNZ5bdDLQ8kpfgafiy7_yD9TL6g4",
  authDomain: "aiapp-c7a9a.firebaseapp.com",
  projectId: "aiapp-c7a9a",
  storageBucket: "aiapp-c7a9a.firebasestorage.app",
  messagingSenderId: "46041256282",
  appId: "1:46041256282:android:125d26060b7555b7ea2363",
  measurementId: "G-MEASUREMENT_ID" // Optional, can be removed if not used
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signInAnonymous = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in anonymously:', error);
    throw error;
  }
};

export { app, auth, db, signInAnonymous };
