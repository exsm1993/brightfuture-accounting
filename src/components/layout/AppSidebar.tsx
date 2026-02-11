import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  CreditCard, 
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Building2,
  Settings,
  Truck,
  Tags,
  Phone,
  ChevronDown,
  ChevronRight,
  Wrench
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Deals', href: '/deals', icon: FileText },
  { name: 'Users', href: '/people', icon: Users },
  { name: 'Payables', href: '/payables', icon: CreditCard },
  { name: 'Payouts', href: '/payouts', icon: Wallet },
  { name: 'Income', href: '/income', icon: ArrowDownCircle },
  { name: 'Expenses', href: '/expenses', icon: ArrowUpCircle },
  { name: 'CC Expenses', href: '/reports/call-center-expenses', icon: Phone },
  { name: 'Accounts', href: '/accounts', icon: Building2 },
  { name: 'Tools', href: '/tools', icon: Wrench },
];

const settingsNavigation = [
  { name: 'Installers', href: '/settings/installers', icon: Truck },
  { name: 'Incentive Types', href: '/settings/incentive-types', icon: Tags },
  { name: 'Call Centers', href: '/settings/call-centers', icon: Phone },
];

export const AppSidebar = () => {
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(
    location.pathname.startsWith('/settings')
  );

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <Wallet className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-sidebar-foreground">FinanceHQ</h1>
            <p className="text-xs text-sidebar-muted">Commission Tracker</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-muted hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-sidebar-border p-3">
          <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-muted transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5" />
                Settings
              </div>
              {settingsOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-1 space-y-1 pl-4">
              {settingsNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-muted hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </NavLink>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </aside>
  );
};
