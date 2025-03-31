# 🚀 KaamKar - Your All-in-One Productivity Suite

KaamKar is a comprehensive productivity suite designed to help you manage tasks, notes, finances, and goals. Stay organized, focused, and achieve more every day.

**Live Demo:** [https://kaamkar-ct31.onrender.com/](https://kaamkar-ct31.onrender.com/)

## ✨ Features

- **📋 Task Management** - Organize and prioritize your tasks with our intuitive todo system. Track deadlines and progress effortlessly.
- **📝 Smart Notes** - Take rich notes with markdown support, organize them with tags, and find them instantly with powerful search.
- **📅 Daily Planner** - Plan your day with our calendar integration. Set reminders and never miss important deadlines.
- **💰 Finance Tracker** - Monitor expenses, create budgets, and get insights into your spending patterns with beautiful charts.
- **🎯 Goal Setting** - Set SMART goals, break them down into actionable tasks, and track your progress over time.
- **📊 Progress Analytics** - Visualize your productivity with detailed analytics. Identify patterns and optimize your workflow.
- **🤖 AI-Powered Assistance** - Get intelligent suggestions for your notes and tasks using Google's Gemini AI.

## 🛠️ Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Authentication & Database**: [Firebase 11](https://firebase.google.com/)
- **State Management**: React Context API
- **AI Features**: [Google's Generative AI (Gemini)](https://ai.google.dev/)
- **Rich Text Editing**: [TipTap](https://tiptap.dev/)
- **Date & Time**: [date-fns 4](https://date-fns.org/)
- **Charts**: [Chart.js](https://www.chartjs.org/) with [react-chartjs-2](https://react-chartjs-2.js.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/)
- **Deployment**: [Render](https://render.com)

## 🚀 Getting Started

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
   Create a `.env.local` file in the root directory with the following variables:

   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
   NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="your-measurement-id"

   # Firebase Admin Configuration (Server Side)
   FIREBASE_CLIENT_EMAIL="your-client-email"
   FIREBASE_PRIVATE_KEY="your-private-key"

   # Gemini AI Configuration
   GEMINI_API_KEY="your-gemini-api-key"
   NEXT_PUBLIC_GEMINI_API_KEY="your-gemini-api-key"
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔧 Firebase Setup

1. Create a new Firebase project at [firebase.google.com](https://firebase.google.com/)
2. Enable the following services:
   - Authentication (with Email/Password provider)
   - Firestore Database
   - Storage (optional, for file uploads)
3. Create a web app in your Firebase project and copy the configuration values to your `.env.local` file
4. For server-side functionality, generate a service account key from Project Settings > Service Accounts and add the values to your `.env.local` file

## 🧠 Setting up Gemini AI

KaamKar uses Google's Gemini AI for intelligent assistance features. Follow these steps to set it up:

1. **Get a Gemini API Key**: 
   - Visit [Google AI Studio](https://aistudio.google.com/apikey)
   - Sign in with your Google account
   - Create a new API key

2. **Add to Environment Variables**:
   - Open `.env.local` in your project root
   - Add: 
     ```
     GEMINI_API_KEY="your-api-key-here"
     NEXT_PUBLIC_GEMINI_API_KEY="your-api-key-here"
     ```

3. **Update the Package**:
   - Ensure you have the latest version:
   ```bash
   npm install @google/generative-ai@latest
   ```

## 📂 Project Structure

- `app/`: Next.js App Router pages and layouts
  - `(dashboard)/`: Protected dashboard routes and components
  - `(auth)/`: Authentication pages
  - `(marketing)/`: Public marketing pages
- `components/`: Reusable UI components
  - `ui/`: Core UI components
  - `notes/`: Notes-related components
  - `finance/`: Finance tracker components
  - `layout/`: Layout components like Header, Sidebar
- `lib/`: Utility functions and services
  - `firebase/`: Firebase services and helpers
  - `geminiAI.ts`: AI functionality
  - `utils.ts`: General utility functions
- `context/`: React context providers
  - `AuthContext.tsx`: Authentication state management

## 🚢 Deployment

The project is configured for easy deployment on Render. Connect your GitHub repository to Render and it will automatically deploy your application.

## 🔐 Security Notes

- Never commit your `.env.local` file to version control
- Set up proper Firebase security rules to protect your data
- For production, ensure that you set up proper CORS rules and API rate limiting

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Google Generative AI](https://ai.google.dev/)
- [Render](https://render.com/)
