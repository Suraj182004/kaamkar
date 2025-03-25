import { adminDb } from '@/lib/firebase-admin';
import { NextResponse } from 'next/server';

// This is a server-side API route, so we can safely use the Firebase Admin SDK here
export async function GET() {
  try {
    // Example of using the adminDb in a server-side API route
    const snapshot = await adminDb.collection('test').get();
    
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error accessing Firestore with Admin SDK:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch data' }, { status: 500 });
  }
} 