import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2, Save, X, Sparkles, MoveUp, MoveDown } from 'lucide-react';
import { projects as initialProjects } from '../../../portfolio/src/data/projects';
import { Project } from '../../../portfolio/src/types/portfolio';
import { Container, Section, Grid, Stack } from '../components/layout/LayoutPrimitives';
import { Button } from '../../../portfolio/src/components/ui/Button';
import { fadeUp, staggerContainer } from '../constants/animations';

// Tiptap imports
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface TiptapProps {
  content: string;
  onChange: (html: string) => void;
}

const TiptapEditor: React.FC<TiptapProps> = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
  });

  if (!editor) return null;

  const btnClass = (active: boolean) =>
    `px-2.5 py-1.5 rounded-[6px] text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
      active
        ? 'bg-accent text-bg border border-accent'
        : 'bg-surface text-secondary hover:bg-neutral-border border border-neutral-border/50'
    }`;

  return (
    <div className="border border-neutral-border rounded-[12px] bg-surface overflow-hidden">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap gap-1.5 p-2 bg-bg/50 border-b border-neutral-border">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btnClass(editor.isActive('bold'))}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btnClass(editor.isActive('italic'))}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={btnClass(editor.isActive('heading', { level: 2 }))}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={btnClass(editor.isActive('heading', { level: 3 }))}
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btnClass(editor.isActive('bulletList'))}
        >
          Bullet List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={btnClass(editor.isActive('codeBlock'))}
        >
          Code Block
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={btnClass(editor.isActive('blockquote'))}
        >
          Quote
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="p-4 bg-surface max-h-[300px] overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export const ProjectsCMS: React.FC = () => {
  const [projectsList, setProjectsList] = useState<Project[]>(() => {
    const saved = localStorage.getItem('adithyan_cms_projects');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved projects', e);
      }
    }
    return initialProjects;
  });
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'narrative'>('details');

  useEffect(() => {
    fetch('/api/v1/projects')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setProjectsList(res.data);
        }
      })
      .catch((err) => console.warn('Could not fetch projects from API:', err));
  }, []);

  useEffect(() => {
    localStorage.setItem('adithyan_cms_projects', JSON.stringify(projectsList));
  }, [projectsList]);

  const syncProjectsToBackend = async (updated: Project[]) => {
    try {
      await fetch('/api/v1/projects/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (e) {
      console.error('Failed to sync projects to backend:', e);
    }
  };

  // Temporary local state for project form fields
  const [formState, setFormState] = useState<Partial<Project>>({
    title: '',
    tagline: '',
    description: '',
    problem: '',
    goals: [],
    hardware: [],
    software: [],
    keyTakeaways: [],
    overview: '',
    research: '',
    challenges: '',
    solutions: '',
    results: '',
    lessonsLearned: '',
    futureWork: '',
    githubUrl: '',
    demoUrl: '',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450"%3E%3Crect width="800" height="450" fill="%23141414"/%3E%3Ccircle cx="400" cy="225" r="80" stroke="%234F8CFF" stroke-width="2" fill="none" opacity="0.3"/%3E%3Ctext x="400" y="235" fill="%23F5F5F5" font-family="sans-serif" font-size="16" text-anchor="middle" letter-spacing="4"%3ETEMPLATE%3C/text%3E%3C/svg%3E'
  });

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setFormState(project);
    setIsCreating(false);
    setActiveTab('details');
  };

  const handleCreateClick = () => {
    setEditingProject(null);
    setFormState({
      title: '',
      tagline: '',
      description: '',
      problem: '',
      goals: [],
      hardware: [],
      software: [],
      keyTakeaways: [],
      overview: '',
      research: '',
      challenges: '',
      solutions: '',
      results: '',
      lessonsLearned: '',
      futureWork: '',
      githubUrl: '',
      demoUrl: '',
      imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450"%3E%3Crect width="800" height="450" fill="%23141414"/%3E%3Ccircle cx="400" cy="225" r="80" stroke="%234F8CFF" stroke-width="2" fill="none" opacity="0.3"/%3E%3Ctext x="400" y="235" fill="%23F5F5F5" font-family="sans-serif" font-size="16" text-anchor="middle" letter-spacing="4"%3ETEMPLATE%3C/text%3E%3C/svg%3E'
    });
    setIsCreating(true);
    setActiveTab('details');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    let nextList = [...projectsList];
    if (isCreating) {
      const newProj: Project = {
        ...formState,
        id: (formState.title || 'project').toLowerCase().replace(/\s+/g, '-'),
        slug: (formState.title || 'project').toLowerCase().replace(/\s+/g, '-'),
        tags: [...(formState.hardware || []), ...(formState.software || [])].slice(0, 5)
      } as Project;
      nextList = [newProj, ...nextList];
      setProjectsList(nextList);
      syncProjectsToBackend(nextList);
    } else if (editingProject) {
      nextList = nextList.map((p) => (p.id === editingProject.id ? ({ ...p, ...formState } as Project) : p));
      setProjectsList(nextList);
      syncProjectsToBackend(nextList);
    }
    setEditingProject(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    const nextList = projectsList.filter((p) => p.id !== id);
    setProjectsList(nextList);
    syncProjectsToBackend(nextList);
  };

  const handleReorder = (idx: number, dir: 'up' | 'down') => {
    const list = [...projectsList];
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;
    setProjectsList(list);
    syncProjectsToBackend(list);
  };

  return (
    <Section className="!py-12">
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Top heading actions */}
          <motion.div variants={fadeUp} className="flex items-center justify-between border-b border-neutral-border/30 pb-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-accent font-semibold block mb-2">
                Curate Public Work
              </span>
              <h1 className="text-3xl font-semibold tracking-tight text-primary uppercase">
                Selected Projects
              </h1>
            </div>
            {!editingProject && !isCreating && (
              <Button variant="primary" onClick={handleCreateClick}>
                <span className="flex items-center gap-2">
                  <Plus size={14} /> New Case Study
                </span>
              </Button>
            )}
          </motion.div>

          <AnimatePresence mode="wait">
            {/* Project List View */}
            {!editingProject && !isCreating ? (
              <motion.div key="list" variants={fadeUp} className="space-y-4">
                {projectsList.map((project, idx) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between bg-surface border border-neutral-border p-5 rounded-[20px] shadow-premium hover:border-accent/25 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      {/* Drag / Reorder Buttons */}
                      <div className="flex flex-col gap-1 text-secondary opacity-40">
                        <button
                          onClick={() => handleReorder(idx, 'up')}
                          disabled={idx === 0}
                          className="hover:text-accent disabled:opacity-30 disabled:hover:text-secondary focus:outline-none"
                        >
                          <MoveUp size={14} />
                        </button>
                        <button
                          onClick={() => handleReorder(idx, 'down')}
                          disabled={idx === projectsList.length - 1}
                          className="hover:text-accent disabled:opacity-30 disabled:hover:text-secondary focus:outline-none"
                        >
                          <MoveDown size={14} />
                        </button>
                      </div>
                      
                      {/* Info details */}
                      <div>
                        <h3 className="text-base font-semibold text-primary">{project.title}</h3>
                        <p className="text-secondary text-xs font-light mt-0.5">{project.tagline}</p>
                      </div>
                    </div>

                    {/* Actions panel */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEditClick(project)}
                        className="p-2 bg-bg border border-neutral-border text-secondary hover:text-accent hover:border-accent rounded-[12px] transition-colors focus:outline-none"
                        title="Edit Project"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-2 bg-bg border border-neutral-border text-secondary hover:text-red-400 hover:border-red-950 rounded-[12px] transition-colors focus:outline-none"
                        title="Delete Project"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              /* Editor View */
              <motion.div
                key="editor"
                variants={fadeUp}
                className="bg-surface border border-neutral-border p-8 rounded-[20px] shadow-premium"
              >
                <form onSubmit={handleSave} className="space-y-8">
                  {/* Editor Header Navigation */}
                  <div className="flex items-center justify-between border-b border-neutral-border/30 pb-4 mb-6">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setActiveTab('details')}
                        className={`text-xs uppercase tracking-wider pb-2 border-b-2 font-semibold transition-colors ${
                          activeTab === 'details' ? 'border-accent text-primary' : 'border-transparent text-secondary'
                        }`}
                      >
                        Metadata Specs
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('narrative')}
                        className={`text-xs uppercase tracking-wider pb-2 border-b-2 font-semibold transition-colors ${
                          activeTab === 'narrative' ? 'border-accent text-primary' : 'border-transparent text-secondary'
                        }`}
                      >
                        Storytelling Narrative
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProject(null);
                          setIsCreating(false);
                        }}
                        className="inline-flex items-center gap-1 text-[10px] tracking-wider uppercase font-semibold border border-neutral-border px-4 py-2 rounded-[20px] text-secondary hover:text-primary transition-colors focus:outline-none"
                      >
                        <X size={12} /> Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1 text-[10px] tracking-wider uppercase font-semibold bg-accent text-bg px-4 py-2 rounded-[20px] border border-accent hover:bg-transparent hover:text-accent transition-all duration-300 focus:outline-none"
                      >
                        <Save size={12} /> Save Changes
                      </button>
                    </div>
                  </div>

                  {/* Tab Details */}
                  {activeTab === 'details' && (
                    <Grid cols={2} gap="lg">
                      {/* Left: General metadata */}
                      <Stack spacing="sm">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-wider text-secondary">Project Title</label>
                          <input
                            required
                            type="text"
                            value={formState.title || ''}
                            onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                            className="w-full bg-bg border border-neutral-border focus:border-accent text-primary px-4 py-2.5 rounded-[12px] text-xs focus:outline-none transition-colors"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-wider text-secondary">Tagline</label>
                          <input
                            required
                            type="text"
                            value={formState.tagline || ''}
                            onChange={(e) => setFormState({ ...formState, tagline: e.target.value })}
                            className="w-full bg-bg border border-neutral-border focus:border-accent text-primary px-4 py-2.5 rounded-[12px] text-xs focus:outline-none transition-colors"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-wider text-secondary">Summary Description</label>
                          <textarea
                            required
                            rows={3}
                            value={formState.description || ''}
                            onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                            className="w-full bg-bg border border-neutral-border focus:border-accent text-primary px-4 py-2.5 rounded-[12px] text-xs focus:outline-none transition-colors resize-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-wider text-secondary">Repository Link</label>
                          <input
                            type="text"
                            value={formState.githubUrl || ''}
                            onChange={(e) => setFormState({ ...formState, githubUrl: e.target.value })}
                            className="w-full bg-bg border border-neutral-border focus:border-accent text-primary px-4 py-2.5 rounded-[12px] text-xs focus:outline-none transition-colors"
                          />
                        </div>
                      </Stack>

                      {/* Right: Spec variables */}
                      <Stack spacing="sm">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-wider text-secondary">Hardware Layer BOM (Comma Separated)</label>
                          <input
                            type="text"
                            value={formState.hardware?.join(', ') || ''}
                            onChange={(e) =>
                              setFormState({
                                ...formState,
                                hardware: e.target.value.split(',').map((x) => x.trim())
                              })
                            }
                            placeholder="ESP32-S3, Solenoid valves..."
                            className="w-full bg-bg border border-neutral-border focus:border-accent text-primary px-4 py-2.5 rounded-[12px] text-xs focus:outline-none transition-colors"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-wider text-secondary">Software Layer API (Comma Separated)</label>
                          <input
                            type="text"
                            value={formState.software?.join(', ') || ''}
                            onChange={(e) =>
                              setFormState({
                                ...formState,
                                software: e.target.value.split(',').map((x) => x.trim())
                              })
                            }
                            placeholder="FreeRTOS, TensorFlow Lite..."
                            className="w-full bg-bg border border-neutral-border focus:border-accent text-primary px-4 py-2.5 rounded-[12px] text-xs focus:outline-none transition-colors"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-wider text-secondary">System Goals (Comma Separated)</label>
                          <textarea
                            rows={3}
                            value={formState.goals?.join('\n') || ''}
                            onChange={(e) =>
                              setFormState({ ...formState, goals: e.target.value.split('\n').filter(Boolean) })
                            }
                            placeholder="Goal 1&#10;Goal 2"
                            className="w-full bg-bg border border-neutral-border focus:border-accent text-primary px-4 py-2.5 rounded-[12px] text-xs focus:outline-none transition-colors resize-none"
                          />
                        </div>
                      </Stack>
                    </Grid>
                  )}

                  {/* Tab Narrative - Using the Tiptap Editor */}
                  {activeTab === 'narrative' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] uppercase tracking-wider text-secondary">Project Overview Narrative</label>
                          <button
                            type="button"
                            className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-accent font-semibold focus:outline-none"
                          >
                            <Sparkles size={10} /> AI Auto-Draft Outline
                          </button>
                        </div>
                        <TiptapEditor
                          content={formState.overview || ''}
                          onChange={(html) => setFormState((prev) => ({ ...prev, overview: html }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-wider text-secondary">Problem & Background Context</label>
                        <TiptapEditor
                          content={formState.problem || ''}
                          onChange={(html) => setFormState((prev) => ({ ...prev, problem: html }))}
                        />
                      </div>
                    </div>
                  )}

                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Container>
    </Section>
  );
};
export default ProjectsCMS;
