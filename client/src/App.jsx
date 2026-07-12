import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout/DashboardLayout';

<<<<<<< HEAD
// Asset Manager Pages
import AssetDashboard from './pages/dashboard/Dashboard';
import AssetInventory from './pages/assets/AssetInventory';
import RegisterAsset from './pages/assets/RegisterAsset';
import Categories from './pages/assets/MyAssets'; // Placeholder
import ResourceInventory from './pages/booking/ResourceBooking'; // Placeholder
import AllocateAsset from './pages/requests/MyRequests'; // Placeholder
import TransferAsset from './pages/requests/MyRequests'; // Placeholder
import ReturnAsset from './pages/requests/MyRequests'; // Placeholder
import Maintenance from './pages/maintenance/Maintenance';
import NotificationCenter from './pages/notifications/NotificationCenter';
import Profile from './pages/profile/Profile';
import SystemSettings from './pages/settings/SystemSettings';
=======
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
>>>>>>> eba111a9b436d9a31cb253baeb1bb36a0ab1af72

function App() {
  return (
    <BrowserRouter>
      <Routes>
<<<<<<< HEAD
        {/* Redirect Root to Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Main Layout containing all routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<AssetDashboard />} />
          <Route path="/inventory" element={<AssetInventory />} />
          <Route path="/register" element={<RegisterAsset />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/resources" element={<ResourceInventory />} />
          <Route path="/allocate" element={<AllocateAsset />} />
          <Route path="/transfer" element={<TransferAsset />} />
          <Route path="/return" element={<ReturnAsset />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/qr" element={<div>QR Management Placeholder</div>} />
          <Route path="/audit" element={<div>Audit Placeholder</div>} />
          <Route path="/reports" element={<div>Reports Placeholder</div>} />
          <Route path="/notifications" element={<NotificationCenter />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<SystemSettings />} />
        </Route>

        {/* Fallback to Dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
=======
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
>>>>>>> eba111a9b436d9a31cb253baeb1bb36a0ab1af72
      </Routes>
    </BrowserRouter>
  );
}

export default App;
