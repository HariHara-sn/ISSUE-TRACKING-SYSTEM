import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { IssueCard } from '@/components/shared/IssueCard';
import { StatsCard } from '@/components/shared/StatsCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
// import { mockIssues } from '@/data/mockData';
import { fetchStudentOpenIssues, fetchStudentAssignedIssues, fetchStudentResolvedIssues } from '@/services/issue.service';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Plus,
  ArrowRight
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Issue } from '@/types';
import { IssueTimeline } from '@/components/shared/IssueTimeline';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  
  const [openIssues, setOpenIssues] = useState<Issue[]>([]);
  const [resolvedIssues, setResolvedIssues] = useState<Issue[]>([]);
  const [inProgressIssues, setInProgressIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [open, assigned, resolved] = await Promise.all([
          fetchStudentOpenIssues(),
          fetchStudentAssignedIssues(),
          fetchStudentResolvedIssues()
        ]);
        setOpenIssues(open);
        setInProgressIssues(assigned);
        setResolvedIssues(resolved);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-8 animate-pulse">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-10 w-40" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {[1, 2].map((col) => (
              <div key={col} className="space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <div className="grid gap-4">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-48 rounded-xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="mt-1 text-muted-foreground">
              Track and manage your reported issues
            </p>
          </div>
          <Link to="/student/report">
            <Button variant="hero" size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Report New Issue
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="Open Issues"
            value={openIssues.length}
            icon={AlertCircle}
            iconClassName="bg-warning/10 text-warning"
          />
          <StatsCard
            title="In Progress"
            value={inProgressIssues.length}
            icon={Clock}
            iconClassName="bg-info/10 text-info"
          />
          <StatsCard
            title="Resolved"
            value={resolvedIssues.length}
            icon={CheckCircle}
            iconClassName="bg-success/10 text-success"
          />
        </div>

        {/* Main Content - 2 columns */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Open Issues - Show only 2 */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Open Issues</h2>
              <Link to="/student/open">
                <Button variant="ghost" size="sm" className="text-primary">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-4">
              {openIssues.slice(0, 2).map((issue) => (
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

          {/* Resolved Issues - Show only 2 */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Recently Resolved</h2>
              <Link to="/student/resolved">
                <Button variant="ghost" size="sm" className="text-primary">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-4">
              {resolvedIssues.slice(0, 2).map((issue) => (
                <IssueCard 
                  key={issue.id} 
                  issue={issue} 
                  onClick={() => setSelectedIssue(issue)}
                />
              ))}
            </div>
            {resolvedIssues.length === 0 && (
              <Card className="flex flex-col items-center justify-center p-12 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No resolved issues yet</h3>
                <p className="mt-2 text-muted-foreground">
                  Your resolved issues will appear here.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Issue Detail Dialog */}
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
