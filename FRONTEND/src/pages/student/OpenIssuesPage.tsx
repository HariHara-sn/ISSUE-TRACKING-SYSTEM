import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { IssueCard } from '@/components/shared/IssueCard';
import { IssueTimeline } from '@/components/shared/IssueTimeline';
import { fetchStudentOpenIssues, fetchStudentAssignedIssues } from '@/services/issue.service';
import { Issue } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function OpenIssuesPage() {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [openIssues, setOpenIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadIssues = async () => {
      try {
        const [pending, assigned] = await Promise.all([
           fetchStudentOpenIssues(),
           fetchStudentAssignedIssues()
        ]);
        // Combine pending and assigned issues
        setOpenIssues([...pending, ...assigned]);
      } catch (error) {
        console.error("Failed to fetch open issues", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadIssues();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Open Issues</h1>
          <p className="mt-1 text-muted-foreground">
            All your unresolved issues ({openIssues.length} total)
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {openIssues.map((issue) => (
            <IssueCard 
              key={issue.id} 
              issue={issue} 
              onClick={() => setSelectedIssue(issue)}
            />
          ))}
        </div>

        {openIssues.length === 0 && (
          <Card className="flex flex-col items-center justify-center p-12 text-center">
            <CheckCircle className="h-12 w-12 text-success" />
            <h3 className="mt-4 text-lg font-semibold">All caught up!</h3>
            <p className="mt-2 text-muted-foreground">
              You have no open issues at the moment.
            </p>
          </Card>
        )}
      </div>

      <Dialog open={!!selectedIssue} onOpenChange={() => setSelectedIssue(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedIssue?.title}</DialogTitle>
          </DialogHeader>
          {selectedIssue && (
            <div className="mt-4 space-y-6">
              <p className="text-muted-foreground">{selectedIssue.description}</p>
              <div className="rounded-lg bg-muted/50 p-4">
                <h4 className="mb-4 font-semibold">Issue Timeline</h4>
                <IssueTimeline events={selectedIssue.timeline} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
