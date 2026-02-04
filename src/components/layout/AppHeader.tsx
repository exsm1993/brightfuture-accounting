import { ReactNode } from 'react';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export const AppHeader = ({ title, subtitle, actions }: AppHeaderProps) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search deals, people..." 
            className="w-64 pl-9"
          />
        </div>
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
        </Button>
        
        {actions}
        
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
          <span className="text-xs font-medium text-primary-foreground">AD</span>
        </div>
      </div>
    </header>
  );
};
