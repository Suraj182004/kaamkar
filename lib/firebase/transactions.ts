import { db } from '@/lib/firebase';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where, orderBy, Timestamp, DocumentReference } from 'firebase/firestore';

// Transaction type definition
export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  description: string;
  category: string;
  date: Timestamp;
  type: 'income' | 'expense';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Create a new transaction
export async function createTransaction(data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, 'transactions'), {
      ...data,
      createdAt: now,
      updatedAt: now
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
}

// Get all transactions for a user
export async function getUserTransactions(userId: string): Promise<Transaction[]> {
  try {
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Transaction));
  } catch (error) {
    console.error('Error getting transactions:', error);
    throw error;
  }
}

// Get transactions by category
export async function getTransactionsByCategory(userId: string, category: string): Promise<Transaction[]> {
  try {
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', userId),
      where('category', '==', category),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Transaction));
  } catch (error) {
    console.error('Error getting transactions by category:', error);
    throw error;
  }
}

// Get transactions by type (income or expense)
export async function getTransactionsByType(userId: string, type: 'income' | 'expense'): Promise<Transaction[]> {
  try {
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', userId),
      where('type', '==', type),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Transaction));
  } catch (error) {
    console.error('Error getting transactions by type:', error);
    throw error;
  }
}

// Get a single transaction by ID
export async function getTransaction(id: string): Promise<Transaction | null> {
  try {
    const docRef = doc(db, 'transactions', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Transaction;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting transaction:', error);
    throw error;
  }
}

// Update a transaction
export async function updateTransaction(id: string, data: Partial<Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<void> {
  try {
    const docRef = doc(db, 'transactions', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
}

// Delete a transaction
export async function deleteTransaction(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'transactions', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
}

// Default expense categories
export const DEFAULT_EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Shopping',
  'Housing',
  'Transportation',
  'Entertainment',
  'Health & Fitness',
  'Education',
  'Personal Care',
  'Travel',
  'Gifts & Donations',
  'Bills & Utilities',
  'Investment',
  'Other'
];

// Default income categories
export const DEFAULT_INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Investments',
  'Gifts',
  'Refunds',
  'Other'
]; 