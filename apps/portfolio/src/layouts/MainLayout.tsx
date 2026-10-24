import React, { useEffect, useState, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ScrollProgress } from './ScrollProgress';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Track theme state by observing the HTML class to sync with Navbar's localStorage logic
  const [isLight, setIsLight] = useState(() =>
    document.documentElement.classList.contains('light')
  );

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isLight) {
      videoRef.current?.play().catch(() => {});
    } else {
      videoRef.current?.pause();
    }
  }, [isLight]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsLight(document.documentElement.classList.contains('light'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen bg-bg text-primary overflow-x-hidden selection:bg-accent/20">

      {/* 2px Electric Blue Progress Indicator */}
      <ScrollProgress />

      {/* Signature Animated Node Network Background (Fades out in Light Mode) */}
      <div
        className={`fixed inset-0 z-0 transition-opacity duration-300 ease-in-out pointer-events-none ${!isLight ? 'opacity-100' : 'opacity-0'
          }`}
      >
        <AnimatedBackground />
      </div>

      {/* Homepage Light Mode Video Background */}
      {isHomePage && (
        <div
          className={`fixed inset-0 z-0 transition-opacity duration-300 ease-in-out pointer-events-none ${isLight ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover scale-[1.15] translate-x-[5%] translate-y-[5%]"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          {/* Subtle white overlay for readability (20%) */}
          <div className="absolute inset-0 bg-white/20" />
        </div>
      )}

      {/* Global Navigation Header */}
      <Navbar />

      {/* Routed Main View Area */}
      <main className="relative z-10 w-full min-h-[calc(100vh-200px)]">
        <Outlet />
      </main>

      {/* Global Footer */}
      <Footer />

    </div>
  );
};
