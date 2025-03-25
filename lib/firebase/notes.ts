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
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Type for Note
export interface Note {
  id?: string;
  title: string;
  content: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  userId: string;
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
    const noteDoc = await doc(db, 'notes', noteId);
    // Note: This doesn't actually fetch the document
    // We'll implement this when needed
    return { id: noteId };
  } catch (error) {
    console.error('Error getting note:', error);
    throw error;
  }
} 