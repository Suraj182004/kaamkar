'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Note, addNote, getUserNotes, updateNote, deleteNote } from '@/lib/firebase/notes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Timestamp } from 'firebase/firestore';
import { Loader2, Plus, Pencil, Trash2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { GeminiAssistant } from '@/components/common/GeminiAssistant';
import { GeminiErrorNotice } from '@/components/common/GeminiErrorNotice';

export default function NotesPage() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [showAiError, setShowAiError] = useState(false);
  const [aiErrorMessage, setAiErrorMessage] = useState('');

  // Fetch notes on component mount
  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const fetchedNotes = await getUserNotes(user.uid);
      setNotes(fetchedNotes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async () => {
    if (!user) return;
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      await addNote({
        title,
        content,
        userId: user.uid
      });
      
      setTitle('');
      setContent('');
      setIsDialogOpen(false);
      toast.success('Note created successfully');
      fetchNotes();
    } catch (error) {
      console.error('Error creating note:', error);
      toast.error('Failed to create note');
    }
  };

  const handleUpdateNote = async () => {
    if (!editingNote || !user) return;
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      await updateNote(editingNote.id as string, {
        title,
        content
      });
      
      setEditingNote(null);
      setTitle('');
      setContent('');
      setIsDialogOpen(false);
      toast.success('Note updated successfully');
      fetchNotes();
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('Failed to update note');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!user) return;
    
    try {
      await deleteNote(noteId);
      toast.success('Note deleted successfully');
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    }
  };

  const openCreateDialog = () => {
    setTitle('');
    setContent('');
    setEditingNote(null);
    setAiSuggestion('');
    setIsDialogOpen(true);
  };

  const openEditDialog = (note: Note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingNote(note);
    setAiSuggestion('');
    setIsDialogOpen(true);
  };

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return '';
    
    try {
      return new Date(timestamp.seconds * 1000).toLocaleString();
    } catch {
      return '';
    }
  };

  const getAiSuggestions = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title first');
      return;
    }
    
    setLoadingAi(true);
    setAiSuggestion('');
    setShowAiError(false);
    
    try {
      const res = await fetch('/api/gemini-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'improveNote',
          data: { 
            title, 
            content: content || 'No content yet.' 
          }
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to get AI suggestions');
      }
      
      const data = await res.json();
      setAiSuggestion(data.result);
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      setShowAiError(true);
      setAiErrorMessage(error instanceof Error ? error.message : 'Failed to get AI suggestions');
      toast.error('Failed to get AI suggestions');
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Notes</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Note
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center my-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
          <h2 className="text-xl font-semibold mb-2">No Notes Yet</h2>
          <p className="text-muted-foreground mb-4">
            Create your first note to get started
          </p>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <Card key={note.id} className="overflow-hidden h-full flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-start">
                  <span className="truncate">{note.title}</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  {note.updatedAt ? formatDate(note.updatedAt) : ''}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow overflow-auto">
                <p className="whitespace-pre-wrap">{note.content}</p>
              </CardContent>
              <CardFooter className="pt-2 flex justify-between">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(note)}>
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteNote(note.id as string)}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingNote ? 'Edit Note' : 'Create Note'}</DialogTitle>
            <DialogDescription>
              {editingNote ? 'Update your note details below.' : 'Add a new note to your collection.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium flex justify-between items-center">
                <span>Content</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={getAiSuggestions}
                  disabled={loadingAi}
                  type="button"
                  className="h-8"
                >
                  {loadingAi ? (
                    <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5 mr-1" />
                  )}
                  Get AI Suggestions
                </Button>
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note here..."
                className="min-h-[150px]"
              />
              
              {aiSuggestion && (
                <div className="mt-2 p-3 bg-primary/5 border border-primary/20 rounded-md">
                  <h4 className="text-sm font-medium flex items-center mb-1">
                    <Sparkles className="h-3.5 w-3.5 mr-1 text-primary" />
                    AI Suggestions
                  </h4>
                  <div className="text-sm whitespace-pre-wrap">{aiSuggestion}</div>
                </div>
              )}
              
              {showAiError && (
                <div className="mt-2">
                  <GeminiErrorNotice message={aiErrorMessage} />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={editingNote ? handleUpdateNote : handleCreateNote}>
              {editingNote ? 'Update Note' : 'Create Note'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <GeminiAssistant />
    </div>
  );
} 