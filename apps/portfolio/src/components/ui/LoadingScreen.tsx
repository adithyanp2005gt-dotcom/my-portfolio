import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const hasVisited = localStorage.getItem('adithyan_portfolio_visited');
    
    if (hasVisited) {
      // Skip loader immediately for returning visitors
      setLoading(false);
      onComplete();
      return;
    }

    // Standard loading sequence for first-time visitors
    const duration = 1000; // 1 second loader
    const intervalTime = 10;
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setLoading(false);
            localStorage.setItem('adithyan_portfolio_visited', 'true');
            onComplete();
          }, 200); // Faint delay for visual smooth finish
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  if (!loading) return null;

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
          }}
          className="fixed inset-0 bg-[#090909] z-[100] flex flex-col items-center justify-center select-none"
        >
          <div className="flex flex-col items-center max-w-xs w-full px-6">
            
            {/* SVG Monogram AL with elegant fade-in */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-16 h-16 mb-8"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full">
                <rect width="100" height="100" rx="20" fill="#141414" stroke="#252525" strokeWidth="1" />
                <motion.path
                  d="M30 75 L50 25 L70 75 L85 75 M40 50 L60 50"
                  stroke="#4F8CFF"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              </svg>
            </motion.div>

            {/* Subdued branding indicator */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-[10px] uppercase tracking-[0.3em] text-[#9A9A9A] font-medium mb-4 block text-center"
            >
              Initialising Environment
            </motion.span>

            {/* Thin animated loading progress line */}
            <div className="w-full h-[1px] bg-neutral-border overflow-hidden rounded-full relative">
              <motion.div
                className="h-full bg-accent absolute left-0 top-0"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
