import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout/DashboardLayout';

// Employee Module Pages
import Dashboard from './pages/dashboard/Dashboard';
import MyAssets from './pages/assets/MyAssets';
import ResourceBooking from './pages/booking/ResourceBooking';
import BookingHistory from './pages/booking/BookingHistory';
import Maintenance from './pages/maintenance/Maintenance';
import MyRequests from './pages/requests/MyRequests';
import NotificationCenter from './pages/notifications/NotificationCenter';
import Profile from './pages/profile/Profile';
import SystemSettings from './pages/settings/SystemSettings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect Root to Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Main Layout containing all routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-assets" element={<MyAssets />} />
          <Route path="/booking" element={<ResourceBooking />} />
          <Route path="/booking-history" element={<BookingHistory />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/my-requests" element={<MyRequests />} />
          <Route path="/notifications" element={<NotificationCenter />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<SystemSettings />} />
        </Route>

        {/* Fallback to Dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
