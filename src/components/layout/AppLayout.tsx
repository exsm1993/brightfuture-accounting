import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export const AppLayout = ({ children, title, subtitle, actions }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="pl-64">
        <AppHeader title={title} subtitle={subtitle} actions={actions} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
