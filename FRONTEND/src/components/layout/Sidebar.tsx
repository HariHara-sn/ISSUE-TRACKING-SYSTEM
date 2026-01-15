import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Bell, 
  Settings, 
  LogOut,
  Users,
  BarChart3,
  ClipboardList,
  Home,
  PlusCircle
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

export function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getNavItems = (): NavItem[] => {
    switch (user?.role) {
      case 'student':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', href: '/student' },
          { icon: PlusCircle, label: 'Report Issue', href: '/student/report' },
          { icon: AlertCircle, label: 'Open Issues', href: '/student/open' },
          { icon: CheckCircle, label: 'Resolved', href: '/student/resolved' },
          { icon: Clock, label: 'Timeline', href: '/student/timeline' },
        ];
      case 'staff':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', href: '/staff' },
          { icon: ClipboardList, label: 'Active Issues', href: '/staff/active' },
          { icon: Clock, label: 'Pending', href: '/staff/pending' },
          { icon: CheckCircle, label: 'Completed', href: '/staff/completed' },
          { icon: Bell, label: 'Notifications', href: '/staff/notifications' },
        ];
      case 'admin':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
          { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
          { icon: ClipboardList, label: 'Assign Issues', href: '/admin/assign' },
          { icon: Users, label: 'Users', href: '/admin/users' },
          { icon: Settings, label: 'Settings', href: '/admin/settings' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
          <Home className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-sidebar-foreground">IssueTrack</h1>
          <p className="text-xs text-muted-foreground capitalize">{user?.role} Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-sidebar-primary")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="border-t border-sidebar-border p-4">
        <div className="mb-3 flex items-center gap-3 rounded-lg bg-sidebar-accent/50 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
            {user?.name.charAt(0)}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-sidebar-foreground">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
