'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  WorkoutSession, 
  WorkoutRoutine, 
  getUserWorkoutSessions, 
  getUserWorkoutRoutines 
} from '@/lib/firebase/workouts';
import { getExercises, Exercise } from '@/lib/firebase/exercises';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { WorkoutForm } from '@/components/gym/WorkoutForm';
import { RoutineForm } from '@/components/gym/RoutineForm';
import { ExerciseForm } from '@/components/gym/ExerciseForm';
import { InitializeButton } from '@/components/gym/InitializeButton';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function GymTrackerPage() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [routines, setRoutines] = useState<WorkoutRoutine[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [needsInitialization, setNeedsInitialization] = useState(false);
  const [showWorkoutDialog, setShowWorkoutDialog] = useState(false);
  const [showRoutineDialog, setShowRoutineDialog] = useState(false);
  const [showExerciseDialog, setShowExerciseDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return;

        const [workoutsData, routinesData, exercisesData] = await Promise.all([
          getUserWorkoutSessions(user.uid),
          getUserWorkoutRoutines(user.uid),
          getExercises()
        ]);
        
        setWorkouts(workoutsData);
        setRoutines(routinesData);
        setExercises(exercisesData);
        setNeedsInitialization(exercisesData.length === 0);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  const handleWorkoutSuccess = () => {
    setShowWorkoutDialog(false);
    if (user) {
      getUserWorkoutSessions(user.uid).then(setWorkouts);
    }
  };

  const handleRoutineSuccess = () => {
    setShowRoutineDialog(false);
    if (user) {
      getUserWorkoutRoutines(user.uid).then(setRoutines);
    }
  };

  const handleExerciseSuccess = () => {
    setShowExerciseDialog(false);
    if (user) {
      getExercises().then(setExercises);
    }
  };

  if (!user) {
    return <div>Please sign in to access the Gym Tracker.</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (needsInitialization) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <h2 className="text-2xl font-bold">Welcome to Gym Tracker!</h2>
        <p className="text-muted-foreground">Let&apos;s get started by initializing some default exercises.</p>
        <InitializeButton onSuccess={() => setNeedsInitialization(false)} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Tabs defaultValue="workouts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="workouts">Workouts</TabsTrigger>
          <TabsTrigger value="routines">Routines</TabsTrigger>
          <TabsTrigger value="exercises">Exercises</TabsTrigger>
        </TabsList>

        <TabsContent value="workouts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Recent Workouts</h2>
            <Dialog open={showWorkoutDialog} onOpenChange={setShowWorkoutDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Workout
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Workout</DialogTitle>
                </DialogHeader>
                <WorkoutForm
                  userId={user.uid}
                  routines={routines}
                  onSuccess={handleWorkoutSuccess}
                  onCancel={() => setShowWorkoutDialog(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {workouts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground">No workouts yet. Create your first workout!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {workouts.map(workout => (
                <Link key={workout.id} href={`/gym/${workout.id}`}>
                  <Card className="hover:bg-accent transition-colors">
                    <CardHeader>
                      <CardTitle>{workout.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {format(workout.date.toDate(), 'PPP')}
                      </p>
                      {workout.duration && (
                        <p className="text-sm text-muted-foreground">
                          Duration: {workout.duration} minutes
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="routines" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Workout Routines</h2>
            <Dialog open={showRoutineDialog} onOpenChange={setShowRoutineDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Routine
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Routine</DialogTitle>
                </DialogHeader>
                <RoutineForm
                  userId={user.uid}
                  onSuccess={handleRoutineSuccess}
                  onCancel={() => setShowRoutineDialog(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {routines.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground">No routines yet. Create your first routine!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {routines.map(routine => (
                <Card key={routine.id}>
                  <CardHeader>
                    <CardTitle>{routine.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Frequency: {routine.frequency}
                    </p>
                    {routine.days && routine.days.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Days: {routine.days.join(', ')}
                      </p>
                    )}
                    {routine.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {routine.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="exercises" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Exercises</h2>
            <Dialog open={showExerciseDialog} onOpenChange={setShowExerciseDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Exercise
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Exercise</DialogTitle>
                </DialogHeader>
                <ExerciseForm
                  userId={user.uid}
                  onSuccess={handleExerciseSuccess}
                  onCancel={() => setShowExerciseDialog(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {exercises.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground">No exercises yet. Create your first exercise!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {exercises.map(exercise => (
                <Card key={exercise.id}>
                  <CardHeader>
                    <CardTitle>{exercise.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Category: {exercise.category}
                    </p>
                    {exercise.equipment && (
                      <p className="text-sm text-muted-foreground">
                        Equipment: {exercise.equipment}
                      </p>
                    )}
                    {exercise.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {exercise.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 