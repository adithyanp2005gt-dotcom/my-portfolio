import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '../../../portfolio/src/components/ui/ErrorBoundary';

// Lazy load route pages to optimize dashboard bundle size
const Login = React.lazy(() => import('../pages/Login').then(m => ({ default: m.Login })));
const AdminLayout = React.lazy(() => import('../layouts/AdminLayout').then(m => ({ default: m.AdminLayout })));
const Dashboard = React.lazy(() => import('../pages/Dashboard').then(m => ({ default: m.Dashboard })));
const ProjectsCMS = React.lazy(() => import('../pages/ProjectsCMS').then(m => ({ default: m.ProjectsCMS })));
const ResearchCMS = React.lazy(() => import('../pages/ResearchCMS').then(m => ({ default: m.ResearchCMS })));
const SkillsCMS = React.lazy(() => import('../pages/SkillsCMS').then(m => ({ default: m.SkillsCMS })));
const MediaCMS = React.lazy(() => import('../pages/MediaCMS').then(m => ({ default: m.MediaCMS })));
const SettingsCMS = React.lazy(() => import('../pages/SettingsCMS').then(m => ({ default: m.SettingsCMS })));

// Initialise React Query Client for dynamic client side caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

// A lightweight route protection wrapper checking session validity
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('adithyan_platform_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Suspense fallback={
            <div className="min-h-screen bg-bg text-secondary flex items-center justify-center font-mono text-[10px] uppercase tracking-[0.3em]">
              loading platform console
            </div>
          }>
            <Routes>
              {/* Public Authenticator Endpoint */}
              <Route path="/login" element={<Login />} />

              {/* Protected Administrative Dashboard Layout */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="projects" element={<ProjectsCMS />} />
                <Route path="research" element={<ResearchCMS />} />
                <Route path="skills" element={<SkillsCMS />} />
                <Route path="media" element={<MediaCMS />} />
                <Route path="settings" element={<SettingsCMS />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
export default App;
