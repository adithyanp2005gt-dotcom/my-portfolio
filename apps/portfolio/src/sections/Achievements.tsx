import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { achievementsList as staticAchievements } from '../data/achievements';
import { Project } from '../types/portfolio';
import { Container, Section, SectionHeading, Grid, Stack } from '../components/layout/LayoutPrimitives';
import { CustomImage } from '../components/ui/CustomImage';
import { fadeUp, staggerContainer } from '../constants/animations';

export const Achievements: React.FC = () => {
  const [achievements] = useState<Project[]>(staticAchievements);

  if (!achievements || achievements.length === 0) {
    return null;
  }

  return (
    <Section id="achievements" className="border-t border-neutral-border">
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={fadeUp}>
            <SectionHeading
              title="Achievements & Awards"
              subtitle="Recognition"
              description="Milestones, competitive wins, and prestigious recognitions earned through innovation and engineering excellence."
            />
          </motion.div>

          <Stack spacing="xl">
            {achievements.map((achievement, idx) => (
              <motion.div
                key={achievement.id}
                variants={fadeUp}
                className="group relative bg-surface border border-neutral-border p-6 md:p-10 rounded-[20px] shadow-premium transition-all duration-500 hover:border-accent/40"
              >
                <Grid cols="1-2" gap="lg" className="items-center">
                  <Link to={`/projects/${achievement.slug}`} className="block overflow-hidden rounded-[20px] outline-none">
                    <CustomImage
                      src={achievement.imageUrl}
                      alt={achievement.title}
                      aspectRatio="video"
                      className="group-hover:scale-[1.01] transition-transform duration-1000 ease-premium"
                    />
                  </Link>

                  <Stack spacing="md" className="justify-center">
                    <div>
                      <span className="font-mono text-xs text-accent font-medium uppercase tracking-wider block mb-2 flex items-center gap-2">
                        <Trophy size={14} /> 0{idx + 1} // Achievement Showcase
                      </span>
                      <h3 className="text-3xl font-semibold text-primary tracking-tight group-hover:text-accent transition-colors duration-300">
                        {achievement.title}
                      </h3>
                      <p className="text-secondary text-sm font-light mt-4 leading-relaxed">
                        {achievement.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {achievement.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-bg text-secondary text-[10px] tracking-wider uppercase px-3.5 py-1.5 rounded-[12px] border border-neutral-border"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4 border-t border-neutral-border/30">
                      <Link
                        to={`/projects/${achievement.slug}`}
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary border border-neutral-border px-5 py-2.5 rounded-[20px] hover:border-accent hover:text-accent transition-colors duration-300"
                      >
                        <FileText size={14} /> Explore Case Study
                      </Link>
                    </div>
                  </Stack>
                </Grid>
              </motion.div>
            ))}
          </Stack>
        </motion.div>
      </Container>
    </Section>
  );
};
