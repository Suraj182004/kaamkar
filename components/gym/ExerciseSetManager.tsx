'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { updateExerciseSet, deleteExerciseSet, toggleSetCompletion, markSetAsPR } from '@/lib/firebase/workouts';
import { Pencil, Trash2, CheckCircle2, Circle, Trophy } from 'lucide-react';
import { toast } from 'sonner';

interface ExerciseSet {
  id: string;
  exerciseId: string;
  weight: number;
  reps: number;
  completed: boolean;
  isPR: boolean;
}

interface ExerciseSetManagerProps {
  workoutId: string;
  exerciseId: string;
  sets: ExerciseSet[];
  onSetUpdate: () => void;
}

export function ExerciseSetManager({ workoutId, exerciseId, sets, onSetUpdate }: ExerciseSetManagerProps) {
  const [editingSet, setEditingSet] = useState<ExerciseSet | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  const handleEdit = (set: ExerciseSet) => {
    setEditingSet(set);
    setWeight(set.weight.toString());
    setReps(set.reps.toString());
    setShowEditDialog(true);
  };

  const handleSave = async () => {
    if (!editingSet || !weight || !reps) return;

    try {
      await updateExerciseSet(editingSet.id, {
        weight: parseFloat(weight),
        reps: parseInt(reps)
      });
      toast.success('Set updated successfully');
      setShowEditDialog(false);
      onSetUpdate();
    } catch (error) {
      console.error('Error updating set:', error);
      toast.error('Failed to update set');
    }
  };

  const handleDelete = async (setId: string) => {
    try {
      await deleteExerciseSet(setId);
      toast.success('Set deleted successfully');
      onSetUpdate();
    } catch (error) {
      console.error('Error deleting set:', error);
      toast.error('Failed to delete set');
    }
  };

  const handleToggleCompletion = async (setId: string, completed: boolean) => {
    try {
      await toggleSetCompletion(setId, completed);
      onSetUpdate();
    } catch (error) {
      console.error('Error toggling set completion:', error);
      toast.error('Failed to update set completion');
    }
  };

  const handleMarkAsPR = async (setId: string) => {
    try {
      await markSetAsPR(setId);
      toast.success('Set marked as PR');
      onSetUpdate();
    } catch (error) {
      console.error('Error marking set as PR:', error);
      toast.error('Failed to mark set as PR');
    }
  };

  return (
    <div className="space-y-4">
      {sets.map((set) => (
        <div key={set.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleToggleCompletion(set.id, !set.completed)}
            >
              {set.completed ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
            </Button>
            <div>
              <div className="font-medium">{set.weight} kg × {set.reps} reps</div>
              {set.isPR && (
                <div className="text-sm text-yellow-500 flex items-center">
                  <Trophy className="h-4 w-4 mr-1" />
                  Personal Record
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(set)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(set.id)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleMarkAsPR(set.id)}
            >
              <Trophy className="h-4 w-4 text-yellow-500" />
            </Button>
          </div>
        </div>
      ))}

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Set</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Enter weight"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reps">Reps</Label>
              <Input
                id="reps"
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder="Enter reps"
              />
            </div>
            <Button onClick={handleSave} className="w-full">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 