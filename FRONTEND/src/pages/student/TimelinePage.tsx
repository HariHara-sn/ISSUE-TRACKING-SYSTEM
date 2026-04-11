import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { IssueTimeline } from '@/components/shared/IssueTimeline';
import { fetchStudentOpenIssues, fetchStudentResolvedIssues } from '@/services/issue.service';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Issue } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

export default function TimelinePage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIssues = async () => {
      try {
        const [open, resolved] = await Promise.all([
          fetchStudentOpenIssues(),
          fetchStudentResolvedIssues()
        ]);
        const allIssues = [...open, ...resolved];
        // Sort issues by most recently updated
        allIssues.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        setIssues(allIssues);
      } catch (error) {
        console.error("Failed to load issues for timeline", error);
      } finally {
        setLoading(false);
      }
    };
    loadIssues();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </DashboardLayout>
    );
  }

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
          {issues.map((issue) => (
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
          {issues.length === 0 && (
            <Card className="flex flex-col items-center justify-center p-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No issues found</h3>
              <p className="mt-2 text-muted-foreground">
                You haven't reported any issues yet.
              </p>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
