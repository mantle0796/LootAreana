'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface GlowCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
}

export function GlowCard({ children, className = '', ...props }: GlowCardProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
      <div className="relative">{children}</div>
    </motion.div>
  );
}

interface FloatingElementProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
}

export function FloatingElement({ children, delay = 0, className = '', ...props }: FloatingElementProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -20, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface ShimmerTextProps {
  children: ReactNode;
  className?: string;
}

export function ShimmerText({ children, className = '' }: ShimmerTextProps) {
  return (
    <motion.div
      className={`relative inline-block ${className}`}
      initial={{ backgroundPosition: '200% center' }}
      animate={{ backgroundPosition: '-200% center' }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'linear',
      }}
      style={{
        backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
      }}
    >
      {children}
    </motion.div>
  );
}
