import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects as staticProjects } from '../data/projects';
import { Project } from '../types/portfolio';
import { Container, Section, SectionHeading, Grid, Stack } from '../components/layout/LayoutPrimitives';
import { CustomImage } from '../components/ui/CustomImage';
import { fadeUp, staggerContainer } from '../constants/animations';

export const SelectedProjects: React.FC = () => {
  const [projectsList, setProjectsList] = useState<Project[]>(staticProjects);

  useEffect(() => {
    fetch('/api/v1/projects?public=true')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setProjectsList(res.data);
        }
      })
      .catch(() => {
        console.warn('Projects API offline. Operating on local static repository.');
      });
  }, []);

  return (
    <Section id="projects" className="border-t border-neutral-border">
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
              title="Selected Projects"
              subtitle="Featured Work"
              description="A curated showcase of engineering prototypes combining hardware design, local artificial intelligence execution, and robust systems architecture."
            />
          </motion.div>

          {/* Full-viewport-like Project Showcases */}
          <Stack spacing="xl">
            {projectsList.map((project, idx) => (
              <motion.div
                key={project.id}
                variants={fadeUp}
                className="group relative bg-surface border border-neutral-border p-6 md:p-10 rounded-[20px] shadow-premium transition-all duration-500 hover:border-accent/40"
              >
                <Grid cols="1-2" gap="lg" className="items-center">
                  
                  {/* Left Column: Visual Mockup with dynamic hover zoom link */}
                  <Link to={`/projects/${project.slug}`} className="block overflow-hidden rounded-[20px] outline-none">
                    <CustomImage
                      src={project.imageUrl}
                      alt={project.title}
                      aspectRatio="video"
                      className="group-hover:scale-[1.01] transition-transform duration-1000 ease-premium"
                    />
                  </Link>

                  {/* Right Column: Storytelling Specs */}
                  <Stack spacing="md" className="justify-center">
                    <div>
                      {/* Project Index indicator */}
                      <span className="font-mono text-xs text-accent font-medium uppercase tracking-wider block mb-2">
                        0{idx + 1} // Project case study
                      </span>
                      <h3 className="text-3xl font-semibold text-primary tracking-tight group-hover:text-accent transition-colors duration-300">
                        {project.title}
                      </h3>
                      <p className="text-secondary text-sm font-light mt-4 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* Tech Chip Tags */}
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-bg text-secondary text-[10px] tracking-wider uppercase px-3.5 py-1.5 rounded-[12px] border border-neutral-border"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-wrap gap-4 pt-4 border-t border-neutral-border/30">
                      <Link
                        to={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary border border-neutral-border px-5 py-2.5 rounded-[20px] hover:border-accent hover:text-accent transition-colors duration-300"
                      >
                        <FileText size={14} /> Explore Case Study
                      </Link>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-secondary hover:text-primary transition-colors duration-300"
                      >
                        <Github size={14} /> Inspect Repository
                      </a>
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

