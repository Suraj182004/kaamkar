'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExerciseTemplate } from '@/lib/firebase/templates';
import { Exercise } from '@/lib/firebase/exercises';
import { Plus, Trash2 } from 'lucide-react';

interface ExerciseTemplateFormProps {
  exercises: Exercise[];
  templateExercises: ExerciseTemplate[];
  onChange: (exercises: ExerciseTemplate[]) => void;
}

export function ExerciseTemplateForm({ exercises, templateExercises, onChange }: ExerciseTemplateFormProps) {
  const [newExercise, setNewExercise] = useState<ExerciseTemplate>({
    id: '',
    name: '',
    sets: 3,
    reps: 12,
    weight: 0
  });

  const handleAddExercise = () => {
    if (!newExercise.name) return;

    const exercise = exercises.find(e => e.name === newExercise.name);
    if (!exercise) return;

    const updatedExercises = [
      ...templateExercises,
      {
        ...newExercise,
        id: exercise.id
      }
    ];

    onChange(updatedExercises);
    setNewExercise({
      id: '',
      name: '',
      sets: 3,
      reps: 12,
      weight: 0
    });
  };

  const handleUpdateExercise = (index: number, field: keyof ExerciseTemplate, value: number) => {
    const updatedExercises = [...templateExercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: value
    };
    onChange(updatedExercises);
  };

  const handleRemoveExercise = (index: number) => {
    const updatedExercises = templateExercises.filter((_, i) => i !== index);
    onChange(updatedExercises);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-4">
        <div className="flex-1 space-y-2">
          <Label htmlFor="exercise">Exercise</Label>
          <Select
            value={newExercise.name}
            onValueChange={(value) => setNewExercise({ ...newExercise, name: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an exercise" />
            </SelectTrigger>
            <SelectContent>
              {exercises.map((exercise) => (
                <SelectItem key={exercise.id} value={exercise.name}>
                  {exercise.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-24 space-y-2">
          <Label htmlFor="sets">Sets</Label>
          <Input
            id="sets"
            type="number"
            min="1"
            value={newExercise.sets}
            onChange={(e) => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) })}
          />
        </div>
        <div className="w-24 space-y-2">
          <Label htmlFor="reps">Reps</Label>
          <Input
            id="reps"
            type="number"
            min="1"
            value={newExercise.reps}
            onChange={(e) => setNewExercise({ ...newExercise, reps: parseInt(e.target.value) })}
          />
        </div>
        <div className="w-24 space-y-2">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="0.5"
            value={newExercise.weight}
            onChange={(e) => setNewExercise({ ...newExercise, weight: parseFloat(e.target.value) })}
          />
        </div>
        <Button onClick={handleAddExercise} className="mb-2">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {templateExercises.map((exercise, index) => (
          <div key={index} className="flex items-center gap-4 p-2 border rounded-lg">
            <div className="flex-1">
              <p className="font-medium">{exercise.name}</p>
            </div>
            <div className="w-24">
              <Input
                type="number"
                min="1"
                value={exercise.sets}
                onChange={(e) => handleUpdateExercise(index, 'sets', parseInt(e.target.value))}
              />
            </div>
            <div className="w-24">
              <Input
                type="number"
                min="1"
                value={exercise.reps}
                onChange={(e) => handleUpdateExercise(index, 'reps', parseInt(e.target.value))}
              />
            </div>
            <div className="w-24">
              <Input
                type="number"
                min="0"
                step="0.5"
                value={exercise.weight}
                onChange={(e) => handleUpdateExercise(index, 'weight', parseFloat(e.target.value))}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveExercise(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
} 