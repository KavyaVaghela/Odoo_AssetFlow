import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout/DashboardLayout';

// Pages
import Dashboard from './pages/dashboard/Dashboard';
import MyAssets from './pages/assets/MyAssets';
import ResourceBooking from './pages/booking/ResourceBooking';
import BookingHistory from './pages/booking/BookingHistory';
import MaintenanceRequests from './pages/maintenance/MaintenanceRequests';
import MyRequests from './pages/requests/MyRequests';
import NotificationsCenter from './pages/notifications/NotificationsCenter';
import ProfileSummary from './pages/profile/ProfileSummary';
import Settings from './pages/settings/Settings';
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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assets" element={<MyAssets />} />
          <Route path="/booking" element={<ResourceBooking />} />
          <Route path="/booking-history" element={<BookingHistory />} />
          <Route path="/maintenance" element={<MaintenanceRequests />} />
          <Route path="/requests" element={<MyRequests />} />
          <Route path="/notifications" element={<NotificationsCenter />} />
          <Route path="/profile" element={<ProfileSummary />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
