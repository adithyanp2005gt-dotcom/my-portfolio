import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, FileDown, CheckCircle } from 'lucide-react';
import { socialLinks } from '../data/socials';
import { Container, Section, SectionHeading, Grid, Stack } from '../components/layout/LayoutPrimitives';
import { Button } from '../components/ui/Button';
import { fadeUp, staggerContainer } from '../constants/animations';

export const Contact: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send directly to adithyanp2005gt@gmail.com via FormSubmit
      const response = await fetch(`https://formsubmit.co/ajax/${socialLinks.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          message: formState.message,
          _subject: `New Portfolio Message from ${formState.name}`,
          _template: 'table',
          _captcha: 'false'
        })
      });

      // Also log locally if local API is running
      fetch('/api/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_name: formState.name,
          email: formState.email,
          message: formState.message
        })
      }).catch(() => {});

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setFormState({ name: '', email: '', message: '' });
          setSubmitted(false);
        }, 5000);
      } else {
        // Direct email fallback
        window.location.href = `mailto:${socialLinks.email}?subject=${encodeURIComponent(`Portfolio Contact: ${formState.name}`)}&body=${encodeURIComponent(formState.message)}`;
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Error transmitting contact message:', err);
      // Direct email fallback
      window.location.href = `mailto:${socialLinks.email}?subject=${encodeURIComponent(`Portfolio Contact: ${formState.name}`)}&body=${encodeURIComponent(formState.message)}`;
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Section id="contact" className="border-t border-neutral-border">
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
              title="Get in Touch"
              subtitle="Contact"
            />
          </motion.div>

          <Grid cols="1-2" gap="xl" className="items-start mb-16">
            
            {/* Left: Contact Info */}
            <Stack spacing="lg" className="max-w-md">
              <p className="text-secondary font-light text-base leading-relaxed">
                Feel free to reach out for research collaborations, project discussions, or technology opportunities. I am always open to exploring complex AI and embedded hardware problems.
              </p>

              {/* Direct Link Options */}
              <Stack spacing="sm" className="pt-4">
                <a
                  href={`mailto:${socialLinks.email}`}
                  className="inline-flex items-center gap-3 text-secondary hover:text-accent text-sm transition-colors duration-300 font-light"
                >
                  <Mail size={16} /> {socialLinks.email}
                </a>
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-secondary hover:text-accent text-sm transition-colors duration-300 font-light"
                >
                  <Github size={16} /> github.com/adithyanp2005gt-dotcom
                </a>
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-secondary hover:text-accent text-sm transition-colors duration-300 font-light"
                >
                  <Linkedin size={16} /> linkedin.com/in/adithyan-p272005
                </a>
              </Stack>

              {/* Resume download */}
              <div className="pt-6">
                <a
                  href={socialLinks.resumeUrl}
                  download
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary border border-neutral-border px-6 py-3.5 rounded-[20px] hover:border-accent hover:text-accent transition-colors duration-300"
                >
                  <FileDown size={14} /> Download Resume (PDF)
                </a>
              </div>
            </Stack>

            {/* Right: Contact Form */}
            <motion.div
              variants={fadeUp}
              className="bg-surface border border-neutral-border p-8 rounded-[20px] shadow-premium"
            >
              {submitted ? (
                <div className="py-12 text-center flex flex-col items-center justify-center">
                  <CheckCircle size={40} className="text-success mb-4 animate-pulse" />
                  <h4 className="text-lg font-medium text-primary mb-2">Message Transmitted</h4>
                  <p className="text-secondary text-xs font-light max-w-xs leading-relaxed">
                    Thank you! Your message has been sent to {socialLinks.email}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-[10px] uppercase tracking-wider text-secondary">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleInputChange}
                      placeholder="e.g. John Doe"
                      className="w-full bg-bg border border-neutral-border focus:border-accent text-primary px-4 py-3 rounded-[20px] text-sm font-sans focus:outline-none transition-colors duration-300"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-[10px] uppercase tracking-wider text-secondary">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleInputChange}
                      placeholder="e.g. john@example.com"
                      className="w-full bg-bg border border-neutral-border focus:border-accent text-primary px-4 py-3 rounded-[20px] text-sm font-sans focus:outline-none transition-colors duration-300"
                    />
                  </div>

                  {/* Message Input */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-[10px] uppercase tracking-wider text-secondary">
                      Message Content
                    </label>
                    <textarea
                      required
                      rows={4}
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleInputChange}
                      placeholder="Explain your project details or request..."
                      className="w-full bg-bg border border-neutral-border focus:border-accent text-primary px-4 py-3 rounded-[20px] text-sm font-sans focus:outline-none transition-colors duration-300 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? 'Transmitting Message...' : 'Transmit Message'}
                    </Button>
                  </div>

                </form>
              )}
            </motion.div>

          </Grid>

          {/* Core Memorable CTA Invitation */}
          <motion.div
            variants={fadeUp}
            className="border-t border-neutral-border/30 pt-16 text-center"
          >
            <p className="text-xl md:text-2xl font-light text-primary tracking-tight">
              Let's build something meaningful together.
            </p>
          </motion.div>

        </motion.div>
      </Container>
    </Section>
  );
};
