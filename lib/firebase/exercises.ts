import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

export interface Exercise {
  id: string;
  name: string;
  description?: string;
  category: string;
  muscleGroups: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  tips?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export async function addExercise(exercise: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const docRef = await addDoc(collection(db, 'exercises'), {
      ...exercise,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return docRef.id;
  } catch (error) {
    console.error('Error adding exercise:', error);
    throw error;
  }
}

export async function getExercises() {
  try {
    const q = query(
      collection(db, 'exercises'),
      orderBy('name', 'asc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    })) as Exercise[];
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
}

export async function getExerciseById(id: string) {
  try {
    const docRef = doc(db, 'exercises', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Exercise not found');
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate(),
      updatedAt: docSnap.data().updatedAt?.toDate()
    } as Exercise;
  } catch (error) {
    console.error('Error fetching exercise:', error);
    throw error;
  }
}

export async function updateExercise(id: string, data: Partial<Exercise>) {
  try {
    const docRef = doc(db, 'exercises', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return id;
  } catch (error) {
    console.error('Error updating exercise:', error);
    throw error;
  }
}

export async function deleteExercise(id: string) {
  try {
    const docRef = doc(db, 'exercises', id);
    await deleteDoc(docRef);
    return id;
  } catch (error) {
    console.error('Error deleting exercise:', error);
    throw error;
  }
}

export async function getExercisesByCategory(category: string) {
  try {
    const q = query(
      collection(db, 'exercises'),
      where('category', '==', category),
      orderBy('name', 'asc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    })) as Exercise[];
  } catch (error) {
    console.error('Error fetching exercises by category:', error);
    throw error;
  }
}

export async function getExercisesByMuscleGroup(muscleGroup: string) {
  try {
    const q = query(
      collection(db, 'exercises'),
      where('muscleGroups', 'array-contains', muscleGroup),
      orderBy('name', 'asc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    })) as Exercise[];
  } catch (error) {
    console.error('Error fetching exercises by muscle group:', error);
    throw error;
  }
}

export async function getExercisesByDifficulty(difficulty: Exercise['difficulty']) {
  try {
    const q = query(
      collection(db, 'exercises'),
      where('difficulty', '==', difficulty),
      orderBy('name', 'asc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    })) as Exercise[];
  } catch (error) {
    console.error('Error fetching exercises by difficulty:', error);
    throw error;
  }
}

// Add function to seed default exercises
export async function seedDefaultExercises() {
  try {
    const defaultExercises = [
      {
        name: 'Push-ups',
        description: 'A compound exercise that targets the chest, shoulders, and triceps',
        category: 'Upper Body',
        muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
        equipment: ['Bodyweight'],
        difficulty: 'beginner' as const,
        instructions: [
          'Start in a plank position with hands slightly wider than shoulders',
          'Lower your body until your chest nearly touches the ground',
          'Push back up to the starting position',
          'Keep your core tight and body in a straight line throughout'
        ],
        tips: [
          'Keep your elbows at a 45-degree angle',
          'Look at a spot on the ground about a foot in front of you',
          'Breathe steadily throughout the movement'
        ]
      },
      {
        name: 'Squats',
        description: 'A fundamental lower body exercise that targets multiple muscle groups',
        category: 'Lower Body',
        muscleGroups: ['Quadriceps', 'Hamstrings', 'Glutes', 'Core'],
        equipment: ['Bodyweight'],
        difficulty: 'beginner' as const,
        instructions: [
          'Stand with feet shoulder-width apart',
          'Lower your body by bending at the knees and hips',
          'Keep your chest up and back straight',
          'Return to standing position'
        ],
        tips: [
          'Keep your weight in your heels',
          'Don\'t let your knees cave inward',
          'Maintain a neutral spine'
        ]
      },
      {
        name: 'Pull-ups',
        description: 'An upper body pulling exercise that builds back and arm strength',
        category: 'Upper Body',
        muscleGroups: ['Back', 'Biceps', 'Shoulders'],
        equipment: ['Pull-up Bar'],
        difficulty: 'advanced' as const,
        instructions: [
          'Hang from a pull-up bar with hands slightly wider than shoulders',
          'Pull yourself up until your chin is over the bar',
          'Lower yourself back down with control',
          'Repeat the movement'
        ],
        tips: [
          'Engage your lats before pulling',
          'Keep your core tight',
          'Use a full range of motion'
        ]
      }
    ];

    const batch = [];
    for (const exercise of defaultExercises) {
      batch.push(addExercise(exercise));
    }

    await Promise.all(batch);
    return true;
  } catch (error) {
    console.error('Error seeding default exercises:', error);
    throw error;
  }
} 