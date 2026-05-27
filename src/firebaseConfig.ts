// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyBc03m_E4WhZJNEquk6MrnLKywcRsb_mXw",
  authDomain: "mediflow-74ade.firebaseapp.com",
  projectId: "mediflow-74ade",
  storageBucket: "mediflow-74ade.firebasestorage.app",
  messagingSenderId: "877283963225",
  appId: "1:877283963225:web:c3bba28b3a5711426fdc48"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
