import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit,
  serverTimestamp, 
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Types for Gym Tracker

export interface WorkoutRoutine {
  id?: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'custom';
  days?: string[]; // days of week if weekly
  userId: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Exercise {
  id?: string;
  name: string;
  category: 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core' | 'cardio' | 'other';
  equipment: 'barbell' | 'dumbbell' | 'machine' | 'bodyweight' | 'cable' | 'band' | 'kettlebell' | 'other';
  description?: string;
  instructions?: string;
  userId?: string; // null for default exercises
  isCustom: boolean; // false for app-provided exercises
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface WorkoutSession {
  id?: string;
  name: string;
  routineId?: string; // optional, link to a routine
  date: Timestamp;
  duration?: number; // in minutes
  notes?: string;
  userId: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ExerciseSet {
  id?: string;
  workoutSessionId: string;
  exerciseId: string;
  exerciseName?: string; // Denormalized for easier display
  setNumber: number;
  weight: number; // in lbs or kg
  reps: number;
  isPersonalRecord?: boolean;
  notes?: string;
  userId: string;
  createdAt?: Timestamp;
}

/**
 * Add a new workout routine
 */
export async function addWorkoutRoutine(routine: Omit<WorkoutRoutine, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const routineWithTimestamps = {
      ...routine,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'workoutRoutines'), routineWithTimestamps);
    return { id: docRef.id, ...routineWithTimestamps };
  } catch (error) {
    console.error('Error adding workout routine:', error);
    throw error;
  }
}

/**
 * Get all workout routines for a specific user
 */
export async function getUserWorkoutRoutines(userId: string) {
  try {
    const q = query(
      collection(db, 'workoutRoutines'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as WorkoutRoutine[];
  } catch (error) {
    console.error('Error getting workout routines:', error);
    throw error;
  }
}

/**
 * Update an existing workout routine
 */
export async function updateWorkoutRoutine(routineId: string, routineData: Partial<Omit<WorkoutRoutine, 'id' | 'userId' | 'createdAt'>>) {
  try {
    const routineRef = doc(db, 'workoutRoutines', routineId);
    
    const updatedData = {
      ...routineData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(routineRef, updatedData);
    return { id: routineId, ...updatedData };
  } catch (error) {
    console.error('Error updating workout routine:', error);
    throw error;
  }
}

/**
 * Delete a workout routine
 */
export async function deleteWorkoutRoutine(routineId: string) {
  try {
    const routineRef = doc(db, 'workoutRoutines', routineId);
    await deleteDoc(routineRef);
    return { success: true, id: routineId };
  } catch (error) {
    console.error('Error deleting workout routine:', error);
    throw error;
  }
}

/**
 * Add a new workout session
 */
export async function addWorkoutSession(session: Omit<WorkoutSession, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const sessionWithTimestamps = {
      ...session,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'workoutSessions'), sessionWithTimestamps);
    return { id: docRef.id, ...sessionWithTimestamps };
  } catch (error) {
    console.error('Error adding workout session:', error);
    throw error;
  }
}

/**
 * Get all workout sessions for a specific user
 */
export async function getUserWorkoutSessions(userId: string, limit?: number) {
  try {
    let q = query(
      collection(db, 'workoutSessions'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    
    if (limit) {
      q = query(q, firestoreLimit(limit));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as WorkoutSession[];
  } catch (error) {
    console.error('Error getting workout sessions:', error);
    throw error;
  }
}

/**
 * Get a specific workout session by ID
 */
export async function getWorkoutSessionById(sessionId: string) {
  try {
    const sessionDoc = await getDoc(doc(db, 'workoutSessions', sessionId));
    
    if (!sessionDoc.exists()) {
      return null;
    }
    
    return {
      id: sessionDoc.id,
      ...sessionDoc.data()
    } as WorkoutSession;
  } catch (error) {
    console.error('Error getting workout session:', error);
    throw error;
  }
}

/**
 * Add an exercise set to a workout session
 */
export async function addExerciseSet(set: Omit<ExerciseSet, 'id' | 'createdAt'>) {
  try {
    const setWithTimestamp = {
      ...set,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'exerciseSets'), setWithTimestamp);
    return { id: docRef.id, ...setWithTimestamp };
  } catch (error) {
    console.error('Error adding exercise set:', error);
    throw error;
  }
}

/**
 * Get all sets for a specific workout session
 */
export async function getExerciseSetsForWorkout(workoutSessionId: string) {
  try {
    const q = query(
      collection(db, 'exerciseSets'),
      where('workoutSessionId', '==', workoutSessionId),
      orderBy('setNumber', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ExerciseSet[];
  } catch (error) {
    console.error('Error getting exercise sets:', error);
    throw error;
  }
}

/**
 * Get personal records for a specific exercise
 */
export async function getPersonalRecordsForExercise(userId: string, exerciseId: string) {
  try {
    const q = query(
      collection(db, 'exerciseSets'),
      where('userId', '==', userId),
      where('exerciseId', '==', exerciseId),
      where('isPersonalRecord', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ExerciseSet[];
  } catch (error) {
    console.error('Error getting personal records:', error);
    throw error;
  }
}

/**
 * Delete a workout session
 */
export async function deleteWorkoutSession(sessionId: string) {
  try {
    const sessionRef = doc(db, 'workoutSessions', sessionId);
    
    // Delete all associated exercise sets first
    const setsQuery = query(
      collection(db, 'exerciseSets'),
      where('workoutSessionId', '==', sessionId)
    );
    const setsSnapshot = await getDocs(setsQuery);
    
    // Create a batch to delete all in one go
    const batch = writeBatch(db);
    
    setsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Delete the workout session itself
    batch.delete(sessionRef);
    
    // Commit the batch
    await batch.commit();
    
    return { success: true, id: sessionId };
  } catch (error) {
    console.error('Error deleting workout session:', error);
    throw error;
  }
}

/**
 * Update a workout session
 */
export async function updateWorkoutSession(sessionId: string, sessionData: Partial<Omit<WorkoutSession, 'id' | 'userId' | 'createdAt'>>) {
  try {
    const sessionRef = doc(db, 'workoutSessions', sessionId);
    
    const updatedData = {
      ...sessionData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(sessionRef, updatedData);
    return { success: true, id: sessionId };
  } catch (error) {
    console.error('Error updating workout session:', error);
    throw error;
  }
}

/**
 * Update an exercise set
 */
export async function updateExerciseSet(setId: string, setData: Partial<Omit<ExerciseSet, 'id' | 'workoutSessionId' | 'userId' | 'createdAt'>>) {
  try {
    const setRef = doc(db, 'exerciseSets', setId);
    await updateDoc(setRef, setData);
    return { success: true, id: setId };
  } catch (error) {
    console.error('Error updating exercise set:', error);
    throw error;
  }
}

/**
 * Delete an exercise set
 */
export async function deleteExerciseSet(setId: string) {
  try {
    const setRef = doc(db, 'exerciseSets', setId);
    await deleteDoc(setRef);
    return { success: true, id: setId };
  } catch (error) {
    console.error('Error deleting exercise set:', error);
    throw error;
  }
}

/**
 * Toggle exercise set completion status
 */
export async function toggleSetCompletion(setId: string, completed: boolean) {
  try {
    const setRef = doc(db, 'exerciseSets', setId);
    await updateDoc(setRef, { completed });
    return { success: true, id: setId };
  } catch (error) {
    console.error('Error toggling set completion:', error);
    throw error;
  }
}

/**
 * Mark exercise set as personal record
 */
export async function markSetAsPR(setId: string, isPR: boolean) {
  try {
    const setRef = doc(db, 'exerciseSets', setId);
    await updateDoc(setRef, { isPersonalRecord: isPR });
    return { success: true, id: setId };
  } catch (error) {
    console.error('Error marking set as PR:', error);
    throw error;
  }
}

/**
 * Calculate workout statistics
 */
export interface WorkoutStats {
  totalVolume: number;
  totalSets: number;
  totalExercises: number;
  duration: number;
  personalRecords: number;
}

export async function getWorkoutStats(workoutSessionId: string): Promise<WorkoutStats> {
  try {
    const sets = await getExerciseSetsForWorkout(workoutSessionId);
    const workout = await getWorkoutSessionById(workoutSessionId);
    
    if (!workout) {
      throw new Error('Workout session not found');
    }
    
    const totalVolume = sets.reduce((sum, set) => sum + (set.weight * set.reps), 0);
    const personalRecords = sets.filter(set => set.isPersonalRecord).length;
    
    return {
      totalVolume,
      totalSets: sets.length,
      totalExercises: new Set(sets.map(set => set.exerciseId)).size,
      duration: workout.duration || 0,
      personalRecords
    };
  } catch (error) {
    console.error('Error calculating workout stats:', error);
    throw error;
  }
}

/**
 * Calculate one-rep max for a set
 */
export function calculateOneRepMax(weight: number, reps: number): number {
  // Brzycki Formula
  return weight * (36 / (37 - reps));
}

/**
 * Calculate volume for a set
 */
export function calculateSetVolume(weight: number, reps: number): number {
  return weight * reps;
}

/**
 * Calculate time under tension
 */
export function calculateTimeUnderTension(reps: number, secondsPerRep: number = 3): number {
  return reps * secondsPerRep;
} 