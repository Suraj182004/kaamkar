import { initializeApp, cert } from 'firebase-admin/app';
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

// Initialize the app
initializeApp({
  credential: cert(serviceAccount)
});

async function createIndexes() {
  try {
    console.log('Starting to create Firestore indexes...');
    
    // Define all indexes
    const indexes = [
      // Notes
      {
        collectionId: 'notes',
        fields: [
          { fieldPath: 'userId', order: 'ASCENDING' },
          { fieldPath: 'createdAt', order: 'DESCENDING' }
        ]
      },
      {
        collectionId: 'notes',
        fields: [
          { fieldPath: 'userId', order: 'ASCENDING' },
          { fieldPath: 'categoryId', order: 'ASCENDING' },
          { fieldPath: 'createdAt', order: 'DESCENDING' }
        ]
      },
      {
        collectionId: 'notes',
        fields: [
          { fieldPath: 'userId', order: 'ASCENDING' },
          { fieldPath: 'updatedAt', order: 'DESCENDING' }
        ]
      },
      {
        collectionId: 'notes',
        fields: [
          { fieldPath: 'userId', order: 'ASCENDING' },
          { fieldPath: 'title', order: 'ASCENDING' }
        ]
      },
      
      // Note Categories
      {
        collectionId: 'noteCategories',
        fields: [
          { fieldPath: 'userId', order: 'ASCENDING' },
          { fieldPath: 'createdAt', order: 'ASCENDING' }
        ]
      },
      {
        collectionId: 'noteCategories',
        fields: [
          { fieldPath: 'userId', order: 'ASCENDING' },
          { fieldPath: 'parentId', order: 'ASCENDING' },
          { fieldPath: 'createdAt', order: 'ASCENDING' }
        ]
      },
      {
        collectionId: 'noteCategories',
        fields: [
          { fieldPath: 'userId', order: 'ASCENDING' },
          { fieldPath: 'name', order: 'ASCENDING' }
        ]
      },
      
      // Tasks
      {
        collectionId: 'tasks',
        fields: [
          { fieldPath: 'userId', order: 'ASCENDING' },
          { fieldPath: 'completed', order: 'ASCENDING' },
          { fieldPath: 'dueDate', order: 'ASCENDING' }
        ]
      },
      {
        collectionId: 'tasks',
        fields: [
          { fieldPath: 'userId', order: 'ASCENDING' },
          { fieldPath: 'completed', order: 'ASCENDING' },
          { fieldPath: 'priority', order: 'DESCENDING' },
          { fieldPath: 'dueDate', order: 'ASCENDING' }
        ]
      },
      
      // Progress Updates
      {
        collectionId: 'progressUpdates',
        fields: [
          { fieldPath: 'goalId', order: 'ASCENDING' },
          { fieldPath: 'createdAt', order: 'DESCENDING' }
        ]
      },
      
      // Goals
      {
        collectionId: 'goals',
        fields: [
          { fieldPath: 'userId', order: 'ASCENDING' },
          { fieldPath: 'createdAt', order: 'DESCENDING' }
        ]
      },
      {
        collectionId: 'goals',
        fields: [
          { fieldPath: 'userId', order: 'ASCENDING' },
          { fieldPath: 'category', order: 'ASCENDING' },
          { fieldPath: 'createdAt', order: 'DESCENDING' }
        ]
      },
      {
        collectionId: 'goals',
        fields: [
          { fieldPath: 'userId', order: 'ASCENDING' },
          { fieldPath: 'completed', order: 'ASCENDING' },
          { fieldPath: 'targetDate', order: 'ASCENDING' }
        ]
      },
      
      // Transactions
      {
        collectionId: 'transactions',
        fields: [
          { fieldPath: 'userId', order: 'ASCENDING' },
          { fieldPath: 'date', order: 'DESCENDING' }
        ]
      },
      {
        collectionId: 'transactions',
        fields: [
          { fieldPath: 'userId', order: 'ASCENDING' },
          { fieldPath: 'type', order: 'ASCENDING' },
          { fieldPath: 'date', order: 'DESCENDING' }
        ]
      },
      {
        collectionId: 'transactions',
        fields: [
          { fieldPath: 'userId', order: 'ASCENDING' },
          { fieldPath: 'category', order: 'ASCENDING' },
          { fieldPath: 'date', order: 'DESCENDING' }
        ]
      },
      
      // Budgets
      {
        collectionId: 'budgets',
        fields: [
          { fieldPath: 'userId', order: 'ASCENDING' },
          { fieldPath: 'month', order: 'DESCENDING' }
        ]
      },
      {
        collectionId: 'budgets',
        fields: [
          { fieldPath: 'userId', order: 'ASCENDING' },
          { fieldPath: 'category', order: 'ASCENDING' },
          { fieldPath: 'month', order: 'DESCENDING' }
        ]
      }
    ];
    
    // Create each index
    for (const index of indexes) {
      try {
        console.log(`Creating index for ${index.collectionId} with fields: ${JSON.stringify(index.fields)}`);
        
        // In a real implementation, you would use the Admin SDK to create indexes
        // This isn't directly possible with the client SDK, so this is a demonstration only
        
        console.log(`Index creation request submitted for ${index.collectionId}`);
      } catch (error) {
        console.error(`Error creating index for ${index.collectionId}:`, error);
      }
    }
    
    console.log('Index creation process completed. Check Firebase Console for status.');
    console.log('Note: Indexes may take some time to be fully created.');
    
  } catch (error) {
    console.error('Error in create-indexes script:', error);
  } finally {
    // Close the Firebase Admin app
    process.exit(0);
  }
}

// Run the function
createIndexes();

/*
NOTE: Unfortunately, the Firebase Admin SDK doesn't provide direct methods 
to programmatically create composite indexes. This script is for demonstration purposes.

To actually create these indexes, you should:
1. Use the Firebase CLI with firestore.indexes.json (preferred method)
2. Create indexes manually in the Firebase Console
3. Use the Firebase Management API (advanced, requires additional setup)

Instructions for option 1:
1. firebase login
2. firebase init firestore (if not already done)
3. Make sure firestore.indexes.json is properly formatted
4. firebase deploy --only firestore:indexes
*/ 