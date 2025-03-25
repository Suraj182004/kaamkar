import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp, 
  Timestamp,
  getDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Type for Todo
export interface Todo {
  id?: string;
  title: string;
  completed: boolean;
  dueDate?: Timestamp | null;
  priority?: 'low' | 'medium' | 'high';
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  userId: string;
}

/**
 * Add a new todo to Firestore
 */
export async function addTodo(todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const todoWithTimestamps = {
      ...todo,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'todos'), todoWithTimestamps);
    return { id: docRef.id, ...todoWithTimestamps };
  } catch (error) {
    console.error('Error adding todo:', error);
    throw error;
  }
}

/**
 * Get all todos for a specific user
 */
export async function getUserTodos(userId: string) {
  try {
    const q = query(
      collection(db, 'todos'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Todo[];
  } catch (error) {
    console.error('Error getting todos:', error);
    throw error;
  }
}

/**
 * Update an existing todo
 */
export async function updateTodo(todoId: string, todoData: Partial<Omit<Todo, 'id' | 'userId' | 'createdAt'>>) {
  try {
    const todoRef = doc(db, 'todos', todoId);
    
    const updatedData = {
      ...todoData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(todoRef, updatedData);
    return { id: todoId, ...updatedData };
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
}

/**
 * Toggle todo completion status
 */
export async function toggleTodoCompletion(todoId: string, completed: boolean) {
  return updateTodo(todoId, { completed });
}

/**
 * Delete a todo
 */
export async function deleteTodo(todoId: string) {
  try {
    const todoRef = doc(db, 'todos', todoId);
    await deleteDoc(todoRef);
    return { success: true, id: todoId };
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
}

/**
 * Get a specific todo by ID
 */
export async function getTodoById(todoId: string) {
  try {
    const todoDoc = await getDoc(doc(db, 'todos', todoId));
    
    if (!todoDoc.exists()) {
      return null;
    }
    
    return {
      id: todoDoc.id,
      ...todoDoc.data()
    } as Todo;
  } catch (error) {
    console.error('Error getting todo:', error);
    throw error;
  }
} 