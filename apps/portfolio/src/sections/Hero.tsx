import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { Container, Section } from '../components/layout/LayoutPrimitives';
import { fadeUp, staggerContainer } from '../constants/animations';

export const Hero: React.FC = () => {
  const [heroText, setHeroText] = useState('I build intelligent AI and machine learning systems combining deep learning, computer vision, and reliable engineering.');
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isDarkVideoLoaded, setIsDarkVideoLoaded] = useState(false);
  
  const [isLight, setIsLight] = useState(() => 
    typeof document !== 'undefined' ? document.documentElement.classList.contains('light') : false
  );

  const lightVideoRef = useRef<HTMLVideoElement>(null);
  const darkVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isLight) {
      lightVideoRef.current?.play().catch(() => {});
      darkVideoRef.current?.pause();
    } else {
      darkVideoRef.current?.play().catch(() => {});
      lightVideoRef.current?.pause();
    }
  }, [isLight]);

  useEffect(() => {
    fetch('/api/v1/settings')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data && res.data.heroText) {
          setHeroText(res.data.heroText);
        }
      })
      .catch(() => {
        console.warn('Settings API offline. Using local static variables.');
      });
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsLight(document.documentElement.classList.contains('light'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const handleScrollTo = (id: string) => {
    const target = document.querySelector(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Section id="home" className="min-h-screen flex flex-col justify-center !pb-12 pt-24 relative overflow-hidden transition-colors duration-500">
      
      {/* BACKGROUND VIDEO LAYER - UNIFIED FOR BOTH THEMES */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        
        {/* ======================= */}
        {/* LIGHT MODE VIDEO & STYLE*/}
        {/* ======================= */}
        <div className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${isLight ? 'opacity-100' : 'opacity-0'}`}>
          {/* Light Mode: White Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/80 to-transparent z-10 mix-blend-normal" />
          
          {/* Light Mode: Soft Edge Mask & Video */}
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)'
            }}
          >
            {/* Loading State */}
            <div className={`absolute inset-0 bg-transparent transition-opacity duration-700 z-20 ${isVideoLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100 animate-pulse'}`} />
            
            <video
              ref={lightVideoRef}
              autoPlay
              muted
              loop
              playsInline
              onLoadedData={() => setIsVideoLoaded(true)}
              className="absolute inset-0 w-full h-full object-cover z-0 mix-blend-multiply brightness-[0.95] saturate-[0.7] contrast-[1.1] scale-[1.15] translate-x-[5%] translate-y-[5%]"
            >
              <source src="/hero-video.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        {/* ======================= */}
        {/* DARK MODE VIDEO & STYLE */}
        {/* ======================= */}
        <div className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${!isLight ? 'opacity-100' : 'opacity-0'}`}>
          {/* Dark Mode: Deep Navy/Black Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#090909] via-[#090909]/90 to-transparent z-10" />
          
          {/* Dark Mode: Additional Vignette & Subtle Blue Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(9,9,9,0.8)_100%)] z-10 mix-blend-multiply" />
          <div className="absolute top-0 left-0 w-1/2 h-full bg-blue-900/10 mix-blend-screen blur-[120px] z-10" />
          
          {/* Dark Mode: Soft Edge Mask & Video */}
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)'
            }}
          >
            {/* Loading State */}
            <div className={`absolute inset-0 bg-transparent transition-opacity duration-700 z-20 ${isDarkVideoLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100 animate-pulse'}`} />
            
            <video
              ref={darkVideoRef}
              autoPlay
              muted
              loop
              playsInline
              onLoadedData={() => setIsDarkVideoLoaded(true)}
              className="absolute inset-0 w-full h-full object-cover z-0 mix-blend-screen brightness-[0.85] saturate-[0.8] scale-[1.15] translate-x-[5%] translate-y-[5%]"
            >
              <source src="/hero-video-dark.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

      </div>

      <Container className="flex-1 flex flex-col justify-center relative z-10">
        
        <div className="grid grid-cols-1 items-center transition-all duration-700">
          {/* CONTENT - Text & Buttons */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start justify-center md:py-12 transition-all duration-700 max-w-xl"
          >
            <motion.div variants={fadeUp} className="mb-6">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium backdrop-blur-sm shadow-sm transition-colors duration-500 ${isLight ? 'bg-blue-50/80 border-blue-100/50 text-blue-600' : 'bg-blue-900/30 border-blue-700/50 text-blue-400'}`}>
                <span className={`w-2 h-2 rounded-full animate-pulse ${isLight ? 'bg-blue-500' : 'bg-blue-400'}`} />
                Available for new opportunities
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-primary leading-[1.05] mb-6 transition-colors duration-500"
            >
              ADITHYAN P
            </motion.h1>

            <motion.h2
              variants={fadeUp}
              className="text-xl sm:text-2xl text-secondary font-medium tracking-tight mb-6 transition-colors duration-500"
            >
              AI & ML Engineer
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-lg text-secondary font-light leading-relaxed mb-10 transition-colors duration-500"
            >
              {heroText}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <button
                onClick={() => handleScrollTo('#projects')}
                className={`px-8 py-4 rounded-2xl font-medium border shadow-sm transition-all duration-300 hover:-translate-y-0.5 ${isLight ? 'bg-white text-neutral-900 border-neutral-200 hover:bg-neutral-50' : 'bg-transparent text-white border-neutral-700 hover:bg-neutral-800'}`}
              >
                Explore Work
              </button>
              <button
                onClick={() => handleScrollTo('#contact')}
                className={`px-8 py-4 rounded-2xl font-medium border shadow-sm transition-all duration-300 hover:-translate-y-0.5 ${isLight ? 'bg-white text-neutral-900 border-neutral-200 hover:bg-neutral-50' : 'bg-transparent text-white border-neutral-700 hover:bg-neutral-800'}`}
              >
                Contact Me
              </button>
            </motion.div>
          </motion.div>

        </div>
      </Container>

      {/* Bottom status strip */}
      <Container className="pt-8 flex items-center justify-end text-secondary text-[10px] tracking-widest uppercase relative z-10 transition-colors duration-500">
        <button
          onClick={() => handleScrollTo('#philosophy')}
          className="flex items-center gap-2 hover:text-accent transition-colors duration-300 focus:outline-none"
        >
          Scroll to explore <ArrowDown size={10} className="animate-bounce" />
        </button>
      </Container>
    </Section>
  );
};


