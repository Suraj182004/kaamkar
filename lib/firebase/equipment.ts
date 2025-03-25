import { db } from './config';
import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';

export interface Equipment {
  id: string;
  userId: string;
  name: string;
  available: boolean;
  lastUsed?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export async function addEquipment(userId: string, equipment: Omit<Equipment, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
  try {
    const docRef = await addDoc(collection(db, 'equipment'), {
      ...equipment,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return {
      success: true,
      id: docRef.id,
    };
  } catch (error) {
    console.error('Error adding equipment:', error);
    throw error;
  }
}

export async function getUserEquipment(userId: string) {
  try {
    const q = query(collection(db, 'equipment'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Equipment[];
  } catch (error) {
    console.error('Error fetching user equipment:', error);
    throw error;
  }
}

export async function updateEquipment(id: string, data: Partial<Equipment>) {
  try {
    const equipmentRef = doc(db, 'equipment', id);
    await updateDoc(equipmentRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });

    return {
      success: true,
      id,
    };
  } catch (error) {
    console.error('Error updating equipment:', error);
    throw error;
  }
}

export async function deleteEquipment(id: string) {
  try {
    const equipmentRef = doc(db, 'equipment', id);
    await deleteDoc(equipmentRef);

    return {
      success: true,
      id,
    };
  } catch (error) {
    console.error('Error deleting equipment:', error);
    throw error;
  }
}

export async function toggleEquipmentAvailability(id: string, available: boolean) {
  try {
    const equipmentRef = doc(db, 'equipment', id);
    await updateDoc(equipmentRef, {
      available,
      lastUsed: available ? null : Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return {
      success: true,
      id,
    };
  } catch (error) {
    console.error('Error toggling equipment availability:', error);
    throw error;
  }
} 