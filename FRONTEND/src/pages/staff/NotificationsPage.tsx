import { StaffDashboardLayout } from '@/components/layout/StaffDashboardLayout';
import { NotificationItem } from '@/components/shared/NotificationItem';
import { mockNotifications } from '@/data/mockData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCheck } from 'lucide-react';

export default function NotificationsPage() {
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <StaffDashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
            <p className="mt-1 text-muted-foreground">
              All your notifications ({mockNotifications.length} total)
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm">
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>

        {unreadCount > 0 && (
          <div className="flex items-center gap-2">
            <Badge className="bg-primary text-primary-foreground">
              {unreadCount} unread
            </Badge>
          </div>
        )}

        <div className="space-y-3">
          {mockNotifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>

        {mockNotifications.length === 0 && (
          <Card className="flex flex-col items-center justify-center p-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No notifications</h3>
            <p className="mt-2 text-muted-foreground">
              You're all caught up!
            </p>
          </Card>
        )}
      </div>
    </StaffDashboardLayout>
  );
}
