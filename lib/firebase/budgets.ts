import { db } from '@/lib/firebase';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where, orderBy, Timestamp } from 'firebase/firestore';

// Budget type definition
export interface Budget {
  id: string;
  userId: string;
  category: string;
  amount: number;
  month: string; // Format: 'YYYY-MM'
  spent: number; // Current amount spent
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Create a new budget
export async function createBudget(data: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, 'budgets'), {
      ...data,
      createdAt: now,
      updatedAt: now
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding budget:', error);
    throw error;
  }
}

// Get all budgets for a user for a specific month
export async function getUserBudgetsForMonth(userId: string, month: string): Promise<Budget[]> {
  try {
    const q = query(
      collection(db, 'budgets'),
      where('userId', '==', userId),
      where('month', '==', month)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Budget));
  } catch (error) {
    console.error('Error getting budgets:', error);
    throw error;
  }
}

// Get all budgets for a user
export async function getUserBudgets(userId: string): Promise<Budget[]> {
  try {
    const q = query(
      collection(db, 'budgets'),
      where('userId', '==', userId),
      orderBy('month', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Budget));
  } catch (error) {
    console.error('Error getting all budgets:', error);
    throw error;
  }
}

// Get budget for a specific category and month
export async function getBudgetForCategory(userId: string, category: string, month: string): Promise<Budget | null> {
  try {
    const q = query(
      collection(db, 'budgets'),
      where('userId', '==', userId),
      where('category', '==', category),
      where('month', '==', month)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    // Return the first matching budget
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as Budget;
  } catch (error) {
    console.error('Error getting budget for category:', error);
    throw error;
  }
}

// Get a single budget by ID
export async function getBudget(id: string): Promise<Budget | null> {
  try {
    const docRef = doc(db, 'budgets', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Budget;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting budget:', error);
    throw error;
  }
}

// Update a budget
export async function updateBudget(id: string, data: Partial<Omit<Budget, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<void> {
  try {
    const docRef = doc(db, 'budgets', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating budget:', error);
    throw error;
  }
}

// Update spent amount for a budget
export async function updateBudgetSpent(id: string, spent: number): Promise<void> {
  try {
    const docRef = doc(db, 'budgets', id);
    await updateDoc(docRef, {
      spent: spent,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating budget spent amount:', error);
    throw error;
  }
}

// Delete a budget
export async function deleteBudget(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'budgets', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting budget:', error);
    throw error;
  }
} 