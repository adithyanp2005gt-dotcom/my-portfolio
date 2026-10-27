import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Globe, Shield, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Container, Section, Grid, Stack } from '../components/layout/LayoutPrimitives';
import { Button } from '../../../portfolio/src/components/ui/Button';
import { fadeUp, staggerContainer } from '../constants/animations';

export const SettingsCMS: React.FC = () => {
  const [siteTitle, setSiteTitle] = useState('ADITHYAN P | AI & ML Engineer');
  const [description, setDescription] = useState('Portfolio of ADITHYAN P, AI & ML Engineer.');
  const [heroText, setHeroText] = useState('I build intelligent AI and machine learning systems combining deep learning, computer vision, and reliable engineering.');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/v1/settings')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          if (res.data.siteTitle) setSiteTitle(res.data.siteTitle);
          if (res.data.description) setDescription(res.data.description);
          if (res.data.heroText) setHeroText(res.data.heroText);
        }
      })
      .catch((err) => console.warn('Could not fetch settings:', err));
  }, []);

  const handleSaveSettings = async () => {
    try {
      await fetch('/api/v1/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteTitle, description, heroText })
      });
      setNotification('Settings saved successfully.');
      setTimeout(() => setNotification(null), 3000);
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
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
                Configure Global Variables
              </span>
              <h1 className="text-3xl font-semibold tracking-tight text-primary uppercase">
                System Settings
              </h1>
            </div>
          </motion.div>

          <Grid cols="1-2" gap="xl">
            {/* Left Column Settings Nav links */}
            <div className="bg-surface border border-neutral-border p-6 rounded-[20px] shadow-premium">
              <h3 className="text-xs uppercase tracking-[0.2em] text-secondary opacity-60 mb-4 font-semibold">
                Configurations Panel
              </h3>
              <Stack spacing="xs">
                <button className="flex items-center gap-2.5 px-3 py-2 rounded-[12px] text-xs font-semibold uppercase tracking-wider bg-accent/10 border border-accent/20 text-accent text-left focus:outline-none">
                  <Globe size={14} /> General & SEO
                </button>
                <button className="flex items-center gap-2.5 px-3 py-2 rounded-[12px] text-xs font-semibold uppercase tracking-wider text-secondary hover:bg-neutral-border/30 hover:text-primary border border-transparent text-left focus:outline-none">
                  <Shield size={14} /> Security clearance
                </button>
                <button className="flex items-center gap-2.5 px-3 py-2 rounded-[12px] text-xs font-semibold uppercase tracking-wider text-secondary hover:bg-neutral-border/30 hover:text-primary border border-transparent text-left focus:outline-none">
                  <RefreshCw size={14} /> Backups & Sync
                </button>
              </Stack>
            </div>

            {/* Right Column Form Editor */}
            <motion.div
              variants={fadeUp}
              className="bg-surface border border-neutral-border p-8 rounded-[20px] shadow-premium space-y-6"
            >
              <h3 className="text-lg font-medium text-primary tracking-tight">
                General Settings
              </h3>
              
              <form className="space-y-6">
                
                {/* Site title */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-secondary">Global Site Title</label>
                  <input
                    type="text"
                    value={siteTitle}
                    onChange={(e) => setSiteTitle(e.target.value)}
                    className="w-full bg-bg border border-neutral-border focus:border-accent text-primary px-4 py-2.5 rounded-[12px] text-xs focus:outline-none transition-colors"
                  />
                </div>

                {/* Hero Bio / Tagline */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-secondary">Hero Bio / Tagline</label>
                  <textarea
                    rows={3}
                    value={heroText}
                    onChange={(e) => setHeroText(e.target.value)}
                    className="w-full bg-bg border border-neutral-border focus:border-accent text-primary px-4 py-2.5 rounded-[12px] text-xs focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* SEO Description */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-secondary">SEO Meta Description</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-bg border border-neutral-border focus:border-accent text-primary px-4 py-2.5 rounded-[12px] text-xs focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Notification */}
                {notification && (
                  <div className="flex items-center gap-2 p-3 rounded-[12px] bg-accent/10 border border-accent/20 text-accent text-xs">
                    <CheckCircle2 size={16} />
                    <span>{notification}</span>
                  </div>
                )}

                {/* Submit button */}
                <div className="pt-2 border-t border-neutral-border/30">
                  <Button type="button" variant="primary" onClick={handleSaveSettings}>
                    <span className="flex items-center gap-2">
                      <Save size={14} /> Save Variables
                    </span>
                  </Button>
                </div>

              </form>
            </motion.div>
          </Grid>

        </motion.div>
      </Container>
    </Section>
  );
};
export default SettingsCMS;
