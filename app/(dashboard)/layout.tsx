'use client';

import { Header } from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

// Navigation items for the sidebar
const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '📊' },
  { name: 'Notes', path: '/notes', icon: '📝' },
  { name: 'To-Do List', path: '/todos', icon: '✓' },
  { name: 'Planner', path: '/planner', icon: '📅' },
  { name: 'Progress Tracker', path: '/progress', icon: '🎯' },
  { name: 'Finance Tracker', path: '/finance', icon: '💰' }
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
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Only render dashboard for authenticated users
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-grow">
        <Sidebar />
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