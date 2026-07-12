import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout/DashboardLayout';

// Personal (Employee) Pages
import Dashboard from './pages/dashboard/Dashboard';
import MyAssets from './pages/assets/MyAssets';
import ResourceBooking from './pages/booking/ResourceBooking';
import BookingHistory from './pages/booking/BookingHistory';
import MaintenanceRequests from './pages/maintenance/MaintenanceRequests';
import MyRequests from './pages/requests/MyRequests';
import NotificationsCenter from './pages/notifications/NotificationsCenter';
import ProfileSummary from './pages/profile/ProfileSummary';
import Settings from './pages/settings/Settings';

// Department Management (HOD) Pages
import DepartmentDashboard from './pages/department/DepartmentDashboard';
import DepartmentEmployees from './pages/department/DepartmentEmployees';
import DepartmentAssets from './pages/department/DepartmentAssets';
import AllocationApprovals from './pages/department/AllocationApprovals';
import TransferApprovals from './pages/department/TransferApprovals';
import DepartmentResources from './pages/department/DepartmentResources';
import DepartmentCalendar from './pages/department/DepartmentCalendar';
import DepartmentReports from './pages/department/DepartmentReports';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route element={<DashboardLayout />}>
          {/* Overview Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Employee Portal Routes */}
          <Route path="/assets" element={<MyAssets />} />
          <Route path="/booking" element={<ResourceBooking />} />
          <Route path="/booking-history" element={<BookingHistory />} />
          <Route path="/maintenance" element={<MaintenanceRequests />} />
          <Route path="/requests" element={<MyRequests />} />
          <Route path="/notifications" element={<NotificationsCenter />} />
          
          {/* Department Head Routes */}
          <Route path="/department/dashboard" element={<DepartmentDashboard />} />
          <Route path="/department/employees" element={<DepartmentEmployees />} />
          <Route path="/department/assets" element={<DepartmentAssets />} />
          <Route path="/department/allocation-approvals" element={<AllocationApprovals />} />
          <Route path="/department/transfer-approvals" element={<TransferApprovals />} />
          <Route path="/department/resources" element={<DepartmentResources />} />
          <Route path="/department/calendar" element={<DepartmentCalendar />} />
          <Route path="/department/reports" element={<DepartmentReports />} />

          {/* Personal Settings */}
          <Route path="/profile" element={<ProfileSummary />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
