'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { seedDefaultExercises } from '@/lib/firebase/exercises';
import { toast } from 'sonner';
import { DatabaseIcon } from 'lucide-react';

interface InitializeButtonProps {
  onSuccess?: () => void;
}

export function InitializeButton({ onSuccess }: InitializeButtonProps) {
  const [loading, setLoading] = useState(false);
  
  const handleInitialize = async () => {
    setLoading(true);
    
    try {
      await seedDefaultExercises();
      toast.success('Default exercises added successfully!');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error initializing exercises:', error);
      toast.error('Failed to initialize default exercises');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center p-6 border rounded-lg bg-card shadow-sm">
      <DatabaseIcon className="h-12 w-12 text-primary mb-4" />
      <h3 className="text-xl font-semibold mb-2">Initialize Gym Tracker</h3>
      <p className="text-muted-foreground text-center mb-4">
        To get started with the Gym Tracker, you need to add default exercises to your database.
      </p>
      <Button 
        onClick={handleInitialize} 
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Initializing...' : 'Initialize Default Exercises'}
      </Button>
    </div>
  );
} 