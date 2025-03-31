'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Goal, ProgressUpdate, getProgressUpdatesForGoal } from '@/lib/firebase/goals';
import { Timestamp } from 'firebase/firestore';
import { ArrowLeft, BarChart2 } from 'lucide-react';
import { toast } from 'sonner';
import { Todo, getTodoById } from '@/lib/firebase/todos';
import Link from 'next/link';

// For chart visualization
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface GoalDetailsProps {
  goal: Goal;
  onBack: () => void;
}

export function GoalDetails({ goal, onBack }: GoalDetailsProps) {
  const [progressUpdates, setProgressUpdates] = useState<ProgressUpdate[]>([]);
  const [linkedTodos, setLinkedTodos] = useState<Todo[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch progress updates
        const updates = await getProgressUpdatesForGoal(goal.id as string);
        setProgressUpdates(updates);
        
        // Fetch linked todos if any
        if (goal.relatedTodos && goal.relatedTodos.length > 0) {
          const todosPromises = goal.relatedTodos.map(id => getTodoById(id));
          const todos = await Promise.all(todosPromises);
          setLinkedTodos(todos.filter(Boolean) as Todo[]);
        }
      } catch (error) {
        console.error('Error fetching goal details:', error);
        toast.error('Failed to load goal details');
      }
    };
    
    fetchData();
  }, [goal]);
  
  // Calculate progress percentage
  const progressPercentage = Math.min(100, Math.round((goal.currentProgress / goal.targetValue) * 100));
  
  // Format timestamp
  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return '';
    return timestamp.toDate().toLocaleDateString();
  };
  
  const formatDateTime = (timestamp: Timestamp) => {
    if (!timestamp) return '';
    return timestamp.toDate().toLocaleString();
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
  
  // Prepare chart data
  const chartData = {
    labels: progressUpdates.map(update => 
      update.createdAt?.toDate().toLocaleDateString() || ''
    ),
    datasets: [
      {
        label: 'Progress',
        data: progressUpdates.reduce((acc, update, index) => {
          const previousValue = index > 0 ? acc[index - 1] : 0;
          acc.push(previousValue + update.value);
          return acc;
        }, [] as number[]),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Progress Over Time',
      },
    },
    scales: {
      y: {
        min: 0,
        max: Math.max(goal.targetValue, goal.currentProgress),
      },
    },
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Goals
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{goal.title}</h2>
          <div className="flex items-center mt-1 gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(goal.status)}`}>
              {goal.status.replace('-', ' ')}
            </span>
            {goal.category && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                {goal.category}
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">
            Target Date: {goal.targetDate ? formatDate(goal.targetDate) : 'No date set'}
          </p>
          <p className="text-sm text-muted-foreground">
            Created: {goal.createdAt ? formatDate(goal.createdAt) : ''}
          </p>
        </div>
      </div>
      
      {goal.description && (
        <div className="bg-muted p-4 rounded-md">
          <p>{goal.description}</p>
        </div>
      )}
      
      <div className="border p-4 rounded-md bg-card">
        <h3 className="text-lg font-medium mb-3">Progress</h3>
        <div className="flex justify-between text-sm mb-1">
          <span>Current Progress: {progressPercentage}% complete</span>
          <span>
            {goal.currentProgress} / {goal.targetValue} {goal.unit}
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2 mb-4" />
        
        {progressUpdates.length > 0 && (
          <div className="h-60 mt-6">
            <Line options={chartOptions} data={chartData} />
          </div>
        )}
      </div>
      
      {linkedTodos.length > 0 && (
        <div className="border p-4 rounded-md bg-card">
          <h3 className="text-lg font-medium mb-3">Related Tasks</h3>
          <ul className="space-y-2">
            {linkedTodos.map(todo => (
              <li key={todo.id} className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={todo.completed} 
                  readOnly 
                  className="h-4 w-4" 
                />
                <span className={todo.completed ? 'line-through text-muted-foreground' : ''}>
                  {todo.title}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <Link
              href="/todos"
              className="text-sm text-primary hover:underline"
            >
              Go to To-Do List
            </Link>
          </div>
        </div>
      )}
      
      {progressUpdates.length > 0 && (
        <div className="border p-4 rounded-md bg-card">
          <h3 className="text-lg font-medium mb-3">Progress History</h3>
          <div className="space-y-3">
            {progressUpdates.map(update => (
              <div key={update.id} className="border-b pb-3 last:border-0">
                <div className="flex justify-between">
                  <span className="font-medium">+{update.value} {goal.unit}</span>
                  <span className="text-sm text-muted-foreground">
                    {update.createdAt ? formatDateTime(update.createdAt) : ''}
                  </span>
                </div>
                {update.notes && (
                  <p className="text-sm mt-1">{update.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {progressUpdates.length === 0 && (
        <div className="text-center py-6 border rounded-md bg-muted/20">
          <BarChart2 className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">No Progress Updates Yet</h3>
          <p className="text-muted-foreground">
            Start tracking your progress by adding your first update.
          </p>
        </div>
      )}
    </div>
  );
} 