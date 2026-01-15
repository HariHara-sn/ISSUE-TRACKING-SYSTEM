import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockIssues } from '@/data/mockData';
import { ArrowLeft, TrendingUp } from 'lucide-react';
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

// Issue Type Distribution Data (Donut Chart)
const issueTypeData = [
  { name: 'Cleanliness', value: 18, color: 'hsl(162, 100%, 36%)' },
  { name: 'WiFi', value: 22, color: 'hsl(199, 89%, 48%)' },
  { name: 'Hostel', value: 25, color: 'hsl(38, 92%, 50%)' },
  { name: 'Canteen', value: 15, color: 'hsl(280, 65%, 60%)' },
  { name: 'Transport', value: 12, color: 'hsl(340, 65%, 55%)' },
  { name: 'Others', value: 8, color: 'hsl(210, 30%, 60%)' },
];

// Issue Status Breakdown Data (Pie Chart)
const issueStatusData = [
  { name: 'Pending', value: 15, color: 'hsl(38, 92%, 50%)' },
  { name: 'Assigned', value: 20, color: 'hsl(199, 89%, 48%)' },
  { name: 'In-Progress', value: 25, color: 'hsl(280, 65%, 60%)' },
  { name: 'Resolved', value: 40, color: 'hsl(162, 100%, 36%)' },
];

// Monthly Issues Trend Data (Line Chart)
const monthlyTrendData = [
  { month: 'Jul', issues: 32 },
  { month: 'Aug', issues: 45 },
  { month: 'Sep', issues: 58 },
  { month: 'Oct', issues: 52 },
  { month: 'Nov', issues: 48 },
  { month: 'Dec', issues: 65 },
  { month: 'Jan', issues: 72 },
  { month: 'Feb', issues: 55 },
  { month: 'Mar', issues: 48 },
  { month: 'Apr', issues: 42 },
  { month: 'May', issues: 38 },
  { month: 'Jun', issues: 35 },
];

// Staff Performance Data (Horizontal Bar Chart)
const staffPerformanceData = [
  { name: 'Joael Sir', assigned: 18, resolved: 14, avgTime: '2.5 days' },
  { name: 'Ravi Sir', assigned: 12, resolved: 9, avgTime: '3.0 days' },
  { name: 'Sarah Williams', assigned: 20, resolved: 16, avgTime: '2.0 days' },
  { name: 'John Martinez', assigned: 15, resolved: 12, avgTime: '2.8 days' },
  { name: 'Emily Chen', assigned: 10, resolved: 8, avgTime: '2.2 days' },
];

export default function AnalyticsPage() {
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
        
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Comprehensive overview of issue tracking metrics and staff performance
          </p>
        </div>

        {/* Row 1: Issue Type Distribution + Issue Status Breakdown */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Issue Type Distribution (Donut Chart) */}
          <Card className="p-6">
            <div className="mb-6">
              <h3 className="font-semibold text-foreground">Issue Type Distribution</h3>
              <p className="text-sm text-muted-foreground">Identify major problem areas</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="h-56 w-56">
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
                {issueTypeData.map((item) => (
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

          {/* Issue Status Breakdown (Pie Chart) */}
          <Card className="p-6">
            <div className="mb-6">
              <h3 className="font-semibold text-foreground">Issue Status Breakdown</h3>
              <p className="text-sm text-muted-foreground">Track overall workload and progress</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="h-56 w-56">
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
                {issueStatusData.map((item) => (
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

        {/* Row 2: Monthly Issues Trend (Line Chart) */}
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Monthly Issues Trend</h3>
              <p className="text-sm text-muted-foreground">Track patterns over the academic year</p>
            </div>
            <Badge variant="secondary" className="gap-1">
              <TrendingUp className="h-3 w-3" />
              Academic Year 2024-25
            </Badge>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendData}>
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

        {/* Row 3: Staff Performance Report (Horizontal Bar Chart) */}
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-foreground">Staff Performance Report</h3>
            <p className="text-sm text-muted-foreground">Evaluate staff efficiency</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={staffPerformanceData} 
                layout="vertical"
                margin={{ left: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  type="number" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  width={100}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value, name) => [value, name === 'assigned' ? 'Assigned' : 'Resolved']}
                />
                <Legend />
                <Bar 
                  dataKey="assigned" 
                  fill="hsl(199, 89%, 48%)" 
                  radius={[0, 4, 4, 0]}
                  name="Issues Assigned"
                />
                <Bar 
                  dataKey="resolved" 
                  fill="hsl(162, 100%, 36%)" 
                  radius={[0, 4, 4, 0]}
                  name="Issues Resolved"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Staff Performance Table */}
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
        </Card>
      </div>
    </DashboardLayout>
  );
}
