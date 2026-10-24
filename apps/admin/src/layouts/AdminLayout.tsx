import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Network, Cpu, Image, Settings, LogOut, ChevronLeft, ChevronRight, Menu } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adithyan_platform_token');
    localStorage.removeItem('adithyan_platform_refresh_token');
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={16} /> },
    { label: 'Projects', path: '/projects', icon: <FileText size={16} /> },
    { label: 'Research', path: '/research', icon: <Network size={16} /> },
    { label: 'Skills', path: '/skills', icon: <Cpu size={16} /> },
    { label: 'Media Library', path: '/media', icon: <Image size={16} /> },
    { label: 'Settings', path: '/settings', icon: <Settings size={16} /> }
  ];

  return (
    <div className="min-h-screen bg-bg text-primary flex font-sans select-none overflow-hidden">
      
      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar navigation drawer */}
      <aside
        className={`fixed md:relative z-30 h-full bg-bg border-r border-neutral-border flex flex-col justify-between py-6 transition-all duration-300 md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'w-64 md:w-20 px-6 md:px-3' : 'w-64 px-6'}`}
      >
        <div className="space-y-8">
          {/* Sidebar Top Logo Branding */}
          <div className="flex items-center justify-between gap-3 h-8">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-[6px] overflow-hidden border border-neutral-border">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full">
                    <rect width="100" height="100" fill="#141414" />
                    <path
                      d="M30 75 L50 25 L70 75 L85 75 M40 50 L60 50"
                      stroke="#F5F5F5"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </div>
                <span className="font-sans font-medium text-[10px] tracking-[0.2em] uppercase text-primary">
                  CONSOLE
                </span>
              </div>
            )}
            
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={`text-secondary hover:text-primary transition-colors focus:outline-none ${collapsed ? 'mx-auto' : ''}`}
              aria-label={collapsed ? 'Expand Menu' : 'Collapse Menu'}
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          {/* Nav Links list */}
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-xs font-medium uppercase tracking-wider transition-all duration-300 outline-none ${
                    isActive
                      ? 'bg-surface text-accent border border-neutral-border/50'
                      : 'text-secondary hover:bg-surface/30 hover:text-primary border border-transparent'
                  }`
                }
                title={collapsed ? item.label : undefined}
              >
                <span className="shrink-0">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Logout Option */}
        <div className="pt-6 border-t border-neutral-border/30">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-xs font-medium uppercase tracking-wider text-secondary hover:bg-red-950/20 hover:text-red-400 border border-transparent transition-all duration-300 outline-none ${
              collapsed ? 'justify-center' : ''
            }`}
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut size={16} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

      </aside>

      {/* Main workspace container */}
      <main className="flex-1 overflow-y-auto min-h-screen relative bg-bg/50">
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-neutral-border bg-bg/95 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="font-sans font-medium text-[10px] tracking-[0.2em] uppercase text-primary">
              CONSOLE
            </span>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="text-secondary hover:text-primary focus:outline-none"
          >
            <Menu size={20} />
          </button>
        </div>

        <Outlet />
      </main>

    </div>
  );
};
export default AdminLayout;
