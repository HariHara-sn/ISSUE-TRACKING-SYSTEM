import { useState, useEffect } from 'react';
import { StaffDashboardLayout } from '@/components/layout/StaffDashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, Loader2 } from 'lucide-react';
import { fetchStaffAssignedIssues, updateIssueStatus } from '@/services/issue.service';
import { Issue } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function PendingIssuesPage() {
  const { toast } = useToast();
  const [pendingIssues, setPendingIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const assigned = await fetchStaffAssignedIssues();
      setPendingIssues(assigned);
    } catch (error) {
      console.error("Failed to load staff assigned issues", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStartIssue = async (issueId: string) => {
    try {
      await updateIssueStatus(issueId, 'in_progress');
      toast({ title: "Working on it!", description: "Issue moved to active." });
      loadData();
    } catch (error) {
      toast({ title: "Error", description: "Could not start issue.", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <StaffDashboardLayout>
        <div className="flex h-[80vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </StaffDashboardLayout>
    );
  }

  return (
    <StaffDashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">New Assignments</h1>
          <p className="mt-1 text-muted-foreground">
            Issues assigned to you awaiting action ({pendingIssues.length} total)
          </p>
        </div>

        <div className="grid gap-4">
          {pendingIssues.map((issue) => (
            <Card key={issue.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground">{issue.title}</h3>
                    <Badge 
                      variant="outline"
                      className={
                        issue.priority === 'critical' ? 'border-destructive text-destructive' :
                        issue.priority === 'high' ? 'border-warning text-warning' :
                        issue.priority === 'medium' ? 'border-info text-info' :
                        'border-muted-foreground text-muted-foreground'
                      }
                    >
                      {issue.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {issue.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="font-medium">{issue.studentName}</span>
                    <span>•</span>
                    <span>{issue.location}</span>
                    <span>•</span>
                    <span className="capitalize">{issue.category}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Button size="sm" variant="hero" onClick={() => handleStartIssue(issue.id)}>
                    <Play className="mr-1 h-3 w-3" />
                    Start
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {pendingIssues.length === 0 && (
          <Card className="flex flex-col items-center justify-center p-12 text-center">
            <Clock className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No pending assignments</h3>
            <p className="mt-2 text-muted-foreground">
              You're all caught up on new assignments!
            </p>
          </Card>
        )}
      </div>
    </StaffDashboardLayout>
  );
}
