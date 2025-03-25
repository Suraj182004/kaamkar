'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  // Define the widgets to display on the dashboard
  const widgets = [
    { 
      title: 'Notes', 
      description: 'Create and manage your notes here.', 
      path: '/notes', 
      icon: '📝' 
    },
    { 
      title: 'To-Do List', 
      description: 'Manage your tasks and track progress.', 
      path: '/todos', 
      icon: '✓' 
    },
    { 
      title: 'Daily Planner', 
      description: 'Plan your day and schedule events.',
      path: '/planner', 
      icon: '📅'
    }
  ];

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Dashboard Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {widgets.map((widget) => (
          <div 
            key={widget.path}
            className="bg-card p-6 rounded-lg shadow-sm border"
          >
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl">{widget.icon}</span>
              <h2 className="text-xl font-semibold">{widget.title}</h2>
            </div>
            <p className="text-muted-foreground mb-4">{widget.description}</p>
            <Button asChild>
              <Link href={widget.path}>
                View {widget.title}
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </>
  );
} 