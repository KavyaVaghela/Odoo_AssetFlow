import { create } from 'zustand';

<<<<<<< HEAD
// --- Premium Employee Mock Data ---

const initialProfile = {
  name: "John Doe",
  employeeId: "EMP-2026-8942",
  department: "Computer Engineering",
  designation: "Senior Software Engineer",
  role: "Employee",
  email: "john.doe@assetflow.com",
  phone: "+1 (555) 234-5678",
  joiningDate: "2024-03-15",
  photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
};

const initialAssets = [
  {
    id: "A001",
    name: "Dell Latitude 7440 Ultrabook",
    code: "AST-DELL-7440",
    serial: "S/N: 92XJ721",
    category: "Electronics (Laptop)",
    status: "Assigned",
    condition: "Excellent",
    allocationDate: "2024-03-16",
    expectedReturnDate: "2027-03-16",
    qrValue: "https://assetflow.com/assets/AST-DELL-7440",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "A002",
    name: "Logitech MX Master 3S Wireless Mouse",
    code: "AST-LOGI-3S",
    serial: "S/N: 48ZJ902",
    category: "Peripherals (Mouse)",
    status: "Assigned",
    condition: "Good",
    allocationDate: "2024-03-16",
    expectedReturnDate: "2026-09-16",
    qrValue: "https://assetflow.com/assets/AST-LOGI-3S",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "A003",
    name: "Dell UltraSharp 34\" Curved Monitor",
    code: "AST-DELL-U34",
    serial: "S/N: 51JK309",
    category: "Peripherals (Monitor)",
    status: "Assigned",
    condition: "Excellent",
    allocationDate: "2024-04-10",
    expectedReturnDate: "2027-04-10",
    qrValue: "https://assetflow.com/assets/AST-DELL-U34",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=80"
  }
];

const initialResources = [
  { id: "R1", name: "Meeting Room Alpha (10 Pax)", category: "Meeting Rooms", capacity: 10, location: "Block A, 3rd Floor", status: "Available" },
  { id: "R2", name: "Conference Room B (25 Pax)", category: "Conference Rooms", capacity: 25, location: "Block C, 1st Floor", status: "Available" },
  { id: "R3", name: "Vite Projector Pro", category: "Projectors", capacity: 1, location: "IT Helpdesk", status: "Available" },
  { id: "R4", name: "Tesla Model Y (Company Vehicle)", category: "Vehicles", capacity: 5, location: "Basement Parking", status: "Available" },
  { id: "R5", name: "Advanced Robotics Lab", category: "Laboratories", capacity: 15, location: "Block D, Lab 4", status: "Available" },
  { id: "R6", name: "DSLR Canon EOS R5 Kit", category: "Equipment", capacity: 1, location: "Media Room", status: "Available" }
];

const initialBookings = [
  { id: "B001", resourceName: "Meeting Room Alpha (10 Pax)", resourceCategory: "Meeting Rooms", date: "2026-07-13", timeStart: "10:00 AM", timeEnd: "11:30 AM", status: "Approved", reason: "Sprint Planning" },
  { id: "B002", resourceName: "Ford Transit Van (Company Vehicle)", resourceCategory: "Vehicles", date: "2026-07-20", timeStart: "09:00 AM", timeEnd: "05:00 PM", status: "Approved", reason: "Field Deployment" },
  { id: "B003", resourceName: "Vite Projector Pro", resourceCategory: "Projectors", date: "2026-07-25", timeStart: "02:00 PM", timeEnd: "04:00 PM", status: "Pending", reason: "Quarterly Review Presentation" }
];

const initialMaintenance = [
  {
    id: "M-101",
    assetName: "Dell Latitude 7440 Ultrabook",
    assetCode: "AST-DELL-7440",
    problem: "Battery backup is low, degrading fast under workload.",
    status: "In Progress",
    submittedDate: "2026-07-10",
    priority: "High",
    timeline: [
      { status: "Submitted", date: "2026-07-10 09:00 AM", note: "Request raised by Employee" },
      { status: "Approved", date: "2026-07-11 02:30 PM", note: "Approved by Asset Manager. Assigned to external vendor Dell Support." },
      { status: "In Progress", date: "2026-07-12 11:00 AM", note: "Device diagnostics running at service center." }
    ]
  },
  {
    id: "M-102",
    assetName: "Logitech MX Master 3S Wireless Mouse",
    assetCode: "AST-LOGI-3S",
    problem: "Scroll wheel tension control mechanism failing.",
    status: "Completed",
    submittedDate: "2026-06-05",
    priority: "Low",
    timeline: [
      { status: "Submitted", date: "2026-06-05 10:15 AM", note: "Request raised by Employee" },
      { status: "Approved", date: "2026-06-05 04:00 PM", note: "Approved by Asset Manager." },
      { status: "Completed", date: "2026-06-08 03:00 PM", note: "Scroll mechanism repaired and returned to Employee." }
    ]
  }
];

const initialRequests = [
  { id: "REQ-301", requestType: "Asset Allocation Request", detail: "Sony WH-1000XM4 Noise-Cancelling Headphones", status: "Pending Approval", submittedDate: "2026-07-11", priority: "High", justification: "Need quiet background for focus/remote coding sessions." },
  { id: "REQ-302", requestType: "Software License Allocation", detail: "JetBrains WebStorm Enterprise License", status: "Approved", submittedDate: "2026-05-12", priority: "Medium", justification: "Required for web development and pair programming." }
];

const initialNotifications = [
  { id: "N1", title: "Maintenance Work In Progress", message: "Your maintenance request M-101 for Dell Latitude 7440 is now diagnostics in progress.", time: "2 hours ago", read: false, category: "maintenance" },
  { id: "N2", title: "Upcoming Asset Return", message: "Your allocated Dell UltraSharp 34\" Monitor return date is in 90 days.", time: "1 day ago", read: false, category: "asset" },
  { id: "N3", title: "Booking Confirmation", message: "Your booking for Ford Transit Van on 2026-07-20 has been approved.", time: "3 days ago", read: true, category: "booking" },
  { id: "N4", title: "System Audit Reminder", message: "Self-Verification audit for your assigned assets is due by the end of July.", time: "4 days ago", read: false, category: "audit" }
];

const initialActivities = [
  { id: 1, action: "Booked Resource", target: "Meeting Room Alpha", time: "2 hours ago", module: "Bookings" },
  { id: 2, action: "Submitted Asset Request", target: "Sony WH-1000XM4", time: "1 day ago", module: "Requests" },
  { id: 3, action: "Updated Profile Contact", target: "Phone Number", time: "2 days ago", module: "Profile" },
  { id: 4, action: "Raised Maintenance Request", target: "Dell Latitude 7440", time: "2 days ago", module: "Maintenance" }
];

// Helper KPI Generator
const computeKpis = (assets, bookings, maintenance, requests, notifications) => ({
  assignedAssets: assets.length,
  upcomingBookings: bookings.filter(b => b.status === "Approved").length,
  pendingMaintenance: maintenance.filter(m => m.status !== "Completed").length,
  openRequests: requests.filter(r => r.status === "Pending Approval").length,
  unreadNotifications: notifications.filter(n => !n.read).length,
  upcomingReturns: assets.filter(a => new Date(a.expectedReturnDate) - new Date() < 90 * 24 * 60 * 60 * 1000).length // Next 90 days
});

// Helper Charts Data Generator
const computeCharts = (bookings) => ({
  bookingStatus: [
    { name: 'Approved', value: bookings.filter(b => b.status === 'Approved').length, color: '#10b981' },
    { name: 'Pending', value: bookings.filter(b => b.status === 'Pending').length, color: '#f59e0b' },
    { name: 'Canceled', value: bookings.filter(b => b.status === 'Canceled').length, color: '#ef4444' },
  ],
  monthlyBookings: [
    { name: 'Jan', bookings: 2 },
    { name: 'Feb', bookings: 5 },
    { name: 'Mar', bookings: 3 },
    { name: 'Apr', bookings: 6 },
    { name: 'May', bookings: 4 },
    { name: 'Jun', bookings: 8 },
    { name: 'Jul', bookings: bookings.length }
  ]
});

// --- Store ---

export const useStore = create((set, get) => ({
  profile: initialProfile,
  myAssets: initialAssets,
  resources: initialResources,
  bookings: initialBookings,
  maintenance: initialMaintenance,
  requests: initialRequests,
  notifications: initialNotifications,
  activities: initialActivities,
  kpi: computeKpis(initialAssets, initialBookings, initialMaintenance, initialRequests, initialNotifications),
  charts: computeCharts(initialBookings),

  // Actions
  updateProfile: (updatedProfile) => set((state) => {
    const profile = { ...state.profile, ...updatedProfile };
    const activities = [
      { id: Date.now(), action: "Updated Profile", target: "Personal Info", time: "Just now", module: "Profile" },
      ...state.activities
    ];
    return { profile, activities };
  }),

  addBooking: (booking) => set((state) => {
    const newBooking = {
      id: `B00${state.bookings.length + 1}`,
      status: "Approved", // Auto-approved for this mockup
      ...booking
    };
    const bookings = [newBooking, ...state.bookings];
    const activities = [
      { id: Date.now(), action: "Booked Resource", target: booking.resourceName, time: "Just now", module: "Bookings" },
      ...state.activities
    ];
    const kpi = computeKpis(state.myAssets, bookings, state.maintenance, state.requests, state.notifications);
    const charts = computeCharts(bookings);
    
    // Add toast notification
    const newNotification = {
      id: `N${Date.now()}`,
      title: "Booking Confirmed",
      message: `Your booking for ${booking.resourceName} has been approved.`,
      time: "Just now",
      read: false,
      category: "booking"
    };
    const notifications = [newNotification, ...state.notifications];

    return { bookings, activities, kpi, charts, notifications };
  }),

  cancelBooking: (id) => set((state) => {
    const bookings = state.bookings.map(b => b.id === id ? { ...b, status: 'Canceled' } : b);
    const deletedBooking = state.bookings.find(b => b.id === id);
    const activities = [
      { id: Date.now(), action: "Canceled Booking", target: deletedBooking ? deletedBooking.resourceName : "Resource", time: "Just now", module: "Bookings" },
      ...state.activities
    ];
    const kpi = computeKpis(state.myAssets, bookings, state.maintenance, state.requests, state.notifications);
    const charts = computeCharts(bookings);
    return { bookings, activities, kpi, charts };
  }),

  addMaintenanceRequest: (req) => set((state) => {
    const newReq = {
      id: `M-${state.maintenance.length + 101}`,
      status: "Pending",
      submittedDate: new Date().toISOString().split('T')[0],
      timeline: [
        { status: "Submitted", date: `${new Date().toISOString().split('T')[0]} Just now`, note: "Request raised by Employee" }
      ],
      ...req
    };
    const maintenance = [newReq, ...state.maintenance];
    const activities = [
      { id: Date.now(), action: "Raised Maintenance", target: req.assetName, time: "Just now", module: "Maintenance" },
      ...state.activities
    ];
    const kpi = computeKpis(state.myAssets, state.bookings, maintenance, state.requests, state.notifications);
    return { maintenance, activities, kpi };
  }),

  addAssetRequest: (req) => set((state) => {
    const newReq = {
      id: `REQ-${state.requests.length + 301}`,
      status: "Pending Approval",
      submittedDate: new Date().toISOString().split('T')[0],
      ...req
    };
    const requests = [newReq, ...state.requests];
    const activities = [
      { id: Date.now(), action: "Submitted Asset Request", target: req.detail, time: "Just now", module: "Requests" },
      ...state.activities
    ];
    const kpi = computeKpis(state.myAssets, state.bookings, state.maintenance, requests, state.notifications);
    return { requests, activities, kpi };
  }),

  markNotificationRead: (id) => set((state) => {
    const notifications = state.notifications.map(n => n.id === id ? { ...n, read: true } : n);
    const kpi = computeKpis(state.myAssets, state.bookings, state.maintenance, state.requests, notifications);
    return { notifications, kpi };
  }),

  markAllNotificationsRead: () => set((state) => {
    const notifications = state.notifications.map(n => ({ ...n, read: true }));
    const kpi = computeKpis(state.myAssets, state.bookings, state.maintenance, state.requests, notifications);
    return { notifications, kpi };
  }),

  deleteNotification: (id) => set((state) => {
    const notifications = state.notifications.filter(n => n.id !== id);
    const kpi = computeKpis(state.myAssets, state.bookings, state.maintenance, state.requests, notifications);
    return { notifications, kpi };
  })
}));
=======
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
>>>>>>> eba111a9b436d9a31cb253baeb1bb36a0ab1af72
