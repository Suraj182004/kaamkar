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
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Type for Note Category
export interface NoteCategory {
  id?: string;
  name: string;
  userId: string;
  parentId?: string | null;
  createdAt?: Timestamp;
}

// Type for Note Formatting
export interface NoteFormatting {
  backgroundColor?: string;
  textColor?: string;
  fontSize?: string;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  alignment?: 'left' | 'center' | 'right';
}

// Type for Note
export interface Note {
  id?: string;
  title: string;
  content: string;
  categoryId?: string | null;
  formatting?: NoteFormatting;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  userId: string;
  tags?: string[];
}

/**
 * Add a new note to Firestore
 */
export async function addNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const noteWithTimestamps = {
      ...note,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'notes'), noteWithTimestamps);
    return { id: docRef.id, ...noteWithTimestamps };
  } catch (error) {
    console.error('Error adding note:', error);
    throw error;
  }
}

/**
 * Get all notes for a specific user
 */
export async function getUserNotes(userId: string) {
  try {
    const q = query(
      collection(db, 'notes'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Note[];
  } catch (error) {
    console.error('Error getting notes:', error);
    throw error;
  }
}

/**
 * Update an existing note
 */
export async function updateNote(noteId: string, noteData: Partial<Omit<Note, 'id' | 'userId' | 'createdAt'>>) {
  try {
    const noteRef = doc(db, 'notes', noteId);
    
    const updatedData = {
      ...noteData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(noteRef, updatedData);
    return { id: noteId, ...updatedData };
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
}

/**
 * Delete a note
 */
export async function deleteNote(noteId: string) {
  try {
    const noteRef = doc(db, 'notes', noteId);
    await deleteDoc(noteRef);
    return { success: true, id: noteId };
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
}

/**
 * Get a specific note by ID
 */
export async function getNoteById(noteId: string) {
  try {
    const noteRef = doc(db, 'notes', noteId);
    const noteSnap = await getDoc(noteRef);
    
    if (!noteSnap.exists()) {
      throw new Error('Note not found');
    }
    
    return {
      id: noteSnap.id,
      ...noteSnap.data()
    } as Note;
  } catch (error) {
    console.error('Error getting note:', error);
    throw error;
  }
}

// Add functions for category management
export async function addCategory(category: Omit<NoteCategory, 'id' | 'createdAt'>) {
  try {
    const categoryWithTimestamp = {
      ...category,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'noteCategories'), categoryWithTimestamp);
    return { id: docRef.id, ...categoryWithTimestamp };
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
}

export async function getUserCategories(userId: string) {
  try {
    const q = query(
      collection(db, 'noteCategories'),
      where('userId', '==', userId),
      orderBy('createdAt', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as NoteCategory[];
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
}

export async function deleteCategory(categoryId: string) {
  try {
    const categoryRef = doc(db, 'noteCategories', categoryId);
    await deleteDoc(categoryRef);
    return { success: true, id: categoryId };
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
} 