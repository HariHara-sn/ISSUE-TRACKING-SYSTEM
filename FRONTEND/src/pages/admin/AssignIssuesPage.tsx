import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, AlertCircle, Eye, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { fetchUnassignedIssues, fetchAllAssignedIssues, fetchStaffList, assignIssue } from '@/services/issue.service';
import { Issue, User } from '@/types';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AssignIssuesPage() {
  const { toast } = useToast();
  const [pendingIssues, setPendingIssues] = useState<Issue[]>([]);
  const [assignedIssues, setAssignedIssues] = useState<Issue[]>([]);
  const [staffList, setStaffList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignmentMap, setAssignmentMap] = useState<Record<string, string>>({});
  const [assigning, setAssigning] = useState<Record<string, boolean>>({});

  const loadData = async () => {
    setLoading(true);
    try {
      const [pending, assigned, staff] = await Promise.all([
        fetchUnassignedIssues(),
        fetchAllAssignedIssues(),
        fetchStaffList()
      ]);
      setPendingIssues(pending);
      setAssignedIssues(assigned);
      setStaffList(staff);
    } catch (error) {
      console.error("Failed to load data", error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStaffSelect = (issueId: string, staffId: string) => {
    setAssignmentMap(prev => ({ ...prev, [issueId]: staffId }));
  };

  const handleAssignClick = async (issueId: string, isReassign = false) => {
    const staffId = assignmentMap[issueId];
    if (!staffId) return;

    setAssigning(prev => ({ ...prev, [issueId]: true }));
    try {
      await assignIssue(issueId, staffId);
      
      const staffMember = staffList.find(s => s.id === staffId);
      toast({
        title: isReassign ? "Issue Reassigned" : "Issue Assigned",
        description: `Issue has been ${isReassign ? 'reassigned' : 'assigned'} to ${staffMember?.name}`,
        variant: "default"
      });

      // Refresh data to reflect changes (move from pending to assigned, or update assigned)
      loadData();
      
      // Cleanup map
      setAssignmentMap(prev => {
        const next = { ...prev };
        delete next[issueId];
        return next;
      });

    } catch (error) {
      console.error("Failed to assign issue", error);
      toast({
        title: "Assignment Failed",
        description: "Could not assign issue to staff member",
        variant: "destructive"
      });
    } finally {
      setAssigning(prev => ({ ...prev, [issueId]: false }));
    }
  };

  const IssueTable = ({ issues, isAssignedTab = false }: { issues: Issue[], isAssignedTab?: boolean }) => (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-border bg-muted/30">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Issue</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Student</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Category</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Location</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Priority</th>
              {isAssignedTab && (
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Assigned To</th>
              )}
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                {isAssignedTab ? "Reassign To" : "Assign To"}
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {issues.map((issue) => (
              <tr key={issue.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-foreground">{issue.title}</p>
                    <div className="flex items-center gap-2">
                       <p className="text-sm text-muted-foreground line-clamp-1">{issue.description}</p>
                       {issue.previewImage && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-5 w-5 text-muted-foreground hover:text-foreground"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl" onClick={(e) => e.stopPropagation()}>
                              <DialogHeader>
                                <DialogTitle>Issue Image Preview</DialogTitle>
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
                </td>
                <td className="px-6 py-4 text-sm text-foreground">{issue.studentName}</td>
                <td className="px-6 py-4">
                  <Badge variant="secondary" className="capitalize">{issue.category}</Badge>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{issue.location}</td>
                <td className="px-6 py-4">
                  <Badge 
                    className={
                      issue.priority === 'critical' ? 'bg-destructive/10 text-destructive' :
                      issue.priority === 'high' ? 'bg-warning/10 text-warning' :
                      issue.priority === 'medium' ? 'bg-info/10 text-info' :
                      'bg-muted text-muted-foreground'
                    }
                  >
                    {issue.priority}
                  </Badge>
                </td>
                {isAssignedTab && (
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    {issue.assignedStaffName || "Unassigned"}
                  </td>
                )}
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <Select onValueChange={(value) => handleStaffSelect(issue.id, value)} value={assignmentMap[issue.id] || ""}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select staff" />
                      </SelectTrigger>
                      <SelectContent>
                        {staffList.map((staff) => (
                          <SelectItem key={staff.id} value={staff.id}>
                            {staff.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Button 
                    variant={isAssignedTab ? "outline" : "hero"} 
                    size="sm"
                    disabled={!assignmentMap[issue.id] || assigning[issue.id]}
                    onClick={() => handleAssignClick(issue.id, isAssignedTab)}
                  >
                    {assigning[issue.id] ? (
                      <><Loader2 className="mr-2 h-3 w-3 animate-spin"/> {isAssignedTab ? "Reassigning" : "Assigning"}</>
                    ) : (
                      isAssignedTab ? "Reassign" : "Assign"
                    )}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {issues.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <AlertCircle className="mb-2 h-8 w-8 text-muted-foreground/50" />
          <p>{isAssignedTab ? "No assigned issues found" : "No pending issues to assign"}</p>
        </div>
      )}
    </Card>
  );

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header with Breadcrumb */}
        <div className="flex items-center gap-4">
          <Link to="/admin">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Assign Issues</h1>
            <p className="mt-1 text-muted-foreground">
              Manage issue assignments and workload
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => loadData()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList>
            <TabsTrigger value="pending">Pending Assignment ({pendingIssues.length})</TabsTrigger>
            <TabsTrigger value="assigned">Assigned Issues ({assignedIssues.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="mt-6">
            <IssueTable issues={pendingIssues} />
          </TabsContent>
          
          <TabsContent value="assigned" className="mt-6">
            <IssueTable issues={assignedIssues} isAssignedTab={true} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
