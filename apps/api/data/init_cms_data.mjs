import fs from 'fs';
import path from 'path';

// Load static files from apps/portfolio/src/data
const projectsPath = 'd:\\my portfolio\\apps\\portfolio\\src\\data\\projects.ts';
const skillsPath = 'd:\\my portfolio\\apps\\portfolio\\src\\data\\skills.ts';
const rdPath = 'd:\\my portfolio\\apps\\portfolio\\src\\data\\rd.ts';
const outDir = 'd:\\my portfolio\\apps\\api\\data';
const outFile = path.join(outDir, 'cms_data.json');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Extract using regex/eval or direct extraction
const projectsContent = fs.readFileSync(projectsPath, 'utf-8');
const skillsContent = fs.readFileSync(skillsPath, 'utf-8');
const rdContent = fs.readFileSync(rdPath, 'utf-8');

// Simple parser for standard typescript exports
function extractArray(content, varName) {
  const match = content.match(new RegExp(`export const ${varName}[^=]*=\\s*(\\[[\\s\\S]*?\\]);`, 'm'));
  if (match) {
    // evaluate the array safely in JS
    try {
      const clean = match[1]
        .replace(/\/\/[^\n]*/g, '') // remove single-line comments
        .replace(/\/\*[\s\S]*?\*\//g, ''); // remove block comments
      return eval(`(${clean})`);
    } catch (e) {
      console.error(`Failed to eval ${varName}`, e);
    }
  }
  return [];
}

const projects = extractArray(projectsContent, 'projects');
const skills = extractArray(skillsContent, 'skillCategories');
const rd = extractArray(rdContent, 'rdProjects');

const cmsData = {
  projects: projects.length > 0 ? projects : [],
  skills: skills.length > 0 ? skills : [],
  rd: rd.length > 0 ? rd : [],
  settings: {
    siteTitle: 'ADITHYAN P | AI & Embedded Systems Engineer',
    name: 'ADITHYAN P',
    description: 'Portfolio of ADITHYAN P, AI & Embedded Systems Developer.',
    email: 'adithyanp2005gt@gmail.com',
    github: 'https://github.com/adithyanp2005gt-dotcom',
    linkedin: 'https://www.linkedin.com/in/adithyan-p272005',
    resumeUrl: '/resume.pdf'
  }
};

fs.writeFileSync(outFile, JSON.stringify(cmsData, null, 2), 'utf-8');
console.log(`Successfully generated ${outFile}:`);
console.log(`- Projects: ${cmsData.projects.length}`);
console.log(`- Skills categories: ${cmsData.skills.length}`);
console.log(`- R&D entries: ${cmsData.rd.length}`);
