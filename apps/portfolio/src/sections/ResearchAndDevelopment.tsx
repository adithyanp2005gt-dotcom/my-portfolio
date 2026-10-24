import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { rdProjects as staticRD } from '../data/rd';
import { RDProject } from '../types/portfolio';
import { Container, Section, SectionHeading, Grid, Stack } from '../components/layout/LayoutPrimitives';
import { fadeUp, staggerContainer } from '../constants/animations';

export const ResearchAndDevelopment: React.FC = () => {
  const [rdList, setRdList] = useState<RDProject[]>(staticRD);

  useEffect(() => {
    fetch('/api/v1/research')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setRdList(res.data);
        }
      })
      .catch(() => {
        console.warn('Research API offline. Operating on local static repository.');
      });
  }, []);

  const statusColors = {
    active: 'text-accent border-accent/20 bg-accent/5',
    experimental: 'text-purple-400 border-purple-400/20 bg-purple-400/5',
    completed: 'text-success border-success/20 bg-success/5'
  };

  return (
    <Section id="rd" className="border-t border-neutral-border">
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
              title="Research & Development"
              subtitle="Active Prototypes"
              description="A real-time snapshot of active lab work, low-power experiments, and embedded computing models currently under design."
            />
          </motion.div>

          {/* R&D Grid */}
          <Grid cols={2} gap="lg">
            {rdList.map((project) => (
              <motion.div
                key={project.id}
                variants={fadeUp}
                className="bg-surface border border-neutral-border p-6 md:p-8 rounded-[20px] shadow-premium hover:border-accent/30 transition-all duration-300 flex flex-col justify-between"
              >
                <Stack spacing="sm">
                  {/* Top: Title & Status */}
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-medium text-primary tracking-tight">
                      {project.title}
                    </h3>
                    <span className={`text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-[10px] border ${statusColors[project.status]} shrink-0 font-medium`}>
                      {project.status}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-secondary text-xs font-light leading-relaxed mt-2">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-neutral-border/30">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-bg text-secondary text-[9px] tracking-wider uppercase px-2.5 py-1 rounded-[10px] border border-neutral-border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Stack>
              </motion.div>
            ))}
          </Grid>

        </motion.div>
      </Container>
    </Section>
  );
};
