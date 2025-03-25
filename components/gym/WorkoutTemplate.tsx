'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getUserWorkoutTemplates, addWorkoutTemplate, updateWorkoutTemplate, deleteWorkoutTemplate, duplicateWorkoutTemplate } from '@/lib/firebase/templates';
import { getExercises } from '@/lib/firebase/exercises';
import { WorkoutTemplate as WorkoutTemplateType, ExerciseTemplate } from '@/lib/firebase/templates';
import { Exercise } from '@/lib/firebase/exercises';
import { ExerciseTemplateForm } from './ExerciseTemplateForm';
import { Loader2, Plus, Edit2, Copy, Trash2, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface WorkoutTemplateProps {
  userId: string;
  onSelectTemplate?: (template: WorkoutTemplateType) => void;
}

export function WorkoutTemplate({ userId, onSelectTemplate }: WorkoutTemplateProps) {
  const [templates, setTemplates] = useState<WorkoutTemplateType[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WorkoutTemplateType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    exercises: [] as ExerciseTemplate[]
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [templatesData, exercisesData] = await Promise.all([
          getUserWorkoutTemplates(userId),
          getExercises()
        ]);
        setTemplates(templatesData);
        setExercises(exercisesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load workout templates and exercises.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, toast]);

  const handleCreateTemplate = async () => {
    try {
      const templateId = await addWorkoutTemplate(userId, formData);
      const newTemplate = {
        id: templateId,
        ...formData,
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setTemplates([...templates, newTemplate]);
      setShowDialog(false);
      resetForm();
      toast({
        title: 'Success',
        description: 'Workout template created successfully.'
      });
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: 'Error',
        description: 'Failed to create workout template.',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateTemplate = async () => {
    if (!editingTemplate) return;

    try {
      await updateWorkoutTemplate(editingTemplate.id, formData);
      const updatedTemplates = templates.map(template =>
        template.id === editingTemplate.id
          ? { ...template, ...formData, updatedAt: new Date() }
          : template
      );
      setTemplates(updatedTemplates);
      setShowDialog(false);
      resetForm();
      toast({
        title: 'Success',
        description: 'Workout template updated successfully.'
      });
    } catch (error) {
      console.error('Error updating template:', error);
      toast({
        title: 'Error',
        description: 'Failed to update workout template.',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await deleteWorkoutTemplate(templateId);
      setTemplates(templates.filter(template => template.id !== templateId));
      toast({
        title: 'Success',
        description: 'Workout template deleted successfully.'
      });
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete workout template.',
        variant: 'destructive'
      });
    }
  };

  const handleDuplicateTemplate = async (template: WorkoutTemplateType) => {
    try {
      const newTemplateId = await duplicateWorkoutTemplate(template.id, userId);
      const newTemplate = {
        ...template,
        id: newTemplateId,
        name: `${template.name} (Copy)`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setTemplates([...templates, newTemplate]);
      toast({
        title: 'Success',
        description: 'Workout template duplicated successfully.'
      });
    } catch (error) {
      console.error('Error duplicating template:', error);
      toast({
        title: 'Error',
        description: 'Failed to duplicate workout template.',
        variant: 'destructive'
      });
    }
  };

  const handleEditTemplate = (template: WorkoutTemplateType) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description,
      exercises: template.exercises
    });
    setShowDialog(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      exercises: []
    });
    setEditingTemplate(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Workout Templates</h2>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? 'Edit Template' : 'Create Template'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter template name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter template description"
                />
              </div>
              <div className="space-y-2">
                <Label>Exercises</Label>
                <ExerciseTemplateForm
                  exercises={exercises}
                  templateExercises={formData.exercises}
                  onChange={(exercises) => setFormData({ ...formData, exercises })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}>
                  {editingTemplate ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div key={template.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{template.name}</h3>
                <p className="text-sm text-gray-500">{template.description}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditTemplate(template)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDuplicateTemplate(template)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteTemplate(template.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                {onSelectTemplate && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onSelectTemplate(template)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <div className="space-y-2">
              {template.exercises.map((exercise, index) => (
                <div key={index} className="text-sm">
                  {exercise.name} - {exercise.sets}x{exercise.reps} @ {exercise.weight}kg
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 