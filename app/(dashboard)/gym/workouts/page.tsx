'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { WorkoutSession, getUserWorkoutSessions } from '@/lib/firebase/workouts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { WorkoutForm } from '@/components/gym/WorkoutForm';
import { format } from 'date-fns';
import { Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function WorkoutsListPage() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWorkoutDialog, setShowWorkoutDialog] = useState(false);

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!user) return;
      
      try {
        const workoutsData = await getUserWorkoutSessions(user.uid);
        setWorkouts(workoutsData);
      } catch (error) {
        console.error('Error fetching workouts:', error);
        toast.error('Failed to load workouts');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkouts();
  }, [user]);

  const handleWorkoutSuccess = () => {
    setShowWorkoutDialog(false);
    if (user) {
      getUserWorkoutSessions(user.uid).then(setWorkouts);
    }
  };

  if (!user) {
    return <div>Please sign in to access the Gym Tracker.</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
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
          <h1 className="text-2xl font-bold">All Workouts</h1>
        </div>
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
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {workout.notes}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 