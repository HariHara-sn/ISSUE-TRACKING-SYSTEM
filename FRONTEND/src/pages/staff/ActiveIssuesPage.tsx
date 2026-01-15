import { StaffDashboardLayout } from '@/components/layout/StaffDashboardLayout';
import { IssueCard } from '@/components/shared/IssueCard';
import { mockIssues } from '@/data/mockData';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function ActiveIssuesPage() {
  const activeIssues = mockIssues.filter(i => 
    i.assignedStaffId === '2' && i.status !== 'resolved'
  );

  return (
    <StaffDashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Active Issues</h1>
          <p className="mt-1 text-muted-foreground">
            Issues currently assigned to you ({activeIssues.length} total)
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} showAssignee={false} />
          ))}
        </div>

        {activeIssues.length === 0 && (
          <Card className="flex flex-col items-center justify-center p-12 text-center">
            <CheckCircle className="h-12 w-12 text-success" />
            <h3 className="mt-4 text-lg font-semibold">No active issues</h3>
            <p className="mt-2 text-muted-foreground">
              You don't have any active issues at the moment.
            </p>
          </Card>
        )}
      </div>
    </StaffDashboardLayout>
  );
}
