import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout/DashboardLayout';

// Pages
import Dashboard from './pages/dashboard/Dashboard';
import Departments from './pages/organization/Departments';
import Employees from './pages/organization/Employees';
import Roles from './pages/organization/Roles';
import Categories from './pages/organization/Categories';

// Placeholders for remaining pages to allow routing
const Placeholder = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
    <div className="p-4 bg-primary/10 rounded-full text-primary text-2xl font-bold w-16 h-16 flex items-center justify-center">?</div>
    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
    <p className="text-muted-foreground max-w-sm">This module is part of the enterprise structure and is ready for implementation.</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/departments" element={<Departments />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/roles" element={<Roles />} />
          
          <Route path="/assets" element={<Placeholder title="Asset List" />} />
          <Route path="/reports" element={<Placeholder title="Reports & Analytics" />} />
          <Route path="/audit" element={<Placeholder title="Audit Management" />} />
          <Route path="/notifications" element={<Placeholder title="Notification Center" />} />
          <Route path="/activity-logs" element={<Placeholder title="Activity Logs" />} />
          <Route path="/settings" element={<Placeholder title="System Settings" />} />
          <Route path="/profile" element={<Placeholder title="My Profile" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
