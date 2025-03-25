'use client';

import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface GeminiErrorNoticeProps {
  message?: string;
}

export function GeminiErrorNotice({ message }: GeminiErrorNoticeProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const defaultMessage = "The Gemini AI features aren't working correctly. This might be because you need to set up your API key.";
  const displayMessage = message || defaultMessage;
  
  // Determine error type based on message content
  let errorType = 'generic';
  if (message) {
    if (message.includes('API key') || message.includes('GEMINI_API_KEY')) {
      errorType = 'api-key';
    } else if (message.includes('404 Not Found') || message.includes('not found for API version') || message.includes('models/')) {
      errorType = 'model-not-found';
    } else if (message.includes('quota') || message.includes('429')) {
      errorType = 'quota';
    } else if (message.includes('network') || message.includes('connect') || message.includes('fetch failed')) {
      errorType = 'network';
    }
  }

  return (
    <div className="bg-destructive/15 border border-destructive text-destructive p-4 rounded-lg mb-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-medium mb-1">Gemini API Configuration Issue</h3>
          <p className="text-sm mb-3">{displayMessage}</p>
          <div className="text-sm space-y-2">
            <p className="font-medium">How to fix this:</p>
            
            {errorType === 'api-key' && (
              <ol className="list-decimal list-inside space-y-1">
                <li>Get a Gemini API key from <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="underline">https://aistudio.google.com/apikey</a></li>
                <li>Add the API key to your <code className="bg-destructive/10 px-1 rounded">.env.local</code> file:</li>
                <li><code className="bg-destructive/10 px-1 rounded">GEMINI_API_KEY=&quot;your-api-key-here&quot;</code></li>
                <li>Restart your Next.js development server</li>
              </ol>
            )}
            
            {errorType === 'model-not-found' && (
              <ol className="list-decimal list-inside space-y-1">
                <li>Update the Gemini AI package: <code className="bg-destructive/10 px-1 rounded">npm install @google/generative-ai@latest</code></li>
                <li>Check your API key has access to the models you&apos;re trying to use</li>
                <li>Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a> to verify your key permissions</li>
                <li>Try using a different model version (we&apos;re now trying multiple models automatically)</li>
                <li>For Gemini 2.0 access, make sure your API key has been granted access to Gemini 2.0 models</li>
                <li>Restart your Next.js development server</li>
              </ol>
            )}
            
            {errorType === 'quota' && (
              <ol className="list-decimal list-inside space-y-1">
                <li>Your API usage limit might have been reached</li>
                <li>Check your quota at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a></li>
                <li>Try again later or use a different API key</li>
              </ol>
            )}
            
            {errorType === 'network' && (
              <ol className="list-decimal list-inside space-y-1">
                <li>Check your internet connection</li>
                <li>Make sure your firewall isn&apos;t blocking requests to Google&apos;s API</li>
                <li>Gemini 2.0 models might be temporarily unavailable - try again later</li>
                <li>Try again in a few minutes</li>
              </ol>
            )}
            
            {errorType === 'generic' && (
              <ol className="list-decimal list-inside space-y-1">
                <li>Get a Gemini API key from <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a></li>
                <li>Add the API key to your <code className="bg-destructive/10 px-1 rounded">.env.local</code> file</li>
                <li>Update the package: <code className="bg-destructive/10 px-1 rounded">npm install @google/generative-ai@latest</code></li>
                <li>Make sure your API key has access to Gemini 2.0 models</li>
                <li>Restart your Next.js development server</li>
              </ol>
            )}
          </div>
          
          <div className="mt-4 pt-3 border-t border-destructive/20">
            <p className="text-xs mb-2">Error details:</p>
            <pre className="text-xs bg-destructive/10 p-2 rounded-sm overflow-x-auto">
              {message || 'No specific error message provided'}
            </pre>
          </div>
          
          <button 
            onClick={() => setDismissed(true)}
            className="text-xs mt-3 text-muted-foreground hover:text-destructive transition-colors"
          >
            Dismiss this notice
          </button>
        </div>
      </div>
    </div>
  );
} 