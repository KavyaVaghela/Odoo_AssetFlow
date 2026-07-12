import { create } from 'zustand';

// Helper for standardized authenticated API fetch requests
const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };
  const response = await fetch(`http://localhost:5000${endpoint}`, {
    ...options,
    headers
  });
  return response.json();
};

// --- Mock Data Definitions (Used as fallback/initial states when token is absent) ---
const initialDepartments = [
  { id: 1, department_name: 'Computer Engineering', department_code: 'CE', status: 'Active', employeeCount: 25, assetCount: 120 },
  { id: 2, department_name: 'Human Resources', department_code: 'HR', status: 'Active', employeeCount: 12, assetCount: 15 },
  { id: 3, department_name: 'Information Technology', department_code: 'IT', status: 'Active', employeeCount: 25, assetCount: 30 }
];

const initialEmployees = [
  { id: 1, name: 'Dr. Rajesh Patel', email: 'depthead@assetflow.com', phone: '+1 234-567-8902', department: 'Computer Engineering', role: 'Department Head', status: 'Active' }
];

const initialCategories = [
  { id: 1, name: 'Electronics', description: 'Laptops, Monitors, Phones', count: 345, status: 'Active', icon: '💻' },
  { id: 2, name: 'Furniture', description: 'Desks, Chairs, Cabinets', count: 120, status: 'Active', icon: '🪑' }
];

const initialRoles = [
  { id: 1, name: 'Admin', description: 'Full system access', users: 3 },
  { id: 2, name: 'Employee', description: 'Basic access to own assets and requests', users: 150 },
  { id: 3, name: 'Asset Manager', description: 'Manage asset inventory and allocations', users: 5 },
  { id: 4, name: 'Department Head', description: 'View department assets and approve requests', users: 10 }
];

const kpiData = {
  totalAssets: 0,
  totalEmployees: 0,
  totalDepartments: 3,
  availableAssets: 0,
  allocatedAssets: 0,
  maintenanceAssets: 0,
  activeBookings: 0,
  pendingMaintenance: 0,
  activeAudits: 0
};

const chartData = {
  assetStatus: [
    { name: 'Allocated', value: 2, color: '#2563EB' },
    { name: 'Available', value: 1, color: '#10B981' }
  ],
  deptAssets: [
    { name: 'IT', assets: 3 }
  ],
  monthlyRegistration: [
    { name: 'Jul', assets: 3 }
  ],
  maintenanceTrends: [
    { name: 'W1', requests: 1, resolved: 0 }
  ]
};

export const useStore = create((set, get) => ({
  departments: initialDepartments,
  employees: initialEmployees,
  categories: initialCategories,
  roles: initialRoles,
  kpi: kpiData,
  charts: chartData,
  activities: [],
  
  // Personal & Departmental States
  employeeAssets: [],
  bookings: [],
  maintenanceRequests: [],
  myRequests: [],
  notificationsList: [],
  profile: {
    name: 'Dr. Rajesh Patel',
    id: 'EMP-1002',
    department: 'Computer Engineering',
    designation: 'Department Head',
    role: 'Department Head',
    email: 'depthead@assetflow.com',
    phone: '+1 (234) 567-8902',
    joiningDate: '2018-06-15',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250'
  },
  departmentEmployees: [],
  departmentAssets: [],
  allocationApprovals: [],
  transferApprovals: [],

  // ==========================================================================
  // Core HOD Fetch Dashboard Data Action
  // ==========================================================================
  fetchHODDashboard: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // 1. Fetch Dashboard Analytics
      const dash = await apiFetch('/api/hod/dashboard');
      if (dash.success) {
        const availableCount = dash.data.stats.statusDistribution.find(s => s.current_status === 'Available')?.count || 0;
        const allocatedCount = dash.data.stats.statusDistribution.find(s => s.current_status === 'Allocated')?.count || 0;
        const maintenanceCount = dash.data.stats.statusDistribution.find(s => s.current_status === 'Under Maintenance')?.count || 0;

        set({
          kpi: {
            totalAssets: dash.data.stats.assetCount,
            totalEmployees: dash.data.stats.employeeCount,
            totalDepartments: 3,
            availableAssets: availableCount,
            allocatedAssets: allocatedCount,
            maintenanceAssets: maintenanceCount,
            activeBookings: dash.data.todayBookingsCount,
            pendingMaintenance: dash.data.stats.pendingMaintenanceCount,
            activeAudits: 0
          },
          activities: dash.data.recentActivities.map(a => ({
            id: a.id,
            user: `${a.first_name} ${a.last_name}`,
            action: a.action,
            target: a.description,
            time: new Date(a.created_at).toLocaleTimeString(),
            module: a.module
          })),
          charts: {
            assetStatus: [
              { name: 'Allocated', value: allocatedCount, color: '#2563EB' },
              { name: 'Available', value: availableCount, color: '#10B981' },
              { name: 'Maintenance', value: maintenanceCount, color: '#F59E0B' }
            ],
            deptAssets: [
              { name: dash.data.department.department_code, assets: dash.data.stats.assetCount }
            ],
            monthlyRegistration: [
              { name: new Date(dash.data.department.created_at).toLocaleString('default', { month: 'short' }), assets: dash.data.stats.assetCount }
            ],
            maintenanceTrends: [
              { name: 'W1', requests: dash.data.stats.pendingMaintenanceCount, resolved: 0 }
            ]
          }
        });
      }

      // 2. Fetch Department Employees
      const emps = await apiFetch('/api/hod/employees');
      if (emps.success) {
        set({
          departmentEmployees: emps.data.map(e => ({
            id: e.id,
            employeeCode: e.employee_code,
            name: `${e.first_name} ${e.last_name}`,
            email: e.email,
            phone: e.phone || 'N/A',
            designation: e.designation_name || 'HOD',
            allocatedAssets: e.allocated_assets_count,
            status: e.status,
            avatar: e.profile_image || `https://i.pravatar.cc/150?u=${e.id}`
          }))
        });
      }

      // 3. Fetch Department Assets
      const assets = await apiFetch('/api/hod/assets');
      if (assets.success) {
        set({
          departmentAssets: assets.data.map(a => ({
            id: a.id,
            name: a.asset_name,
            code: a.asset_code,
            holder: a.holder || 'Available',
            status: a.current_status,
            condition: a.condition,
            location: a.location || 'N/A',
            category: a.category_name,
            image: a.asset_image || 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=400'
          }))
        });
      }

      // 4. Fetch Bookings and Pending Booking Requests
      const bookings = await apiFetch('/api/hod/booking-requests');
      if (bookings.success) {
        set({
          allocationApprovals: bookings.data.filter(b => b.status === 'Pending').map(b => ({
            id: b.id,
            employeeName: `${b.first_name} ${b.last_name}`,
            requestedAsset: `${b.asset_name} (${b.asset_code})`,
            date: b.booking_date,
            priority: 'Medium',
            justification: b.purpose || 'Department resource usage requested.'
          })),
          bookings: bookings.data.map(b => ({
            id: b.id,
            resource: b.asset_name,
            date: b.booking_date,
            time: `${b.start_time} - ${b.end_time}`,
            purpose: b.purpose || 'Team project presentation',
            status: b.status === 'Approved' ? 'Confirmed' : b.status
          }))
        });
      }

      // 5. Fetch Maintenance
      const maintenance = await apiFetch('/api/hod/maintenance');
      if (maintenance.success) {
        set({
          maintenanceRequests: maintenance.data.map(m => ({
            id: m.id,
            assetName: m.asset_name,
            assetCode: m.asset_code,
            issue: m.issue_title,
            status: m.status,
            priority: m.priority,
            date: m.requested_date,
            description: m.issue_description,
            assignedToName: m.technician_name || 'Unassigned'
          }))
        });
      }

      // 6. Fetch Employee Requests (Mapped into transferApprovals in the HOD state UI)
      const requests = await apiFetch('/api/hod/employee-requests');
      if (requests.success) {
        set({
          transferApprovals: requests.data.filter(r => r.status === 'Pending').map(r => ({
            id: r.id,
            asset: r.title,
            currentHolder: `${r.first_name} ${r.last_name}`,
            requestedHolder: 'HOD Approval Needed',
            reason: r.description,
            date: r.request_date
          }))
        });
      }

      // 7. Fetch Notifications
      const notifications = await apiFetch('/api/hod/notifications');
      if (notifications.success) {
        set({
          notificationsList: notifications.data.map(n => ({
            id: n.id,
            title: n.title,
            message: n.message,
            time: new Date(n.created_at).toLocaleTimeString(),
            type: n.notification_type,
            read: n.is_read
          }))
        });
      }

      // 8. Fetch Profile settings
      const profile = await apiFetch('/api/hod/profile');
      if (profile.success) {
        set({
          profile: {
            name: `${profile.data.first_name} ${profile.data.last_name}`,
            id: profile.data.employee_code,
            dbId: profile.data.id,
            department: profile.data.department_name || 'IT',
            designation: profile.data.designation_name || 'HOD',
            role: 'Department Head',
            email: profile.data.email,
            phone: profile.data.phone || 'N/A',
            joiningDate: profile.data.joining_date,
            avatar: profile.data.profile_image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
          }
        });
      }
    } catch (err) {
      console.error('Failed to sync Zustand store state with live database:', err);
    }
  },

  // ==========================================================================
  // Backend Action Hooks
  // ==========================================================================

  // Approve a Booking (allocationApproval in HOD panel)
  approveAllocation: async (id) => {
    try {
      const res = await apiFetch(`/api/hod/booking/${id}/approve`, { method: 'PUT' });
      if (res.success) {
        await get().fetchHODDashboard();
      }
    } catch (err) {
      console.error('Failed to approve resource allocation booking request:', err);
    }
  },

  // Reject a Booking
  rejectAllocation: async (id) => {
    try {
      const res = await apiFetch(`/api/hod/booking/${id}/reject`, { method: 'PUT' });
      if (res.success) {
        await get().fetchHODDashboard();
      }
    } catch (err) {
      console.error('Failed to reject resource allocation booking request:', err);
    }
  },

  // Approve a Service Request (transferApproval in HOD panel)
  approveTransfer: async (id) => {
    try {
      const res = await apiFetch(`/api/hod/request/${id}/approve`, { method: 'PUT' });
      if (res.success) {
        await get().fetchHODDashboard();
      }
    } catch (err) {
      console.error('Failed to approve employee service request:', err);
    }
  },

  // Reject a Service Request
  rejectTransfer: async (id) => {
    try {
      const res = await apiFetch(`/api/hod/request/${id}/reject`, { method: 'PUT' });
      if (res.success) {
        await get().fetchHODDashboard();
      }
    } catch (err) {
      console.error('Failed to reject employee service request:', err);
    }
  },

  // Raising a Booking via HOD
  addBooking: async (booking) => {
    try {
      const body = {
        resource_id: booking.resource_id || 1, // default or selected
        booking_title: booking.resource,
        purpose: booking.purpose,
        booking_date: booking.date,
        start_time: booking.time ? booking.time.split('-')[0].trim() : '09:00',
        end_time: booking.time ? booking.time.split('-')[1].trim() : '10:00'
      };

      const res = await apiFetch('/api/hod/calendar', {
        method: 'POST',
        body: JSON.stringify(body)
      });
      if (res.success) {
        await get().fetchHODDashboard();
      }
    } catch (err) {
      console.error('Failed to create calendar reservation slot:', err);
    }
  },

  // Mark all notifications read
  markNotificationsRead: async () => {
    try {
      const unreadList = get().notificationsList.filter(n => !n.read);
      for (let n of unreadList) {
        await apiFetch(`/api/hod/notifications/read/${n.id}`, { method: 'PUT' });
      }
      await get().fetchHODDashboard();
    } catch (err) {
      console.error('Failed to mark notifications as read:', err);
    }
  },

  // Profile Update
  updateProfile: async (updatedProfile) => {
    try {
      const res = await apiFetch('/api/hod/profile', {
        method: 'PUT',
        body: JSON.stringify({
          phone: updatedProfile.phone,
          profile_image: updatedProfile.avatar,
          password: updatedProfile.password
        })
      });
      if (res.success) {
        await get().fetchHODDashboard();
      }
    } catch (err) {
      console.error('Failed to update employee profile:', err);
    }
  },

  // Local state modifiers for Admin dashboard creation (Fallbacks)
  addDepartment: (dept) => set((state) => ({ departments: [...state.departments, { ...dept, id: state.departments.length + 1, status: 'Active', employeeCount: 0, assetCount: 0 }] })),
  updateDepartment: (id, updated) => set((state) => ({ departments: state.departments.map(d => d.id === id ? { ...d, ...updated } : d) })),
  addEmployee: (emp) => set((state) => ({ employees: [...state.employees, { ...emp, id: state.employees.length + 1, status: 'Active' }] })),
  updateEmployee: (id, updated) => set((state) => ({ employees: state.employees.map(e => e.id === id ? { ...e, ...updated } : e) }))
}));

// Automatic self-initializer: Runs in background when token exists on import
if (typeof window !== 'undefined' && localStorage.getItem('token')) {
  setTimeout(() => {
    useStore.getState().fetchHODDashboard();
  }, 100);
}
