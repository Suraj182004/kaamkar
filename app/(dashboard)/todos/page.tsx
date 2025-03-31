'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Todo, addTodo, getUserTodos, updateTodo, toggleTodoCompletion, deleteTodo } from '@/lib/firebase/todos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Timestamp } from 'firebase/firestore';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function TodosPage() {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch todos on component mount
  useEffect(() => {
    if (user) {
      const fetchTodos = async () => {
        if (!user) return;
        
        try {
          setLoading(true);
          const userTodos = await getUserTodos(user.uid);
          setTodos(userTodos);
        } catch (error) {
          console.error('Error fetching todos:', error);
          toast.error('Failed to load todos');
        } finally {
          setLoading(false);
        }
      };

      fetchTodos();
    }
  }, [user]);

  const handleCreateTodo = async () => {
    if (!user) return;
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      const newTodo = await addTodo({
        title,
        completed: false,
        priority,
        userId: user.uid
      });
      
      // Add new todo to state
      setTodos(prev => [newTodo as Todo, ...prev]);
      
      // Reset form
      setTitle('');
      setPriority('medium');
      setIsDialogOpen(false);
      
      toast.success('Todo created successfully');
    } catch (error) {
      console.error('Error creating todo:', error);
      toast.error('Failed to create todo');
    }
  };

  const handleUpdateTodo = async () => {
    if (!user || !editingTodo) return;
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      const updatedTodo = await updateTodo(editingTodo.id as string, {
        title,
        priority
      });
      
      // Update todo in state
      setTodos(prev => 
        prev.map(todo => 
          todo.id === editingTodo.id 
            ? { ...todo, title, priority, updatedAt: updatedTodo.updatedAt as Timestamp } 
            : todo
        )
      );
      
      // Reset form
      setEditingTodo(null);
      setTitle('');
      setPriority('medium');
      setIsDialogOpen(false);
      
      toast.success('Todo updated successfully');
    } catch (error) {
      console.error('Error updating todo:', error);
      toast.error('Failed to update todo');
    }
  };

  const handleToggleTodo = async (todoId: string, completed: boolean) => {
    if (!user) return;

    try {
      await toggleTodoCompletion(todoId, completed);
      
      // Update todo in state
      setTodos(prev => 
        prev.map(todo => 
          todo.id === todoId 
            ? { ...todo, completed } 
            : todo
        )
      );
      
      toast.success(completed ? 'Todo completed' : 'Todo marked as incomplete');
    } catch (error) {
      console.error('Error toggling todo:', error);
      toast.error('Failed to update todo');
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    if (!user) return;

    try {
      await deleteTodo(todoId);
      
      // Remove todo from state
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
      
      toast.success('Todo deleted successfully');
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast.error('Failed to delete todo');
    }
  };

  const openCreateDialog = () => {
    setEditingTodo(null);
    setTitle('');
    setPriority('medium');
    setIsDialogOpen(true);
  };

  const openEditDialog = (todo: Todo) => {
    setEditingTodo(todo);
    setTitle(todo.title);
    setPriority(todo.priority || 'medium');
    setIsDialogOpen(true);
  };

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp || !timestamp.toDate) {
      return '';
    }
    return timestamp.toDate().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-amber-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">To-Do List</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" /> New Task
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : todos.length === 0 ? (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
          <p className="text-muted-foreground mb-4">Create your first task to get started.</p>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" /> Create Task
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {todos.map((todo) => (
            <Card key={todo.id} className={`${todo.completed ? 'opacity-70' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Checkbox 
                    id={`todo-${todo.id}`}
                    checked={todo.completed}
                    onCheckedChange={(checked: boolean) => 
                      handleToggleTodo(todo.id as string, checked as boolean)
                    }
                    className="mt-1"
                  />
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <label 
                        htmlFor={`todo-${todo.id}`}
                        className={`font-medium ${todo.completed ? 'line-through text-muted-foreground' : ''}`}
                      >
                        {todo.title}
                      </label>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold ${getPriorityColor(todo.priority)}`}>
                          {todo.priority ? todo.priority.toUpperCase() : 'MEDIUM'}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openEditDialog(todo)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteTodo(todo.id as string)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {todo.createdAt && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Added {formatDate(todo.createdAt)}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Todo Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTodo ? 'Edit Task' : 'Create Task'}
            </DialogTitle>
            <DialogDescription>
              {editingTodo 
                ? 'Update your task details below.' 
                : 'Add a new task to your list.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Task
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium">
                Priority
              </label>
              <Select 
                value={priority} 
                onValueChange={(value: string) => setPriority(value as 'low' | 'medium' | 'high')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={editingTodo ? handleUpdateTodo : handleCreateTodo}>
              {editingTodo ? 'Update Task' : 'Create Task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 