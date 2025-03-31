'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Nav } from '@/components/layout/nav';
import { Logo } from '@/components/ui/logo';
import { useEffect } from 'react';
import { CheckCircle, Clock, LineChart, LucideIcon, PenSquare, Target, Wallet } from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Only redirect to dashboard on initial mount if user exists
  useEffect(() => {
    const isInitialMount = true;
    if (user && isInitialMount) {
      router.push('/dashboard');
    }
  }, []);  // Empty dependency array for initial mount only

  const features: Feature[] = [
    {
      title: 'Task Management',
      description: 'Organize and prioritize your tasks with our intuitive todo system. Track deadlines and progress effortlessly.',
      icon: CheckCircle,
      color: 'bg-blue-500/10 text-blue-500'
    },
    {
      title: 'Smart Notes',
      description: 'Take rich notes with markdown support, organize them with tags, and find them instantly with powerful search.',
      icon: PenSquare,
      color: 'bg-green-500/10 text-green-500'
    },
    {
      title: 'Daily Planner',
      description: 'Plan your day with our calendar integration. Set reminders and never miss important deadlines.',
      icon: Clock,
      color: 'bg-purple-500/10 text-purple-500'
    },
    {
      title: 'Finance Tracker',
      description: 'Monitor expenses, create budgets, and get insights into your spending patterns with beautiful charts.',
      icon: Wallet,
      color: 'bg-yellow-500/10 text-yellow-500'
    },
    {
      title: 'Goal Setting',
      description: 'Set SMART goals, break them down into actionable tasks, and track your progress over time.',
      icon: Target,
      color: 'bg-red-500/10 text-red-500'
    },
    {
      title: 'Progress Analytics',
      description: 'Visualize your productivity with detailed analytics. Identify patterns and optimize your workflow.',
      icon: LineChart,
      color: 'bg-indigo-500/10 text-indigo-500'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  // If user is logged in, don't render the landing page
  if (user) {
    return null;
  }

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
        {/* Hero Section */}
        <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 -z-10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),transparent)]" style={{ opacity: 0.15 }} />
            <div className="absolute inset-y-0 right-1/2 -left-72 bg-gradient-to-r from-primary/5 to-transparent transform rotate-12" />
            <div className="absolute inset-y-0 left-1/2 -right-72 bg-gradient-to-l from-violet-600/5 to-transparent transform -rotate-12" />
          </motion.div>
          <div className="relative max-w-7xl mx-auto">
            <div className="text-center">
              <motion.div 
                className="flex items-center justify-center gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Logo size="large" />
                <h1 className="text-4xl sm:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-violet-600 to-indigo-600">
                  KaamKar
                </h1>
              </motion.div>
              <motion.p 
                className="mt-6 text-xl sm:text-2xl max-w-2xl mx-auto text-muted-foreground leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Your all-in-one productivity suite for managing tasks, notes, finances, and goals.
                Stay organized, focused, and achieve more every day.
              </motion.p>
              <motion.div 
                className="mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Button size="lg" className="bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 h-12 px-8">
                  <Link href="/login">Get Started</Link>
                </Button>
                <Button variant="outline" size="lg" className="h-12 px-8">
                  <Link href="/register">Sign Up Free</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-600">
                Everything you need to stay productive
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                Powerful features designed to help you manage your work and life more effectively.
              </p>
            </motion.div>
            <motion.div 
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    variants={itemVariants}
                    className="relative group rounded-2xl border bg-card p-8 hover:shadow-lg transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-6`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/50 to-background relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="absolute inset-0 -z-10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),transparent)]" style={{ opacity: 0.15 }} />
            <div className="absolute inset-y-0 right-1/2 -left-72 bg-gradient-to-r from-primary/5 to-transparent transform -rotate-12" />
            <div className="absolute inset-y-0 left-1/2 -right-72 bg-gradient-to-l from-violet-600/5 to-transparent transform rotate-12" />
          </motion.div>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-600">
                Ready to boost your productivity?
              </h2>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                Join thousands of users who have transformed their work and life with KaamKar.
                Start your journey to better productivity today.
              </p>
              <Button size="lg" className="bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 h-12 px-8">
                <Link href="/login">Get Started Now</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Logo size="small" />
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-600">
                    KaamKar
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your all-in-one productivity solution for better task and life management.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8 md:col-span-2 md:grid-cols-3">
                <div>
                  <h3 className="font-semibold mb-3">Product</h3>
                  <ul className="space-y-2">
                    <li><Link href="/features" className="text-sm text-muted-foreground hover:text-primary">Features</Link></li>
                    <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary">Pricing</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Company</h3>
                  <ul className="space-y-2">
                    <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary">About</Link></li>
                    <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-primary">Blog</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Legal</h3>
                  <ul className="space-y-2">
                    <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy</Link></li>
                    <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms</Link></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} KaamKar. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}