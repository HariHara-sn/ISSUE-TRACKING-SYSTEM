import { useState, useEffect } from 'react';
import { StaffDashboardLayout } from '@/components/layout/StaffDashboardLayout';
import { IssueCard } from '@/components/shared/IssueCard';
import { NotificationItem } from '@/components/shared/NotificationItem';
import { StatsCard } from '@/components/shared/StatsCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockNotifications } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle,
  Bell,
  ArrowRight,
  Play,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchStaffAssignedIssues, fetchStaffActiveIssues, fetchStaffResolvedIssues, updateIssueStatus } from '@/services/issue.service';
import { Issue } from '@/types';

export default function StaffDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [activeIssues, setActiveIssues] = useState<Issue[]>([]);
  const [pendingIssues, setPendingIssues] = useState<Issue[]>([]);
  const [completedIssues, setCompletedIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  const unreadNotifications = mockNotifications.filter(n => !n.read);

  const loadData = async () => {
    try {
      const [active, assigned, resolved] = await Promise.all([
        fetchStaffActiveIssues(),
        fetchStaffAssignedIssues(),
        fetchStaffResolvedIssues()
      ]);
      setActiveIssues(active);
      setPendingIssues(assigned);
      setCompletedIssues(resolved);
    } catch (error) {
      console.error("Failed to load staff dashboard data", error);
      toast({ title: "Error", description: "Failed to load dashboard data.", variant: "destructive" });
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
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Good morning, {user?.name?.split(' ')[0] || 'Staff'}!
          </h1>
          <p className="mt-1 text-muted-foreground">
            Here's your workload overview for today
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Active Issues"
            value={activeIssues.length}
            icon={ClipboardList}
            iconClassName="bg-primary/10 text-primary"
          />
          <StatsCard
            title="Pending Approval"
            value={pendingIssues.length}
            icon={Clock}
            iconClassName="bg-warning/10 text-warning"
          />
          <StatsCard
            title="Completed"
            value={completedIssues.length}
            icon={CheckCircle}
            iconClassName="bg-success/10 text-success"
          />
          <StatsCard
            title="Notifications"
            value={unreadNotifications.length}
            icon={Bell}
            iconClassName="bg-info/10 text-info"
          />
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Active Issues */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-foreground">Active Issues</h2>
                  <Badge variant="secondary">{activeIssues.length}</Badge>
                </div>
                <Link to="/staff/active">
                  <Button variant="ghost" size="sm" className="text-primary">
                    View All <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid gap-4">
                {activeIssues.slice(0, 2).map((issue) => (
                  <IssueCard key={issue.id} issue={issue} showAssignee={false} />
                ))}
                {activeIssues.length === 0 && (
                  <Card className="flex flex-col items-center justify-center p-8 text-center">
                    <CheckCircle className="h-10 w-10 text-success" />
                    <p className="mt-3 text-muted-foreground">No active issues</p>
                  </Card>
                )}
              </div>
            </div>

            {/* Pending Issues */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-foreground">New Assignments</h2>
                  <Badge className="bg-warning/10 text-warning">{pendingIssues.length}</Badge>
                </div>
                <Link to="/staff/pending">
                  <Button variant="ghost" size="sm" className="text-primary">
                    View All <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid gap-4">
                {pendingIssues.slice(0, 2).map((issue) => (
                  <Card key={issue.id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{issue.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                          {issue.description}
                        </p>
                        <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{issue.studentName}</span>
                          <span>•</span>
                          <span>{issue.location}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="hero" onClick={() => handleStartIssue(issue.id)}>
                        <Play className="mr-1 h-3 w-3" />
                        Start
                      </Button>
                    </div>
                  </Card>
                ))}
                {pendingIssues.length === 0 && (
                  <Card className="flex flex-col items-center justify-center p-8 text-center">
                    <CheckCircle className="h-10 w-10 text-success" />
                    <p className="mt-3 text-muted-foreground">No pending assignments</p>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Recent Notifications - Only 2 */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Recent Notifications</h2>
              <Link to="/staff/notifications">
                <Button variant="ghost" size="sm" className="text-primary">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {mockNotifications.slice(0, 2).map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </div>
          </div>
        </div>

        {/* Completed Issues */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Recently Completed</h2>
            <Link to="/staff/completed">
              <Button variant="ghost" size="sm" className="text-primary">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {completedIssues.slice(0, 3).map((issue) => (
              <IssueCard key={issue.id} issue={issue} showAssignee={false} />
            ))}
            {completedIssues.length === 0 && (
              <Card className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                <ClipboardList className="h-10 w-10 text-muted-foreground" />
                <p className="mt-3 text-muted-foreground">No completed issues yet</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </StaffDashboardLayout>
  );
}
