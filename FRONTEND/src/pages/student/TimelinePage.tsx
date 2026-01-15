import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { IssueTimeline } from '@/components/shared/IssueTimeline';
import { mockIssues } from '@/data/mockData';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TimelinePage() {
  // Sort issues by most recently updated
  const sortedIssues = [...mockIssues].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Issue Timeline</h1>
          <p className="mt-1 text-muted-foreground">
            Track the progress of all your issues
          </p>
        </div>

        <div className="space-y-6">
          {sortedIssues.map((issue) => (
            <Card key={issue.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">{issue.title}</h3>
                  <p className="text-sm text-muted-foreground">{issue.location}</p>
                </div>
                <Badge 
                  variant={
                    issue.status === 'resolved' ? 'default' :
                    issue.status === 'in_progress' ? 'secondary' :
                    'outline'
                  }
                  className={
                    issue.status === 'resolved' ? 'bg-success text-success-foreground' :
                    issue.status === 'in_progress' ? 'bg-info text-info-foreground' :
                    ''
                  }
                >
                  {issue.status.replace('_', ' ')}
                </Badge>
              </div>
              <IssueTimeline events={issue.timeline} />
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
