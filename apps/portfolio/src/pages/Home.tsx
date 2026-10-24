import React from 'react';
import { motion } from 'framer-motion';
import { Hero } from '../sections/Hero';
import { Philosophy } from '../sections/Philosophy';
import { SelectedProjects } from '../sections/SelectedProjects';
import { Achievements } from '../sections/Achievements';
import { Education } from '../sections/Education';
import { Skills } from '../sections/Skills';
import { ResearchAndDevelopment } from '../sections/ResearchAndDevelopment';
import { About } from '../sections/About';
import { Contact } from '../sections/Contact';

export const Home: React.FC = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="relative w-full"
    >
      <Hero />
      <Philosophy />
      <SelectedProjects />
      <Achievements />
      <Education />
      <Skills />
      <ResearchAndDevelopment />
      <About />
      <Contact />
    </motion.div>
  );
};
