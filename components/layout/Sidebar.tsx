'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import {
  Home,
  Users,
  School,
  BookOpen,
  Handshake,
  SidebarOpen,
  SidebarClose,
  VideoIcon,
  FileArchive,
  SquareStack,
  Gamepad2,
  Settings,
  Lock,
  User,
  ShieldQuestion,
} from 'lucide-react';

const routesConfig = {
  '/user-analysis': {
    title: 'Users Analytics',
    routes: [
      { name: 'guardians', label: 'Guardians', icon: Users },
      { name: 'learners', label: 'Learners', icon: Home },
      { name: 'schools', label: 'Schools', icon: School },
      { name: 'publishers', label: 'Publishers', icon: BookOpen },
      { name: 'partners', label: 'Partners', icon: Handshake },
    ],
  },
  '/content-analysis': {
    title: 'Content Analytics',
    routes: [
      { name: 'books', label: 'Books', icon: BookOpen },
      { name: 'videos', label: 'Videos', icon: VideoIcon },
      { name: 'dals', label: 'Dals', icon: FileArchive },
      { name: 'simulations', label: 'Simulations', icon: SquareStack },
      { name: 'games', label: 'Games', icon: Gamepad2 },
    ],
  },
  '/profile': {
    title: 'Profile',
    routes: [
      { name: '', label: 'Profile Overview', icon: User },
      { name: 'security-questions', label: 'Security Questions', icon: ShieldQuestion },
      { name: 'change-password', label: 'Change Password', icon: Lock },
      { name: 'settings', label: 'Settings', icon: Settings },
    ],
  },
} as const;

type RouteKey = keyof typeof routesConfig;

interface SidebarProps {
  children: React.ReactNode;
  suppressHydrationWarning?: boolean;
}

export default function Sidebar({ children, suppressHydrationWarning }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useLocalStorage<boolean>('sidebarCollapsed', false);
  const [mounted, setMounted] = useState(false);

  // Wait for component to mount before rendering to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const matchedRoot = (Object.keys(routesConfig) as RouteKey[]).find((key) =>
    pathname.startsWith(key)
  );

  if (!matchedRoot) return <main className="flex-1 p-6" suppressHydrationWarning={suppressHydrationWarning}>{children}</main>;

  const { title, routes } = routesConfig[matchedRoot];

  // Show a loading state or default state until mounted
  if (!mounted) {
    return (
      <div className="flex h-screen overflow-hidden" suppressHydrationWarning={suppressHydrationWarning}>
        <aside className="bg-muted border-r transition-all duration-300 ease-in-out w-60">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b pt-18">
              <h2 className="text-lg font-semibold">{title}</h2>
              <button className="text-xs text-muted-foreground p-1">
                <SidebarClose className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-4">
              {routes.map((route) => {
                const routePath = `${matchedRoot}${route.name ? `/${route.name}` : ''}`;
                const isActive = pathname === routePath;

                return (
                  <Link
                    key={routePath}
                    href={routePath}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                    )}
                  >
                    <route.icon className="h-5 w-5 shrink-0" />
                    <span>{route.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto p-6 bg-background">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" suppressHydrationWarning={suppressHydrationWarning}>
      <aside
        className={cn(
          'bg-muted border-r transition-all duration-300 ease-in-out',
          collapsed ? 'w-15' : 'w-60'
        )}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b pt-18">
            {!collapsed && <h2 className="text-lg font-semibold">{title}</h2>}
            <button
              className="text-xs text-muted-foreground p-1"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <SidebarOpen className="h-4 w-4" /> : <SidebarClose className="h-4 w-4" />}
            </button>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-4">
            {routes.map((route) => {
              const routePath = `${matchedRoot}${route.name ? `/${route.name}` : ''}`;
              const isActive = pathname === routePath;

              return (
                <Link
                  key={routePath}
                  href={routePath}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                  )}
                >
                  <route.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{route.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-6 bg-background">{children}</main>
    </div>
  );
}