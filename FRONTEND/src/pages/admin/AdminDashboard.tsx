import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/shared/StatsCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockIssues } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  Users,
  Clock,
  ArrowRight,
  UserPlus
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const categoryData = [
  { name: 'Lab', value: 35, color: 'hsl(162, 100%, 36%)' },
  { name: 'Classroom', value: 28, color: 'hsl(199, 89%, 48%)' },
  { name: 'Hostel', value: 20, color: 'hsl(38, 92%, 50%)' },
  { name: 'Library', value: 12, color: 'hsl(280, 65%, 60%)' },
  { name: 'Other', value: 5, color: 'hsl(210, 30%, 60%)' },
];

const monthlyData = [
  { month: 'Sep', issues: 45, resolved: 42 },
  { month: 'Oct', issues: 52, resolved: 48 },
  { month: 'Nov', issues: 38, resolved: 35 },
  { month: 'Dec', issues: 65, resolved: 58 },
  { month: 'Jan', issues: 48, resolved: 40 },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  
  const totalIssues = mockIssues.length;
  const openIssues = mockIssues.filter(i => i.status !== 'resolved').length;
  const resolvedIssues = mockIssues.filter(i => i.status === 'resolved').length;
  const pendingAssignment = mockIssues.filter(i => i.status === 'submitted').length;

  const staffMembers = [
    { id: '1', name: 'Sarah Williams' },
    { id: '2', name: 'John Martinez' },
    { id: '3', name: 'Emily Chen' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="mt-1 text-muted-foreground">
              System overview and management
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Link to="/admin/manage-users">
              <Button variant="hero">
                <UserPlus className="mr-2 h-4 w-4" />
                Manage Staff
              </Button>
            </Link>
          </div>
        </div>


        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Issues"
            value={totalIssues}
            icon={BarChart3}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Open Issues"
            value={openIssues}
            icon={AlertCircle}
            iconClassName="bg-warning/10 text-warning"
          />
          <StatsCard
            title="Resolved"
            value={resolvedIssues}
            icon={CheckCircle}
            iconClassName="bg-success/10 text-success"
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Pending Assignment"
            value={pendingAssignment}
            icon={Clock}
            iconClassName="bg-info/10 text-info"
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Monthly Trends */}
          <Card className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Monthly Trends</h3>
              <Badge variant="secondary" className="gap-1">
                <TrendingUp className="h-3 w-3" />
                +12% this month
              </Badge>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar 
                    dataKey="issues" 
                    fill="hsl(162, 100%, 36%)" 
                    radius={[4, 4, 0, 0]}
                    name="Reported"
                  />
                  <Bar 
                    dataKey="resolved" 
                    fill="hsl(162, 60%, 70%)" 
                    radius={[4, 4, 0, 0]}
                    name="Resolved"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Category Distribution */}
          <Card className="p-6">
            <h3 className="mb-6 font-semibold text-foreground">Issues by Category</h3>
            <div className="flex items-center gap-6">
              <div className="h-48 w-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3">
                {categoryData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-3 w-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Issues Needing Assignment */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-foreground">Issues Needing Assignment</h2>
              <Badge className="bg-warning/10 text-warning">{pendingAssignment}</Badge>
            </div>
            <Button variant="ghost" size="sm" className="text-primary">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockIssues.filter(i => i.status === 'submitted').map((issue) => (
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
                        <Select>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
