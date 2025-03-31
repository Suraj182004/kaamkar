import { GoogleGenerativeAI } from '@google/generative-ai';

// Helper to safely get the API key with better debugging
function getApiKey(): string {
  const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
  
  // Debug info in development
  if (process.env.NODE_ENV === 'development') {
    if (!key) {
      console.warn('[GeminiAI] WARNING: NEXT_PUBLIC_GEMINI_API_KEY is not set in environment variables');
    } else {
      console.log('[GeminiAI] API key is configured');
    }
  }
  
  return key;
}

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(getApiKey());

// List of available models - if one fails, we can try the next one
const AVAILABLE_MODELS = [
  'gemini-pro',           // Start with the stable model
  'gemini-1.5-pro',       // Then try newer models
  'gemini-1.0-pro',
  'gemini-pro-vision'     // Vision model as last resort
];

/**
 * Format markdown text to HTML with proper styling
 */
function formatMarkdownToHtml(text: string): string {
  // First, let's normalize line endings and clean up any existing HTML
  text = text
    .replace(/\r\n/g, '\n')
    .replace(/<[^>]*>/g, ''); // Strip any existing HTML
  
  // Split into blocks
  const blocks = text.split('\n\n');
  
  // Process each block
  const processedBlocks = blocks.map(block => {
    let processed = block.trim();
    if (!processed) return '';
    
    // Headers (process these first)
    if (processed.match(/^#{1,3} /)) {
      processed = processed
        .replace(/^# (.*$)/gm, '<h2 class="text-xl font-bold mb-3">$1</h2>')
        .replace(/^## (.*$)/gm, '<h3 class="text-lg font-semibold mb-2">$1</h3>')
        .replace(/^### (.*$)/gm, '<h4 class="text-base font-semibold mb-2">$1</h4>');
      return processed;
    }
    
    // Lists
    if (processed.match(/^[-*+] /m)) {
      // Split into lines and process each line
      const lines = processed.split('\n');
      let inList = false;
      let currentList: string[] = [];
      const lists: string[] = [];
      
      lines.forEach(line => {
        if (line.match(/^[-*+] /)) {
          if (!inList) {
            inList = true;
            currentList = [];
          }
          // Process the list item content
          let item = line.replace(/^[-*+] /, '');
          // Handle inline formatting
          item = item
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
          currentList.push(`<li class="mb-1.5">${item}</li>`);
        } else if (inList) {
          // End current list
          lists.push(`<ul class="list-disc pl-4 mb-3">${currentList.join('\n')}</ul>`);
          inList = false;
          currentList = [];
        }
      });
      
      // Handle any remaining list items
      if (inList && currentList.length > 0) {
        lists.push(`<ul class="list-disc pl-4 mb-3">${currentList.join('\n')}</ul>`);
      }
      
      return lists.join('\n');
    }
    
    // Process inline formatting for non-list blocks
    processed = processed
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    
    // Wrap in paragraph if not already wrapped
    if (!processed.match(/^<[^>]+>/)) {
      processed = `<p class="mb-3">${processed}</p>`;
    }
    
    return processed;
  });
  
  // Filter out empty blocks and join
  return processedBlocks.filter(block => block.trim()).join('\n');
}

/**
 * Generate a response using Gemini AI
 */
export async function generateResponse(prompt: string, formatHtml: boolean = false): Promise<string> {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error('Gemini API key is not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your .env.local file.');
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
        return formatHtml ? formatMarkdownToHtml(text) : text;
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
        throw new Error('Invalid or missing Gemini API key. Please check your .env.local file and ensure NEXT_PUBLIC_GEMINI_API_KEY is set.');
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
  
  Format your response using this structure:
  
  # Summary
  
  **Key Points:**
  - First key point
  - Second key point
  - Third key point
  
  **Details:**
  - Important details or context
  - Additional relevant information`;
  
  return generateResponse(prompt, true);
}

/**
 * Generate improvement suggestions for a note
 */
export async function suggestNoteImprovements(noteTitle: string, noteContent: string): Promise<string> {
  const prompt = `I have a note with the title "${noteTitle}" and the following content:
  
  ${noteContent}
  
  Please suggest ways to improve this note. Format your response using this structure:
  
  # Improvement Suggestions
  
  **1. First Suggestion**
  - Clear explanation of what to improve
  - Specific examples or recommendations
  - How this improvement helps
  
  **2. Second Suggestion**
  - Clear explanation of what to improve
  - Specific examples or recommendations
  - How this improvement helps
  
  **3. Additional Recommendations**
  - Quick tips for enhancement
  - Optional improvements to consider`;
  
  return generateResponse(prompt, true);
}

/**
 * Prioritize a list of todos
 */
export async function suggestTodoPriorities(todos: string[]): Promise<string> {
  const todoList = todos.map(todo => `- ${todo}`).join('\n');
  
  const prompt = `Here's my todo list:
  
  ${todoList}
  
  Please help me prioritize these tasks. Format your response using this structure:
  
  # Task Prioritization
  
  **High Priority**
  - Task: [Name]
  - Why: [Brief explanation]
  - Timeline: [Suggested timing]
  
  **Medium Priority**
  - Task: [Name]
  - Why: [Brief explanation]
  - Timeline: [Suggested timing]
  
  **Low Priority**
  - Task: [Name]
  - Why: [Brief explanation]
  - Timeline: [Suggested timing]
  
  # Strategy
  Brief explanation of the prioritization approach.`;
  
  return generateResponse(prompt, true);
} 