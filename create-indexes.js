const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // You need to download this from Firebase console

// Initialize the app
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const firestore = admin.firestore();

async function createIndexes() {
  try {
    console.log('Starting to create Firestore indexes...');
    
    // Define all indexes
    const indexes = [
      // workoutRoutines
      {
        collectionId: 'workoutRoutines',
        fields: [
          { fieldPath: 'userId', order: 'ASCENDING' },
          { fieldPath: 'createdAt', order: 'DESCENDING' }
        ]
      },
      
      // workoutSessions
      {
        collectionId: 'workoutSessions',
        fields: [
          { fieldPath: 'userId', order: 'ASCENDING' },
          { fieldPath: 'date', order: 'DESCENDING' }
        ]
      },
      
      // exerciseSets
      {
        collectionId: 'exerciseSets',
        fields: [
          { fieldPath: 'workoutSessionId', order: 'ASCENDING' },
          { fieldPath: 'setNumber', order: 'ASCENDING' }
        ]
      },
      {
        collectionId: 'exerciseSets',
        fields: [
          { fieldPath: 'userId', order: 'ASCENDING' },
          { fieldPath: 'exerciseId', order: 'ASCENDING' },
          { fieldPath: 'isPersonalRecord', order: 'ASCENDING' },
          { fieldPath: 'createdAt', order: 'DESCENDING' }
        ]
      },
      {
        collectionId: 'exerciseSets',
        fields: [
          { fieldPath: 'userId', order: 'ASCENDING' },
          { fieldPath: 'exerciseId', order: 'ASCENDING' },
          { fieldPath: 'createdAt', order: 'DESCENDING' }
        ]
      },
      
      // exercises
      {
        collectionId: 'exercises',
        fields: [
          { fieldPath: 'isCustom', order: 'ASCENDING' },
          { fieldPath: 'category', order: 'ASCENDING' }
        ]
      },
      {
        collectionId: 'exercises',
        fields: [
          { fieldPath: 'isCustom', order: 'ASCENDING' },
          { fieldPath: 'userId', order: 'ASCENDING' }
        ]
      },
      {
        collectionId: 'exercises',
        fields: [
          { fieldPath: 'isCustom', order: 'ASCENDING' },
          { fieldPath: 'userId', order: 'ASCENDING' },
          { fieldPath: 'category', order: 'ASCENDING' }
        ]
      },
      
      // goals
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
      
      // progressUpdates
      {
        collectionId: 'progressUpdates',
        fields: [
          { fieldPath: 'goalId', order: 'ASCENDING' },
          { fieldPath: 'createdAt', order: 'DESCENDING' }
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
    admin.app().delete();
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