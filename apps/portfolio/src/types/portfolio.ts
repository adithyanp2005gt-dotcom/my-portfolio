export interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  githubUrl: string;
  demoUrl?: string;
  imageUrl: string;
  overview: string;
  problem: string;
  goals: string[];
  research: string;
  architecture: {
    description: string;
    imageUrl?: string;
  };
  hardware: string[];
  software: string[];
  process: string;
  challenges: string;
  solutions: string;
  results: string;
  keyTakeaways: string[];
  lessonsLearned: string;
  futureWork: string;
}

export interface SkillCategory {
  name: string;
  description: string;
  skills: string[];
}

export interface TimelineItem {
  id: string;
  roleOrDegree: string;
  institutionOrCompany: string;
  duration: string;
  achievements: string[];
  coursework?: string[];
  certifications?: string[];
}

export interface JourneyEvent {
  year: string;
  title: string;
  description: string;
}

export interface RDProject {
  id: string;
  title: string;
  status: 'active' | 'completed' | 'experimental';
  description: string;
  tags: string[];
}

export interface SocialLinks {
  email: string;
  github: string;
  linkedin: string;
  resumeUrl: string;
}
