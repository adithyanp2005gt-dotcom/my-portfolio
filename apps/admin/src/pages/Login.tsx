import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '../../../portfolio/src/components/ui/Button';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Mock Authentication layer for initial console login
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        localStorage.setItem('adithyan_platform_token', 'mock_jwt_session_token');
        navigate('/dashboard');
      } else {
        setError('Invalid security credentials validation failed.');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-bg text-primary flex items-center justify-center font-sans px-6 select-none relative">
      
      {/* Grid Blueprint Background Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,%23141414_1px,transparent_1px),linear-gradient(to_bottom,%23141414_1px,transparent_1px)] bg-[size:30px_30px]" />
      
      <div className="max-w-md w-full relative z-10 bg-surface border border-neutral-border p-8 rounded-[20px] shadow-premium">
        
        {/* Top visual brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-[12px] bg-bg border border-neutral-border flex items-center justify-center text-accent mb-4">
            <ShieldCheck size={24} />
          </div>
          <h1 className="text-xl font-medium tracking-tight uppercase text-primary text-center">
            Security Clearance
          </h1>
          <p className="text-secondary text-[11px] uppercase tracking-widest mt-1 text-center opacity-60">
            Adithyan Platform Entry
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-[12px] bg-red-950/20 border border-red-900/40 text-red-400 text-xs font-light">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username */}
          <div className="space-y-2">
            <label htmlFor="username" className="text-[10px] uppercase tracking-wider text-secondary">
              Username
            </label>
            <input
              required
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
              className="w-full bg-bg border border-neutral-border focus:border-accent text-primary px-4 py-3 rounded-[12px] text-xs font-sans focus:outline-none transition-colors duration-300"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-[10px] uppercase tracking-wider text-secondary">
              Password
            </label>
            <input
              required
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-bg border border-neutral-border focus:border-accent text-primary px-4 py-3 rounded-[12px] text-xs font-sans focus:outline-none transition-colors duration-300"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Authenticating...' : (
                <span className="flex items-center gap-2">
                  Verify Credentials <ArrowRight size={14} />
                </span>
              )}
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
};
export default Login;
