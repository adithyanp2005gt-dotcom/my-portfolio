import React from 'react';
import { motion } from 'framer-motion';
import { Target, Terminal, Cpu, Network } from 'lucide-react';
import { Container, Section, SectionHeading, Grid, Stack } from '../components/layout/LayoutPrimitives';
import { fadeUp, staggerContainer } from '../constants/animations';

export const About: React.FC = () => {
  const journeyTimeline = [
    {
      icon: <Terminal size={14} />,
      year: 'Phase 1',
      title: 'First Embedded Systems Project',
      text: 'Discovered microcontrollers, programmed direct register access on 8-bit MCUs, and built custom serial communication scripts.'
    },
    {
      icon: <Network size={14} />,
      year: 'Phase 2',
      title: 'Started Exploring AI',
      text: 'Implemented computer vision pipelines using OpenCV, PyTorch, and optimized networks for object classification tasks.'
    },
    {
      icon: <Cpu size={14} />,
      year: 'Phase 3',
      title: 'Built Intelligent Automation Systems',
      text: 'Integrated neural networks directly on edge gateways, routing multi-node telemetry networks over wireless links.'
    },
    {
      icon: <Target size={14} />,
      year: 'Phase 4',
      title: 'Current Research Focus',
      text: 'Designing local LLM systems, hardware co-processors, and dual-core RTOS schedulers to reduce loop latency.'
    }
  ];

  return (
    <Section id="about" className="border-t border-neutral-border">
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Section Heading */}
          <motion.div variants={fadeUp}>
            <SectionHeading
              title="Engineering Journey"
              subtitle="About Me"
            />
          </motion.div>

          <Grid cols="2-1" gap="xl" className="items-start">
            
            {/* Left: Bio and Concise Timeline */}
            <Stack spacing="lg">
              
              {/* Introduction */}
              <motion.div variants={fadeUp} className="max-w-2xl">
                <p className="text-secondary font-light text-base leading-relaxed">
                  I am an AI and ML engineer focusing on building intelligent systems, neural network models, and edge computing solutions. My research and projects explore computer vision pipelines, localized LLMs, automated architectures, and smart robotics. I believe in designing software that is clean, scalable, and engineered with precision.
                </p>
                <p className="text-secondary font-light text-base leading-relaxed mt-4">
                  With a solid engineering and computer science foundation, my approach combines deep learning architectures, efficient model quantization, and real-time execution to solve complex technical problems.
                </p>
              </motion.div>

              {/* Journey Timeline */}
              <div className="border-t border-neutral-border/30 pt-10">
                <span className="text-[10px] uppercase tracking-[0.2em] text-secondary opacity-60 mb-6 block">
                  Chronological Journey
                </span>
                
                <div className="relative border-l border-neutral-border/50 ml-4 pl-8 py-2 space-y-8">
                  {journeyTimeline.map((item, idx) => (
                    <motion.div key={idx} variants={fadeUp} className="relative">
                      {/* Bullet icon */}
                      <div className="absolute -left-[44px] top-1 w-6 h-6 rounded-full bg-bg border border-neutral-border flex items-center justify-center text-secondary">
                        {item.icon}
                      </div>
                      
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase tracking-wider text-accent font-mono block">
                          {item.year}
                        </span>
                        <h4 className="text-base font-medium text-primary">
                          {item.title}
                        </h4>
                        <p className="text-secondary font-light text-xs leading-relaxed max-w-xl">
                          {item.text}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

            </Stack>

            {/* Right: Portrait Photo */}
            <motion.div
              variants={fadeUp}
              className="bg-surface border border-neutral-border p-4 rounded-[20px] shadow-premium flex items-center justify-center select-none"
            >
              <Stack spacing="md" className="items-center w-full">
                {/* Photo Container */}
                <div className="w-full aspect-[3/4] bg-bg rounded-[16px] border border-neutral-border/60 overflow-hidden relative group">
                  <img
                    src="/profile.jpg"
                    alt="ADITHYAN P - AI & ML Engineer"
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />
                </div>

                <div className="text-center w-full pb-1">
                  <span className="text-xs uppercase tracking-wider text-primary font-medium block">
                    ADITHYAN P
                  </span>
                  <span className="text-[10px] text-secondary opacity-75 uppercase tracking-widest mt-0.5 block">
                    AI & ML Engineer
                  </span>
                </div>
              </Stack>
            </motion.div>

          </Grid>
        </motion.div>
      </Container>
    </Section>
  );
};
