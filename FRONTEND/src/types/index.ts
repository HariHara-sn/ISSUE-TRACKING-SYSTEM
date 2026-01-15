export type UserRole = 'student' | 'staff' | 'admin';

export type IssueStatus = 'submitted' | 'assigned' | 'in_progress' | 'resolved';

export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';

export type IssueCategory = 'lab' | 'classroom' | 'hostel' | 'library' | 'cafeteria' | 'other';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  priority: IssuePriority;
  status: IssueStatus;
  location: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  studentId: string;
  studentName: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  previewImage?: string;
  feedback?: string;
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  status: IssueStatus;
  timestamp: Date;
  note?: string;
  staffName?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}
