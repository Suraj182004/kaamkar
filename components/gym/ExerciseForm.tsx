'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Exercise, addExercise } from '@/lib/firebase/exercises';
import { toast } from 'sonner';

interface ExerciseFormProps {
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const EXERCISE_CATEGORIES = [
  'Strength',
  'Cardio',
  'Flexibility',
  'Balance',
  'Core',
  'Custom'
];

const EXERCISE_DIFFICULTIES = [
  'Beginner',
  'Intermediate',
  'Advanced'
];

export function ExerciseForm({ userId, onSuccess, onCancel }: ExerciseFormProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [description, setDescription] = useState('');
  const [equipment, setEquipment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter an exercise name');
      return;
    }
    
    if (!category) {
      toast.error('Please select a category');
      return;
    }
    
    if (!difficulty) {
      toast.error('Please select a difficulty level');
      return;
    }
    
    setLoading(true);
    
    try {
      const exerciseData: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'> = {
        name: name.trim(),
        category,
        difficulty,
        description: description.trim() || undefined,
        equipment: equipment.trim() || undefined,
        userId,
        isDefault: false
      };
      
      await addExercise(exerciseData);
      onSuccess();
    } catch (error) {
      console.error('Error creating exercise:', error);
      toast.error('Failed to create exercise');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Exercise Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter exercise name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {EXERCISE_CATEGORIES.map(cat => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="difficulty">Difficulty Level</Label>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger>
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            {EXERCISE_DIFFICULTIES.map(level => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="equipment">Equipment Needed</Label>
        <Input
          id="equipment"
          value={equipment}
          onChange={(e) => setEquipment(e.target.value)}
          placeholder="List required equipment"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe how to perform this exercise"
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Exercise'}
        </Button>
      </div>
    </form>
  );
} 