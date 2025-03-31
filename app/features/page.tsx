'use client';

import { motion } from 'framer-motion';
import { Nav } from '@/components/layout/nav';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle, Clock, LineChart, PenSquare, Target, Wallet, Zap, Shield, Users, Search, Bell, ArrowRight } from 'lucide-react';

const features = [
  {
    title: 'Task Management',
    description: 'Organize and prioritize your tasks with our intuitive todo system.',
    icon: CheckCircle,
    color: 'bg-blue-500/10 text-blue-500',
    details: [
      'Create, organize, and track tasks effortlessly',
      'Set priorities and deadlines',
      'Add subtasks and checklists',
      'Track task progress and completion',
    ],
  },
  {
    title: 'Smart Notes',
    description: 'Take rich notes with markdown support and powerful organization.',
    icon: PenSquare,
    color: 'bg-green-500/10 text-green-500',
    details: [
      'Rich text editor with markdown support',
      'Organize notes with tags and categories',
      'Quick search and filter functionality',
      'Auto-save and version history',
    ],
  },
  {
    title: 'Daily Planner',
    description: 'Plan your day effectively with our calendar integration.',
    icon: Clock,
    color: 'bg-purple-500/10 text-purple-500',
    details: [
      'Calendar integration for scheduling',
      'Set reminders and notifications',
      'Daily, weekly, and monthly views',
      'Recurring task support',
    ],
  },
  {
    title: 'Finance Tracker',
    description: 'Monitor expenses and maintain budgets with powerful insights.',
    icon: Wallet,
    color: 'bg-yellow-500/10 text-yellow-500',
    details: [
      'Track income and expenses',
      'Create and manage budgets',
      'Visual reports and analytics',
      'Export financial data',
    ],
  },
  {
    title: 'Goal Setting',
    description: 'Set and track your personal and professional goals.',
    icon: Target,
    color: 'bg-red-500/10 text-red-500',
    details: [
      'Create SMART goals',
      'Break down goals into milestones',
      'Track progress over time',
      'Set goal reminders',
    ],
  },
  {
    title: 'Progress Analytics',
    description: 'Visualize your productivity with detailed analytics.',
    icon: LineChart,
    color: 'bg-indigo-500/10 text-indigo-500',
    details: [
      'Productivity trends and insights',
      'Task completion analytics',
      'Goal achievement tracking',
      'Custom reports and exports',
    ],
  },
];

const additionalFeatures = [
  { icon: Zap, title: 'Fast & Responsive', description: 'Lightning-fast performance across all devices' },
  { icon: Shield, title: 'Secure', description: 'Enterprise-grade security for your data' },
  { icon: Users, title: 'Collaboration', description: 'Share and collaborate with team members' },
  { icon: Search, title: 'Smart Search', description: 'Find anything instantly with powerful search' },
  { icon: Bell, title: 'Notifications', description: 'Stay updated with smart notifications' },
];

export default function FeaturesPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 -z-10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),transparent)]" style={{ opacity: 0.15 }} />
          </motion.div>
          <div className="max-w-7xl mx-auto text-center">
            <motion.h1
              className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-violet-600 to-indigo-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Powerful Features for Enhanced Productivity
            </motion.h1>
            <motion.p
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Everything you need to manage tasks, take notes, track finances, and achieve your goals.
              All in one beautifully designed platform.
            </motion.p>
          </div>
        </section>

        {/* Main Features */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 gap-12 lg:gap-16">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="flex flex-col lg:flex-row gap-8 items-start"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex-1">
                    <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-6`}>
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">{feature.title}</h2>
                    <p className="text-muted-foreground mb-6">{feature.description}</p>
                    <ul className="space-y-3">
                      {feature.details.map((detail, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <ArrowRight className="w-4 h-4 text-primary" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex-1 rounded-2xl border bg-card/50 p-6 lg:p-8">
                    {/* Placeholder for feature screenshot/demo */}
                    <div className="aspect-video rounded-lg bg-gradient-to-br from-primary/5 to-violet-600/5 flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">Feature Preview</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Features */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              className="text-3xl font-bold text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              And Much More
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {additionalFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="p-6 rounded-xl border bg-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <feature.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of users who are already enjoying these features.
              </p>
              <Button size="lg" className="bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90">
                <Link href="/register">Start Free Trial</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
} 