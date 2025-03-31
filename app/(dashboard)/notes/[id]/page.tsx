'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getNoteById, updateNote, addNote } from '@/lib/firebase/notes';
import { suggestNoteImprovements } from '@/lib/geminiAI';
import { FormattedContent } from '@/components/notes/FormattedContent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, Save, ArrowLeft, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { debounce } from 'lodash';
import RichTextEditor from '@/components/notes/RichTextEditor';
import CategoryManager from '@/components/notes/CategoryManager';

export default function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [autoSuggest, setAutoSuggest] = useState(false);

  // Fetch note data when component mounts or params change
  useEffect(() => {
    const fetchNote = async () => {
      if (!user || resolvedParams.id === 'new') {
        setLoading(false);
        return;
      }

      try {
        const fetchedNote = await getNoteById(resolvedParams.id);
        if (fetchedNote) {
          setTitle(fetchedNote.title || '');
          setContent(fetchedNote.content || '');
          setSelectedCategory(fetchedNote.categoryId || null);
          
          // If there's existing content, trigger AI suggestions if auto-suggest is enabled
          if (autoSuggest && fetchedNote.content) {
            debouncedGetSuggestions(fetchedNote.title, fetchedNote.content);
          }
        } else {
          toast.error('Note not found');
          router.push('/notes');
        }
      } catch (error) {
        console.error('Error fetching note:', error);
        toast.error('Failed to load note');
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [user, resolvedParams.id, router, autoSuggest]);

  // Debounced function for auto-suggestions
  const debouncedGetSuggestions = debounce(async (title: string, content: string) => {
    if (!title.trim() || !content.trim()) return;
    
    try {
      setLoadingAi(true);
      const suggestions = await suggestNoteImprovements(title, content);
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      toast.error('Failed to get AI suggestions');
    } finally {
      setLoadingAi(false);
    }
  }, 2000);

  // Effect for auto-suggestions
  useEffect(() => {
    if (autoSuggest && title.trim() && content.trim()) {
      debouncedGetSuggestions(title, content);
    }
    return () => {
      debouncedGetSuggestions.cancel();
    };
  }, [title, content, autoSuggest]);

  useEffect(() => {
    debouncedGetSuggestions();
  }, [content, debouncedGetSuggestions]);

  useEffect(() => {
    debouncedGetSuggestions();
  }, [selectedText, debouncedGetSuggestions]);

  const handleSave = async () => {
    if (!user) return;
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    setSaving(true);
    try {
      if (resolvedParams.id === 'new') {
        await addNote({
          title: title.trim(),
          content,
          userId: user.uid,
          categoryId: selectedCategory,
        });
        toast.success('Note created successfully');
      } else {
        await updateNote(resolvedParams.id, {
          title: title.trim(),
          content,
          categoryId: selectedCategory,
        });
        toast.success('Note updated successfully');
      }
      router.push('/notes');
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const getAiSuggestions = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Please add some content first');
      return;
    }

    setLoadingAi(true);
    try {
      const suggestions = await suggestNoteImprovements(title, content);
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      toast.error('Failed to get AI suggestions');
    } finally {
      setLoadingAi(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/notes')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Notes
          </Button>
          <h1 className="text-3xl font-bold">
            {resolvedParams.id === 'new' ? 'New Note' : 'Edit Note'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoSuggest(!autoSuggest)}
            className={autoSuggest ? 'bg-primary/10' : ''}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Auto Suggest
          </Button>
          <Button
            variant="outline"
            onClick={getAiSuggestions}
            disabled={loadingAi || !title.trim() || !content.trim()}
          >
            {loadingAi ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Get AI Suggestions
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !title.trim()}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Note
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <Input
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-semibold"
          />

          <Card className="min-h-[500px] overflow-hidden">
            <div className="h-full">
              <RichTextEditor
                content={content}
                onChange={setContent}
              />
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <CategoryManager
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {aiSuggestions && (
            <Card className="p-4">
              <div className="flex items-center gap-2 text-primary mb-4">
                <Sparkles className="h-4 w-4" />
                <h3 className="font-semibold">AI Suggestions</h3>
              </div>
              <FormattedContent content={aiSuggestions} />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 