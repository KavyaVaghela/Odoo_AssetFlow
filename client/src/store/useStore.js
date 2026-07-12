import { create } from 'zustand';

// --- Dummy Data Definitions ---

const initialDepartments = [
  { id: 'D001', name: 'Engineering', head: 'John Doe', headId: 'E001', status: 'Active', employeeCount: 45, assetCount: 120 },
  { id: 'D002', name: 'Human Resources', head: 'Jane Smith', headId: 'E002', status: 'Active', employeeCount: 12, assetCount: 15 },
  { id: 'D003', name: 'Marketing', head: 'Alice Johnson', headId: 'E003', status: 'Active', employeeCount: 25, assetCount: 30 },
  { id: 'D004', name: 'Finance', head: 'Robert Brown', headId: 'E004', status: 'Inactive', employeeCount: 10, assetCount: 12 },
];

const initialEmployees = [
  { id: 'E001', name: 'John Doe', email: 'john.doe@assetflow.com', phone: '+1 234-567-8901', department: 'Engineering', role: 'Department Head', status: 'Active', lastLogin: '2023-10-25 09:30 AM', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
  { id: 'E002', name: 'Jane Smith', email: 'jane.smith@assetflow.com', phone: '+1 234-567-8902', department: 'Human Resources', role: 'Department Head', status: 'Active', lastLogin: '2023-10-25 08:15 AM', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  { id: 'E003', name: 'Alice Johnson', email: 'alice.johnson@assetflow.com', phone: '+1 234-567-8903', department: 'Marketing', role: 'Department Head', status: 'Active', lastLogin: '2023-10-24 04:45 PM', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d' },
  { id: 'E005', name: 'Michael Chang', email: 'michael.c@assetflow.com', phone: '+1 234-567-8905', department: 'Engineering', role: 'Employee', status: 'Active', lastLogin: '2023-10-25 10:00 AM', avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d' },
  { id: 'E006', name: 'Sarah Lee', email: 'sarah.lee@assetflow.com', phone: '+1 234-567-8906', department: 'Finance', role: 'Employee', status: 'On Leave', lastLogin: '2023-10-15 11:20 AM', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026703d' },
  { id: 'E007', name: 'David Kim', email: 'david.kim@assetflow.com', phone: '+1 234-567-8907', department: 'Engineering', role: 'Asset Manager', status: 'Active', lastLogin: '2023-10-25 09:10 AM', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026708d' },
];

const initialCategories = [
  { id: 'C001', name: 'Electronics', description: 'Laptops, Monitors, Phones', count: 345, status: 'Active', icon: '💻' },
  { id: 'C002', name: 'Furniture', description: 'Desks, Chairs, Cabinets', count: 120, status: 'Active', icon: '🪑' },
  { id: 'C003', name: 'Vehicles', description: 'Company Cars, Vans', count: 15, status: 'Active', icon: '🚗' },
  { id: 'C004', name: 'Networking', description: 'Routers, Switches, Servers', count: 85, status: 'Active', icon: '📡' },
  { id: 'C005', name: 'Software Licenses', description: 'Cloud, IDEs, Design Tools', count: 500, status: 'Active', icon: '🔑' },
];

const initialRoles = [
  { id: 'R001', name: 'Admin', description: 'Full system access', users: 3 },
  { id: 'R002', name: 'Employee', description: 'Basic access to own assets and requests', users: 150 },
  { id: 'R003', name: 'Asset Manager', description: 'Manage asset inventory and allocations', users: 5 },
  { id: 'R004', name: 'Department Head', description: 'View department assets and approve requests', users: 10 },
];

const kpiData = {
  totalAssets: 1245,
  totalEmployees: 342,
  totalDepartments: 12,
  availableAssets: 450,
  allocatedAssets: 765,
  maintenanceAssets: 30,
  activeBookings: 15,
  pendingMaintenance: 8,
  activeAudits: 2,
};

const chartData = {
  assetStatus: [
    { name: 'Allocated', value: 765, color: '#3b82f6' },
    { name: 'Available', value: 450, color: '#10b981' },
    { name: 'Maintenance', value: 30, color: '#f59e0b' },
  ],
  deptAssets: [
    { name: 'Eng', assets: 400 },
    { name: 'HR', assets: 50 },
    { name: 'Mktg', assets: 80 },
    { name: 'Fin', assets: 40 },
    { name: 'Ops', assets: 120 },
    { name: 'Sales', assets: 90 },
  ],
  monthlyRegistration: [
    { name: 'Jan', assets: 30 },
    { name: 'Feb', assets: 45 },
    { name: 'Mar', assets: 28 },
    { name: 'Apr', assets: 80 },
    { name: 'May', assets: 55 },
    { name: 'Jun', assets: 90 },
    { name: 'Jul', assets: 110 },
  ],
  maintenanceTrends: [
    { name: 'W1', requests: 5, resolved: 4 },
    { name: 'W2', requests: 8, resolved: 6 },
    { name: 'W3', requests: 12, resolved: 10 },
    { name: 'W4', requests: 7, resolved: 8 },
  ]
};

const recentActivities = [
  { id: 1, user: 'John Doe', action: 'Assigned Dell Latitude 5440', target: 'John Smith', time: '2 hours ago', module: 'Assets' },
  { id: 2, user: 'Jane Smith', action: 'Approved Maintenance Request', target: 'Logitech Mouse (AST-1002)', time: '4 hours ago', module: 'Maintenance' },
  { id: 3, user: 'System', action: 'Upcoming Physical Verification Scheduled', target: 'Q3 Audit Cycle', time: '1 day ago', module: 'Audit' },
  { id: 4, user: 'David Kim', action: 'Assigned Dell UltraSharp Monitor', target: 'John Smith', time: '2 days ago', module: 'Assets' },
];

const initialEmployeeAssets = [
  {
    id: 'AST-1001',
    name: 'Dell Latitude 5440',
    code: 'AST-1001',
    category: 'Electronics',
    serialNumber: 'CN-0HG45-128',
    status: 'Allocated',
    condition: 'Excellent',
    allocationDate: '2026-01-15',
    returnDate: '2026-07-13',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=400',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=AST-1001-DELL-LATITUDE-CN-0HG45-128'
  },
  {
    id: 'AST-1002',
    name: 'Logitech MX Master 3S',
    code: 'AST-1002',
    category: 'Electronics',
    serialNumber: 'LZ234567',
    status: 'Allocated',
    condition: 'Good',
    allocationDate: '2026-02-10',
    returnDate: '2026-12-31',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=400',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=AST-1002-LOGITECH-MOUSE-LZ234567'
  },
  {
    id: 'AST-1003',
    name: 'Dell UltraSharp 27" Monitor',
    code: 'AST-1003',
    category: 'Electronics',
    serialNumber: 'CN-0TR89-567',
    status: 'Allocated',
    condition: 'Excellent',
    allocationDate: '2026-03-01',
    returnDate: '2026-12-31',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=400',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=AST-1003-DELL-MONITOR-CN-0TR89-567'
  }
];

const initialBookings = [
  { id: 'B-501', resource: 'Meeting Room A', date: '2026-07-12', time: '14:00 - 15:00', purpose: 'Weekly Team Sync', status: 'Confirmed' },
  { id: 'B-502', resource: 'Projector 2', date: '2026-07-15', time: '10:00 - 12:00', purpose: 'Client Presentation', status: 'Confirmed' },
  { id: 'B-503', resource: 'Honda Civic (Vehicle)', date: '2026-07-20', time: '09:00 - 17:00', purpose: 'Site Visit', status: 'Pending' }
];

const initialMaintenance = [
  { id: 'M-201', assetName: 'Dell Latitude 5440', assetCode: 'AST-1001', issue: 'Battery draining quickly', status: 'Pending', priority: 'Medium', date: '2026-07-10', description: 'Battery drains from 100% to 10% in less than an hour.' },
  { id: 'M-202', assetName: 'Logitech MX Master 3S', assetCode: 'AST-1002', issue: 'Scroll wheel loose', status: 'Completed', priority: 'Low', date: '2026-06-15', description: 'The smart scroll wheel gets stuck occasionally.' }
];

const initialMyRequests = [
  { id: 'REQ-301', requestType: 'Software License', item: 'WebStorm IDE', priority: 'Medium', status: 'Approved', date: '2026-07-08', assignedTo: 'IT Support Team' },
  { id: 'REQ-302', requestType: 'New Asset', item: 'Noise-Cancelling Headphones', priority: 'High', status: 'Pending', date: '2026-07-11', assignedTo: 'Operations Dept' }
];

const initialNotificationsList = [
  { id: 'N-401', title: 'Laptop Return Due', message: 'Your Dell Latitude 5440 is scheduled for return tomorrow. If you need an extension, request it now.', time: '3 hours ago', type: 'Asset Update', read: false, category: 'asset' },
  { id: 'N-402', title: 'Booking Confirmed', message: 'Your booking for Meeting Room A today at 2:00 PM has been confirmed.', time: '5 hours ago', type: 'Booking Update', read: false, category: 'booking' },
  { id: 'N-403', title: 'Maintenance Update', message: 'Your maintenance request for Dell Monitor has been updated to \'Completed\'.', time: '1 day ago', type: 'Maintenance Update', read: true, category: 'maintenance' },
  { id: 'N-404', title: 'Asset Verification', message: 'Upcoming annual physical asset verification starts next Monday. Make sure all assets are in the office.', time: '2 days ago', type: 'Announcement', read: false, category: 'announcement' }
];

export const useStore = create((set) => ({
  departments: initialDepartments,
  employees: initialEmployees,
  categories: initialCategories,
  roles: initialRoles,
  kpi: kpiData,
  charts: chartData,
  activities: recentActivities,
  
  // Employee Dashboard state
  employeeAssets: initialEmployeeAssets,
  bookings: initialBookings,
  maintenanceRequests: initialMaintenance,
  myRequests: initialMyRequests,
  notificationsList: initialNotificationsList,
  profile: {
    name: 'John Smith',
    id: 'EMP-1001',
    department: 'Computer Engineering',
    designation: 'Senior Software Engineer',
    role: 'Employee',
    email: 'john.smith@assetflow.com',
    phone: '+1 (555) 019-2834',
    joiningDate: '2024-03-12',
    manager: 'Sarah Jenkins (VP of Engineering)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
  },
  
  // Actions
  addDepartment: (dept) => set((state) => ({ departments: [...state.departments, { ...dept, id: `D00${state.departments.length + 1}`, status: 'Active', employeeCount: 0, assetCount: 0 }] })),
  updateDepartment: (id, updated) => set((state) => ({
    departments: state.departments.map(d => d.id === id ? { ...d, ...updated } : d)
  })),
  
  addEmployee: (emp) => set((state) => ({ employees: [...state.employees, { ...emp, id: `E00${state.employees.length + 1}`, status: 'Active', lastLogin: 'Never', avatar: 'https://i.pravatar.cc/150' }] })),
  updateEmployee: (id, updated) => set((state) => ({
    employees: state.employees.map(e => e.id === id ? { ...e, ...updated } : e)
  })),
  
  promoteEmployee: (id, newRole) => set((state) => {
    return {
      employees: state.employees.map(e => {
        if (e.id === id) {
          let assignedRole = newRole;
          if (e.role === 'Employee' && newRole !== 'Employee') {
             assignedRole = `Employee + ${newRole}`;
          }
          return { ...e, role: assignedRole };
        }
        return e;
      })
    };
  }),

  // Employee-specific actions
  addBooking: (booking) => set((state) => ({ 
    bookings: [{ ...booking, id: `B-${Math.floor(100 + Math.random() * 900)}`, status: 'Pending' }, ...state.bookings] 
  })),
  
  addMaintenanceRequest: (req) => set((state) => ({ 
    maintenanceRequests: [{ 
      ...req, 
      id: `M-${Math.floor(100 + Math.random() * 900)}`, 
      status: 'Pending', 
      date: new Date().toISOString().split('T')[0] 
    }, ...state.maintenanceRequests] 
  })),
  
  addAssetRequest: (req) => set((state) => ({ 
    myRequests: [{ 
      ...req, 
      id: `REQ-${Math.floor(100 + Math.random() * 900)}`, 
      status: 'Pending', 
      date: new Date().toISOString().split('T')[0] 
    }, ...state.myRequests] 
  })),
  
  markNotificationsRead: () => set((state) => ({ 
    notificationsList: state.notificationsList.map(n => ({ ...n, read: true })) 
  })),
  
  updateProfile: (updatedProfile) => set((state) => ({ 
    profile: { ...state.profile, ...updatedProfile } 
  }))
}));
