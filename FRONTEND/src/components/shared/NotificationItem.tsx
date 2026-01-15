import { Notification } from '@/types';
import { cn } from '@/lib/utils';
import { 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  XCircle 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
}

const typeConfig = {
  info: { icon: Info, className: 'text-info bg-info/10' },
  success: { icon: CheckCircle, className: 'text-success bg-success/10' },
  warning: { icon: AlertTriangle, className: 'text-warning bg-warning/10' },
  error: { icon: XCircle, className: 'text-destructive bg-destructive/10' },
};

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const config = typeConfig[notification.type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex gap-4 rounded-xl border border-border p-4 transition-all duration-200 cursor-pointer hover:bg-accent/50",
        !notification.read && "bg-accent/30 border-primary/20"
      )}
      onClick={onClick}
    >
      <div className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
        config.className
      )}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className={cn(
            "font-medium text-foreground",
            !notification.read && "font-semibold"
          )}>
            {notification.title}
          </h4>
          {!notification.read && (
            <span className="h-2 w-2 shrink-0 rounded-full bg-primary mt-2" />
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {notification.message}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}
