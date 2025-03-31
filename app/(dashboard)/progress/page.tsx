'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Goal, getUserGoals, deleteGoal } from '@/lib/firebase/goals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GoalCard } from '@/components/progress/GoalCard';
import { GoalForm } from '@/components/progress/GoalForm';
import { GoalDetails } from '@/components/progress/GoalDetails';
import { ProgressUpdateForm } from '@/components/progress/ProgressUpdateForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Plus, TargetIcon, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { GeminiAssistant } from '@/components/common/GeminiAssistant';

export default function ProgressPage() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isProgressDialogOpen, setIsProgressDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [progressGoal, setProgressGoal] = useState<Goal | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch goals on component mount
  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user, fetchGoals]);

  const fetchGoals = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const fetchedGoals = await getUserGoals(user.uid);
      setGoals(fetchedGoals);
      
      // Extract unique categories for the filter
      const uniqueCategories = Array.from(
        new Set(fetchedGoals.map(goal => goal.category).filter(Boolean))
      ) as string[];
      
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!user) return;
    
    if (!confirm('Are you sure you want to delete this goal? This will also delete all progress history.')) {
      return;
    }
    
    try {
      await deleteGoal(goalId);
      setGoals(goals.filter(goal => goal.id !== goalId));
      
      // If we're viewing the deleted goal, go back to the list
      if (selectedGoal?.id === goalId) {
        setSelectedGoal(null);
      }
      
      toast.success('Goal deleted successfully');
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Failed to delete goal');
    }
  };

  const handleCreateGoal = () => {
    setEditingGoal(null);
    setIsFormDialogOpen(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setIsFormDialogOpen(true);
  };

  const handleAddProgress = (goal: Goal) => {
    setProgressGoal(goal);
    setIsProgressDialogOpen(true);
  };

  const handleViewDetails = (goal: Goal) => {
    setSelectedGoal(goal);
  };

  const handleFormSuccess = () => {
    setIsFormDialogOpen(false);
    setEditingGoal(null);
    fetchGoals();
  };

  const handleProgressSuccess = () => {
    setIsProgressDialogOpen(false);
    setProgressGoal(null);
    fetchGoals();
    
    // If we're viewing the goal that got updated, refresh the selected goal
    if (selectedGoal && progressGoal && selectedGoal.id === progressGoal.id) {
      const updatedGoal = goals.find(g => g.id === selectedGoal.id);
      if (updatedGoal) {
        setSelectedGoal(updatedGoal);
      }
    }
  };

  // Filter goals based on search term and category
  const filteredGoals = goals.filter(goal => {
    // Search filter
    const matchesSearch = searchTerm 
      ? goal.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (goal.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
      : true;
      
    // Category filter
    const matchesCategory = categoryFilter === 'all' 
      ? true 
      : goal.category === categoryFilter;
      
    // Status filter
    const matchesStatus = statusFilter === 'all'
      ? true
      : goal.status === statusFilter;
      
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (!user) {
    return null;
  }

  // If a goal is selected, show its detailed view
  if (selectedGoal) {
    return (
      <GoalDetails 
        goal={selectedGoal} 
        onBack={() => setSelectedGoal(null)} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Progress Tracker</h1>
        <Button onClick={handleCreateGoal}>
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <Input
            placeholder="Search goals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex gap-2">
          <div className="w-40">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-40">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="abandoned">Abandoned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center my-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredGoals.length === 0 ? (
        <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
          <TargetIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">No Goals Found</h2>
          <p className="text-muted-foreground mb-4">
            {goals.length === 0 
              ? "You haven't created any goals yet." 
              : "No goals match your current filters."}
          </p>
          {goals.length === 0 && (
            <Button onClick={handleCreateGoal}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Goal
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGoals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={handleEditGoal}
              onDelete={handleDeleteGoal}
              onAddProgress={handleAddProgress}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}
      
      {/* Goal Form Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingGoal ? 'Edit Goal' : 'Create Goal'}</DialogTitle>
          </DialogHeader>
          <GoalForm
            goal={editingGoal || undefined}
            userId={user.uid}
            onSuccess={handleFormSuccess}
            onCancel={() => setIsFormDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Progress Update Dialog */}
      <Dialog open={isProgressDialogOpen} onOpenChange={setIsProgressDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Progress</DialogTitle>
          </DialogHeader>
          {progressGoal && (
            <ProgressUpdateForm
              goal={progressGoal}
              onSuccess={handleProgressSuccess}
              onCancel={() => setIsProgressDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <GeminiAssistant />
    </div>
  );
} 