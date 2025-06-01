'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

const sidebarRoutes = ['/profile', '/user-analysis', '/content-analysis'];

interface ClientLayoutProps {
  children: React.ReactNode;
  suppressHydrationWarning?: boolean;
}

export default function ClientLayout({ 
  children, 
  suppressHydrationWarning 
}: ClientLayoutProps) {
  const pathname = usePathname();
  const shouldShowSidebar = sidebarRoutes.some((route) => pathname.startsWith(route));

  if (shouldShowSidebar) {
    return <Sidebar suppressHydrationWarning={suppressHydrationWarning}>{children}</Sidebar>;
  }

  return (
    <main className="p-6" suppressHydrationWarning={suppressHydrationWarning}>
      {children}
    </main>
  );
}