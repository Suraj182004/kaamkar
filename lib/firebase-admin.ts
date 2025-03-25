// Firebase Admin SDK Initialization
// THIS FILE SHOULD ONLY BE IMPORTED IN SERVER COMPONENTS OR API ROUTES

import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin if it hasn't been initialized yet
export function getFirebaseAdminApp() {
  // Check if app is already initialized
  if (getApps().length === 0) {
    const adminConfig = {
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Replace newlines in the private key
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
    };
    
    return initializeApp(adminConfig);
  }
  
  // If already initialized, return the existing app
  return getApps()[0];
}

// Get Firestore instance
const adminDb = getFirestore(getFirebaseAdminApp());

export { adminDb }; 