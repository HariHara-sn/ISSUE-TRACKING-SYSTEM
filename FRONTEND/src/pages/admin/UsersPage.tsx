import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatsCard } from '@/components/shared/StatsCard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowLeft, 
  Users, 
  UserCheck, 
  GraduationCap, 
  Search,
  Mail,
  Phone,
  Building2,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'student' | 'staff';
  department: string;
  issuesRaised?: number;
  issuesResolved?: number;
  joinedDate: string;
}

// Mock Users Data
const mockAllUsers: UserData[] = [
  { id: '1', name: 'Alex Johnson', email: 'alex.j@university.edu', phone: '+91 9876543210', role: 'student', department: 'CSE', issuesRaised: 8, joinedDate: '2023-08-15' },
  { id: '2', name: 'Priya Sharma', email: 'priya.s@university.edu', phone: '+91 9876543211', role: 'student', department: 'IT', issuesRaised: 5, joinedDate: '2023-08-15' },
  { id: '3', name: 'Rahul Kumar', email: 'rahul.k@university.edu', phone: '+91 9876543212', role: 'student', department: 'ECE', issuesRaised: 3, joinedDate: '2023-08-15' },
  { id: '4', name: 'Sneha Patel', email: 'sneha.p@university.edu', phone: '+91 9876543213', role: 'student', department: 'MECH', issuesRaised: 6, joinedDate: '2023-08-15' },
  { id: '5', name: 'Arjun Reddy', email: 'arjun.r@university.edu', phone: '+91 9876543214', role: 'student', department: 'MBA', issuesRaised: 2, joinedDate: '2023-08-15' },
  { id: '6', name: 'Ananya Gupta', email: 'ananya.g@university.edu', phone: '+91 9876543215', role: 'student', department: 'CSE', issuesRaised: 4, joinedDate: '2024-01-10' },
  { id: '7', name: 'Vikram Singh', email: 'vikram.s@university.edu', phone: '+91 9876543216', role: 'student', department: 'IT', issuesRaised: 7, joinedDate: '2024-01-10' },
  { id: '8', name: 'Kavya Nair', email: 'kavya.n@university.edu', phone: '+91 9876543217', role: 'student', department: 'ECE', issuesRaised: 1, joinedDate: '2024-01-10' },
  { id: '9', name: 'Sarah Williams', email: 'sarah.w@university.edu', phone: '+91 9876543218', role: 'staff', department: 'Maintenance', issuesResolved: 45, joinedDate: '2022-06-01' },
  { id: '10', name: 'John Martinez', email: 'john.m@university.edu', phone: '+91 9876543219', role: 'staff', department: 'IT Support', issuesResolved: 38, joinedDate: '2022-06-01' },
  { id: '11', name: 'Emily Chen', email: 'emily.c@university.edu', phone: '+91 9876543220', role: 'staff', department: 'Housekeeping', issuesResolved: 52, joinedDate: '2022-03-15' },
  { id: '12', name: 'Ravi Kumar', email: 'ravi.k@university.edu', phone: '+91 9876543221', role: 'staff', department: 'Electrical', issuesResolved: 28, joinedDate: '2023-01-10' },
  { id: '13', name: 'Joael Sir', email: 'joael@university.edu', phone: '+91 9876543222', role: 'staff', department: 'Transport', issuesResolved: 35, joinedDate: '2021-08-01' },
];

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const totalUsers = mockAllUsers.length;
  const totalStaff = mockAllUsers.filter(u => u.role === 'staff').length;
  const totalStudents = mockAllUsers.filter(u => u.role === 'student').length;

  const filteredUsers = mockAllUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleUserClick = (user: UserData) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
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
        
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users Management</h1>
          <p className="mt-1 text-muted-foreground">
            View and manage all users in the system
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatsCard
            title="Total Users"
            value={totalUsers}
            icon={Users}
          />
          <StatsCard
            title="Total Staff"
            value={totalStaff}
            icon={UserCheck}
            iconClassName="bg-info/10 text-info"
          />
          <StatsCard
            title="Total Students"
            value={totalStudents}
            icon={GraduationCap}
            iconClassName="bg-success/10 text-success"
          />
        </div>

        {/* Search and Filter */}
        <Card className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Users List */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Department</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    className="hover:bg-muted/20 transition-colors cursor-pointer"
                    onClick={() => handleUserClick(user)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <span className="font-medium text-foreground">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{user.department}</td>
                    <td className="px-6 py-4">
                      <Badge 
                        className={
                          user.role === 'staff' 
                            ? 'bg-info/10 text-info' 
                            : 'bg-success/10 text-success'
                        }
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Search className="h-12 w-12 mb-4 opacity-50" />
              <p>No users found matching your criteria</p>
            </div>
          )}
        </Card>

        {/* User Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-semibold">
                  {selectedUser?.name.charAt(0)}
                </div>
                <div>
                  <p className="text-lg font-semibold">{selectedUser?.name}</p>
                  <Badge 
                    className={
                      selectedUser?.role === 'staff' 
                        ? 'bg-info/10 text-info' 
                        : 'bg-success/10 text-success'
                    }
                  >
                    {selectedUser?.role}
                  </Badge>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{selectedUser?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{selectedUser?.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{selectedUser?.department}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">
                  {selectedUser?.role === 'student' 
                    ? `${selectedUser.issuesRaised || 0} issues raised`
                    : `${selectedUser?.issuesResolved || 0} issues resolved`
                  }
                </span>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Joined: {selectedUser?.joinedDate && new Date(selectedUser.joinedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
