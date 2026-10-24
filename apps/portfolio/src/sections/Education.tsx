import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, GraduationCap, Award, BookOpen } from 'lucide-react';
import { educationList as staticEducation } from '../data/education';
import { TimelineItem } from '../types/portfolio';
import { Container, Section, SectionHeading, Stack, Grid } from '../components/layout/LayoutPrimitives';
import { fadeUp, staggerContainer } from '../constants/animations';

export const Education: React.FC = () => {
  const [eduList, setEduList] = useState<TimelineItem[]>(staticEducation);

  useEffect(() => {
    fetch('/api/v1/education')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setEduList(res.data);
        }
      })
      .catch(() => {
        console.warn('Education API offline. Operating on local static repository.');
      });
  }, []);

  return (
    <Section id="education" className="border-t border-neutral-border">
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
              title="Academic Journey"
              subtitle="Education & Credentials"
            />
          </motion.div>

          {/* Timeline Items */}
          <div className="relative border-l border-neutral-border ml-4 md:ml-8 pl-8 md:pl-12 py-2 space-y-16">
            
            {eduList.map((edu) => (
              <motion.div
                key={edu.id}
                variants={fadeUp}
                className="relative"
              >
                {/* Timeline Bullet Anchor */}
                <div className="absolute -left-[44px] md:-left-[60px] top-1.5 w-6 h-6 rounded-full bg-bg border border-accent flex items-center justify-center text-accent">
                  <GraduationCap size={12} />
                </div>

                <div className="space-y-6">
                  {/* Meta Specs */}
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-xs text-secondary opacity-60 mb-2 font-mono uppercase">
                      <Calendar size={12} /> {edu.duration}
                    </span>
                    <h3 className="text-2xl font-medium tracking-tight text-primary">
                      {edu.roleOrDegree}
                    </h3>
                    <span className="text-sm text-accent uppercase tracking-wider block mt-1">
                      {edu.institutionOrCompany}
                    </span>
                  </div>

                  {/* Split achievements / coursework */}
                  <Grid cols="1-2" gap="lg" className="border-t border-neutral-border/30 pt-6">
                    
                    {/* Coursework & Certs */}
                    <Stack spacing="md">
                      {edu.coursework && (
                        <div className="space-y-3">
                          <span className="text-[10px] uppercase tracking-[0.2em] text-secondary opacity-60 flex items-center gap-2">
                            <BookOpen size={12} /> Core Focus Coursework
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {edu.coursework.map((course) => (
                              <span
                                key={course}
                                className="bg-surface/50 text-secondary text-[10px] tracking-wider uppercase px-3 py-1 rounded-[12px] border border-neutral-border"
                              >
                                {course}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {edu.certifications && (
                        <div className="space-y-3 pt-2">
                          <span className="text-[10px] uppercase tracking-[0.2em] text-secondary opacity-60 flex items-center gap-2">
                            <Award size={12} /> Key Certifications
                          </span>
                          <ul className="space-y-2">
                            {edu.certifications.map((cert, idx) => (
                              <li key={idx} className="text-secondary font-light text-xs flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent opacity-50" /> {cert}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </Stack>

                    {/* Achievements */}
                    <div className="space-y-3">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-secondary opacity-60 flex items-center gap-2">
                        <Award size={12} /> Selected Academic Achievements
                      </span>
                      <ul className="space-y-3 pl-4">
                        {edu.achievements.map((ach, idx) => (
                          <li key={idx} className="text-secondary font-light text-sm leading-relaxed list-disc marker:text-accent">
                            {ach}
                          </li>
                        ))}
                      </ul>
                    </div>

                  </Grid>
                </div>
              </motion.div>
            ))}

          </div>

        </motion.div>
      </Container>
    </Section>
  );
};

