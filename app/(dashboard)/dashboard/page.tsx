'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useDashboardStats } from '@/lib/hooks/useDashboardStats';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user } = useAuth();
  const { stats, loading, error } = useDashboardStats();

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const StatCard = ({ title, value, subtitle, icon }: { title: string; value: string | number; subtitle: string; icon: string }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span className="text-2xl">{icon}</span>
      </CardHeader>
      <CardContent>
        {loading ? (
          <>
            <Skeleton className="h-8 w-20 mb-2" />
            <Skeleton className="h-4 w-32" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </>
        )}
      </CardContent>
    </Card>
  );

  const FeatureCard = ({ 
    title, 
    description, 
    icon, 
    link 
  }: { 
    title: string; 
    description: string; 
    icon: string; 
    link: string;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <>
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-9 w-full" />
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
            <Button asChild className="w-full">
              <Link href={link}>View {title}</Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back, {user?.displayName || 'User'}!</p>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Tasks"
          value={stats.todos.total - stats.todos.completed}
          subtitle={`${stats.todos.completed} completed of ${stats.todos.total} total`}
          icon="✓"
        />
        <StatCard
          title="Today's Events"
          value={stats.planner.today}
          subtitle={`${stats.planner.upcoming} upcoming events`}
          icon="📅"
        />
        <StatCard
          title="Budget Status"
          value={`$${stats.finance.expenses}`}
          subtitle={`of $${stats.finance.budget} budget`}
          icon="💰"
        />
        <StatCard
          title="Active Goals"
          value={stats.goals.active}
          subtitle={`${stats.goals.completed} goals completed`}
          icon="🎯"
        />
      </div>

      {/* Feature Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          title="Notes"
          description={`You have ${stats.notes.recent} recent notes and ${stats.notes.total} total notes.`}
          icon="📝"
          link="/notes"
        />
        <FeatureCard
          title="To-Do List"
          description={`${stats.todos.completed} of ${stats.todos.total} tasks completed.`}
          icon="✓"
          link="/todos"
        />
        <FeatureCard
          title="Daily Planner"
          description={`${stats.planner.today} events today, ${stats.planner.upcoming} upcoming.`}
          icon="📅"
          link="/planner"
        />
        <FeatureCard
          title="Progress Tracker"
          description={`${stats.goals.active} active goals, ${stats.goals.completed} achieved.`}
          icon="🎯"
          link="/progress"
        />
        <FeatureCard
          title="Finance Tracker"
          description={`$${stats.finance.expenses} spent of $${stats.finance.budget} budget.`}
          icon="💰"
          link="/finance"
        />

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/todos/new">Add New Task</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/notes/new">Create Note</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/planner/new">Schedule Event</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 