import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { fetchUnassignedIssues, fetchStaffList, assignIssue } from '@/services/issue.service';
import { Issue, User } from '@/types';
import { Loader2, AlertCircle, ImageIcon, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function AssignIssuesTab() {
  const { toast } = useToast();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [staffList, setStaffList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignmentMap, setAssignmentMap] = useState<Record<string, string>>({});
  const [assigning, setAssigning] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedIssues, fetchedStaff] = await Promise.all([
          fetchUnassignedIssues(),
          fetchStaffList()
        ]);
        setIssues(fetchedIssues);
        setStaffList(fetchedStaff);
      } catch (error) {
        console.error("Failed to load data", error);
        toast({
          title: "Error",
          description: "Failed to load issues or staff list",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleStaffSelect = (issueId: string, staffId: string) => {
    setAssignmentMap(prev => ({ ...prev, [issueId]: staffId }));
  };

  const handleAssignClick = async (issueId: string) => {
    const staffId = assignmentMap[issueId];
    if (!staffId) return;

    setAssigning(prev => ({ ...prev, [issueId]: true }));
    try {
      await assignIssue(issueId, staffId);
      
      // Success Notification
      const staffMember = staffList.find(s => s.id === staffId);
      toast({
        title: "Issue Assigned",
        description: `Issue assigned to ${staffMember?.name} successfully`,
        variant: "default" // or success if available, default is fine
      });

      // Remove issue from list
      setIssues(prev => prev.filter(i => i.id !== issueId));
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

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
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
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Assign To</th>
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
                <td className="px-6 py-4">
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
                </td>
                <td className="px-6 py-4">
                  <Button 
                    variant="hero" 
                    size="sm"
                    disabled={!assignmentMap[issue.id] || assigning[issue.id]}
                    onClick={() => handleAssignClick(issue.id)}
                  >
                    {assigning[issue.id] ? (
                      <><Loader2 className="mr-2 h-3 w-3 animate-spin"/> Assigning</>
                    ) : (
                      "Assign"
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
          <p>No unassigned issues found</p>
        </div>
      )}
    </Card>
  );
}
