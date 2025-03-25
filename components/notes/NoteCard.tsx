'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NoteCardProps {
  note: Note;
  onEdit: (id: string, title: string, content: string) => void;
  onDelete: (id: string) => void;
}

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  const handleSave = () => {
    if (title.trim() && content.trim()) {
      onEdit(note.id, title, content);
      setIsEditing(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-1 text-lg font-medium border rounded"
            placeholder="Note title"
            autoFocus
          />
        ) : (
          <CardTitle>{note.title}</CardTitle>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-32 p-2 border rounded"
            placeholder="Write your note here..."
          />
        ) : (
          <div className="whitespace-pre-wrap">
            {note.content}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground">
          {note.updatedAt.toLocaleString()}
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button size="sm" onClick={handleSave}>Save</Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(note.id)}>Delete</Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
} 