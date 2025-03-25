import { GoogleGenerativeAI } from '@google/generative-ai';

// Helper to safely get the API key with better debugging
function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY || '';
  
  // Debug info in development - this helps identify if the key is loaded
  if (process.env.NODE_ENV === 'development' && typeof window === 'undefined') {
    if (!key) {
      console.warn('[GeminiAI] WARNING: GEMINI_API_KEY is not set in environment variables');
    } else {
      console.log('[GeminiAI] API key is configured (first 5 chars):', key.substring(0, 5) + '...');
    }
  }
  
  return key;
}

// This API key should be set as GEMINI_API_KEY in .env.local
// Note: This key is only available on the server-side, not in client components
const apiKey = getApiKey();

// Initialize the Google Generative AI with your API key
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// List of available models - if one fails, we can try the next one
const AVAILABLE_MODELS = [
  'gemini-2.0-pro',       // Try Gemini 2.0 Pro first
  'gemini-2.0-flash',     // Then try Gemini 2.0 Flash
  'gemini-2.0-vision',    // Vision model for any image-related content
  'gemini-1.5-pro',       // Fall back to 1.5 if needed
  'gemini-pro',           // Older models as final fallbacks
  'gemini-pro-vision'
];

/**
 * Generate a response using Gemini AI
 */
export async function generateResponse(prompt: string): Promise<string> {
  try {
    if (!genAI) {
      throw new Error('Gemini API key is not configured. Please add GEMINI_API_KEY to your .env.local file.');
    }
    
    // Try each model in order until one works
    let lastError = null;
    
    for (const modelName of AVAILABLE_MODELS) {
      try {
        console.log(`[GeminiAI] Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          // Add additional configuration
          generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
          }
        });
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log(`[GeminiAI] Successfully used model: ${modelName}`);
        return text;
      } catch (err) {
        console.warn(`[GeminiAI] Failed with model ${modelName}:`, err);
        lastError = err;
        // Continue to the next model
      }
    }
    
    // If we get here, all models failed
    throw lastError || new Error('All available Gemini models failed');
    
  } catch (error) {
    console.error('[GeminiAI] Error generating AI response:', error);
    
    // Enhance error messages for common issues
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Invalid or missing Gemini API key. Please check your .env.local file.');
      }
      
      if (error.message.includes('404 Not Found') || error.message.includes('models/')) {
        throw new Error('Gemini API model not found. This might be due to an API version mismatch. Please update the @google/generative-ai package or check your API key.');
      }
      
      if (error.message.includes('429') || error.message.includes('quota')) {
        throw new Error('Gemini API quota exceeded or rate limited. Please try again later or check your usage limits.');
      }
      
      if (error.message.includes('network') || error.message.includes('connect')) {
        throw new Error('Network error connecting to Gemini API. Please check your internet connection.');
      }
    }
    
    throw error;
  }
}

/**
 * Summarize text using Gemini AI
 */
export async function summarizeText(text: string): Promise<string> {
  const prompt = `Please summarize the following text concisely:
  
  ${text}
  
  Provide a summary that captures the main points.`;
  
  return generateResponse(prompt);
}

/**
 * Generate improvement suggestions for a note
 */
export async function suggestNoteImprovements(noteTitle: string, noteContent: string): Promise<string> {
  const prompt = `I have a note with the title "${noteTitle}" and the following content:
  
  ${noteContent}
  
  Please suggest 2-3 ways I could improve or expand on this note. Be concise and practical.`;
  
  return generateResponse(prompt);
}

/**
 * Prioritize a list of todos
 */
export async function suggestTodoPriorities(todos: string[]): Promise<string> {
  const todoList = todos.map(todo => `- ${todo}`).join('\n');
  
  const prompt = `Here's my todo list:
  
  ${todoList}
  
  Please help me prioritize these tasks by suggesting which ones I should do first, second, etc. 
  Explain your reasoning briefly.`;
  
  return generateResponse(prompt);
} 