# KaamKar - Your Productivity Hub

KaamKar is an all-in-one productivity application built with Next.js, Firebase, and Shadcn UI. It provides features for note-taking, to-do lists, planning, and tracking various aspects of your life.

## Features

- **User Authentication**: Secure login and registration with Firebase
- **Dashboard**: Central hub for quick access to all tools
- **Notes**: Create, edit, and organize your notes with AI assistance
- **To-Do List**: Manage tasks with priorities and due dates
- **Daily Planner**: Schedule your days and events
- **AI Assistant**: Get intelligent suggestions and assistance using Google's Gemini 2.0 AI
- **Progress Tracker**: (Coming soon) Monitor your goals and achievements
- **Finance Tracker**: Track income, expenses, and manage your budgets
- **Food Tracker**: (Coming soon) Monitor your diet and nutrition

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **UI Components**: Shadcn UI
- **Authentication & Database**: Firebase
- **AI Features**: Google's Generative AI (Gemini 2.0)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- Gemini API key

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/kaamkar.git
   cd kaamkar
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   - Create a `.env.local` file based on the `.env.example`
   - Add your Firebase configuration values
   - Add your Gemini API key (get one from https://aistudio.google.com/apikey)

4. Run the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Setting up Gemini AI

KaamKar uses Google's Gemini AI for intelligent assistance features. Follow these steps to set it up:

1. **Get a Gemini API Key**: 
   - Visit [Google AI Studio](https://aistudio.google.com/apikey)
   - Sign in with your Google account
   - Create a new API key
   - Note: For Gemini 2.0 access, you may need to apply for early access or wait for public release

2. **Add to Environment Variables**:
   - Open `.env.local` in your project root
   - Add: `GEMINI_API_KEY="your-api-key-here"`

3. **Update the Package**:
   - Ensure you have the latest version:
   ```bash
   npm install @google/generative-ai@latest
   ```

### Troubleshooting Gemini API Issues

If you encounter a "404 Not Found" error or "model not found for API version" error:

1. Make sure you're using the latest version of the `@google/generative-ai` package
2. Check that your API key is correctly set in `.env.local`
3. Verify your API key has access to the models you're trying to use
4. The application will automatically try multiple models (gemini-2.0-pro, gemini-1.5-pro, etc.) to find one that works
5. If you specifically want to use Gemini 2.0:
   - Make sure your API key has been granted access to Gemini 2.0 models
   - These models might still be in limited availability
   - Check Google AI Studio for your access status

## Project Structure

- `app/`: Next.js App Router pages and layouts
- `components/`: Reusable UI components
  - `notes/`: Notes-related components
  - `todos/`: To-do list components
  - `common/`: Shared components
- `lib/`: Utility functions and services
  - `firebase.ts`: Firebase initialization
  - `auth.ts`: Authentication helpers
  - `geminiAI.ts`: AI functionality
- `context/`: React context providers
  - `AuthContext.tsx`: Authentication state management

## Deployment

The project is configured for easy deployment on Vercel. Connect your GitHub repository to Vercel and it will automatically deploy your application.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Google Generative AI](https://ai.google.dev/)
