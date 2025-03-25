'use client';

import { useState } from 'react';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { GeminiErrorNotice } from './GeminiErrorNotice';

export function GeminiAssistant() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showErrorNotice, setShowErrorNotice] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    
    setLoading(true);
    setResponse('');
    setShowErrorNotice(false);
    
    try {
      const res = await fetch('/api/gemini-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate',
          data: { prompt }
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to get AI response');
      }
      
      const data = await res.json();
      setResponse(data.result);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setShowErrorNotice(true);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to get response from AI');
      toast.error('Failed to get response from AI');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-10">
      {expanded ? (
        <Card className="w-80 shadow-lg">
          <CardHeader className="pb-2 pt-4 px-4 flex flex-row justify-between items-center">
            <CardTitle className="text-sm flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-primary" />
              Gemini Assistant
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={() => setExpanded(false)}
            >
              &times;
            </Button>
          </CardHeader>
          <CardContent className="p-4">
            {showErrorNotice && (
              <div className="mb-3">
                <GeminiErrorNotice message={errorMessage} />
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-3">
              <Textarea
                placeholder="Ask me anything..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="resize-none h-20"
              />
              
              {response && (
                <div className="bg-muted p-3 rounded-md text-sm overflow-y-auto max-h-40">
                  {response}
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || !prompt.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Button 
          onClick={() => setExpanded(true)} 
          className="rounded-full h-12 w-12 p-2"
        >
          <Sparkles className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
} 