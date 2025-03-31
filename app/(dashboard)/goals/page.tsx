'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Target } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

type Goal = {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);

  const addGoal = () => {
    // This would typically open a modal or form to add a new goal
    const goal: Goal = {
      id: Date.now().toString(),
      title: 'Sample Goal',
      description: 'This is a sample goal description',
      progress: 0,
      target: 100,
    };
    setGoals([...goals, goal]);
  };

  const updateProgress = (id: string, newProgress: number) => {
    setGoals(goals.map(goal =>
      goal.id === id ? { ...goal, progress: Math.min(newProgress, goal.target) } : goal
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Goals</h1>
        <Button onClick={addGoal}>
          <Plus className="mr-2 h-4 w-4" />
          New Goal
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {goals.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No goals set yet.</p>
                <p className="text-sm text-muted-foreground">Create your first goal to start tracking your progress!</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          goals.map((goal) => (
            <Card key={goal.id}>
              <CardHeader>
                <CardTitle>{goal.title}</CardTitle>
                <CardDescription>{goal.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round((goal.progress / goal.target) * 100)}%</span>
                  </div>
                  <Progress value={(goal.progress / goal.target) * 100} />
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateProgress(goal.id, goal.progress - 10)}
                    >
                      -10
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateProgress(goal.id, goal.progress + 10)}
                    >
                      +10
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 