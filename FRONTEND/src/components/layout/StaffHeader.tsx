import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockNotifications } from '@/data/mockData';
import { NotificationItem } from '@/components/shared/NotificationItem';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Link } from 'react-router-dom';

export function StaffHeader() {
  const [open, setOpen] = useState(false);
  const unreadNotifications = mockNotifications.filter(n => !n.read);

  return (
    <div className="flex items-center justify-end p-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadNotifications.length > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive text-destructive-foreground"
              >
                {unreadNotifications.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Notifications</h4>
              {unreadNotifications.length > 0 && (
                <Badge variant="secondary">
                  {unreadNotifications.length} new
                </Badge>
              )}
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto p-2 space-y-2">
            {mockNotifications.slice(0, 5).map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </div>
          <div className="p-3 border-t border-border">
            <Link to="/staff/notifications" onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full text-primary">
                View All Notifications
              </Button>
            </Link>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
