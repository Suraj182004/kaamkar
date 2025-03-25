'use client';

import { useState, useEffect, use } from 'react';
import { useAuth } from '@/context/AuthContext';
import { WorkoutSession, ExerciseSet, getWorkoutSessionById, addExerciseSet, updateWorkoutSession, deleteWorkoutSession } from '@/lib/firebase/workouts';
import { Exercise, getExerciseById } from '@/lib/firebase/exercises';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ExerciseSetForm } from '@/components/gym/ExerciseSetForm';
import { WorkoutForm } from '@/components/gym/WorkoutForm';
import { format } from 'date-fns';
import { Plus, ArrowLeft, Pencil, Trash2, CheckCircle2, Circle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ExerciseSetManager } from '@/components/gym/ExerciseSetManager';
import { WorkoutStats } from '@/components/gym/WorkoutStats';
import { RestTimer } from '@/components/gym/RestTimer';

interface WorkoutDetailsPageProps {
  params: Promise<{
    workoutId: string;
  }>;
}

export default function WorkoutDetailsPage({ params }: WorkoutDetailsPageProps) {
  const { workoutId } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [workout, setWorkout] = useState<WorkoutSession | null>(null);
  const [exercises, setExercises] = useState<Record<string, Exercise>>({});
  const [loading, setLoading] = useState(true);
  const [showSetDialog, setShowSetDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      if (!user) return;
      
      try {
        const workoutData = await getWorkoutSessionById(workoutId);
        if (!workoutData) {
          toast.error('Workout not found');
          return;
        }
        
        setWorkout(workoutData);
        
        // Fetch exercise details for each set
        const exercisePromises = workoutData.sets?.map(async (set) => {
          const exercise = await getExerciseById(set.exerciseId);
          return { [set.exerciseId]: exercise };
        }) || [];
        
        const exerciseResults = await Promise.all(exercisePromises);
        const exerciseMap = exerciseResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        setExercises(exerciseMap);
      } catch (error) {
        console.error('Error fetching workout:', error);
        toast.error('Failed to load workout');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkout();
  }, [user, workoutId]);

  const handleSetSuccess = async (set: Omit<ExerciseSet, 'id' | 'createdAt'>) => {
    if (!workout || !user) return;
    
    try {
      await addExerciseSet({
        ...set,
        workoutSessionId: workout.id,
        userId: user.uid
      });
      
      // Refresh workout data
      const updatedWorkout = await getWorkoutSessionById(workoutId);
      if (updatedWorkout) {
        setWorkout(updatedWorkout);
        
        // Fetch new exercise details if needed
        if (set.exerciseId && !exercises[set.exerciseId]) {
          const exercise = await getExerciseById(set.exerciseId);
          if (exercise) {
            setExercises(prev => ({ ...prev, [set.exerciseId]: exercise }));
          }
        }
      }
      
      setShowSetDialog(false);
      setSelectedExerciseId(null);
    } catch (error) {
      console.error('Error adding set:', error);
      toast.error('Failed to add set');
    }
  };

  const handleWorkoutUpdate = async (updatedWorkout: WorkoutSession) => {
    try {
      await updateWorkoutSession(workoutId, updatedWorkout);
      setWorkout(updatedWorkout);
      setShowEditDialog(false);
      toast.success('Workout updated successfully');
    } catch (error) {
      console.error('Error updating workout:', error);
      toast.error('Failed to update workout');
    }
  };

  const handleWorkoutDelete = async () => {
    if (!user) return;
    
    try {
      await deleteWorkoutSession(workoutId);
      toast.success('Workout deleted successfully');
      router.push('/gym');
    } catch (error) {
      console.error('Error deleting workout:', error);
      toast.error('Failed to delete workout');
    }
  };

  const handleSetComplete = async (setId: string, completed: boolean) => {
    if (!workout) return;
    
    try {
      const updatedSets = workout.sets?.map(set => 
        set.id === setId ? { ...set, completed } : set
      );
      
      await updateWorkoutSession(workoutId, { sets: updatedSets });
      
      // Refresh workout data
      const updatedWorkout = await getWorkoutSessionById(workoutId);
      if (updatedWorkout) {
        setWorkout(updatedWorkout);
      }
    } catch (error) {
      console.error('Error updating set:', error);
      toast.error('Failed to update set');
    }
  };

  if (!user) {
    return <div>Please sign in to access the Gym Tracker.</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!workout) {
    return <div>Workout not found.</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/gym">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Gym Tracker
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{workout.name}</h1>
        </div>
        <div className="flex gap-2">
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Pencil className="h-4 w-4 mr-2" />
                Edit Workout
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Workout</DialogTitle>
              </DialogHeader>
              <WorkoutForm
                workout={workout}
                userId={user.uid}
                onSuccess={() => handleWorkoutUpdate(workout)}
                onCancel={() => setShowEditDialog(false)}
              />
            </DialogContent>
          </Dialog>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleWorkoutDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Workout
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workout Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <p className="text-sm text-muted-foreground">
              Date: {format(workout.date.toDate(), 'PPP')}
            </p>
            {workout.duration && (
              <p className="text-sm text-muted-foreground">
                Duration: {workout.duration} minutes
              </p>
            )}
            {workout.notes && (
              <p className="text-sm text-muted-foreground">
                Notes: {workout.notes}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Exercise Sets</h2>
          <Dialog open={showSetDialog} onOpenChange={setShowSetDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Set
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Exercise Set</DialogTitle>
              </DialogHeader>
              <ExerciseSetForm
                exerciseId={selectedExerciseId || ''}
                onSuccess={handleSetSuccess}
                onCancel={() => {
                  setShowSetDialog(false);
                  setSelectedExerciseId(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {workout.sets && workout.sets.length > 0 ? (
          <div className="grid gap-4">
            {workout.sets.map((set, index) => {
              const exercise = exercises[set.exerciseId];
              return (
                <Card key={set.id} className={set.completed ? 'bg-muted/50' : ''}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {exercise?.name || 'Unknown Exercise'} - Set {index + 1}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetComplete(set.id!, !set.completed)}
                      >
                        {set.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      {set.reps && (
                        <p className="text-sm text-muted-foreground">
                          Reps: {set.reps}
                        </p>
                      )}
                      {set.weight && (
                        <p className="text-sm text-muted-foreground">
                          Weight: {set.weight} kg
                        </p>
                      )}
                      {set.duration && (
                        <p className="text-sm text-muted-foreground">
                          Duration: {set.duration} seconds
                        </p>
                      )}
                      {set.distance && (
                        <p className="text-sm text-muted-foreground">
                          Distance: {set.distance} meters
                        </p>
                      )}
                      {set.notes && (
                        <p className="text-sm text-muted-foreground">
                          Notes: {set.notes}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground">No sets yet. Add your first set!</p>
            </CardContent>
          </Card>
        )}
      </div>

      <RestTimer />

      <WorkoutStats workoutId={workoutId} />

      <Card>
        <CardHeader>
          <CardTitle>Exercise Sets</CardTitle>
        </CardHeader>
        <CardContent>
          {workout.sets && workout.sets.map((set: ExerciseSet) => (
            <div key={set.id} className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{exercises[set.exerciseId]?.name || 'Unknown Exercise'}</h3>
              <ExerciseSetManager
                workoutId={workoutId}
                exerciseId={set.exerciseId}
                sets={[set]}
                onSetUpdate={() => {
                  // Refresh workout data
                  fetchWorkout();
                }}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
} 