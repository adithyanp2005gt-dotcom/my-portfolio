import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { navigationItems } from '../data/navigation';
import { Container } from '../components/layout/LayoutPrimitives';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('#home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Read or initialize light/dark theme preference from localStorage
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
  });

  // Apply layout transformations on HTML class list change
  useEffect(() => {
    if (themeMode === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('theme', themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Track page scroll to toggle background styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll spy observer to highlight navigation links
  useEffect(() => {
    if (!isHomePage) return;

    const sections = navigationItems.map(item => document.querySelector(item.hash));
    
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies the active viewing band
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.id) {
          setActiveSection(`#${entry.target.id}`);
        }
      });
    }, observerOptions);

    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, [isHomePage]);

  const handleNavClick = (hash: string) => {
    setMobileMenuOpen(false);
    
    if (!isHomePage) return; // Router links handle navigation to Home page first

    const target = document.querySelector(hash);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(hash);
      // Update URL hash without reload
      window.history.pushState(null, '', hash);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-bg/75 backdrop-blur-md border-b border-neutral-border py-4'
            : 'bg-transparent py-6 border-b border-transparent'
        }`}
      >
        <Container className="flex items-center justify-between">
          
          {/* Brand Monogram Link */}
          <Link
            to="/"
            onClick={() => handleNavClick('#home')}
            className="flex items-center gap-3 group focus:outline-none"
            aria-label="Adithyan Home"
          >
            <div className="w-8 h-8 rounded-[8px] overflow-hidden border border-neutral-border group-hover:border-accent transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full">
                <rect width="100" height="100" fill="#141414" />
                <path
                  d="M30 75 L50 25 L70 75 L85 75 M40 50 L60 50"
                  stroke="#F5F5F5"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  className="group-hover:stroke-accent transition-colors duration-300"
                />
              </svg>
            </div>
            <span className="font-sans font-medium text-xs tracking-[0.2em] uppercase text-primary">
              ADITHYAN P
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navigationItems.map((item) => {
              const isActive = isHomePage && activeSection === item.hash;
              
              return (
                <div key={item.label} className="relative py-2">
                  {isHomePage ? (
                    <button
                      onClick={() => handleNavClick(item.hash)}
                      className={`text-xs uppercase tracking-wider font-sans transition-colors duration-300 ${
                        isActive ? 'text-primary font-medium' : 'text-secondary hover:text-primary'
                      }`}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link
                      to={`/${item.hash}`}
                      className="text-xs uppercase tracking-wider font-sans text-secondary hover:text-primary transition-colors duration-300"
                    >
                      {item.label}
                    </Link>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-accent"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Call-to-action Button & Theme Toggle (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-[20px] border border-neutral-border text-secondary hover:text-accent hover:border-accent transition-all duration-300 cursor-pointer focus:outline-none"
              aria-label="Toggle theme mode"
            >
              {themeMode === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            {isHomePage ? (
              <button
                onClick={() => handleNavClick('#contact')}
                className="text-[10px] tracking-widest uppercase font-sans border border-neutral-border px-5 py-2.5 rounded-[20px] text-secondary hover:text-accent hover:border-accent transition-all duration-300 cursor-pointer"
              >
                Connect
              </button>
            ) : (
              <Link
                to="/#contact"
                className="text-[10px] tracking-widest uppercase font-sans border border-neutral-border px-5 py-2.5 rounded-[20px] text-secondary hover:text-accent hover:border-accent transition-all duration-300"
              >
                Connect
              </Link>
            )}
          </div>

          {/* Mobile Hamburguer Toggle & Theme controls */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-[12px] border border-neutral-border text-secondary hover:text-primary transition-all duration-300 focus:outline-none"
              aria-label="Toggle theme mode"
            >
              {themeMode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-secondary hover:text-primary focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </Container>
      </motion.nav>

      {/* Mobile Drawer Menu (Fades & Slide-in) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#090909]/95 backdrop-blur-lg z-40 md:hidden flex flex-col justify-center px-8"
          >
            <div className="flex flex-col gap-8 text-left">
              {navigationItems.map((item, idx) => {
                const isActive = isHomePage && activeSection === item.hash;
                
                return (
                  <motion.div
                    key={item.label}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {isHomePage ? (
                      <button
                        onClick={() => handleNavClick(item.hash)}
                        className={`text-2xl uppercase tracking-wider font-sans font-light text-left ${
                          isActive ? 'text-accent' : 'text-primary'
                        }`}
                      >
                        {item.label}
                      </button>
                    ) : (
                      <Link
                        to={`/${item.hash}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-2xl uppercase tracking-wider font-sans font-light text-primary"
                      >
                        {item.label}
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
