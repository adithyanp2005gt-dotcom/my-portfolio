import React from 'react';
import { Mail, Github, Linkedin, Instagram } from 'lucide-react';
import { socialLinks } from '../data/socials';
import { Container } from '../components/layout/LayoutPrimitives';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#090909] text-[#F5F5F5] border-t border-[#252525] py-16 md:py-24 relative z-10">
      <Container className="flex flex-col md:flex-row items-start justify-between gap-12">

        {/* Branding Info */}
        <div className="max-w-md">
          <span className="font-sans font-medium text-sm tracking-wider uppercase text-[#F5F5F5] block mb-2">
            ADITHYAN P
          </span>
          <span className="text-xs text-[#9A9A9A] block mb-6 font-light">
            AI & ML Engineer
          </span>
          <p className="text-[#9A9A9A] text-sm font-light leading-relaxed">
            Building intelligent AI and machine learning systems with precision.
          </p>
        </div>

        {/* Links and Copyright */}
        <div className="flex flex-col items-start md:items-end gap-6 w-full md:w-auto">
          {/* Social Icons */}
          <div className="flex items-center gap-5">
            <a
              href={`mailto:${socialLinks.email}`}
              className="text-[#9A9A9A] hover:text-[#4F8CFF] transition-colors duration-300"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9A9A9A] hover:text-[#4F8CFF] transition-colors duration-300"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9A9A9A] hover:text-[#4F8CFF] transition-colors duration-300"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            {socialLinks.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9A9A9A] hover:text-[#4F8CFF] transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
            )}
          </div>

          {/* Copyright Tag */}
          <span className="text-[11px] font-sans text-[#9A9A9A] opacity-60 tracking-wider">
            &copy; {currentYear} ADITHYAN P. All rights reserved.
          </span>
        </div>

      </Container>
    </footer>
  );
};
