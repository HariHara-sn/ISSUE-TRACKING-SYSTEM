import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { StaffHeader } from './StaffHeader';

interface StaffDashboardLayoutProps {
  children: ReactNode;
}

export function StaffDashboardLayout({ children }: StaffDashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64 min-h-screen flex flex-col">
        <StaffHeader />
        <main className="flex-1">
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
