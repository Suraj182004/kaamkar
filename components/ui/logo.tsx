import { motion } from 'framer-motion';

export function Logo({ className = '', size = 'default' }: { className?: string; size?: 'small' | 'default' | 'large' }) {
  const sizes = {
    small: 'w-6 h-6',
    default: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <motion.div
      className={`relative ${sizes[size]} ${className}`}
      initial={{ rotate: -90, opacity: 0 }}
      animate={{ rotate: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg transform rotate-3" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-violet-600 rounded-lg" />
      <span className="relative flex items-center justify-center w-full h-full text-white font-bold">
        K
      </span>
    </motion.div>
  );
} 