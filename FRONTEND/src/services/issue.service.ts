import api from '@/lib/api';
import { Issue, IssueStatus, IssueCategory, IssuePriority, User } from '@/types';

// Helper to transform backend data to frontend Issue type
const transformIssue = (data: any): Issue => {
  // Map backend status (Capitalized) to frontend status (lowercase)
  const statusMap: Record<string, IssueStatus> = {
    'Pending': 'submitted',
    'Assigned': 'assigned',
    'In Progress': 'in_progress',
    'Resolved': 'resolved'
  };

  // Map backend priority (Capitalized) to frontend priority (lowercase)
  const priorityMap: Record<string, IssuePriority> = {
    'Low': 'low',
    'Medium': 'medium',
    'High': 'high',
    'Critical': 'critical'
  };
  
  // Map category: Use backend string but lowercase it for the ID if needed, 
  // or just pass it through if the ID matches. 
  // The user asked to use the issue's label name as category name. 
  // Frontend Category ID must match one of: 'lab' | 'classroom' | 'hostel' | 'library' | 'cafeteria' | 'other'
  // If backend returns something else, we might default to 'other' or try to match.
  // Converting to lowercase for now as a best guess for ID.
  const category = (data.category?.toLowerCase() || 'other') as IssueCategory;

  return {
    id: data._id,
    title: data.title,
    description: data.description,
    category: category,
    priority: priorityMap[data.priority] || 'low',
    status: statusMap[data.status] || 'submitted',
    location: data.location,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
    resolvedAt: data.status === 'Resolved' ? new Date(data.updatedAt) : undefined,
    studentId: data.createdBy?._id || data.createdBy,
    studentName: data.createdBy?.name || 'Unknown',
    assignedStaffId: data.assignedTo?._id || data.assignedTo,
    assignedStaffName: data.assignedTo?.name,
    previewImage: data.image,
    // Inject mock timeline for now as backend doesn't provide it
    timeline: [
      { 
        id: '1', 
        status: statusMap[data.status] || 'submitted', 
        timestamp: new Date(data.updatedAt) 
      }
    ]
  };
};

export const fetchStudentOpenIssues = async (): Promise<Issue[]> => {
  const response = await api.get('/issues/student/openIssues');
  return response.data.issues.map(transformIssue);
};

export const fetchStudentAssignedIssues = async (): Promise<Issue[]> => {
  const response = await api.get('/issues/student/assignedIssues');
  return response.data.issues.map(transformIssue);
};

export const fetchStudentResolvedIssues = async (): Promise<Issue[]> => {
  const response = await api.get('/issues/student/resolved');
  return response.data.issues.map(transformIssue);
};

export const createIssue = async (payload: any): Promise<Issue> => {
  const response = await api.post('/issues/create', payload);
  return transformIssue(response.data.issue);
};

// Admin Functions
export const fetchAllIssues = async (): Promise<Issue[]> => {
  const response = await api.get('/issues/openIssues');
  return response.data.issues.map(transformIssue);
};

export const fetchUnassignedIssues = async (): Promise<Issue[]> => {
  const response = await api.get('/issues/pending');
  return response.data.issues.map(transformIssue);
};

export const fetchAllAssignedIssues = async (): Promise<Issue[]> => {
  const response = await api.get('/issues/assigned');
  return response.data.issues.map(transformIssue);
};

export const fetchAllResolvedIssues = async (): Promise<Issue[]> => {
  const response = await api.get('/issues/resolved');
  return response.data.issues.map(transformIssue);
};

// Staff Functions
export const fetchStaffAssignedIssues = async (): Promise<Issue[]> => {
  const response = await api.get('/issues/staff/assignedIssues');
  return response.data.issues.map(transformIssue);
};

export const fetchStaffActiveIssues = async (): Promise<Issue[]> => {
  const response = await api.get('/issues/staff/active');
  return response.data.issues.map(transformIssue);
};

export const fetchStaffResolvedIssues = async (): Promise<Issue[]> => {
  const response = await api.get('/issues/staff/resolved');
  return response.data.issues.map(transformIssue);
};

export const fetchStaffList = async (): Promise<User[]> => {
  const response = await api.get('/issues/staff');
  return response.data.staff.map((s: any) => ({
    id: s._id,
    name: s.name,
    email: s.email,
    role: 'staff'
  }));
};

export const fetchStudentList = async (): Promise<User[]> => {
  const response = await api.get('/issues/student');
  return response.data.studentlist.map((s: any) => ({
    id: s._id,
    name: s.name,
    email: s.email,
    role: 'student'
  }));
};

// Utility Functions
export const assignIssue = async (issueId: string, staffId: string): Promise<void> => {
  await api.put('/issues/assign', { issueId, staffId });
};

export const updateIssueStatus = async (issueId: string, status: string): Promise<void> => {
  // Mapping frontend status correctly to backend
  const statusMap: Record<string, string> = {
    'submitted': 'Pending',
    'assigned': 'Assigned',
    'in_progress': 'In Progress',
    'resolved': 'Resolved'
  };
  await api.put(`/issues/${issueId}/status`, { status: statusMap[status] || status });
};
