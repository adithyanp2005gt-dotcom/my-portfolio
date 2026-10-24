import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { useLenis } from '../hooks/useLenis';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import { injectPersonSchema } from '../utils/seo';

// Route-based code splitting for production chunk optimization
const Home = React.lazy(() => import('../pages/Home').then(m => ({ default: m.Home })));
const ProjectDetail = React.lazy(() => import('../pages/ProjectDetail').then(m => ({ default: m.ProjectDetail })));
const NotFound = React.lazy(() => import('../pages/NotFound').then(m => ({ default: m.NotFound })));

export const App: React.FC = () => {
  const [showLoader, setShowLoader] = useState(true);

  // Initialise Lenis smooth scroll mechanism
  useLenis();

  useEffect(() => {
    // Inject Person JSON-LD Schema Markup
    injectPersonSchema();
  }, []);

  return (
    <ErrorBoundary>
      {/* Visual draw loading gate */}
      <LoadingScreen onComplete={() => setShowLoader(false)} />

      {!showLoader && (
        <BrowserRouter>
          <Suspense fallback={
            <div className="min-h-screen bg-bg text-secondary flex items-center justify-center font-mono text-[10px] uppercase tracking-[0.3em]">
              Initialising Route Segment
            </div>
          }>
            <Routes>
              {/* App Shell wrapper */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="projects/:slug" element={<ProjectDetail />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      )}
    </ErrorBoundary>
  );
};
export default App;
