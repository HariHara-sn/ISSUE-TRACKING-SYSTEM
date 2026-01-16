import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import StudentDashboard from "./pages/student/StudentDashboard";
import OpenIssuesPage from "./pages/student/OpenIssuesPage";
import ResolvedIssuesPage from "./pages/student/ResolvedIssuesPage";
import AssignedIssuesPage from "./pages/student/AssignedIssuesPage";
import TimelinePage from "./pages/student/TimelinePage";
import ReportIssuePage from "./pages/student/ReportIssuePage";
import IssueFormPage from "./pages/student/IssueFormPage";
import StaffDashboard from "./pages/staff/StaffDashboard";
import ActiveIssuesPage from "./pages/staff/ActiveIssuesPage";
import PendingIssuesPage from "./pages/staff/PendingIssuesPage";
import CompletedIssuesPage from "./pages/staff/CompletedIssuesPage";
import NotificationsPage from "./pages/staff/NotificationsPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import UsersPage from "./pages/admin/UsersPage";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import SettingsPage from "./pages/admin/SettingsPage";
import AssignIssuesPage from "./pages/admin/AssignIssuesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode; 
  allowedRoles: string[] 
}) {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  if (isLoading) {
    // You could replace this with a proper loading spinner component
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      
      {/* Student Routes */}
      <Route 
        path="/student" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student/open" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <OpenIssuesPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student/assigned" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <AssignedIssuesPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student/resolved" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <ResolvedIssuesPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student/timeline" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <TimelinePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student/report" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <ReportIssuePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student/report/:category" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <IssueFormPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Staff Routes */}
      <Route 
        path="/staff" 
        element={
          <ProtectedRoute allowedRoles={['staff']}>
            <StaffDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/staff/active" 
        element={
          <ProtectedRoute allowedRoles={['staff']}>
            <ActiveIssuesPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/staff/pending" 
        element={
          <ProtectedRoute allowedRoles={['staff']}>
            <PendingIssuesPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/staff/completed" 
        element={
          <ProtectedRoute allowedRoles={['staff']}>
            <CompletedIssuesPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/staff/notifications" 
        element={
          <ProtectedRoute allowedRoles={['staff']}>
            <NotificationsPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Admin Routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/analytics" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AnalyticsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UsersPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/manage-users" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ManageUsersPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/settings" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <SettingsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/assign" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AssignIssuesPage />
          </ProtectedRoute>
        } 
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
