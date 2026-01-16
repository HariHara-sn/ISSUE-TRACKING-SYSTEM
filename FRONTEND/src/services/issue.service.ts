import api from '@/lib/api';
import { Issue, IssueStatus, IssueCategory, IssuePriority } from '@/types';

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
