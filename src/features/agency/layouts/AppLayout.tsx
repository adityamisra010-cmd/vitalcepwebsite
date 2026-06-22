'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import {
  LayoutDashboard, Users, Briefcase, ImageIcon,
  MessageSquare, CheckCircle2, Palette, BarChart3,
  Activity, Settings, Bell, Search, Zap,
  ChevronDown, ChevronRight, Menu,
  Crown, Pen, Eye
} from 'lucide-react';
import { useRole, type Role } from '../context/RoleContext';
import { useNavigate } from '../lib/navigation';
import { cn } from '../lib/utils';

const navItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard, exact: true },
  { label: 'Clients', path: '/clients', icon: Users },
  { label: 'Campaigns', path: '/campaigns', icon: Briefcase },
  { label: 'Assets', path: '/assets', icon: ImageIcon },
  { label: 'Reviews', path: '/assets', icon: MessageSquare, query: '?view=kanban' },
  { label: 'Approvals', path: '/approvals', icon: CheckCircle2 },
  { label: 'Brand Kits', path: '/brand-kits', icon: Palette },
  { label: 'Analytics', path: '/analytics', icon: BarChart3, founderOnly: true },
  { label: 'Activity', path: '/activity', icon: Activity },
  { label: 'Settings', path: '/settings', icon: Settings },
];

const roleIcons: Record<Role, ReactNode> = {
  founder: <Crown size={13} />,
  designer: <Pen size={13} />,
  client: <Eye size={13} />,
};

const roleColors: Record<Role, string> = {
  founder: '#7c3aed',
  designer: '#3b82f6',
  client: '#059669',
};

export default function AppLayout({ children }: { children: ReactNode }) {
  const { role, setRole } = useRole();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const navigate = useNavigate();
  const pathname = usePathname();

  const visibleNav = navItems.filter(item => {
    if (item.founderOnly && role !== 'founder') return false;
    if (role === 'client' && ['Clients', 'Campaigns', 'Brand Kits', 'Analytics'].includes(item.label)) return false;
    if (item.label === 'Reviews') return false; // merged into Assets
    return true;
  });

  const getBreadcrumb = () => {
    const path = pathname;
    if (path === '/') return [{ label: 'Dashboard' }];
    if (path.includes('/review')) return [{ label: 'Assets', path: '/assets' }, { label: 'Asset', path: path.replace('/review','') }, { label: 'Review Interface' }];
    if (path.includes('/consolidation')) return [{ label: 'Assets', path: '/assets' }, { label: 'Asset', path: path.replace('/consolidation','') }, { label: 'AI Consolidation' }];
    if (path.includes('/revision-package')) return [{ label: 'Assets', path: '/assets' }, { label: 'Asset', path: path.replace('/revision-package','') }, { label: 'Revision Package' }];
    if (path.includes('/ai-prompt')) return [{ label: 'Assets', path: '/assets' }, { label: 'Asset', path: path.replace('/ai-prompt','') }, { label: 'AI Prompt' }];
    if (path.startsWith('/assets/')) return [{ label: 'Assets', path: '/assets' }, { label: 'Asset Detail' }];
    const found = navItems.find(n => n.path === path);
    if (found) return [{ label: found.label }];
    return [{ label: 'Page' }];
  };

  const breadcrumb = getBreadcrumb();

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          'flex-shrink-0 flex flex-col border-r transition-all duration-200 overflow-hidden',
          'bg-sidebar border-sidebar-border',
          sidebarOpen ? 'w-56' : 'w-14'
        )}
      >
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-sidebar-border gap-3 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Zap size={14} className="text-white" />
          </div>
          {sidebarOpen && (
            <span className="font-semibold text-sm tracking-tight text-sidebar-foreground truncate" style={{ fontFamily: 'var(--font-display)' }}>
              Agency OS
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto">
          <ul className="space-y-0.5 px-2">
            {visibleNav.map((item) => {
              const isActive = item.exact
                ? pathname === item.path
                : pathname === item.path || pathname.startsWith(item.path + '/');

              return (
                <li key={item.label}>
                  <Link
                    href={item.path}
                    className={cn(
                      'flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-all duration-100 group',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-foreground font-medium'
                        : 'text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                    )}
                  >
                    <item.icon
                      size={16}
                      className={cn(
                        'flex-shrink-0 transition-colors',
                        isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-sidebar-foreground'
                      )}
                    />
                    {sidebarOpen && <span className="truncate">{item.label}</span>}
                    {isActive && sidebarOpen && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Role Switcher (Demo) */}
        <div className="px-2 pb-3 border-t border-sidebar-border pt-3 flex-shrink-0">
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className={cn(
                'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors',
                'hover:bg-sidebar-accent text-sidebar-foreground'
              )}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white"
                style={{ backgroundColor: roleColors[role] }}
              >
                {roleIcons[role]}
              </div>
              {sidebarOpen && (
                <>
                  <div className="flex-1 text-left min-w-0">
                    <div className="text-xs font-medium truncate">
                      {role === 'founder' ? 'Maya Chen' : role === 'designer' ? 'Alex Kim' : 'Elena Vasquez'}
                    </div>
                    <div className="text-[10px] text-muted-foreground capitalize">{role}</div>
                  </div>
                  <ChevronDown size={12} className="text-muted-foreground flex-shrink-0" />
                </>
              )}
            </button>

            {roleMenuOpen && (
              <div className="absolute bottom-full left-0 mb-1 w-48 bg-popover border border-border rounded-lg shadow-xl py-1 z-50">
                <div className="px-3 py-1.5 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Switch Role (Demo)</div>
                {(['founder', 'designer', 'client'] as Role[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => { setRole(r); setRoleMenuOpen(false); navigate('/'); }}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-secondary transition-colors',
                      role === r ? 'text-foreground font-medium' : 'text-muted-foreground'
                    )}
                  >
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px]" style={{ backgroundColor: roleColors[r] }}>
                      {roleIcons[r]}
                    </div>
                    <span className="capitalize">{r}</span>
                    {role === r && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <header className="h-14 flex items-center px-4 gap-3 border-b border-border flex-shrink-0 bg-background/80 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <Menu size={16} />
          </button>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-sm min-w-0">
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1 min-w-0">
                {i > 0 && <ChevronRight size={12} className="text-muted-foreground flex-shrink-0" />}
                {crumb.path ? (
                  <button onClick={() => navigate(crumb.path!)} className="text-muted-foreground hover:text-foreground transition-colors truncate">
                    {crumb.label}
                  </button>
                ) : (
                  <span className="text-foreground font-medium truncate">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 bg-secondary rounded-md px-3 py-1.5 text-sm text-muted-foreground border border-border/50 w-52">
              <Search size={14} />
              <span>Search...</span>
              <kbd className="ml-auto text-[10px] bg-muted/50 px-1.5 py-0.5 rounded text-muted-foreground">⌘K</kbd>
            </div>
            {/* Notifications */}
            <button className="relative p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
