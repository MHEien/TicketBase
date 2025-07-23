import { motion } from 'framer-motion';
import * as React from 'react';

export const UserAnimation = React.forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className="w-full h-full bg-indigo-600 relative">
      <div className="flex items-center justify-center py-10">
        <motion.div
          style={{
            width: '50px',
            height: '50px',
            backgroundColor: 'white',
          }}
          animate={{
            scale: [1, 2, 2, 1, 1],
            rotate: [0, 0, 180, 180, 0],
            borderRadius: ['0%', '0%', '50%', '50%', '0%'],
          }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
            times: [0, 0.2, 0.5, 0.8, 1],
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />
      </div>
      <div className="px-2 py-2 w-full bg-indigo-700 text-white/60 text-xs text-center">
        This is a React Component + Framer motion
      </div>
    </div>
  );
});