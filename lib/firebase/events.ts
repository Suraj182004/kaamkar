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

// Type for Event
export interface Event {
  id?: string;
  title: string;
  description?: string;
  start: Timestamp;
  end: Timestamp;
  allDay?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  userId: string;
}

/**
 * Add a new event to Firestore
 */
export async function addEvent(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const eventWithTimestamps = {
      ...event,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'events'), eventWithTimestamps);
    return { id: docRef.id, ...eventWithTimestamps };
  } catch (error) {
    console.error('Error adding event:', error);
    throw error;
  }
}

/**
 * Get all events for a specific user
 */
export async function getUserEvents(userId: string) {
  try {
    const q = query(
      collection(db, 'events'),
      where('userId', '==', userId),
      orderBy('start', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Event[];
  } catch (error) {
    console.error('Error getting events:', error);
    throw error;
  }
}

/**
 * Get events for a specific date range
 */
export async function getEventsByDateRange(userId: string, startDate: Date, endDate: Date) {
  try {
    const startTimestamp = Timestamp.fromDate(startDate);
    const endTimestamp = Timestamp.fromDate(endDate);
    
    // Create query with filters
    const q = query(
      collection(db, 'events'),
      where('userId', '==', userId),
      where('start', '>=', startTimestamp),
      where('start', '<=', endTimestamp),
      orderBy('start', 'asc')
    );
    
    try {
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[];
    } catch (error: any) {
      // If we get an index error, provide clear instructions
      if (error?.name === 'FirebaseError' && error?.message?.includes('requires an index')) {
        console.error('Firestore index error:', error?.message);
        
        // Extract the index creation URL if it exists in the error message
        const indexUrlMatch = error?.message?.match(/(https:\/\/console\.firebase\.google\.com\S+)/);
        const indexUrl = indexUrlMatch ? indexUrlMatch[1] : null;
        
        // Throw a more helpful error
        throw {
          code: 'missing-index',
          message: 'This query requires a Firestore index to be created.',
          indexUrl: indexUrl,
          originalError: error
        };
      }
      
      // Re-throw any other errors
      throw error;
    }
  } catch (error) {
    console.error('Error getting events by date range:', error);
    throw error;
  }
}

/**
 * Update an existing event
 */
export async function updateEvent(eventId: string, eventData: Partial<Omit<Event, 'id' | 'userId' | 'createdAt'>>) {
  try {
    const eventRef = doc(db, 'events', eventId);
    
    const updatedData = {
      ...eventData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(eventRef, updatedData);
    return { id: eventId, ...updatedData };
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
}

/**
 * Delete an event
 */
export async function deleteEvent(eventId: string) {
  try {
    const eventRef = doc(db, 'events', eventId);
    await deleteDoc(eventRef);
    return { success: true, id: eventId };
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
} 