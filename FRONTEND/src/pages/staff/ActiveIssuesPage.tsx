import { useState, useEffect } from 'react';
import { StaffDashboardLayout } from '@/components/layout/StaffDashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, CheckCircle2, Loader2, Eye } from 'lucide-react';
import { fetchStaffActiveIssues, updateIssueStatus } from '@/services/issue.service';
import { Issue } from '@/types';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ActiveIssuesPage() {
  const { toast } = useToast();
  const [activeIssues, setActiveIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const issues = await fetchStaffActiveIssues();
      setActiveIssues(issues);
    } catch (error) {
      console.error("Failed to load staff active issues", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleResolveIssue = async (issueId: string) => {
    try {
      await updateIssueStatus(issueId, 'resolved');
      toast({ title: "Issue Resolved!", description: "Great job completing the work." });
      loadData();
    } catch (error) {
      toast({ title: "Error", description: "Could not resolve issue.", variant: "destructive" });
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
          <h1 className="text-2xl font-bold text-foreground">Active Issues</h1>
          <p className="mt-1 text-muted-foreground">
            Issues currently in progress ({activeIssues.length} total)
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeIssues.map((issue) => (
            <Card key={issue.id} className="flex flex-col group overflow-hidden transition-all duration-300 hover:shadow-lg border-l-4 border-l-info">
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="capitalize">
                      {issue.category}
                    </Badge>
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
                  <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="mb-4">
                  <h3 className="mb-2 font-semibold leading-tight text-foreground line-clamp-2">
                    {issue.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {issue.description}
                    </p>
                    {issue.previewImage && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-5 w-5 shrink-0 text-muted-foreground hover:text-foreground"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl" onClick={(e) => e.stopPropagation()}>
                          <DialogHeader>
                            <DialogTitle>Issue Image</DialogTitle>
                          </DialogHeader>
                          <div className="mt-2 flex items-center justify-center overflow-hidden rounded-lg bg-muted/20 p-2">
                            <img 
                              src={issue.previewImage} 
                              alt={issue.title} 
                              className="max-h-[80vh] w-full object-contain"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-muted-foreground">Location</span>
                      <span className="font-medium text-foreground">{issue.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 bg-muted/30 border-t border-border">
                <Button 
                  className="w-full" 
                  variant="hero" 
                  onClick={() => handleResolveIssue(issue.id)}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark as Resolved
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {activeIssues.length === 0 && (
          <Card className="flex flex-col items-center justify-center p-12 text-center">
            <CheckCircle className="h-12 w-12 text-success" />
            <h3 className="mt-4 text-lg font-semibold">No active issues</h3>
            <p className="mt-2 text-muted-foreground">
              You don't have any issues in progress at the moment.
            </p>
          </Card>
        )}
      </div>
    </StaffDashboardLayout>
  );
}
