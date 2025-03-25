'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(todo.id, editText);
      setIsEditing(false);
    }
  };

  const priorityColor = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  return (
    <div className="flex items-center p-3 border rounded-lg mb-2 bg-card">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="h-5 w-5 mr-3"
      />
      
      {isEditing ? (
        <div className="flex-grow flex gap-2">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="flex-grow p-1 rounded border"
            autoFocus
          />
          <Button size="sm" onClick={handleSave}>Save</Button>
          <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
        </div>
      ) : (
        <>
          <div className="flex-grow">
            <p className={`${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
              {todo.text}
            </p>
            {todo.dueDate && (
              <p className="text-xs text-muted-foreground">
                Due: {todo.dueDate.toLocaleDateString()}
              </p>
            )}
          </div>
          <span className={`text-xs px-2 py-1 rounded-full mr-2 ${priorityColor[todo.priority]}`}>
            {todo.priority}
          </span>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>Edit</Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete(todo.id)}>Delete</Button>
          </div>
        </>
      )}
    </div>
  );
} 