import { Issue } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Clock, 
  MapPin, 
  User,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Timer
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface IssueCardProps {
  issue: Issue;
  onClick?: () => void;
  showAssignee?: boolean;
}

const priorityConfig = {
  low: { label: 'Low', className: 'bg-muted text-muted-foreground' },
  medium: { label: 'Medium', className: 'bg-info/10 text-info' },
  high: { label: 'High', className: 'bg-warning/10 text-warning' },
  critical: { label: 'Critical', className: 'bg-destructive/10 text-destructive' },
};

const statusConfig = {
  submitted: { label: 'Submitted', icon: AlertCircle, className: 'text-muted-foreground' },
  assigned: { label: 'Assigned', icon: User, className: 'text-info' },
  in_progress: { label: 'In Progress', icon: Timer, className: 'text-warning' },
  resolved: { label: 'Resolved', icon: CheckCircle2, className: 'text-success' },
};

const categoryConfig = {
  lab: 'Lab',
  classroom: 'Classroom',
  hostel: 'Hostel',
  library: 'Library',
  cafeteria: 'Cafeteria',
  other: 'Other',
};

export function IssueCard({ issue, onClick, showAssignee = true }: IssueCardProps) {
  const priority = priorityConfig[issue.priority];
  const status = statusConfig[issue.status];
  const StatusIcon = status.icon;

  return (
    <Card
      className={cn(
        "group cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-card-hover",
        onClick && "hover:border-primary/30"
      )}
      onClick={onClick}
    >
      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {issue.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {issue.description}
            </p>
          </div>
          <Badge className={cn("shrink-0", priority.className)}>
            {priority.label}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{issue.location}</span>
          </div>
          <Badge variant="secondary" className="font-normal">
            {categoryConfig[issue.category]}
          </Badge>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-2">
            <StatusIcon className={cn("h-4 w-4", status.className)} />
            <span className={cn("text-sm font-medium", status.className)}>
              {status.label}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatDistanceToNow(issue.updatedAt, { addSuffix: true })}</span>
          </div>
        </div>

        {showAssignee && issue.assignedStaffName && (
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Assigned to: {issue.assignedStaffName}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
