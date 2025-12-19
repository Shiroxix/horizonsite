import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
  delay?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hoverEffect = false, 
  onClick,
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      whileHover={hoverEffect ? { scale: 1.02, boxShadow: "0 0 25px rgba(155, 0, 255, 0.15)" } : {}}
      onClick={onClick}
      className={`glass-panel rounded-xl p-6 relative overflow-hidden transition-colors ${className} ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brawl-blue via-brawl-purple to-brawl-yellow opacity-50" />
      {children}
    </motion.div>
  );
};
