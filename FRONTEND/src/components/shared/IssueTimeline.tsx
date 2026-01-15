import { TimelineEvent, IssueStatus } from '@/types';
import { cn } from '@/lib/utils';
import { 
  Send, 
  UserCheck, 
  Wrench, 
  CheckCircle2 
} from 'lucide-react';
import { format } from 'date-fns';

interface IssueTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

const statusConfig: Record<IssueStatus, { icon: React.ElementType; label: string; color: string }> = {
  submitted: { icon: Send, label: 'Submitted', color: 'text-muted-foreground bg-muted' },
  assigned: { icon: UserCheck, label: 'Assigned', color: 'text-info bg-info/10' },
  in_progress: { icon: Wrench, label: 'In Progress', color: 'text-warning bg-warning/10' },
  resolved: { icon: CheckCircle2, label: 'Resolved', color: 'text-success bg-success/10' },
};

export function IssueTimeline({ events, className }: IssueTimelineProps) {
  return (
    <div className={cn("relative", className)}>
      {events.map((event, index) => {
        const config = statusConfig[event.status];
        const Icon = config.icon;
        const isLast = index === events.length - 1;

        return (
          <div key={event.id} className="relative flex gap-4 pb-8 last:pb-0">
            {/* Vertical line */}
            {!isLast && (
              <div className="absolute left-5 top-10 h-full w-0.5 bg-border" />
            )}
            
            {/* Icon */}
            <div className={cn(
              "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
              config.color
            )}>
              <Icon className="h-5 w-5" />
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-foreground">{config.label}</h4>
                <span className="text-xs text-muted-foreground">
                  {format(event.timestamp, 'MMM d, yyyy • h:mm a')}
                </span>
              </div>
              {event.staffName && (
                <p className="mt-1 text-sm text-muted-foreground">
                  By {event.staffName}
                </p>
              )}
              {event.note && (
                <p className="mt-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                  {event.note}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
