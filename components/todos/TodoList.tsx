'use client';

import { useState } from 'react';
import { TodoItem, Todo } from './TodoItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: text.trim(),
        completed: false,
        priority,
      };
      setTodos([...todos, newTodo]);
      setText('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const editTodo = (id: string, newText: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  };

  return (
    <div className="space-y-4">
      <form onSubmit={addTodo} className="flex gap-2 mb-4">
        <Input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task..."
          className="flex-grow"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
          className="border p-2 rounded"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <Button type="submit">Add</Button>
      </form>

      <div>
        {todos.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No tasks yet. Add one above!</p>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
          ))
        )}
      </div>
    </div>
  );
} 