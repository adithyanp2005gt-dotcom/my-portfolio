import React from 'react';
import { motion } from 'framer-motion';
import { Container, Section, Grid, Stack, SectionHeading } from '../components/layout/LayoutPrimitives';
import { fadeUp, staggerContainer } from '../constants/animations';

export const Philosophy: React.FC = () => {
  const principles = [
    {
      num: '01',
      title: 'Maintainability',
      text: 'Build systems that are simple to maintain and easy to extend.'
    },
    {
      num: '02',
      title: 'Performance-First',
      text: 'Performance is not an afterthought; it is a core feature of the design.'
    },
    {
      num: '03',
      title: 'Reliability Over Complexity',
      text: 'A working, reliable system is infinitely superior to a complex, fragile one.'
    },
    {
      num: '04',
      title: 'Purposeful AI',
      text: 'AI should solve meaningful real-world problems rather than just demonstrate technology.'
    },
    {
      num: '05',
      title: 'Unified Systems',
      text: 'Embedded hardware and orchestrating software should feel like one seamless system.'
    }
  ];

  return (
    <Section id="philosophy">
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
              title="Engineering Mindset"
              subtitle="Philosophy & Guidelines"
            />
          </motion.div>

          <Grid cols="1-2" gap="xl" className="items-start">
            
            {/* Core Philosophy Statement */}
            <motion.div variants={fadeUp} className="max-w-md pr-0 md:pr-8">
              <span className="text-[10px] uppercase tracking-[0.2em] text-secondary opacity-60 mb-4 block">
                Core Philosophy
              </span>
              <p className="text-2xl md:text-3xl font-light leading-relaxed text-primary">
                "I believe software should feel effortless, hardware should feel reliable, and AI should solve real problems rather than simply demonstrate technology."
              </p>
            </motion.div>

            {/* Engineering Principles list */}
            <Stack spacing="md" className="border-l border-neutral-border pl-6 md:pl-12">
              <span className="text-[10px] uppercase tracking-[0.2em] text-secondary opacity-60 mb-2 block">
                Engineering Principles
              </span>
              
              {principles.map((pr, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  className="group py-4 flex items-start gap-6 border-b border-neutral-border last:border-none"
                >
                  <span className="font-mono text-sm text-accent font-medium leading-none pt-1">
                    {pr.num}
                  </span>
                  <div className="space-y-1">
                    <h4 className="text-base font-medium text-primary group-hover:text-accent transition-colors duration-300">
                      {pr.title}
                    </h4>
                    <p className="text-secondary font-light text-sm leading-relaxed max-w-lg">
                      {pr.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </Stack>

          </Grid>
        </motion.div>
      </Container>
    </Section>
  );
};
