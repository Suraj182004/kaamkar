// Firebase Client SDK Initialization
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, Analytics } from 'firebase/analytics';

// Client-side Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// For debugging purposes - log config to verify values
if (typeof window !== 'undefined') {
  console.log('Firebase config:', { 
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'exists' : 'missing',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'exists' : 'missing',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'exists' : 'missing',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? 'exists' : 'missing',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? 'exists' : 'missing',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? 'exists' : 'missing'
  });
}

// Initialize Firebase client
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Analytics (only on client-side)
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  // Initialize Analytics only in the browser environment
  analytics = getAnalytics(app);
}

export { app, auth, db, analytics }; 