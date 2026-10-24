import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Check, X, Save, Trash2, CheckCircle2 } from 'lucide-react';
import { skillCategories as initialSkills } from '../../../portfolio/src/data/skills';
import { SkillCategory } from '../../../portfolio/src/types/portfolio';
import { Container, Section, Grid, Stack } from '../components/layout/LayoutPrimitives';
import { Button } from '../../../portfolio/src/components/ui/Button';
import { fadeUp, staggerContainer } from '../constants/animations';

export const SkillsCMS: React.FC = () => {
  const [categories, setCategories] = useState<SkillCategory[]>(() => {
    const saved = localStorage.getItem('adithyan_cms_skills');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved skills', e);
      }
    }
    return initialSkills;
  });

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);

  const [categoryForm, setCategoryForm] = useState<{
    name: string;
    description: string;
    skills: string;
  }>({
    name: '',
    description: '',
    skills: ''
  });

  // Track which category has an active inline skill input
  const [addingSkillToCatIndex, setAddingSkillToCatIndex] = useState<number | null>(null);
  const [newSkillName, setNewSkillName] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/v1/skills')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setCategories(res.data);
        }
      })
      .catch((err) => console.warn('Could not fetch skills from API:', err));
  }, []);

  useEffect(() => {
    localStorage.setItem('adithyan_cms_skills', JSON.stringify(categories));
  }, [categories]);

  const syncSkillsToBackend = async (updated: SkillCategory[]) => {
    try {
      await fetch('/api/v1/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (e) {
      console.error('Failed to sync skills to backend:', e);
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenAddCategory = () => {
    setEditingCategoryIndex(null);
    setCategoryForm({
      name: '',
      description: '',
      skills: ''
    });
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (index: number) => {
    const cat = categories[index];
    setEditingCategoryIndex(index);
    setCategoryForm({
      name: cat.name,
      description: cat.description,
      skills: cat.skills.join(', ')
    });
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = (index: number) => {
    const nextCategories = categories.filter((_, i) => i !== index);
    setCategories(nextCategories);
    syncSkillsToBackend(nextCategories);
    setIsCategoryModalOpen(false);
    showNotification('Skill category removed.');
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;

    const parsedSkills = categoryForm.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    let nextCategories: SkillCategory[];
    if (editingCategoryIndex !== null) {
      nextCategories = categories.map((cat, i) =>
        i === editingCategoryIndex
          ? {
              ...cat,
              name: categoryForm.name.trim(),
              description: categoryForm.description.trim(),
              skills: parsedSkills.length > 0 ? parsedSkills : cat.skills
            }
          : cat
      );
      setCategories(nextCategories);
      syncSkillsToBackend(nextCategories);
      showNotification('Category updated.');
    } else {
      const newCat: SkillCategory = {
        name: categoryForm.name.trim(),
        description: categoryForm.description.trim(),
        skills: parsedSkills
      };
      nextCategories = [...categories, newCat];
      setCategories(nextCategories);
      syncSkillsToBackend(nextCategories);
      showNotification('New skill category added.');
    }

    setIsCategoryModalOpen(false);
  };

  const handleAddInlineSkill = (catIndex: number) => {
    if (!newSkillName.trim()) {
      setAddingSkillToCatIndex(null);
      return;
    }
    const nextCategories = categories.map((cat, i) =>
      i === catIndex
        ? {
            ...cat,
            skills: [...cat.skills, newSkillName.trim()]
          }
        : cat
    );
    setCategories(nextCategories);
    syncSkillsToBackend(nextCategories);
    setNewSkillName('');
    setAddingSkillToCatIndex(null);
    showNotification('Skill added to category.');
  };

  const handleRemoveSkill = (catIndex: number, skillName: string) => {
    const nextCategories = categories.map((cat, i) =>
      i === catIndex
        ? {
            ...cat,
            skills: cat.skills.filter((s) => s !== skillName)
          }
        : cat
    );
    setCategories(nextCategories);
    syncSkillsToBackend(nextCategories);
    showNotification(`Removed "${skillName}".`);
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
          {/* Header row */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-border/30 pb-6 gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-accent font-semibold block mb-2">
                Configure Domain Expertise
              </span>
              <h1 className="text-3xl font-semibold tracking-tight text-primary uppercase">
                Skills Registry
              </h1>
            </div>
            <button
              onClick={handleOpenAddCategory}
              className="inline-flex items-center justify-center font-sans font-medium text-[10px] tracking-widest uppercase bg-primary text-bg px-5 py-2.5 rounded-[20px] border border-primary hover:bg-transparent hover:text-primary transition-all duration-300 focus:outline-none cursor-pointer"
            >
              <Plus size={14} className="mr-1.5" /> Add Category
            </button>
          </motion.div>

          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-surface border border-accent/40 text-primary text-xs rounded-[12px] flex items-center gap-2"
            >
              <CheckCircle2 size={14} className="text-accent" />
              <span>{notification}</span>
            </motion.div>
          )}

          {/* Categories Grid list */}
          <Grid cols={2} gap="lg">
            {categories.map((cat, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="bg-surface border border-neutral-border p-6 rounded-[20px] shadow-premium flex flex-col justify-between hover:border-accent/30 transition-all duration-300"
              >
                <Stack spacing="sm">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-base font-semibold text-primary">{cat.name}</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditCategory(idx)}
                        className="p-1.5 text-secondary hover:text-accent transition-colors focus:outline-none cursor-pointer"
                        title="Edit Category"
                      >
                        <Edit2 size={13} />
                      </button>
                    </div>
                  </div>
                  <p className="text-secondary text-[11px] font-light leading-relaxed">{cat.description}</p>
                  
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-neutral-border/30 items-center">
                    {cat.skills.map((skill) => (
                      <span
                        key={skill}
                        className="group bg-bg text-secondary hover:text-primary text-[10px] tracking-wider uppercase px-2.5 py-1.5 rounded-[12px] border border-neutral-border flex items-center gap-1.5 transition-colors"
                      >
                        <Check size={10} className="text-accent" />
                        <span>{skill}</span>
                        <button
                          onClick={() => handleRemoveSkill(idx, skill)}
                          className="text-secondary/40 hover:text-red-400 ml-0.5 focus:outline-none cursor-pointer"
                          title={`Remove ${skill}`}
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}

                    {addingSkillToCatIndex === idx ? (
                      <div className="flex items-center gap-1.5 bg-bg border border-accent rounded-[12px] px-2 py-1">
                        <input
                          autoFocus
                          type="text"
                          value={newSkillName}
                          onChange={(e) => setNewSkillName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddInlineSkill(idx);
                            } else if (e.key === 'Escape') {
                              setAddingSkillToCatIndex(null);
                            }
                          }}
                          placeholder="Skill name..."
                          className="bg-transparent text-primary text-[10px] tracking-wider uppercase focus:outline-none w-24"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddInlineSkill(idx)}
                          className="text-accent hover:text-primary focus:outline-none cursor-pointer"
                        >
                          <Check size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setAddingSkillToCatIndex(null)}
                          className="text-secondary hover:text-primary focus:outline-none cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setAddingSkillToCatIndex(idx);
                          setNewSkillName('');
                        }}
                        className="bg-bg/40 text-secondary hover:text-accent text-[9px] uppercase tracking-wider px-2.5 py-1.5 rounded-[12px] border border-dashed border-neutral-border hover:border-accent/40 transition-colors focus:outline-none cursor-pointer"
                      >
                        + Add Skill
                      </button>
                    )}
                  </div>
                </Stack>
              </motion.div>
            ))}
          </Grid>

        </motion.div>
      </Container>

      {/* Modal for Creating / Editing Category */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-surface border border-neutral-border rounded-[20px] shadow-2xl p-6 md:p-8 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-neutral-border/40 pb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold block">
                    Domain Category
                  </span>
                  <h3 className="text-xl font-semibold text-primary uppercase">
                    {editingCategoryIndex !== null ? 'Edit Skill Category' : 'New Skill Category'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="p-1.5 text-secondary hover:text-primary rounded-lg transition-colors focus:outline-none cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-secondary">
                    Category Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    placeholder="e.g. Cloud & DevOps Infrastructure"
                    className="w-full bg-bg border border-neutral-border focus:border-accent text-primary px-4 py-2.5 rounded-[12px] text-xs font-sans focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-secondary">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    placeholder="Brief description of skills governed under this domain..."
                    className="w-full bg-bg border border-neutral-border focus:border-accent text-primary px-4 py-2.5 rounded-[12px] text-xs font-sans focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-secondary">
                    Skills / Tools (comma separated)
                  </label>
                  <input
                    type="text"
                    value={categoryForm.skills}
                    onChange={(e) => setCategoryForm({ ...categoryForm, skills: e.target.value })}
                    placeholder="AWS, Docker, Kubernetes, CI/CD, Terraform"
                    className="w-full bg-bg border border-neutral-border focus:border-accent text-primary px-4 py-2.5 rounded-[12px] text-xs font-sans focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-border/40">
                  {editingCategoryIndex !== null ? (
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(editingCategoryIndex)}
                      className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors focus:outline-none cursor-pointer"
                    >
                      <Trash2 size={13} /> Delete Category
                    </button>
                  ) : <div />}

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsCategoryModalOpen(false)}
                      className="px-5 py-2.5 rounded-[20px] text-xs uppercase font-medium text-secondary hover:text-primary transition-colors focus:outline-none cursor-pointer"
                    >
                      Cancel
                    </button>
                    <Button type="submit" variant="primary">
                      <Save size={14} className="mr-1.5" />
                      {editingCategoryIndex !== null ? 'Save Changes' : 'Create Category'}
                    </Button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Section>
  );
};
export default SkillsCMS;
