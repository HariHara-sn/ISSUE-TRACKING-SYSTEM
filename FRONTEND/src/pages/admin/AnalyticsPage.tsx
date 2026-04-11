import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { fetchAllIssues } from '@/services/issue.service';
import { Issue } from '@/types';
import { ArrowLeft, TrendingUp, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from 'recharts';

export default function AnalyticsPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const allIssues = await fetchAllIssues();
        setIssues(allIssues || []);
      } catch (error) {
        console.error("Failed to load analytics data", error);
        setIssues([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const totalIssues = issues.length || 1; // avoid division by zero

  // Category Distribution
  const categoryCounts = issues.reduce((acc, issue) => {
    acc[issue.category] = (acc[issue.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const colorMap: Record<string, string> = {
    'lab': 'hsl(162, 100%, 36%)',
    'classroom': 'hsl(199, 89%, 48%)',
    'hostel': 'hsl(38, 92%, 50%)',
    'library': 'hsl(280, 65%, 60%)',
    'other': 'hsl(210, 30%, 60%)',
    'cafeteria': 'hsl(15, 80%, 50%)'
  };

  const issueTypeData = Object.keys(categoryCounts).map(cat => ({
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    value: Math.round((categoryCounts[cat] / totalIssues) * 100),
    color: colorMap[cat] || colorMap['other']
  }));

  // Status Breakdown
  const statusCounts = issues.reduce((acc, issue) => {
    acc[issue.status] = (acc[issue.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusColorMap: Record<string, string> = {
    'submitted': 'hsl(38, 92%, 50%)',
    'assigned': 'hsl(199, 89%, 48%)',
    'in_progress': 'hsl(280, 65%, 60%)',
    'resolved': 'hsl(162, 100%, 36%)'
  };

  const issueStatusData = Object.keys(statusCounts).map(status => ({
    name: status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    value: Math.round((statusCounts[status] / totalIssues) * 100),
    color: statusColorMap[status] || 'hsl(210, 30%, 60%)'
  }));

  // Monthly Trend
  const monthlyCounts = issues.reduce((acc, issue) => {
    const month = new Date(issue.createdAt).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyTrendData = months.map(month => ({
    month,
    issues: monthlyCounts[month] || 0
  })).filter(data => data.issues > 0);

  if (monthlyTrendData.length === 0) {
    monthlyTrendData.push({ month: new Date().toLocaleString('default', { month: 'short' }), issues: 0 });
  }

  // Staff Performance (derived from assigned issues)
  const staffPerfMap = {} as Record<string, { assigned: number, resolved: number }>;
  issues.forEach(issue => {
    if (issue.assignedStaffId && issue.assignedStaffId !== 'undecided') {
      const staffName = issue.assignedStaffName || 'Unknown Staff'; 
      if (!staffPerfMap[staffName]) {
        staffPerfMap[staffName] = { assigned: 0, resolved: 0 };
      }
      staffPerfMap[staffName].assigned += 1;
      if (issue.status === 'resolved') {
        staffPerfMap[staffName].resolved += 1;
      }
    }
  });

  const staffPerformanceData = Object.keys(staffPerfMap).map(name => ({
    name,
    assigned: staffPerfMap[name].assigned,
    resolved: staffPerfMap[name].resolved,
    avgTime: 'N/A' // Could calculate average time if resolvedAt was available
  }));

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[80vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center gap-4">
          <Link to="/admin">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Comprehensive overview of issue tracking metrics and staff performance
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Issue Type Distribution */}
          <Card className="p-6">
            <div className="mb-6">
              <h3 className="font-semibold text-foreground">Issue Type Distribution</h3>
              <p className="text-sm text-muted-foreground">Identify major problem areas</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="h-56 w-56 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={issueTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {issueTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {issueTypeData.length === 0 && <p className="text-sm text-muted-foreground">No data available.</p>}
                {issueTypeData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between gap-2 overflow-hidden">
                    <div className="flex items-center gap-2 truncate">
                      <div className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-muted-foreground truncate" title={item.name}>{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-foreground shrink-0">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Issue Status Breakdown */}
          <Card className="p-6">
            <div className="mb-6">
              <h3 className="font-semibold text-foreground">Issue Status Breakdown</h3>
              <p className="text-sm text-muted-foreground">Track overall workload and progress</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="h-56 w-56 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={issueStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {issueStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {issueStatusData.length === 0 && <p className="text-sm text-muted-foreground">No data available.</p>}
                {issueStatusData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between gap-2 overflow-hidden">
                    <div className="flex items-center gap-2 truncate">
                      <div className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-muted-foreground truncate" title={item.name}>{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-foreground shrink-0">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Monthly Issues Trend */}
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Monthly Issues Trend</h3>
              <p className="text-sm text-muted-foreground">Track patterns over the academic year</p>
            </div>
            <Badge variant="secondary" className="gap-1">
              <TrendingUp className="h-3 w-3" />
            </Badge>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="issues" 
                  stroke="hsl(162, 100%, 36%)" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(162, 100%, 36%)', strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                  name="Issues Raised"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Staff Performance Report */}
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-foreground">Staff Performance Report</h3>
            <p className="text-sm text-muted-foreground">Evaluate staff efficiency</p>
          </div>
          {staffPerformanceData.length > 0 ? (
            <>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={staffPerformanceData} layout="vertical" margin={{ left: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value, name) => [value, name === 'assigned' ? 'Assigned' : 'Resolved']}
                    />
                    <Legend />
                    <Bar dataKey="assigned" fill="hsl(199, 89%, 48%)" radius={[0, 4, 4, 0]} name="Issues Assigned" />
                    <Bar dataKey="resolved" fill="hsl(162, 100%, 36%)" radius={[0, 4, 4, 0]} name="Issues Resolved" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Staff Name</th>
                      <th className="px-4 py-3 text-center font-medium text-muted-foreground">Assigned</th>
                      <th className="px-4 py-3 text-center font-medium text-muted-foreground">Resolved</th>
                      <th className="px-4 py-3 text-center font-medium text-muted-foreground">Avg. Resolution Time</th>
                      <th className="px-4 py-3 text-center font-medium text-muted-foreground">Efficiency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {staffPerformanceData.map((staff) => (
                      <tr key={staff.name} className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 font-medium text-foreground">{staff.name}</td>
                        <td className="px-4 py-3 text-center">{staff.assigned}</td>
                        <td className="px-4 py-3 text-center">{staff.resolved}</td>
                        <td className="px-4 py-3 text-center">{staff.avgTime}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge 
                            className={
                              (staff.resolved / staff.assigned) >= 0.8 
                                ? 'bg-success/10 text-success' 
                                : (staff.resolved / staff.assigned) >= 0.6 
                                  ? 'bg-warning/10 text-warning'
                                  : 'bg-destructive/10 text-destructive'
                            }
                          >
                            {Math.round((staff.resolved / staff.assigned) * 100)}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground text-sm">No staff performance data available yet.</p>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
