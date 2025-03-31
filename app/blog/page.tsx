'use client';

import { motion } from 'framer-motion';
import { Nav } from '@/components/layout/nav';
import { Button } from '@/components/ui/button';
import { Clock, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const categories = [
  { name: 'Productivity', count: 12 },
  { name: 'Task Management', count: 8 },
  { name: 'Time Management', count: 6 },
  { name: 'Goal Setting', count: 5 },
  { name: 'Personal Finance', count: 4 },
];

const posts = [
  {
    title: '10 Tips to Boost Your Daily Productivity',
    excerpt: 'Learn the best practices and techniques to enhance your productivity and achieve more in less time.',
    category: 'Productivity',
    date: 'Mar 28, 2024',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=500',
  },
  {
    title: 'The Art of Task Management',
    excerpt: 'Master the skills of effective task management and learn how to prioritize your work for maximum efficiency.',
    category: 'Task Management',
    date: 'Mar 25, 2024',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&q=80&w=500',
  },
  {
    title: 'Setting SMART Goals for Success',
    excerpt: 'Discover how to set and achieve your goals using the SMART framework for better results.',
    category: 'Goal Setting',
    date: 'Mar 22, 2024',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1553034545-32d4cd2168f1?auto=format&fit=crop&q=80&w=500',
  },
  {
    title: 'Managing Personal Finances Effectively',
    excerpt: 'Learn practical tips and strategies for better financial management and budgeting.',
    category: 'Personal Finance',
    date: 'Mar 20, 2024',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=500',
  },
  {
    title: 'Time Management Techniques',
    excerpt: 'Explore proven techniques to manage your time more effectively and increase productivity.',
    category: 'Time Management',
    date: 'Mar 18, 2024',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=500',
  },
];

export default function BlogPage() {
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
              KaamKar Blog
            </motion.h1>
            <motion.p
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Insights, tips, and strategies to help you become more productive and organized.
            </motion.p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-xl font-semibold mb-4">Categories</h2>
                  <ul className="space-y-2">
                    {categories.map((category) => (
                      <li key={category.name}>
                        <Button
                          variant="ghost"
                          className="w-full justify-between text-muted-foreground hover:text-primary"
                        >
                          {category.name}
                          <span className="text-sm">{category.count}</span>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {posts.map((post, index) => (
                  <motion.article
                    key={post.title}
                    className="group rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all duration-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        width={500}
                        height={300}
                        className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readTime}
                        </span>
                        <span>{post.date}</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {post.excerpt}
                      </p>
                      <Button variant="ghost" className="group/btn">
                        Read More
                        <ChevronRight className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 mt-20 bg-muted/50">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Subscribe to Our Newsletter</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Get the latest productivity tips and insights delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 rounded-lg border bg-background"
                />
                <Button className="bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90">
                  Subscribe
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
} 
  );
} 