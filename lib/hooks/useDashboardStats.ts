import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

export interface DashboardStats {
  notes: { total: number; recent: number };
  todos: { total: number; completed: number };
  planner: { upcoming: number; today: number };
  finance: { expenses: number; budget: number };
  goals: { active: number; completed: number };
}

export const useDashboardStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    notes: { total: 0, recent: 0 },
    todos: { total: 0, completed: 0 },
    planner: { upcoming: 0, today: 0 },
    finance: { expenses: 0, budget: 0 },
    goals: { active: 0, completed: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get today's start and end timestamps
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const todayStart = Timestamp.fromDate(today);
        const todayEnd = Timestamp.fromDate(tomorrow);

        // Get last 7 days timestamp for recent notes
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        const lastWeekTimestamp = Timestamp.fromDate(lastWeek);

        // Fetch notes stats
        const notesQuery = query(
          collection(db, 'notes'),
          where('userId', '==', user.uid)
        );
        const recentNotesQuery = query(
          collection(db, 'notes'),
          where('userId', '==', user.uid),
          where('updatedAt', '>=', lastWeekTimestamp)
        );
        const [notesSnapshot, recentNotesSnapshot] = await Promise.all([
          getDocs(notesQuery),
          getDocs(recentNotesQuery)
        ]);

        // Fetch todos stats
        const todosQuery = query(
          collection(db, 'todos'),
          where('userId', '==', user.uid)
        );
        const todosSnapshot = await getDocs(todosQuery);
        const completedTodos = todosSnapshot.docs.filter(doc => doc.data().completed).length;

        // Fetch planner stats
        const upcomingEventsQuery = query(
          collection(db, 'planner'),
          where('userId', '==', user.uid),
          where('date', '>=', todayStart)
        );
        const eventsSnapshot = await getDocs(upcomingEventsQuery);
        const todayEvents = eventsSnapshot.docs.filter(
          doc => {
            const eventDate = doc.data().date.toDate();
            return eventDate >= today && eventDate < tomorrow;
          }
        ).length;

        // Fetch finance stats
        const budgetQuery = query(
          collection(db, 'budget'),
          where('userId', '==', user.uid)
        );
        const expensesQuery = query(
          collection(db, 'expenses'),
          where('userId', '==', user.uid),
          where('date', '>=', Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth(), 1))),
          where('date', '<', Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth() + 1, 1)))
        );
        
        const [budgetSnapshot, expensesSnapshot] = await Promise.all([
          getDocs(budgetQuery),
          getDocs(expensesQuery)
        ]);

        const budgetData = budgetSnapshot.docs[0]?.data() || { amount: 0 };
        const totalExpenses = expensesSnapshot.docs.reduce((sum, doc) => {
          const expenseData = doc.data();
          return sum + (expenseData.amount || 0);
        }, 0);

        // Fetch goals stats
        const goalsQuery = query(
          collection(db, 'goals'),
          where('userId', '==', user.uid)
        );
        const goalsSnapshot = await getDocs(goalsQuery);
        const completedGoals = goalsSnapshot.docs.filter(doc => doc.data().completed).length;

        setStats({
          notes: {
            total: notesSnapshot.size,
            recent: recentNotesSnapshot.size
          },
          todos: {
            total: todosSnapshot.size,
            completed: completedTodos
          },
          planner: {
            upcoming: eventsSnapshot.size - todayEvents,
            today: todayEvents
          },
          finance: {
            expenses: totalExpenses,
            budget: budgetData.amount || 0
          },
          goals: {
            active: goalsSnapshot.size - completedGoals,
            completed: completedGoals
          }
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to fetch dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return { stats, loading, error };
}; 