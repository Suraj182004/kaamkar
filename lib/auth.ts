"// Auth file placeholder - to be replaced" 

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  UserCredential
} from 'firebase/auth';
import { auth } from './firebase';

// Sign up with email and password
export const signUp = async (
  email: string, 
  password: string, 
  displayName?: string
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name if provided
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
    
    return userCredential;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

// Sign in with email and password
export const signIn = async (
  email: string, 
  password: string
): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// Sign out
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Firebase Auth Error type (since Firebase doesn't export this directly)
interface FirebaseAuthError extends Error {
  code?: string;
  message: string;
}

// Format auth error message for UI display
export const formatAuthError = (error: FirebaseAuthError): string => {
  const errorCode = error.code;
  
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already in use. Please try a different one.';
    case 'auth/invalid-email':
      return 'Invalid email address format.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use a stronger password.';
    case 'auth/too-many-requests':
      return 'Too many unsuccessful login attempts. Please try again later.';
    default:
      return 'An error occurred. Please try again.';
  }
}; 
