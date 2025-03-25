import { NextResponse } from 'next/server';
import { generateResponse, summarizeText, suggestNoteImprovements, suggestTodoPriorities } from '@/lib/geminiAI';

export async function POST(request: Request) {
  try {
    // Log environment info in development
    if (process.env.NODE_ENV === 'development') {
      const apiKey = process.env.GEMINI_API_KEY;
      console.log('[GeminiAI API] Environment check:', {
        hasApiKey: Boolean(apiKey),
        keyStart: apiKey ? `${apiKey.substring(0, 5)}...` : 'none',
        nodeEnv: process.env.NODE_ENV
      });
    }
    
    // Check if the API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error('[GeminiAI API] Missing API key in environment variables');
      return NextResponse.json(
        { error: 'Gemini API key is not configured. Please add GEMINI_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { action, data } = body;
    
    // Log incoming request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[GeminiAI API] Request received: action=${action}`);
    }
    
    let result: string;
    
    switch (action) {
      case 'generate':
        if (!data.prompt) {
          return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }
        result = await generateResponse(data.prompt);
        break;
        
      case 'summarize':
        if (!data.text) {
          return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }
        result = await summarizeText(data.text);
        break;
        
      case 'improveNote':
        if (!data.title || !data.content) {
          return NextResponse.json({ error: 'Note title and content are required' }, { status: 400 });
        }
        result = await suggestNoteImprovements(data.title, data.content);
        break;
        
      case 'prioritizeTodos':
        if (!data.todos || !Array.isArray(data.todos)) {
          return NextResponse.json({ error: 'Todos array is required' }, { status: 400 });
        }
        result = await suggestTodoPriorities(data.todos);
        break;
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[GeminiAI API] Success: action=${action}, result length=${result.length}`);
    }
    
    return NextResponse.json({ result });
  } catch (error) {
    console.error('[GeminiAI API] Error:', error);
    
    // Provide a detailed error message
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to process AI request';
      
    // If the error contains "API key", provide a more helpful message
    const finalMessage = errorMessage.includes('API key') 
      ? 'Gemini API key issue: Please check that your API key is valid and properly configured in .env.local'
      : errorMessage;
    
    // Add debugging info in development
    const responseData = { 
      error: finalMessage,
      timestamp: new Date().toISOString()
    };
    
    if (process.env.NODE_ENV === 'development') {
      Object.assign(responseData, {
        debug: {
          hasApiKey: Boolean(process.env.GEMINI_API_KEY),
          errorType: error instanceof Error ? error.constructor.name : typeof error,
          stack: error instanceof Error ? error.stack?.split('\n').slice(0, 3) : null
        }
      });
    }
      
    return NextResponse.json(responseData, { status: 500 });
  }
} 