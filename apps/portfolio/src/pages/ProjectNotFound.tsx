import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container } from '../components/layout/LayoutPrimitives';
import { pageTransition } from '../constants/animations';

export const ProjectNotFound: React.FC = () => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen bg-bg text-primary flex items-center justify-center font-sans"
    >
      <Container className="max-w-md text-center py-12">
        <div className="mb-8 inline-flex items-center justify-center w-16 h-16 rounded-[20px] bg-surface border border-neutral-border">
          <svg
            className="w-8 h-8 text-accent animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-xl font-medium tracking-tight mb-4 uppercase">
          Case Study Unresolved
        </h1>
        <p className="text-secondary font-light text-sm mb-8 leading-relaxed">
          The project identifier provided in the URL does not exist in our engineering registry database.
        </p>
        <Link
          to="/#projects"
          className="inline-flex items-center justify-center font-sans font-medium text-xs tracking-wider uppercase bg-primary text-bg px-6 py-3 rounded-[20px] border border-primary hover:bg-transparent hover:text-primary transition-all duration-300"
        >
          View Selected Projects
        </Link>
      </Container>
    </motion.div>
  );
};
