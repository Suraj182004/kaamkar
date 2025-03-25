import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // SECURITY NOTE: We're only exposing non-sensitive information about environment variables
    // We don't return the actual values, only check if they exist and their first few characters
    
    const envVars = {
      // Gemini
      GEMINI_API_KEY: checkEnvVar('GEMINI_API_KEY'),
      
      // Firebase public vars
      NEXT_PUBLIC_FIREBASE_API_KEY: checkEnvVar('NEXT_PUBLIC_FIREBASE_API_KEY'),
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: checkEnvVar('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: checkEnvVar('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
      
      // Node environment
      NODE_ENV: process.env.NODE_ENV || 'not set',
    };
    
    return NextResponse.json({
      status: 'success',
      message: 'Environment variables check',
      envVars,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error checking environment variables:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error checking environment variables',
    }, { status: 500 });
  }
}

// Helper function to safely check environment variables without exposing full values
function checkEnvVar(name: string) {
  const value = process.env[name];
  
  if (!value) {
    return { exists: false, preview: null };
  }
  
  // For API keys, only show first and last few characters
  if (name.includes('KEY') || name.includes('SECRET')) {
    const firstChars = value.substring(0, 3);
    const lastChars = value.substring(value.length - 3);
    return { 
      exists: true, 
      length: value.length,
      preview: `${firstChars}...${lastChars}`,
    };
  }
  
  // For other values, show a bit more
  return { 
    exists: true, 
    length: value.length,
    preview: value.length > 10 ? `${value.substring(0, 10)}...` : value
  };
} 