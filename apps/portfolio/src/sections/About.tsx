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

            {/* Right: Abstract Schematic Portrait Placeholder */}
            <motion.div
              variants={fadeUp}
              className="bg-surface border border-neutral-border p-6 rounded-[20px] shadow-premium flex items-center justify-center select-none"
            >
              <Stack spacing="md" className="items-center w-full">
                {/* SVG Blueprint Schematic Portrait */}
                <div className="w-full aspect-[3/4] bg-bg rounded-[16px] border border-neutral-border flex items-center justify-center relative overflow-hidden">
                  
                  {/* Faint Grid Lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,%23161616_1px,transparent_1px),linear-gradient(to_bottom,%23161616_1px,transparent_1px)] bg-[size:20px_20px]" />
                  
                  {/* Schematic Node Layout */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260" className="w-4/5 h-4/5 relative z-10">
                    <circle cx="100" cy="130" r="40" stroke="#252525" strokeWidth="1" fill="none" />
                    <circle cx="100" cy="130" r="60" stroke="#252525" strokeWidth="1" strokeDasharray="4 4" fill="none" />
                    
                    {/* Node Connections */}
                    <line x1="100" y1="30" x2="100" y2="230" stroke="#252525" strokeWidth="1" />
                    <line x1="30" y1="130" x2="170" y2="130" stroke="#252525" strokeWidth="1" />
                    
                    {/* Center AL Monogram */}
                    <rect x="75" y="105" width="50" height="50" rx="10" fill="#141414" stroke="#4F8CFF" strokeWidth="1.5" />
                    <path d="M85 140 L100 115 L115 140 L122 140 M92 130 L108 130" stroke="#F5F5F5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    
                    {/* Floating Sensor Nodes */}
                    <circle cx="100" cy="30" r="5" fill="#4F8CFF" />
                    <circle cx="100" cy="230" r="5" fill="#3DDC84" />
                    <circle cx="30" cy="130" r="5" fill="#9A9A9A" />
                    <circle cx="170" cy="130" r="5" fill="#9A9A9A" />

                    {/* Sensor Labels */}
                    <text x="100" y="20" fill="#9A9A9A" fontSize="8" fontFamily="sans-serif" textAnchor="middle">AI_ENGINE</text>
                    <text x="100" y="245" fill="#9A9A9A" fontSize="8" fontFamily="sans-serif" textAnchor="middle">MCU_IO</text>
                    <text x="25" y="120" fill="#9A9A9A" fontSize="8" fontFamily="sans-serif" textAnchor="end">SPI</text>
                    <text x="175" y="120" fill="#9A9A9A" fontSize="8" fontFamily="sans-serif" textAnchor="start">I2C</text>
                  </svg>

                </div>

                <div className="text-center w-full">
                  <span className="text-xs uppercase tracking-wider text-primary font-medium block">
                    AL_SCHEMATIC_01
                  </span>
                  <span className="text-[10px] text-secondary opacity-60 uppercase tracking-widest mt-1 block">
                    systems engineering block
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
