import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

export interface ExerciseTemplate {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
}

export interface WorkoutTemplate {
  id: string;
  userId: string;
  name: string;
  description?: string;
  exercises: ExerciseTemplate[];
  createdAt: Date;
  updatedAt: Date;
}

export async function addWorkoutTemplate(userId: string, template: Omit<WorkoutTemplate, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
  try {
    const docRef = await addDoc(collection(db, 'workoutTemplates'), {
      ...template,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return docRef.id;
  } catch (error) {
    console.error('Error adding workout template:', error);
    throw error;
  }
}

export async function getUserWorkoutTemplates(userId: string) {
  try {
    const q = query(
      collection(db, 'workoutTemplates'),
      where('userId', '==', userId),
      orderBy('name', 'asc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    })) as WorkoutTemplate[];
  } catch (error) {
    console.error('Error fetching workout templates:', error);
    throw error;
  }
}

export async function updateWorkoutTemplate(id: string, data: Partial<WorkoutTemplate>) {
  try {
    const docRef = doc(db, 'workoutTemplates', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return id;
  } catch (error) {
    console.error('Error updating workout template:', error);
    throw error;
  }
}

export async function deleteWorkoutTemplate(id: string) {
  try {
    const docRef = doc(db, 'workoutTemplates', id);
    await deleteDoc(docRef);
    return id;
  } catch (error) {
    console.error('Error deleting workout template:', error);
    throw error;
  }
}

export async function duplicateWorkoutTemplate(templateId: string, userId: string) {
  try {
    const templateRef = doc(db, 'workoutTemplates', templateId);
    const templateDoc = await getDoc(templateRef);
    
    if (!templateDoc.exists()) {
      throw new Error('Template not found');
    }

    const templateData = templateDoc.data();
    const newTemplate = {
      ...templateData,
      name: `${templateData.name} (Copy)`,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'workoutTemplates'), newTemplate);
    return docRef.id;
  } catch (error) {
    console.error('Error duplicating workout template:', error);
    throw error;
  }
} 