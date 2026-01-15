import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockIssues } from '@/data/mockData';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const staffMembers = [
  { id: '1', name: 'Sarah Williams' },
  { id: '2', name: 'John Martinez' },
  { id: '3', name: 'Emily Chen' },
  { id: '4', name: 'Ravi Kumar' },
  { id: '5', name: 'Joael Sir' },
];

export default function AssignIssuesPage() {
  const { toast } = useToast();
  const pendingIssues = mockIssues.filter(i => i.status === 'submitted');

  const handleAssign = (issueId: string, staffId: string) => {
    const staff = staffMembers.find(s => s.id === staffId);
    toast({
      title: "Issue Assigned",
      description: `Issue has been assigned to ${staff?.name}`,
    });
  };

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
              Assign pending issues to staff members
            </p>
          </div>
          <Badge className="bg-warning/10 text-warning">
            {pendingIssues.length} Pending
          </Badge>
        </div>

        {/* Issues Table */}
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
                {pendingIssues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">{issue.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{issue.description}</p>
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
                      <Select onValueChange={(value) => handleAssign(issue.id, value)}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Select staff" />
                        </SelectTrigger>
                        <SelectContent>
                          {staffMembers.map((staff) => (
                            <SelectItem key={staff.id} value={staff.id}>
                              {staff.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="hero" size="sm">
                        Assign
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pendingIssues.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <p>No pending issues to assign</p>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
