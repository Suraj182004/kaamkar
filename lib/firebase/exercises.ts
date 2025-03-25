import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { defaultExercises } from '@/lib/seedExercises';

export interface Exercise {
  id: string;
  userId: string;
  name: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description?: string;
  equipment?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const EXERCISE_CATEGORIES = [
  'Strength',
  'Cardio',
  'Flexibility',
  'Balance',
  'Core',
  'Upper Body',
  'Lower Body',
  'Full Body',
  'Sports',
  'Other'
] as const;

export const EXERCISE_DIFFICULTIES = [
  'beginner',
  'intermediate',
  'advanced'
] as const;

/**
 * Add a new exercise to Firestore
 */
export async function addExercise(userId: string, exercise: Omit<Exercise, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const exercisesRef = collection(db, 'exercises');
  const now = Timestamp.now();
  
  const exerciseData = {
    ...exercise,
    userId,
    createdAt: now,
    updatedAt: now
  };

  const docRef = await addDoc(exercisesRef, exerciseData);
  return docRef.id;
}

/**
 * Seed the database with default exercises
 */
export async function seedDefaultExercises() {
  try {
    // Check if default exercises already exist
    const q = query(
      collection(db, 'exercises'),
      where('isCustom', '==', false)
    );
    
    const snapshot = await getDocs(q);
    
    // If we already have default exercises, don't add them again
    if (!snapshot.empty) {
      console.log(`Default exercises already exist: ${snapshot.size} found`);
      return;
    }
    
    console.log('Seeding database with default exercises...');
    
    // Add each default exercise to Firestore
    const addPromises = defaultExercises.map(exercise => 
      addDoc(collection(db, 'exercises'), {
        ...exercise,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    );
    
    await Promise.all(addPromises);
    
    console.log(`Successfully added ${defaultExercises.length} default exercises`);
    
    return true;
  } catch (error) {
    console.error('Error seeding default exercises:', error);
    throw error;
  }
}

/**
 * Get all exercises for a user (including default exercises)
 */
export async function getExercises(userId: string): Promise<Exercise[]> {
  try {
    // First, query for default exercises (isCustom = false)
    const defaultQuery = query(
      collection(db, 'exercises'),
      where('isCustom', '==', false)
    );
    
    // Then, query for user's custom exercises
    const customQuery = query(
      collection(db, 'exercises'),
      where('isCustom', '==', true),
      where('userId', '==', userId)
    );
    
    // Execute both queries
    const [defaultSnapshot, customSnapshot] = await Promise.all([
      getDocs(defaultQuery),
      getDocs(customQuery)
    ]);
    
    // Combine results
    const defaultExercises = defaultSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Exercise[];
    
    const customExercises = customSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Exercise[];
    
    return [...defaultExercises, ...customExercises];
  } catch (error) {
    console.error('Error getting exercises:', error);
    throw error;
  }
}

/**
 * Get exercises by category
 */
export async function getExercisesByCategory(userId: string, category: string): Promise<Exercise[]> {
  try {
    // Get default exercises for this category
    const defaultQuery = query(
      collection(db, 'exercises'),
      where('isCustom', '==', false),
      where('category', '==', category)
    );
    
    // Get user's custom exercises for this category
    const customQuery = query(
      collection(db, 'exercises'),
      where('isCustom', '==', true),
      where('userId', '==', userId),
      where('category', '==', category)
    );
    
    // Execute both queries
    const [defaultSnapshot, customSnapshot] = await Promise.all([
      getDocs(defaultQuery),
      getDocs(customQuery)
    ]);
    
    // Combine results
    const defaultExercises = defaultSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Exercise[];
    
    const customExercises = customSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Exercise[];
    
    return [...defaultExercises, ...customExercises];
  } catch (error) {
    console.error('Error getting exercises by category:', error);
    throw error;
  }
}

/**
 * Get a single exercise by ID
 */
export async function getExerciseById(exerciseId: string): Promise<Exercise | null> {
  try {
    const docRef = doc(db, 'exercises', exerciseId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Exercise;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting exercise by ID:', error);
    throw error;
  }
}

/**
 * Update an exercise
 * Note: Users can only update their custom exercises
 */
export async function updateExercise(exerciseId: string, updates: Partial<Exercise>): Promise<void> {
  const exerciseRef = doc(db, 'exercises', exerciseId);
  await updateDoc(exerciseRef, {
    ...updates,
    updatedAt: Timestamp.now()
  });
}

/**
 * Delete an exercise
 * Note: Users can only delete their custom exercises
 */
export async function deleteExercise(exerciseId: string): Promise<void> {
  const exerciseRef = doc(db, 'exercises', exerciseId);
  await deleteDoc(exerciseRef);
}

/**
 * Get exercise history (all sets performed for this exercise)
 */
export async function getExerciseHistory(userId: string, exerciseId: string) {
  try {
    const q = query(
      collection(db, 'exerciseSets'),
      where('userId', '==', userId),
      where('exerciseId', '==', exerciseId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting exercise history:', error);
    throw error;
  }
}

export async function initializeDefaultExercises(userId: string): Promise<void> {
  const defaultExercises: Omit<Exercise, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] = [
    {
      name: 'Push-ups',
      category: 'Upper Body',
      difficulty: 'intermediate',
      description: 'A compound exercise that targets the chest, shoulders, and triceps.',
      equipment: ['None']
    },
    {
      name: 'Pull-ups',
      category: 'Upper Body',
      difficulty: 'advanced',
      description: 'A compound exercise that targets the back, biceps, and shoulders.',
      equipment: ['Pull-up bar']
    },
    {
      name: 'Squats',
      category: 'Lower Body',
      difficulty: 'beginner',
      description: 'A compound exercise that targets the quadriceps, hamstrings, and glutes.',
      equipment: ['None']
    },
    {
      name: 'Running',
      category: 'Cardio',
      difficulty: 'beginner',
      description: 'A cardiovascular exercise that improves endurance and burns calories.',
      equipment: ['Running shoes']
    },
    {
      name: 'Plank',
      category: 'Core',
      difficulty: 'beginner',
      description: 'An isometric exercise that strengthens the core muscles.',
      equipment: ['None']
    },
    {
      name: 'Yoga',
      category: 'Flexibility',
      difficulty: 'beginner',
      description: 'A mind-body practice that improves flexibility and balance.',
      equipment: ['Yoga mat']
    }
  ];

  const exercisesRef = collection(db, 'exercises');
  const now = Timestamp.now();

  for (const exercise of defaultExercises) {
    await addDoc(exercisesRef, {
      ...exercise,
      userId,
      createdAt: now,
      updatedAt: now
    });
  }
} 