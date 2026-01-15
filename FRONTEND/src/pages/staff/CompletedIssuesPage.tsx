import { StaffDashboardLayout } from '@/components/layout/StaffDashboardLayout';
import { IssueCard } from '@/components/shared/IssueCard';
import { mockIssues } from '@/data/mockData';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function CompletedIssuesPage() {
  const completedIssues = mockIssues.filter(i => 
    i.assignedStaffId === '2' && i.status === 'resolved'
  );

  return (
    <StaffDashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Completed Issues</h1>
          <p className="mt-1 text-muted-foreground">
            All issues you have resolved ({completedIssues.length} total)
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {completedIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} showAssignee={false} />
          ))}
        </div>

        {completedIssues.length === 0 && (
          <Card className="flex flex-col items-center justify-center p-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No completed issues yet</h3>
            <p className="mt-2 text-muted-foreground">
              Your resolved issues will appear here.
            </p>
          </Card>
        )}
      </div>
    </StaffDashboardLayout>
  );
}
