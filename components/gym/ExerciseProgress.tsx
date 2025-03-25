'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserWorkoutSessions } from '@/lib/firebase/workouts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface ExerciseProgressProps {
  userId: string;
  exerciseId: string;
  limit?: number;
}

interface ProgressData {
  date: string;
  weight: number;
  reps: number;
  volume: number;
  oneRepMax: number;
}

export function ExerciseProgress({ userId, exerciseId, limit = 10 }: ExerciseProgressProps) {
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const sessions = await getUserWorkoutSessions(userId, limit);
        const data: ProgressData[] = [];

        sessions.forEach(session => {
          session.exerciseSets.forEach(set => {
            if (set.exerciseId === exerciseId) {
              data.push({
                date: format(session.date.toDate(), 'MMM d'),
                weight: set.weight,
                reps: set.reps,
                volume: set.weight * set.reps,
                oneRepMax: set.weight * (36 / (37 - set.reps))
              });
            }
          });
        });

        setProgressData(data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      } catch (error) {
        console.error('Error fetching exercise progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [userId, exerciseId, limit]);

  if (loading) {
    return <div>Loading progress...</div>;
  }

  if (!progressData.length) {
    return <div>No progress data available</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="weight"
                stroke="#8884d8"
                name="Weight (kg)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="oneRepMax"
                stroke="#82ca9d"
                name="1RM (kg)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 