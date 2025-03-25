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
  serverTimestamp, 
  Timestamp,
  increment
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Types for Goal and Progress Tracking
export interface Goal {
  id?: string;
  title: string;
  description?: string;
  category?: string;
  targetDate: Timestamp;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  userId: string;
  currentProgress: number;
  targetValue: number;
  unit: string;  // e.g. "kg", "minutes", "pages", "items", etc.
  status: 'not-started' | 'in-progress' | 'completed' | 'abandoned';
  milestones?: Milestone[];
  relatedTodos?: string[]; // Array of Todo IDs related to this goal
}

export interface Milestone {
  id?: string;
  title: string;
  targetValue: number;
  isCompleted: boolean;
  completedAt?: Timestamp;
}

export interface ProgressUpdate {
  id?: string;
  goalId: string;
  value: number;
  notes?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  userId: string;
}

/**
 * Add a new goal to Firestore
 */
export async function addGoal(goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const goalWithTimestamps = {
      ...goal,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: goal.status || 'not-started',
      currentProgress: goal.currentProgress || 0
    };
    
    const docRef = await addDoc(collection(db, 'goals'), goalWithTimestamps);
    return { id: docRef.id, ...goalWithTimestamps };
  } catch (error) {
    console.error('Error adding goal:', error);
    throw error;
  }
}

/**
 * Get all goals for a specific user
 */
export async function getUserGoals(userId: string) {
  try {
    const q = query(
      collection(db, 'goals'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Goal[];
  } catch (error) {
    console.error('Error getting goals:', error);
    throw error;
  }
}

/**
 * Get goals by category
 */
export async function getGoalsByCategory(userId: string, category: string) {
  try {
    const q = query(
      collection(db, 'goals'),
      where('userId', '==', userId),
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Goal[];
  } catch (error) {
    console.error('Error getting goals by category:', error);
    throw error;
  }
}

/**
 * Get a specific goal by ID
 */
export async function getGoalById(goalId: string) {
  try {
    const goalDoc = await getDoc(doc(db, 'goals', goalId));
    
    if (!goalDoc.exists()) {
      throw new Error('Goal not found');
    }
    
    return {
      id: goalDoc.id,
      ...goalDoc.data()
    } as Goal;
  } catch (error) {
    console.error('Error getting goal:', error);
    throw error;
  }
}

/**
 * Update an existing goal
 */
export async function updateGoal(goalId: string, goalData: Partial<Omit<Goal, 'id' | 'userId' | 'createdAt'>>) {
  try {
    const goalRef = doc(db, 'goals', goalId);
    
    const updatedData = {
      ...goalData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(goalRef, updatedData);
    return { id: goalId, ...updatedData };
  } catch (error) {
    console.error('Error updating goal:', error);
    throw error;
  }
}

/**
 * Delete a goal
 */
export async function deleteGoal(goalId: string) {
  try {
    const goalRef = doc(db, 'goals', goalId);
    await deleteDoc(goalRef);
    
    // Also delete related progress updates
    const progressUpdatesQuery = query(
      collection(db, 'progressUpdates'),
      where('goalId', '==', goalId)
    );
    
    const progressSnapshots = await getDocs(progressUpdatesQuery);
    const deletePromises = progressSnapshots.docs.map(doc => deleteDoc(doc.ref));
    
    await Promise.all(deletePromises);
    
    return { success: true, id: goalId };
  } catch (error) {
    console.error('Error deleting goal:', error);
    throw error;
  }
}

/**
 * Add a progress update and update the goal's current progress
 */
export async function addProgressUpdate(progressUpdate: Omit<ProgressUpdate, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    // Create the progress update
    const updateWithTimestamps = {
      ...progressUpdate,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'progressUpdates'), updateWithTimestamps);
    
    // Update the goal's current progress
    const goalRef = doc(db, 'goals', progressUpdate.goalId);
    await updateDoc(goalRef, {
      currentProgress: increment(progressUpdate.value),
      updatedAt: serverTimestamp()
    });
    
    // Get the updated goal to check if milestones are completed
    const updatedGoal = await getGoalById(progressUpdate.goalId);
    
    // If the goal has reached or exceeded the target, mark it as completed
    if (updatedGoal.currentProgress >= updatedGoal.targetValue && updatedGoal.status !== 'completed') {
      await updateDoc(goalRef, {
        status: 'completed',
        updatedAt: serverTimestamp()
      });
    } else if (updatedGoal.status === 'not-started') {
      // If progress was 0 but now there's progress, update to in-progress
      await updateDoc(goalRef, {
        status: 'in-progress',
        updatedAt: serverTimestamp()
      });
    }
    
    return { 
      id: docRef.id, 
      ...updateWithTimestamps,
      updatedGoal 
    };
  } catch (error) {
    console.error('Error adding progress update:', error);
    throw error;
  }
}

/**
 * Get progress updates for a specific goal
 */
export async function getProgressUpdatesForGoal(goalId: string) {
  try {
    const q = query(
      collection(db, 'progressUpdates'),
      where('goalId', '==', goalId),
      orderBy('createdAt', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ProgressUpdate[];
  } catch (error) {
    console.error('Error getting progress updates:', error);
    throw error;
  }
} 