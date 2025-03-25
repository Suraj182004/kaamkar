'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Goal } from '@/lib/firebase/goals';
import { Timestamp } from 'firebase/firestore';
import { Pencil, Trash2, PlusCircle, LineChart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
  onAddProgress: (goal: Goal) => void;
  onViewDetails: (goal: Goal) => void;
}

export function GoalCard({ goal, onEdit, onDelete, onAddProgress, onViewDetails }: GoalCardProps) {
  // Calculate progress percentage
  const progressPercentage = Math.min(100, Math.round((goal.currentProgress / goal.targetValue) * 100));
  
  // Format target date
  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return 'No date set';
    return timestamp.toDate().toLocaleDateString();
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'not-started':
        return 'bg-gray-100 text-gray-800';
      case 'abandoned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{goal.title}</CardTitle>
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(goal.status)}`}>
            {goal.status.replace('-', ' ')}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Target: {goal.targetDate ? formatDate(goal.targetDate) : 'No date set'}
        </p>
      </CardHeader>
      
      <CardContent className="flex-grow">
        {goal.description && (
          <p className="text-sm mb-4">{goal.description}</p>
        )}
        
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress: {progressPercentage}%</span>
            <span>
              {goal.currentProgress} / {goal.targetValue} {goal.unit}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        {goal.category && (
          <div className="mt-4">
            <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded">
              {goal.category}
            </span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between border-t">
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEdit(goal)}
          >
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDelete(goal.id as string)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
        <div className="flex gap-1">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onAddProgress(goal)}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Add Progress
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewDetails(goal)}
          >
            <LineChart className="h-4 w-4 mr-1" />
            Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
} 