import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { skillCategories as staticSkills } from '../data/skills';
import { SkillCategory } from '../types/portfolio';
import { Container, Section, SectionHeading, Grid, Stack } from '../components/layout/LayoutPrimitives';
import { fadeUp, staggerContainer } from '../constants/animations';

export const Skills: React.FC = () => {
  const [categories, setCategories] = useState<SkillCategory[]>(staticSkills);

  useEffect(() => {
    fetch('/api/v1/skills')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setCategories(res.data);
        }
      })
      .catch(() => {
        console.warn('Skills API offline. Operating on local static repository.');
      });
  }, []);

  return (
    <Section id="skills" className="border-t border-neutral-border">
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
              title="Expertise Registry"
              subtitle="Skills & Capabilities"
              description="A categorized directory of technical expertise across firmware architecture, intelligence systems deployment, and web platforms."
            />
          </motion.div>

          {/* Grouped Skills Grid */}
          <Grid cols={2} gap="lg">
            {categories.map((category, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="bg-surface border border-neutral-border p-8 rounded-[20px] shadow-premium flex flex-col justify-between hover:border-accent/30 transition-all duration-300"
              >
                <Stack spacing="sm">
                  <div>
                    {/* Category Title */}
                    <h3 className="text-xl font-medium tracking-tight text-primary">
                      {category.name}
                    </h3>
                    {/* Category Description */}
                    <p className="text-secondary text-xs font-light mt-2 leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                  
                  {/* Skill Chips */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-neutral-border/30">
                    {category.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-bg text-primary text-[10px] tracking-wider uppercase px-3 py-1.5 rounded-[12px] border border-neutral-border hover:border-accent hover:text-accent transition-colors duration-300"
                      >
                        {skill}
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

