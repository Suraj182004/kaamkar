'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExerciseSet } from '@/lib/firebase/workouts';
import { toast } from 'sonner';

interface ExerciseSetFormProps {
  exerciseId: string;
  onSuccess: (set: ExerciseSet) => void;
  onCancel: () => void;
}

export function ExerciseSetForm({ exerciseId, onSuccess, onCancel }: ExerciseSetFormProps) {
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reps && !duration && !distance) {
      toast.error('Please enter at least one metric (reps, duration, or distance)');
      return;
    }
    
    setLoading(true);
    
    try {
      const setData: Omit<ExerciseSet, 'id' | 'createdAt'> = {
        exerciseId,
        reps: reps ? parseInt(reps) : undefined,
        weight: weight ? parseFloat(weight) : undefined,
        duration: duration ? parseInt(duration) : undefined,
        distance: distance ? parseFloat(distance) : undefined,
        notes: notes.trim() || undefined,
        completed: true
      };
      
      onSuccess(setData);
    } catch (error) {
      console.error('Error creating set:', error);
      toast.error('Failed to create set');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="reps">Reps</Label>
          <Input
            id="reps"
            type="number"
            min="1"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="Number of reps"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Weight in kg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration (seconds)</Label>
          <Input
            id="duration"
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Duration in seconds"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="distance">Distance (meters)</Label>
          <Input
            id="distance"
            type="number"
            min="0"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="Distance in meters"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Input
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes about this set"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Set'}
        </Button>
      </div>
    </form>
  );
} 