'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Goal, addGoal, updateGoal } from '@/lib/firebase/goals';
import { Timestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import { Todo, getUserTodos } from '@/lib/firebase/todos';

interface GoalFormProps {
  goal?: Goal;
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const COMMON_CATEGORIES = [
  'Personal Development',
  'Health & Fitness',
  'Career',
  'Education',
  'Finance',
  'Relationships',
  'Hobbies',
  'Other'
];

const COMMON_UNITS = [
  'kg',
  'pounds',
  'hours',
  'minutes',
  'days',
  'sessions',
  'items',
  'pages',
  'books',
  'chapters',
  'steps',
  '%',
  'points'
];

export function GoalForm({ goal, userId, onSuccess, onCancel }: GoalFormProps) {
  const [title, setTitle] = useState(goal?.title || '');
  const [description, setDescription] = useState(goal?.description || '');
  const [category, setCategory] = useState(goal?.category || '');
  const [targetDate, setTargetDate] = useState(
    goal?.targetDate 
      ? new Date(goal.targetDate.toDate()).toISOString().split('T')[0] 
      : ''
  );
  const [targetValue, setTargetValue] = useState(goal?.targetValue?.toString() || '');
  const [unit, setUnit] = useState(goal?.unit || '');
  const [customCategory, setCustomCategory] = useState('');
  const [customUnit, setCustomUnit] = useState('');
  const [loading, setLoading] = useState(false);
  const [userTodos, setUserTodos] = useState<Todo[]>([]);
  const [selectedTodos, setSelectedTodos] = useState<string[]>(goal?.relatedTodos || []);
  const [showTodoSelector, setShowTodoSelector] = useState(false);
  
  useEffect(() => {
    // Fetch user's todos if the user wants to link goals to todos
    if (showTodoSelector) {
      const fetchTodos = async () => {
        try {
          const todos = await getUserTodos(userId);
          setUserTodos(todos);
        } catch (error) {
          console.error('Error fetching todos:', error);
          toast.error('Failed to load todos');
        }
      };
      
      fetchTodos();
    }
  }, [userId, showTodoSelector]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Goal title is required');
      return;
    }
    
    if (!targetValue || parseFloat(targetValue) <= 0) {
      toast.error('Target value must be greater than zero');
      return;
    }
    
    setLoading(true);
    
    try {
      const finalCategory = category === 'custom' ? customCategory : category;
      const finalUnit = unit === 'custom' ? customUnit : unit;
      
      const goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'> = {
        title: title.trim(),
        description: description.trim(),
        category: finalCategory,
        targetDate: targetDate ? Timestamp.fromDate(new Date(targetDate)) : Timestamp.fromDate(new Date()),
        userId,
        currentProgress: goal?.currentProgress || 0,
        targetValue: parseFloat(targetValue),
        unit: finalUnit,
        status: goal?.status || 'not-started',
        relatedTodos: showTodoSelector ? selectedTodos : []
      };
      
      if (goal?.id) {
        // Update existing goal
        await updateGoal(goal.id, goalData);
        toast.success('Goal updated successfully');
      } else {
        // Create new goal
        await addGoal(goalData);
        toast.success('Goal created successfully');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving goal:', error);
      toast.error(`Failed to ${goal ? 'update' : 'create'} goal`);
    } finally {
      setLoading(false);
    }
  };
  
  const toggleTodoSelection = (todoId: string) => {
    setSelectedTodos(prev => 
      prev.includes(todoId)
        ? prev.filter(id => id !== todoId)
        : [...prev, todoId]
    );
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">
          {goal ? 'Edit Goal' : 'Create New Goal'}
        </h3>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium">
          Goal Title *
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What do you want to achieve?"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details about your goal"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="category" className="block text-sm font-medium">
            Category
          </label>
          <Select 
            value={category} 
            onValueChange={setCategory}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {COMMON_CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
              <SelectItem value="custom">Custom category...</SelectItem>
            </SelectContent>
          </Select>
          
          {category === 'custom' && (
            <Input
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Enter custom category"
              className="mt-2"
            />
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="targetDate" className="block text-sm font-medium">
            Target Date
          </label>
          <Input
            id="targetDate"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="targetValue" className="block text-sm font-medium">
            Target Value *
          </label>
          <Input
            id="targetValue"
            type="number"
            min="0.01"
            step="0.01"
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
            placeholder="e.g. 10"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="unit" className="block text-sm font-medium">
            Unit of Measurement *
          </label>
          <Select 
            value={unit} 
            onValueChange={setUnit}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a unit" />
            </SelectTrigger>
            <SelectContent>
              {COMMON_UNITS.map(u => (
                <SelectItem key={u} value={u}>{u}</SelectItem>
              ))}
              <SelectItem value="custom">Custom unit...</SelectItem>
            </SelectContent>
          </Select>
          
          {unit === 'custom' && (
            <Input
              value={customUnit}
              onChange={(e) => setCustomUnit(e.target.value)}
              placeholder="Enter custom unit"
              className="mt-2"
            />
          )}
        </div>
      </div>
      
      <div className="pt-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="linkTodos" 
            checked={showTodoSelector} 
            onCheckedChange={(checked) => setShowTodoSelector(!!checked)} 
          />
          <Label htmlFor="linkTodos">Link to existing To-Do items</Label>
        </div>
      </div>
      
      {showTodoSelector && (
        <div className="border rounded-md p-3 space-y-2 bg-background">
          <h4 className="text-sm font-medium">Select related To-Do items:</h4>
          
          {userTodos.length === 0 ? (
            <p className="text-sm text-muted-foreground">No To-Do items found. Create some first!</p>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {userTodos.map(todo => (
                <div key={todo.id} className="flex items-start space-x-2">
                  <Checkbox 
                    id={`todo-${todo.id}`} 
                    checked={selectedTodos.includes(todo.id as string)} 
                    onCheckedChange={() => toggleTodoSelection(todo.id as string)} 
                  />
                  <Label 
                    htmlFor={`todo-${todo.id}`}
                    className={`text-sm ${todo.completed ? 'line-through text-muted-foreground' : ''}`}
                  >
                    {todo.title}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (goal ? 'Updating...' : 'Creating...') : (goal ? 'Update Goal' : 'Create Goal')}
        </Button>
      </div>
    </form>
  );
} 