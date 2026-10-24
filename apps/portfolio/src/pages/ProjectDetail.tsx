import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink, Cpu, Code2, Key } from 'lucide-react';
import { projects as staticProjects } from '../data/projects';
import { Project } from '../types/portfolio';
import { Container, Section, Grid, Stack } from '../components/layout/LayoutPrimitives';
import { CustomImage } from '../components/ui/CustomImage';
import { pageTransition, fadeIn, fadeUp, staggerContainer } from '../constants/animations';
import { ProjectNotFound } from './ProjectNotFound';
import { seo } from '../utils/seo';

export const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(() => {
    return staticProjects.find((p) => p.slug === slug || p.id === slug) || null;
  });
  const [loading, setLoading] = useState<boolean>(!project);

  // Scroll to top and fetch dynamic project from API if needed
  useEffect(() => {
    window.scrollTo(0, 0);
    if (slug) {
      fetch(`/api/v1/projects/${slug}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.success && res.data) {
            setProject(res.data);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-32 min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return <ProjectNotFound />;
  }

  // Generate dynamic SEO titles and metadata
  seo({
    title: `${project.title} | ADITHYAN P Case Study`,
    description: project.tagline,
    type: 'article'
  });

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="pt-24 min-h-screen bg-bg"
    >
      <Section className="!py-16 md:!py-24">
        <Container>
          
          {/* Back Button */}
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-secondary hover:text-accent transition-colors duration-300 mb-12 focus:outline-none"
          >
            <ArrowLeft size={14} /> Back to Projects
          </Link>

          {/* Project Header Case Study Overview */}
          <Grid cols="1-2" gap="lg" className="items-start mb-16">
            <Stack spacing="sm">
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-primary leading-tight">
                {project.title}
              </h1>
              <p className="text-accent text-sm tracking-wider uppercase font-medium">
                {project.tagline}
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary border border-neutral-border px-5 py-2.5 rounded-[20px] hover:border-accent hover:text-accent transition-colors duration-300"
                >
                  <Github size={14} /> Inspect Repository
                </a>
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-bg bg-primary px-5 py-2.5 rounded-[20px] hover:bg-transparent hover:text-primary border border-primary transition-colors duration-300"
                  >
                    <ExternalLink size={14} /> Live Showcase
                  </a>
                )}
              </div>
            </Stack>

            <div className="text-secondary font-light text-base md:text-lg leading-relaxed pt-2">
              <p>{project.overview}</p>
            </div>
          </Grid>

          {/* Large Showcase Mockup/Placeholder Image */}
          <motion.div variants={fadeIn} className="mb-24">
            <CustomImage src={project.imageUrl} alt={project.title} aspectRatio="video" />
          </motion.div>

          {/* Case Study Contents */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <Grid cols={2} gap="xl" className="border-t border-neutral-border pt-16 mb-24">
              {/* Problem */}
              <motion.div variants={fadeUp} className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" /> The Problem
                </span>
                <h3 className="text-2xl font-medium tracking-tight text-primary">Challenge Context</h3>
                <p className="text-secondary font-light leading-relaxed text-sm">
                  {project.problem}
                </p>
              </motion.div>

              {/* Goals */}
              <motion.div variants={fadeUp} className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" /> Key Goals
                </span>
                <h3 className="text-2xl font-medium tracking-tight text-primary">Objectives</h3>
                <ul className="space-y-3 pl-4">
                  {project.goals.map((goal, idx) => (
                    <li key={idx} className="text-secondary font-light leading-relaxed text-sm list-disc marker:text-accent">
                      {goal}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </Grid>

            {/* Research & System Architecture */}
            <Grid cols="1-2" gap="xl" className="border-t border-neutral-border pt-16 mb-24">
              <motion.div variants={fadeUp} className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" /> Exploration
                </span>
                <h3 className="text-2xl font-medium tracking-tight text-primary">Research</h3>
                <p className="text-secondary font-light leading-relaxed text-sm">
                  {project.research}
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="space-y-4 bg-surface border border-neutral-border p-8 rounded-[20px]">
                <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" /> Block Diagram
                </span>
                <h3 className="text-xl font-medium tracking-tight text-primary">System Architecture</h3>
                <p className="text-secondary font-light leading-relaxed text-sm">
                  {project.architecture.description}
                </p>
              </motion.div>
            </Grid>

            {/* Bill of Materials (Hardware & Software Specifications) */}
            <Grid cols={2} gap="lg" className="mb-24">
              {/* Hardware */}
              <motion.div variants={fadeUp} className="bg-surface border border-neutral-border p-8 rounded-[20px] space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[8px] bg-bg border border-neutral-border flex items-center justify-center text-accent">
                    <Cpu size={16} />
                  </div>
                  <h4 className="text-lg font-medium text-primary tracking-tight">Hardware Layer</h4>
                </div>
                <ul className="space-y-2">
                  {project.hardware.map((item, idx) => (
                    <li key={idx} className="text-secondary font-light text-xs flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-accent opacity-50" /> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Software */}
              <motion.div variants={fadeUp} className="bg-surface border border-neutral-border p-8 rounded-[20px] space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[8px] bg-bg border border-neutral-border flex items-center justify-center text-accent">
                    <Code2 size={16} />
                  </div>
                  <h4 className="text-lg font-medium text-primary tracking-tight">Software Layer</h4>
                </div>
                <ul className="space-y-2">
                  {project.software.map((item, idx) => (
                    <li key={idx} className="text-secondary font-light text-xs flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-accent opacity-50" /> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </Grid>

            {/* Process & Challenges */}
            <Grid cols={2} gap="xl" className="border-t border-neutral-border pt-16 mb-24">
              <motion.div variants={fadeUp} className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" /> Lifecycle
                </span>
                <h3 className="text-2xl font-medium tracking-tight text-primary">Development Process</h3>
                <p className="text-secondary font-light leading-relaxed text-sm">
                  {project.process}
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" /> Bottlenecks
                </span>
                <h3 className="text-2xl font-medium tracking-tight text-primary">Core Engineering Challenges</h3>
                <p className="text-secondary font-light leading-relaxed text-sm">
                  {project.challenges}
                </p>
              </motion.div>
            </Grid>

            {/* Solutions, Key Takeaways, Results */}
            <div className="border-t border-neutral-border pt-16 mb-24">
              <Grid cols="2-1" gap="xl">
                
                {/* Solution & Results */}
                <Stack spacing="lg">
                  <motion.div variants={fadeUp} className="space-y-3">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" /> Implementation
                    </span>
                    <h3 className="text-2xl font-medium tracking-tight text-primary">Resolutions & Code Refactoring</h3>
                    <p className="text-secondary font-light leading-relaxed text-sm">
                      {project.solutions}
                    </p>
                  </motion.div>

                  <motion.div variants={fadeUp} className="space-y-3">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" /> Benchmarks
                    </span>
                    <h3 className="text-2xl font-medium tracking-tight text-primary">System Results</h3>
                    <p className="text-secondary font-light leading-relaxed text-sm">
                      {project.results}
                    </p>
                  </motion.div>
                </Stack>

                {/* Key Takeaways */}
                <motion.div variants={fadeUp} className="bg-surface border border-neutral-border p-8 rounded-[20px] space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[8px] bg-bg border border-neutral-border flex items-center justify-center text-accent">
                      <Key size={16} />
                    </div>
                    <h4 className="text-lg font-medium text-primary tracking-tight">Key Takeaways</h4>
                  </div>
                  <ul className="space-y-4">
                    {project.keyTakeaways.map((item, idx) => (
                      <li key={idx} className="text-secondary font-light text-xs leading-relaxed">
                        <span className="text-accent font-semibold block mb-1">0{idx + 1}.</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>

              </Grid>
            </div>

            {/* Lessons Learned & Future Scope */}
            <Grid cols={2} gap="xl" className="border-t border-neutral-border pt-16">
              <motion.div variants={fadeUp} className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" /> Post-Mortem
                </span>
                <h3 className="text-2xl font-medium tracking-tight text-primary">Lessons Learned</h3>
                <p className="text-secondary font-light leading-relaxed text-sm">
                  {project.lessonsLearned}
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" /> Roadmap
                </span>
                <h3 className="text-2xl font-medium tracking-tight text-primary">Future Work</h3>
                <p className="text-secondary font-light leading-relaxed text-sm">
                  {project.futureWork}
                </p>
              </motion.div>
            </Grid>

          </motion.div>

        </Container>
      </Section>
    </motion.div>
  );
};
