'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WorkoutSession, WorkoutRoutine, addWorkoutSession } from '@/lib/firebase/workouts';
import { toast } from 'sonner';
import { Timestamp } from 'firebase/firestore';

interface WorkoutFormProps {
  workout?: WorkoutSession;
  routines?: WorkoutRoutine[];
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function WorkoutForm({ workout, routines = [], userId, onSuccess, onCancel }: WorkoutFormProps) {
  const [name, setName] = useState(workout?.name || '');
  const [routineId, setRoutineId] = useState(workout?.routineId || 'none');
  const [duration, setDuration] = useState(workout?.duration?.toString() || '');
  const [notes, setNotes] = useState(workout?.notes || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter a workout name');
      return;
    }
    
    setLoading(true);
    
    try {
      const workoutData: Omit<WorkoutSession, 'id' | 'createdAt' | 'updatedAt'> = {
        name: name.trim(),
        routineId: routineId === 'none' ? undefined : routineId,
        date: Timestamp.fromDate(new Date()),
        duration: duration ? parseInt(duration) : undefined,
        notes: notes.trim() || undefined,
        userId
      };
      
      await addWorkoutSession(workoutData);
      onSuccess();
    } catch (error) {
      console.error('Error creating workout:', error);
      toast.error('Failed to create workout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Workout Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter workout name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="routine">Workout Routine (Optional)</Label>
        <Select value={routineId} onValueChange={setRoutineId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a routine" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Routine</SelectItem>
            {routines.map(routine => (
              <SelectItem key={routine.id} value={routine.id || ''}>
                {routine.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Duration (minutes)</Label>
        <Input
          id="duration"
          type="number"
          min="1"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Enter duration in minutes"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes about this workout"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Workout'}
        </Button>
      </div>
    </form>
  );
} 