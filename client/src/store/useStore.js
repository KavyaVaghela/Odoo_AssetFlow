import { create } from 'zustand';

// --- Dummy Data Definitions ---

const initialDepartments = [
  { id: 'D001', name: 'Computer Engineering', head: 'Dr. Rajesh Patel', headId: 'EMP-1002', status: 'Active', employeeCount: 25, assetCount: 120 },
  { id: 'D002', name: 'Human Resources', head: 'Jane Smith', headId: 'E002', status: 'Active', employeeCount: 12, assetCount: 15 },
  { id: 'D003', name: 'Marketing', head: 'Alice Johnson', headId: 'E003', status: 'Active', employeeCount: 25, assetCount: 30 },
  { id: 'D004', name: 'Finance', head: 'Robert Brown', headId: 'E004', status: 'Inactive', employeeCount: 10, assetCount: 12 },
];

const initialEmployees = [
  { id: 'EMP-1002', name: 'Dr. Rajesh Patel', email: 'depthead@assetflow.com', phone: '+1 234-567-8902', department: 'Computer Engineering', role: 'Department Head', status: 'Active', lastLogin: '2023-10-25 08:15 AM', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250' },
  { id: 'E001', name: 'John Doe', email: 'john.doe@assetflow.com', phone: '+1 234-567-8901', department: 'Engineering', role: 'Department Head', status: 'Active', lastLogin: '2023-10-25 09:30 AM', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
  { id: 'E003', name: 'Alice Johnson', email: 'alice.johnson@assetflow.com', phone: '+1 234-567-8903', department: 'Marketing', role: 'Department Head', status: 'Active', lastLogin: '2023-10-24 04:45 PM', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d' },
  { id: 'E005', name: 'Michael Chang', email: 'michael.c@assetflow.com', phone: '+1 234-567-8905', department: 'Computer Engineering', role: 'Employee', status: 'Active', lastLogin: '2023-10-25 10:00 AM', avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d' },
  { id: 'E006', name: 'Sarah Lee', email: 'sarah.lee@assetflow.com', phone: '+1 234-567-8906', department: 'Finance', role: 'Employee', status: 'On Leave', lastLogin: '2023-10-15 11:20 AM', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026703d' },
  { id: 'E007', name: 'David Kim', email: 'david.kim@assetflow.com', phone: '+1 234-567-8907', department: 'Computer Engineering', role: 'Asset Manager', status: 'Active', lastLogin: '2023-10-25 09:10 AM', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026708d' },
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
  totalAssets: 120,
  totalEmployees: 25,
  totalDepartments: 4,
  availableAssets: 45,
  allocatedAssets: 75,
  maintenanceAssets: 4,
  activeBookings: 8,
  pendingMaintenance: 4,
  activeAudits: 1,
};

const chartData = {
  assetStatus: [
    { name: 'Allocated', value: 75, color: '#2563EB' },
    { name: 'Available', value: 41, color: '#10B981' },
    { name: 'Maintenance', value: 4, color: '#F59E0B' },
  ],
  deptAssets: [
    { name: 'Eng', assets: 120 },
    { name: 'HR', assets: 15 },
    { name: 'Mktg', assets: 30 },
    { name: 'Fin', assets: 12 },
  ],
  monthlyRegistration: [
    { name: 'Jan', assets: 5 },
    { name: 'Feb', assets: 8 },
    { name: 'Mar', assets: 12 },
    { name: 'Apr', assets: 18 },
    { name: 'May', assets: 15 },
    { name: 'Jun', assets: 22 },
    { name: 'Jul', assets: 30 },
  ],
  maintenanceTrends: [
    { name: 'W1', requests: 1, resolved: 1 },
    { name: 'W2', requests: 3, resolved: 2 },
    { name: 'W3', requests: 4, resolved: 3 },
    { name: 'W4', requests: 2, resolved: 2 },
  ]
};

const recentActivities = [
  { id: 1, user: 'Amit Sharma', action: 'Booked IoT Research Lab', target: 'IoT Lab', time: '1 hour ago', module: 'Booking' },
  { id: 2, user: 'Dr. Rajesh Patel', action: 'Approved Asset Transfer', target: 'MacBook Pro (AST-AF-021)', time: '3 hours ago', module: 'Transfer' },
  { id: 3, user: 'Priya Patel', action: 'Raised Maintenance Ticket', target: 'Workstation (AST-AF-022)', time: '6 hours ago', module: 'Maintenance' },
  { id: 4, user: 'System', action: 'New Employee Registration', target: 'Vikram Singh', time: '1 day ago', module: 'Employee' },
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
  }
];

const initialBookings = [
  { id: 'B-501', resource: 'Meeting Room A', date: '2026-07-12', time: '14:00 - 15:00', purpose: 'Weekly Team Sync', status: 'Confirmed' },
  { id: 'B-502', resource: 'Projector 2', date: '2026-07-15', time: '10:00 - 12:00', purpose: 'Client Presentation', status: 'Confirmed' }
];

const initialMaintenance = [
  { id: 'M-201', assetName: 'Dell Latitude 5440', assetCode: 'AST-1001', issue: 'Battery draining quickly', status: 'Pending', priority: 'Medium', date: '2026-07-10', description: 'Battery drains from 100% to 10% in less than an hour.' }
];

const initialMyRequests = [
  { id: 'REQ-301', requestType: 'Software License', item: 'WebStorm IDE', priority: 'Medium', status: 'Approved', date: '2026-07-08', assignedTo: 'IT Support Team' }
];

const initialNotificationsList = [
  { id: 'N-401', title: 'Asset Return Alert', message: 'Your Dell Latitude 5440 return window closes tomorrow.', time: '2 hours ago', type: 'Asset Update', read: false, category: 'asset' },
  { id: 'N-402', title: 'Booking Confirmed', message: 'Your reservation for Meeting Room A today is confirmed.', time: '4 hours ago', type: 'Booking Update', read: false, category: 'booking' },
  { id: 'N-403', title: 'Transfer Pending', message: 'Priya Patel requested a transfer of Workstation AST-AF-022.', time: '5 hours ago', type: 'Approval Alert', read: false, category: 'announcement' }
];

// --- HOD Specific Dummy Data ---

const initialDepartmentEmployees = [
  { id: 'EMP-201', name: 'Amit Sharma', email: 'amit.sharma@assetflow.com', phone: '+1 234-567-9001', designation: 'Associate Professor', allocatedAssets: 3, status: 'Active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
  { id: 'EMP-202', name: 'Priya Patel', email: 'priya.patel@assetflow.com', phone: '+1 234-567-9002', designation: 'Assistant Professor', allocatedAssets: 5, status: 'Active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
  { id: 'EMP-203', name: 'Rohan Mehta', email: 'rohan.mehta@assetflow.com', phone: '+1 234-567-9003', designation: 'Lab Assistant', allocatedAssets: 2, status: 'Active', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
  { id: 'EMP-204', name: 'Anjali Desai', email: 'anjali.desai@assetflow.com', phone: '+1 234-567-9004', designation: 'Senior Lecturer', allocatedAssets: 4, status: 'On Leave', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150' },
  { id: 'EMP-205', name: 'Vikram Singh', email: 'vikram.singh@assetflow.com', phone: '+1 234-567-9005', designation: 'Research Scholar', allocatedAssets: 2, status: 'Active', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150' },
];

const initialDepartmentAssets = [
  { id: 'AST-AF-021', name: 'Apple MacBook Pro 16', code: 'AST-AF-021', holder: 'Amit Sharma', status: 'Allocated', condition: 'Excellent', location: 'CE-Lab 3', category: 'Electronics', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400' },
  { id: 'AST-AF-022', name: 'Dell Precision Workstation', code: 'AST-AF-022', holder: 'Priya Patel', status: 'Allocated', condition: 'Excellent', location: 'CE-Lab 1', category: 'Electronics', image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=400' },
  { id: 'AST-AF-023', name: 'HP LaserJet Printer', code: 'AST-AF-023', holder: 'Rohan Mehta', status: 'Under Maintenance', condition: 'Fair', location: 'Staff Room', category: 'Equipment', image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59edd6?auto=format&fit=crop&q=80&w=400' },
  { id: 'AST-AF-024', name: 'Universal VR Headset Kit', code: 'AST-AF-024', holder: 'Vikram Singh', status: 'Allocated', condition: 'Excellent', location: 'IoT Research Lab', category: 'Electronics', image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=400' },
  { id: 'AST-AF-025', name: 'Ergonomic Mesh Chair', code: 'AST-AF-025', holder: 'Anjali Desai', status: 'Allocated', condition: 'Excellent', location: 'Cabin 4B', category: 'Furniture', image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&q=80&w=400' },
];

const initialAllocationApprovals = [
  { id: 'APP-701', employeeName: 'Vikram Singh', requestedAsset: 'iPad Pro 12.9 (AST-AF-089)', date: '2026-07-12', priority: 'High', justification: 'Needed for IoT Interface control development.' },
  { id: 'APP-702', employeeName: 'Priya Patel', requestedAsset: 'Wacom Cintiq Tablet (AST-AF-091)', date: '2026-07-11', priority: 'Medium', justification: 'To draw schematic structures for publications.' },
  { id: 'APP-703', employeeName: 'Amit Sharma', requestedAsset: 'VGA to HDMI Connector Bundle (AST-AF-095)', date: '2026-07-10', priority: 'Low', justification: 'Connecting old monitor in the seminar hall.' }
];

const initialTransferApprovals = [
  { id: 'TRA-801', asset: 'Dell Precision Workstation (AST-AF-022)', currentHolder: 'Priya Patel', requestedHolder: 'Vikram Singh', reason: 'Priya Patel is moving to classroom teaching; Vikram needs the GPU for research models.', date: '2026-07-12' },
  { id: 'TRA-802', asset: 'Logitech MX Master Mouse (AST-AF-066)', currentHolder: 'Amit Sharma', requestedHolder: 'Anjali Desai', reason: 'Amit has a secondary mouse; Anjali\'s current mouse is faulty.', date: '2026-07-11' }
];

export const useStore = create((set) => ({
  departments: initialDepartments,
  employees: initialEmployees,
  categories: initialCategories,
  roles: initialRoles,
  kpi: kpiData,
  charts: chartData,
  activities: recentActivities,
  
  // Personal (Employee Mode) States
  employeeAssets: initialEmployeeAssets,
  bookings: initialBookings,
  maintenanceRequests: initialMaintenance,
  myRequests: initialMyRequests,
  notificationsList: initialNotificationsList,
  profile: {
    name: 'Dr. Rajesh Patel',
    id: 'EMP-1002',
    department: 'Computer Engineering',
    designation: 'Department Head',
    role: 'Department Head',
    email: 'depthead@assetflow.com',
    phone: '+1 (234) 567-8902',
    joiningDate: '2018-06-15',
    manager: 'Dr. Susan Miller (Dean of Engineering)',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250'
  },

  // Department (HOD Mode) States
  departmentEmployees: initialDepartmentEmployees,
  departmentAssets: initialDepartmentAssets,
  allocationApprovals: initialAllocationApprovals,
  transferApprovals: initialTransferApprovals,
  
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

  // Employee actions
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
  })),

  // HOD specific approval actions
  approveAllocation: (id) => set((state) => {
    const itemToApprove = state.allocationApprovals.find(app => app.id === id);
    const newAssetList = itemToApprove ? [
      ...state.departmentAssets,
      {
        id: `AST-AF-${Math.floor(100 + Math.random() * 900)}`,
        name: itemToApprove.requestedAsset.split('(')[0].trim(),
        code: itemToApprove.requestedAsset.includes('(') ? itemToApprove.requestedAsset.split('(')[1].replace(')', '') : 'AST-NEW',
        holder: itemToApprove.employeeName,
        status: 'Allocated',
        condition: 'Excellent',
        location: 'CE-Lab 1',
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=400'
      }
    ] : state.departmentAssets;

    return {
      allocationApprovals: state.allocationApprovals.filter(app => app.id !== id),
      departmentAssets: newAssetList,
      kpi: {
        ...state.kpi,
        pendingApprovals: Math.max(0, state.kpi.pendingApprovals - 1),
        allocatedAssets: state.kpi.allocatedAssets + 1
      },
      activities: [
        { id: Date.now(), user: 'Dr. Rajesh Patel', action: 'Approved Asset Allocation', target: itemToApprove ? itemToApprove.requestedAsset : 'Asset', time: 'Just now', module: 'Allocation' },
        ...state.activities
      ]
    };
  }),

  rejectAllocation: (id) => set((state) => ({
    allocationApprovals: state.allocationApprovals.filter(app => app.id !== id),
    kpi: {
      ...state.kpi,
      pendingApprovals: Math.max(0, state.kpi.pendingApprovals - 1)
    }
  })),

  approveTransfer: (id) => set((state) => {
    const transfer = state.transferApprovals.find(t => t.id === id);
    let updatedAssets = state.departmentAssets;
    
    if (transfer) {
      const assetCodeMatch = transfer.asset.match(/\(([^)]+)\)/);
      const code = assetCodeMatch ? assetCodeMatch[1] : '';
      updatedAssets = state.departmentAssets.map(a => 
        a.code === code ? { ...a, holder: transfer.requestedHolder } : a
      );
    }

    return {
      transferApprovals: state.transferApprovals.filter(t => t.id !== id),
      departmentAssets: updatedAssets,
      kpi: {
        ...state.kpi,
        pendingApprovals: Math.max(0, state.kpi.pendingApprovals - 1)
      },
      activities: [
        { id: Date.now(), user: 'Dr. Rajesh Patel', action: 'Approved Asset Transfer', target: transfer ? transfer.asset : 'Asset', time: 'Just now', module: 'Transfer' },
        ...state.activities
      ]
    };
  }),

  rejectTransfer: (id) => set((state) => ({
    transferApprovals: state.transferApprovals.filter(t => t.id !== id),
    kpi: {
      ...state.kpi,
      pendingApprovals: Math.max(0, state.kpi.pendingApprovals - 1)
    }
  }))
}));
