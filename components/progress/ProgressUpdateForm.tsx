'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Goal, ProgressUpdate, addProgressUpdate } from '@/lib/firebase/goals';
import { toast } from 'sonner';

interface ProgressUpdateFormProps {
  goal: Goal;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProgressUpdateForm({ goal, onSuccess, onCancel }: ProgressUpdateFormProps) {
  const [value, setValue] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (value <= 0) {
      toast.error('Progress value must be greater than zero');
      return;
    }
    
    setLoading(true);
    
    try {
      // Create the progress update
      const progressUpdate: Omit<ProgressUpdate, 'id' | 'createdAt' | 'updatedAt'> = {
        goalId: goal.id as string,
        value,
        notes,
        userId: goal.userId
      };
      
      await addProgressUpdate(progressUpdate);
      
      toast.success('Progress updated successfully');
      onSuccess();
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Update Progress</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Current progress: {goal.currentProgress} / {goal.targetValue} {goal.unit}
        </p>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="value" className="block text-sm font-medium">
          Add Progress ({goal.unit})
        </label>
        <Input
          id="value"
          type="number"
          min="0.01"
          step="0.01"
          value={value}
          onChange={(e) => setValue(parseFloat(e.target.value))}
          placeholder={`Enter value in ${goal.unit}`}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="notes" className="block text-sm font-medium">
          Notes (Optional)
        </label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes about this progress update"
          rows={3}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Progress'}
        </Button>
      </div>
    </form>
  );
} 