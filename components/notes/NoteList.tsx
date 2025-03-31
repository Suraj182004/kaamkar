'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NoteCard, Note } from './NoteCard';

export function NoteList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const addNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      const now = new Date();
      const newNote: Note = {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        createdAt: now,
        updatedAt: now,
      };
      setNotes([...notes, newNote]);
      setTitle('');
      setContent('');
      setIsAdding(false);
    }
  };

  const editNote = (id: string, newTitle: string, newContent: string) => {
    setNotes(
      notes.map((note) =>
        note.id === id
          ? { ...note, title: newTitle, content: newContent, updatedAt: new Date() }
          : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <div className="space-y-6">
      {isAdding ? (
        <div className="border p-4 rounded-lg bg-card mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Note</h2>
          <form onSubmit={addNote} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note here..."
                className="w-full h-32 p-2 border rounded"
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">Save Note</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <Button onClick={() => setIsAdding(true)}>Add New Note</Button>
      )}

      {notes.length === 0 && !isAdding ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No notes yet. Click &quot;Add New Note&quot; to create one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={editNote}
              onDelete={deleteNote}
            />
          ))}
        </div>
      )}
    </div>
  );
} 