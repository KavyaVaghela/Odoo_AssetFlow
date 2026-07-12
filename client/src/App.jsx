import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout/DashboardLayout';

// Asset Manager Pages
import AssetInventory from './pages/assets/AssetInventory';
import RegisterAsset from './pages/assets/RegisterAsset';
import Maintenance from './pages/maintenance/Maintenance';
import SystemSettings from './pages/settings/SystemSettings';
import Profile from './pages/profile/Profile';

// Auth Pages
import Welcome from './pages/auth/Welcome';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import VerifyOtp from './pages/auth/VerifyOtp';
import ResetPassword from './pages/auth/ResetPassword';
import PendingApproval from './pages/auth/PendingApproval';
import Rejected from './pages/auth/Rejected';
import Unauthorized from './pages/auth/Unauthorized';
import SessionExpired from './pages/auth/SessionExpired';

// Dashboards and general pages
import Dashboard from './pages/dashboard/Dashboard';
import MyAssets from './pages/assets/MyAssets';
import ResourceBooking from './pages/booking/ResourceBooking';
import BookingHistory from './pages/booking/BookingHistory';
import MaintenanceRequests from './pages/maintenance/MaintenanceRequests';
import MyRequests from './pages/requests/MyRequests';
import NotificationsCenter from './pages/notifications/NotificationsCenter';
import ProfileSummary from './pages/profile/ProfileSummary';
import Settings from './pages/settings/Settings';

// Department Head (HOD) Pages
import DepartmentDashboard from './pages/department/DepartmentDashboard';
import DepartmentEmployees from './pages/department/DepartmentEmployees';
import DepartmentAssets from './pages/department/DepartmentAssets';
import AllocationApprovals from './pages/department/AllocationApprovals';
import TransferApprovals from './pages/department/TransferApprovals';
import DepartmentResources from './pages/department/DepartmentResources';
import DepartmentCalendar from './pages/department/DepartmentCalendar';
import DepartmentReports from './pages/department/DepartmentReports';

// Asset Manager Pages (Remote)
import AssetList from './pages/assets/AssetList';
import Allocation from './pages/assets/Allocation';
import Transfer from './pages/assets/Transfer';
import Returns from './pages/assets/Returns';
import QRGenerator from './pages/qr/QRGenerator';
import Reports from './pages/reports/Reports';
import AuditCycle from './pages/audit/AuditCycle';

// Admin control pages
import Employees from './pages/organization/Employees';
import Departments from './pages/organization/Departments';
import Roles from './pages/organization/Roles';
import Categories from './pages/organization/Categories';

// Session guard components
function PrivateRoute({ children }) {
  const token = localStorage.getItem('accessToken');
  return token ? children : <Navigate to="/login" replace />;
}

function RoleRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRoles = user.roles || [];
  const hasAccess = userRoles.some(role => allowedRoles.includes(role));
  return hasAccess ? children : <Navigate to="/unauthorized" replace />;
}

// Redirect helper to check roles and map /dashboard
function DashboardRedirect() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const roles = user.roles || [];
  if (roles.includes('Admin')) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <Navigate to="/employee/dashboard" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/pending-approval" element={<PendingApproval />} />
        <Route path="/rejected" element={<Rejected />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/session-expired" element={<SessionExpired />} />

        {/* Private Dashboard Scope */}
        <Route 
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          {/* Dynamic home router */}
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/employee/dashboard" element={<Dashboard />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          
          {/* Employee Portal Routes */}
          <Route path="/assets" element={<MyAssets />} />
          <Route path="/booking" element={<ResourceBooking />} />
          <Route path="/booking-history" element={<BookingHistory />} />
          <Route path="/maintenance" element={<MaintenanceRequests />} />
          <Route path="/requests" element={<MyRequests />} />
          <Route path="/notifications" element={<NotificationsCenter />} />
          
          {/* Asset Manager Portal Routes */}
          <Route 
            path="/assets/inventory" 
            element={
              <RoleRoute allowedRoles={['Asset Manager', 'Admin']}>
                <AssetInventory />
              </RoleRoute>
            } 
          />
          <Route 
            path="/assets/register" 
            element={
              <RoleRoute allowedRoles={['Asset Manager', 'Admin']}>
                <RegisterAsset />
              </RoleRoute>
            } 
          />
          <Route 
            path="/assets/list" 
            element={
              <RoleRoute allowedRoles={['Asset Manager', 'Admin']}>
                <AssetList />
              </RoleRoute>
            } 
          />
          <Route 
            path="/assets/allocation" 
            element={
              <RoleRoute allowedRoles={['Asset Manager', 'Admin']}>
                <Allocation />
              </RoleRoute>
            } 
          />
          <Route 
            path="/assets/transfer" 
            element={
              <RoleRoute allowedRoles={['Asset Manager', 'Admin']}>
                <Transfer />
              </RoleRoute>
            } 
          />
          <Route 
            path="/assets/returns" 
            element={
              <RoleRoute allowedRoles={['Asset Manager', 'Admin']}>
                <Returns />
              </RoleRoute>
            } 
          />
          <Route 
            path="/qr" 
            element={
              <RoleRoute allowedRoles={['Asset Manager', 'Admin']}>
                <QRGenerator />
              </RoleRoute>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <RoleRoute allowedRoles={['Asset Manager', 'Admin']}>
                <Reports />
              </RoleRoute>
            } 
          />
          <Route 
            path="/audit" 
            element={
              <RoleRoute allowedRoles={['Asset Manager', 'Admin']}>
                <AuditCycle />
              </RoleRoute>
            } 
          />

          {/* Department Head Routes */}
          <Route 
            path="/department/dashboard" 
            element={
              <RoleRoute allowedRoles={['Department Head', 'Admin']}>
                <DepartmentDashboard />
              </RoleRoute>
            } 
          />
          <Route 
            path="/department/employees" 
            element={
              <RoleRoute allowedRoles={['Department Head', 'Admin']}>
                <DepartmentEmployees />
              </RoleRoute>
            } 
          />
          <Route 
            path="/department/assets" 
            element={
              <RoleRoute allowedRoles={['Department Head', 'Admin']}>
                <DepartmentAssets />
              </RoleRoute>
            } 
          />
          <Route 
            path="/department/allocation-approvals" 
            element={
              <RoleRoute allowedRoles={['Department Head', 'Admin']}>
                <AllocationApprovals />
              </RoleRoute>
            } 
          />
          <Route 
            path="/department/transfer-approvals" 
            element={
              <RoleRoute allowedRoles={['Department Head', 'Admin']}>
                <TransferApprovals />
              </RoleRoute>
            } 
          />
          <Route 
            path="/department/resources" 
            element={
              <RoleRoute allowedRoles={['Department Head', 'Admin']}>
                <DepartmentResources />
              </RoleRoute>
            } 
          />
          <Route 
            path="/department/calendar" 
            element={
              <RoleRoute allowedRoles={['Department Head', 'Admin']}>
                <DepartmentCalendar />
              </RoleRoute>
            } 
          />
          <Route 
            path="/department/reports" 
            element={
              <RoleRoute allowedRoles={['Department Head', 'Admin']}>
                <DepartmentReports />
              </RoleRoute>
            } 
          />

          {/* Admin Control Routes */}
          <Route 
            path="/admin/employees" 
            element={
              <RoleRoute allowedRoles={['Admin']}>
                <Employees />
              </RoleRoute>
            } 
          />
          <Route 
            path="/admin/departments" 
            element={
              <RoleRoute allowedRoles={['Admin']}>
                <Departments />
              </RoleRoute>
            } 
          />
          <Route 
            path="/admin/roles" 
            element={
              <RoleRoute allowedRoles={['Admin']}>
                <Roles />
              </RoleRoute>
            } 
          />
          <Route 
            path="/admin/categories" 
            element={
              <RoleRoute allowedRoles={['Admin']}>
                <Categories />
              </RoleRoute>
            } 
          />

          {/* System Admin Settings */}
          <Route 
            path="/admin/settings" 
            element={
              <RoleRoute allowedRoles={['Admin']}>
                <SystemSettings />
              </RoleRoute>
            } 
          />

          {/* Personal Settings */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile-summary" element={<ProfileSummary />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
