'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth';
import { LoadingScreen } from '@/components/ui/loading';

// Navigation items for the sidebar
const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '📊' },
  { name: 'Notes', path: '/notes', icon: '📝' },
  { name: 'To-Do List', path: '/todos', icon: '✓' },
  { name: 'Planner', path: '/planner', icon: '📅' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Show loading state
  if (loading) {
    return <LoadingScreen />;
  }

  // Only render dashboard for authenticated users
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b py-4 sticky top-0 bg-background z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">KaamKar</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Hello, {user.displayName || user.email}
            </span>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-grow">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-card hidden md:block sticky top-[61px] h-[calc(100vh-61px)] overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Menu</h2>
            <nav className="space-y-1">
              {navItems.map((item) => {
                // Check if the current path matches this navigation item
                const isActive = typeof window !== 'undefined' && window.location.pathname === item.path;
                
                return (
                  <Link 
                    key={item.path} 
                    href={item.path}
                    className={`flex items-center px-4 py-2 rounded-md w-full hover:bg-muted transition-colors ${
                      isActive ? 'bg-primary/10 text-primary' : ''
                    }`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow">
          <div className="container mx-auto py-8 px-4">
            {/* Mobile Navigation (only visible on small screens) */}
            <div className="grid grid-cols-2 gap-2 mb-6 md:hidden">
              {navItems.map((item) => {
                // Check if the current path matches this navigation item
                const isActive = typeof window !== 'undefined' && window.location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg ${
                      isActive ? 'bg-primary/10 border-primary' : 'bg-card'
                    }`}
                  >
                    <span className="text-2xl mb-1">{item.icon}</span>
                    <span className="text-sm">{item.name}</span>
                  </Link>
                );
              })}
            </div>
            
            {/* Page Content */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 