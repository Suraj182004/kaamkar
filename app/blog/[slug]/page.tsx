'use client';

import { motion } from 'framer-motion';
import { Nav } from '@/components/layout/nav';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, ChevronLeft, Share2, Bookmark } from 'lucide-react';
import Image from 'next/image';

// This would typically come from your CMS or database
const post = {
  title: '10 Tips to Boost Your Daily Productivity',
  excerpt: 'Learn the best practices and techniques to enhance your productivity and achieve more in less time.',
  content: `
    <h2>Introduction</h2>
    <p>In today's fast-paced world, productivity is more important than ever. Whether you're a student, professional, or entrepreneur, making the most of your time can be the difference between success and falling behind.</p>

    <h2>1. Start Your Day Right</h2>
    <p>The way you begin your day sets the tone for everything that follows. Create a morning routine that energizes and prepares you for the challenges ahead.</p>

    <h2>2. Use the Two-Minute Rule</h2>
    <p>If a task takes less than two minutes to complete, do it immediately. This prevents the accumulation of small tasks that can overwhelm you later.</p>

    <h2>3. Practice Time Blocking</h2>
    <p>Allocate specific time blocks for different activities. This helps maintain focus and prevents multitasking, which can reduce productivity by up to 40%.</p>

    <h2>4. Take Regular Breaks</h2>
    <p>The Pomodoro Technique suggests working for 25 minutes followed by a 5-minute break. This helps maintain high levels of focus and prevents burnout.</p>

    <h2>5. Organize Your Workspace</h2>
    <p>A clean and organized workspace reduces distractions and helps you maintain focus on important tasks.</p>
  `,
  category: 'Productivity',
  date: 'Mar 28, 2024',
  readTime: '5 min read',
  author: {
    name: 'Sarah Johnson',
    role: 'Productivity Expert',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
  },
  image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=1200',
  relatedPosts: [
    {
      title: 'The Art of Task Management',
      excerpt: 'Master the skills of effective task management and learn how to prioritize your work.',
      image: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&q=80&w=500',
      category: 'Task Management',
      date: 'Mar 25, 2024',
    },
    {
      title: 'Time Management Techniques',
      excerpt: 'Explore proven techniques to manage your time more effectively and increase productivity.',
      image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=500',
      category: 'Time Management',
      date: 'Mar 18, 2024',
    },
  ],
};

export default function BlogPost() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 -z-10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),transparent)]" style={{ opacity: 0.15 }} />
          </motion.div>
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              className="mb-8 hover:bg-transparent hover:text-primary"
              onClick={() => window.history.back()}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {post.category}
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">
                {post.title}
              </h1>
              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Image
                src={post.image}
                alt={post.title}
                width={1200}
                height={675}
                className="w-full rounded-xl mb-8"
              />
              <div className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              
              {/* Share and Save Buttons */}
              <div className="flex items-center gap-4 mt-12 pt-8 border-t">
                <Button variant="outline" className="flex-1">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Article
                </Button>
                <Button variant="outline" className="flex-1">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Save for Later
                </Button>
              </div>
            </motion.div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                {/* Author Info */}
                <motion.div
                  className="rounded-xl border p-6 bg-card"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h2 className="text-lg font-semibold mb-4">About the Author</h2>
                  <div className="flex items-center gap-4">
                    <Image
                      src={post.author.image}
                      alt={post.author.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium">{post.author.name}</h3>
                      <p className="text-sm text-muted-foreground">{post.author.role}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Related Posts */}
                <motion.div
                  className="rounded-xl border p-6 bg-card"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <h2 className="text-lg font-semibold mb-4">Related Posts</h2>
                  <div className="space-y-4">
                    {post.relatedPosts.map((relatedPost) => (
                      <div key={relatedPost.title} className="group">
                        <Image
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          width={500}
                          height={300}
                          className="w-full aspect-video rounded-lg object-cover mb-2"
                        />
                        <span className="text-xs text-primary">{relatedPost.category}</span>
                        <h3 className="font-medium group-hover:text-primary transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{relatedPost.date}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
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
              <h2 className="text-3xl font-bold mb-6">Enjoyed this article?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Subscribe to our newsletter for more productivity tips and insights.
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