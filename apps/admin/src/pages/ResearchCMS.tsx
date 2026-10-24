import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Save, CheckCircle2 } from 'lucide-react';
import { rdProjects as initialRD } from '../../../portfolio/src/data/rd';
import { RDProject } from '../../../portfolio/src/types/portfolio';
import { Container, Section } from '../components/layout/LayoutPrimitives';
import { Button } from '../../../portfolio/src/components/ui/Button';
import { fadeUp, staggerContainer } from '../constants/animations';

export const ResearchCMS: React.FC = () => {
  const [rdList, setRdList] = useState<RDProject[]>(() => {
    const saved = localStorage.getItem('adithyan_cms_rd');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved RD entries', e);
      }
    }
    return initialRD;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<RDProject | null>(null);

  const [formState, setFormState] = useState<{
    title: string;
    description: string;
    status: 'active' | 'experimental' | 'completed';
    tags: string;
  }>({
    title: '',
    description: '',
    status: 'active',
    tags: ''
  });

  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/v1/research')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setRdList(res.data);
        }
      })
      .catch((err) => console.warn('Could not fetch research from API:', err));
  }, []);

  useEffect(() => {
    localStorage.setItem('adithyan_cms_rd', JSON.stringify(rdList));
  }, [rdList]);

  const syncResearchToBackend = async (updated: RDProject[]) => {
    try {
      await fetch('/api/v1/research/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (e) {
      console.error('Failed to sync research to backend:', e);
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenCreate = () => {
    setEditingEntry(null);
    setFormState({
      title: '',
      description: '',
      status: 'active',
      tags: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (entry: RDProject) => {
    setEditingEntry(entry);
    setFormState({
      title: entry.title,
      description: entry.description,
      status: entry.status,
      tags: entry.tags.join(', ')
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const nextList = rdList.filter((item) => item.id !== id);
    setRdList(nextList);
    syncResearchToBackend(nextList);
    showNotification('Research entry removed successfully.');
  };

  const handleToggleStatus = (id: string) => {
    const nextList: RDProject[] = rdList.map((item) => {
      if (item.id === id) {
        const nextStatus: 'active' | 'completed' | 'experimental' = item.status === 'active' ? 'completed' : item.status === 'completed' ? 'experimental' : 'active';
        return { ...item, status: nextStatus };
      }
      return item;
    });
    setRdList(nextList);
    syncResearchToBackend(nextList);
    showNotification('Status updated.');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title.trim()) return;

    const parsedTags = formState.tags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    let nextList: RDProject[];
    if (editingEntry) {
      nextList = rdList.map((item) =>
        item.id === editingEntry.id
          ? {
              ...item,
              title: formState.title.trim(),
              description: formState.description.trim(),
              status: formState.status,
              tags: parsedTags
            }
          : item
      );
      setRdList(nextList);
      syncResearchToBackend(nextList);
      showNotification('Research entry updated.');
    } else {
      const newEntry: RDProject = {
        id: `rd-${Date.now()}`,
        title: formState.title.trim(),
        description: formState.description.trim(),
        status: formState.status,
        tags: parsedTags.length > 0 ? parsedTags : ['R&D', 'Experimental']
      };
      nextList = [newEntry, ...rdList];
      setRdList(nextList);
      syncResearchToBackend(nextList);
      showNotification('New research entry added.');
    }

    setIsModalOpen(false);
  };

  const statusColors = {
    active: 'text-accent border-accent/20 bg-accent/5',
    experimental: 'text-purple-400 border-purple-400/20 bg-purple-400/5',
    completed: 'text-success border-success/20 bg-success/5'
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
          <motion.div variants={fadeUp} className="flex items-center justify-between border-b border-neutral-border/30 pb-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-accent font-semibold block mb-2">
                Manage Research Notebooks
              </span>
              <h1 className="text-3xl font-semibold tracking-tight text-primary uppercase">
                Research & Development
              </h1>
            </div>
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center justify-center font-sans font-medium text-[10px] tracking-widest uppercase bg-primary text-bg px-5 py-2.5 rounded-[20px] border border-primary hover:bg-transparent hover:text-primary transition-all duration-300 focus:outline-none cursor-pointer"
            >
              <Plus size={14} className="mr-1.5" /> Log Entry
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

          {/* R&D items table */}
          <motion.div variants={fadeUp} className="overflow-x-auto bg-surface border border-neutral-border rounded-[20px] shadow-premium">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-border bg-bg/40 text-[9px] uppercase tracking-widest text-secondary font-medium">
                  <th className="p-4 pl-6">Experiment Title</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Tags</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-border/30 text-xs font-light">
                {rdList.map((entry) => (
                  <tr key={entry.id} className="hover:bg-surface/20 transition-colors">
                    <td className="p-4 pl-6">
                      <h4 className="font-semibold text-primary">{entry.title}</h4>
                      <p className="text-[10px] text-secondary mt-0.5">{entry.description}</p>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(entry.id)}
                        title="Click to cycle status"
                        className={`text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-[8px] border font-medium transition-colors cursor-pointer ${
                          statusColors[entry.status] || statusColors.active
                        }`}
                      >
                        {entry.status}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1.5">
                        {entry.tags.map((t) => (
                          <span key={t} className="text-[9px] text-secondary opacity-70 uppercase font-mono bg-bg px-2 py-0.5 rounded-[6px] border border-neutral-border/50">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right pr-6 space-x-3">
                      <button
                        onClick={() => handleOpenEdit(entry)}
                        className="text-[10px] uppercase font-semibold text-accent hover:underline focus:outline-none cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-[10px] uppercase font-semibold text-red-400 hover:underline focus:outline-none cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {rdList.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-secondary text-xs">
                      No research entries logged yet. Click "+ Log Entry" above to add your first experiment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </motion.div>

        </motion.div>
      </Container>

      {/* Modal for Creating / Editing Research Entry */}
      <AnimatePresence>
        {isModalOpen && (
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
                    Research Prototype
                  </span>
                  <h3 className="text-xl font-semibold text-primary uppercase">
                    {editingEntry ? 'Edit Research Entry' : 'Log New Experiment'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-secondary hover:text-primary rounded-lg transition-colors focus:outline-none cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-secondary">
                    Experiment Title *
                  </label>
                  <input
                    required
                    type="text"
                    value={formState.title}
                    onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                    placeholder="e.g. Sub-mW LoRa Synchronous Mesh Protocol"
                    className="w-full bg-bg border border-neutral-border focus:border-accent text-primary px-4 py-2.5 rounded-[12px] text-xs font-sans focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-secondary">
                    Status
                  </label>
                  <select
                    value={formState.status}
                    onChange={(e) => setFormState({ ...formState, status: e.target.value as any })}
                    className="w-full bg-bg border border-neutral-border focus:border-accent text-primary px-4 py-2.5 rounded-[12px] text-xs font-sans focus:outline-none transition-colors"
                  >
                    <option value="active">Active</option>
                    <option value="experimental">Experimental</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-secondary">
                    Description & Findings *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formState.description}
                    onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                    placeholder="Document the experiment problem statement, technical approach, and current conclusions..."
                    className="w-full bg-bg border border-neutral-border focus:border-accent text-primary px-4 py-2.5 rounded-[12px] text-xs font-sans focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-secondary">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formState.tags}
                    onChange={(e) => setFormState({ ...formState, tags: e.target.value })}
                    placeholder="ESP32, FreeRTOS, TinyML, Low Power"
                    className="w-full bg-bg border border-neutral-border focus:border-accent text-primary px-4 py-2.5 rounded-[12px] text-xs font-sans focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-border/40">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-[20px] text-xs uppercase font-medium text-secondary hover:text-primary transition-colors focus:outline-none cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button type="submit" variant="primary">
                    <Save size={14} className="mr-1.5" />
                    {editingEntry ? 'Update Entry' : 'Publish Entry'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Section>
  );
};
export default ResearchCMS;
