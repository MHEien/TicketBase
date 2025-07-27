import React, {  } from 'react';
import '@measured/puck/puck.css';
import '../fullscreen-puck.css';
import { motion } from 'framer-motion';
import { Button } from '@repo/ui/components/ui/button';

export const FloatingActionButton = ({ 
    onClick, 
    icon: Icon, 
    label, 
    variant = "default",
    className = "",
    isActive = false 
  }: { 
    onClick: () => void; 
    icon: React.ElementType; 
    label: string; 
    variant?: "default" | "primary" | "secondary";
    className?: string;
    isActive?: boolean;
  }) => {
    const getVariantStyles = () => {
      if (isActive) return "bg-primary text-primary-foreground shadow-lg shadow-primary/25";
      switch (variant) {
        case "primary": return "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25";
        case "secondary": return "bg-secondary text-secondary-foreground hover:bg-secondary/80";
        default: return "bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground shadow-lg";
      }
    };
  
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={className}
      >
        <Button
          onClick={onClick}
          size="icon"
          className={`h-12 w-12 rounded-full transition-all duration-200 border-border/50 backdrop-blur-xl ${getVariantStyles()}`}
          title={label}
        >
          <Icon size={20} />
        </Button>
      </motion.div>
    );
  };