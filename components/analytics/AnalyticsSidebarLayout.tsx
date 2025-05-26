// components/analytics/AnalyticsSidebarLayout.tsx

'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
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
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Props {
  children: React.ReactNode;
  active: string;
}

const userRoutes = [
  { name: 'guardians', label: 'Guardians', icon: Users },
  { name: 'learners', label: 'Learners', icon: Home },
  { name: 'schools', label: 'Schools', icon: School },
  { name: 'publishers', label: 'Publishers', icon: BookOpen },
  { name: 'partners', label: 'Partners', icon: Handshake },
];

const contentRoutes = [
  { name: 'books', label: 'Books', icon: BookOpen },
  { name: 'videos', label: 'Videos', icon: VideoIcon },
  { name: 'dals', label: 'Dals', icon: FileArchive },
  { name: 'simulations', label: 'Simulations', icon: SquareStack },
  { name: 'games', label: 'Games', icon: Gamepad2 },
];

export default function AnalyticsSidebarLayout({ children, active }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const isUserRoute = pathname.startsWith('/user-analysis');
  const routes = isUserRoute ? userRoutes : contentRoutes;

  return (
    <div className="flex h-screen overflow-hidden">
      <aside
        className={cn(
          'bg-muted border-r transition-all duration-300 ease-in-out',
          collapsed ? 'w-15' : 'w-60'
        )}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            {!collapsed && (
              <h2 className="text-lg font-semibold">
                {isUserRoute ? 'Users Analytics' : 'Content Analytics'}
              </h2>
            )}
            <button
              className="text-xs text-muted-foreground p-1"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <SidebarOpen className="h-4 w-4" /> : <SidebarClose className="h-4 w-4" />}
            </button>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-4">
            {routes.map((route) => (
              <Link
                key={route.name}
                href={`/${isUserRoute ? 'user-analysis' : 'content-analysis'}/${route.name}`}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active === route.name ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                )}
              >
                <route.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{route.label}</span>}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-6 bg-background">{children}</main>
    </div>
  );
}
