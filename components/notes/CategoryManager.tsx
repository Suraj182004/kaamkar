'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { NoteCategory, getUserCategories, addCategory, deleteCategory } from '@/lib/firebase/notes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, Plus, Trash } from 'lucide-react';
import { toast } from 'sonner';

interface CategoryManagerProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export default function CategoryManager({ selectedCategory, onSelectCategory }: CategoryManagerProps) {
  const { user } = useAuth();
  const [categories, setCategories] = useState<NoteCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchCategories = async () => {
        if (!user) return;
        try {
          const fetchedCategories = await getUserCategories(user.uid);
          setCategories(fetchedCategories);
        } catch (error) {
          console.error('Error fetching categories:', error);
          toast.error('Failed to load categories');
        } finally {
          setLoading(false);
        }
      };
      
      fetchCategories();
    }
  }, [user]);

  const handleAddCategory = async () => {
    if (!user || !newCategoryName.trim()) return;
    
    setIsAdding(true);
    try {
      await addCategory({
        name: newCategoryName.trim(),
        userId: user.uid,
      });
      setNewCategoryName('');
      toast.success('Category added successfully');
      
      const fetchedCategories = await getUserCategories(user.uid);
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId);
      if (selectedCategory === categoryId) {
        onSelectCategory(null);
      }
      toast.success('Category deleted successfully');
      
      const fetchedCategories = await getUserCategories(user.uid);
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="p-4 space-y-4">
      <h2 className="font-semibold">Categories</h2>
      
      <div className="flex gap-2">
        <Input
          placeholder="New category"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
        />
        <Button
          size="icon"
          onClick={handleAddCategory}
          disabled={isAdding || !newCategoryName.trim()}
        >
          {isAdding ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="space-y-1">
        <Button
          variant={selectedCategory === null ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => onSelectCategory(null)}
        >
          All Notes
        </Button>
        
        {categories.map((category) => (
          <div key={category.id} className="flex items-center gap-1">
            <Button
              variant={selectedCategory === category.id ? "secondary" : "ghost"}
              className="flex-1 justify-start"
              onClick={() => onSelectCategory(category.id!)}
            >
              {category.name}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => handleDeleteCategory(category.id!)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {categories.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-2">
            No categories yet
          </p>
        )}
      </div>
    </Card>
  );
} 