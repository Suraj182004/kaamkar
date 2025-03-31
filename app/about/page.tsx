'use client';

import { motion } from 'framer-motion';
import { Nav } from '@/components/layout/nav';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Award, Heart, BarChart, Users, Mail } from 'lucide-react';
import Image from 'next/image';

const stats = [
  { number: '2023', label: 'Founded', icon: Award },
  { number: '100%', label: 'Satisfaction', icon: Heart },
  { number: '24/7', label: 'Support', icon: Users },
  { number: '99.9%', label: 'Uptime', icon: BarChart },
];

const team = [
  {
    name: 'John Doe',
    role: 'Founder & CEO',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    description: 'Passionate about creating tools that enhance productivity and make work enjoyable.',
  },
  {
    name: 'Jane Smith',
    role: 'Head of Product',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
    description: 'Expert in user experience and product development with 10+ years of experience.',
  },
  {
    name: 'Mike Johnson',
    role: 'Lead Developer',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    description: 'Full-stack developer with a passion for creating scalable and efficient solutions.',
  },
];

export default function AboutPage() {
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
              About KaamKar
            </motion.h1>
            <motion.p
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              We&apos;re on a mission to help individuals and teams achieve more by providing powerful,
              intuitive tools for better productivity and organization.
            </motion.p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex justify-center mb-4">
                    <stat.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary">{stat.number}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Founded in 2023, KaamKar was born from a simple observation: people needed a better
                    way to manage their work and personal lives. We saw the struggle of juggling multiple
                    apps and tools, and decided to create a single, unified solution.
                  </p>
                  <p>
                    Our team of passionate developers and designers worked tirelessly to create an
                    intuitive platform that combines task management, note-taking, financial tracking,
                    and goal setting into one seamless experience.
                  </p>
                  <p>
                    Today, we&apos;re proud to help thousands of users stay organized, focused, and
                    productive. But we&apos;re just getting started - we continue to innovate and improve
                    our platform based on user feedback and emerging technologies.
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border bg-card/50 p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-violet-600/5" />
                <div className="relative">
                  <h3 className="text-2xl font-bold mb-4">Our Values</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      </span>
                      <div>
                        <h4 className="font-semibold">User-First Design</h4>
                        <p className="text-muted-foreground">Every feature is crafted with our users in mind</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      </span>
                      <div>
                        <h4 className="font-semibold">Continuous Innovation</h4>
                        <p className="text-muted-foreground">Always improving and adding new features</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      </span>
                      <div>
                        <h4 className="font-semibold">Privacy & Security</h4>
                        <p className="text-muted-foreground">Your data&apos;s security is our top priority</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-xl text-muted-foreground">
                The passionate people behind KaamKar
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  className="bg-card rounded-xl p-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary mb-3">{member.role}</p>
                  <p className="text-muted-foreground">{member.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Have questions or feedback? We&apos;d love to hear from you.
              </p>
              <Button size="lg" className="bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90">
                <Mail className="w-5 h-5 mr-2" />
                <Link href="mailto:contact@kaamkar.com">Contact Us</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
} 