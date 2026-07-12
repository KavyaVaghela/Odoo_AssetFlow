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
  { id: 1, user: 'John Doe', action: 'Assigned MacBook Pro', target: 'Michael Chang', time: '2 hours ago', module: 'Assets' },
  { id: 2, user: 'Jane Smith', action: 'Approved Maintenance', target: 'Dell Monitor (AST-102)', time: '4 hours ago', module: 'Maintenance' },
  { id: 3, user: 'System', action: 'Audit Cycle Started', target: 'Q3 IT Assets Audit', time: '1 day ago', module: 'Audit' },
  { id: 4, user: 'David Kim', action: 'Registered New Asset', target: 'Ergonomic Chair', time: '2 days ago', module: 'Assets' },
];

export const useStore = create((set) => ({
  departments: initialDepartments,
  employees: initialEmployees,
  categories: initialCategories,
  roles: initialRoles,
  kpi: kpiData,
  charts: chartData,
  activities: recentActivities,
  
  // Actions
  addDepartment: (dept) => set((state) => ({ departments: [...state.departments, { ...dept, id: `D00${state.departments.length + 1}`, status: 'Active', employeeCount: 0, assetCount: 0 }] })),
  updateDepartment: (id, updated) => set((state) => ({
    departments: state.departments.map(d => d.id === id ? { ...d, ...updated } : d)
  })),
  
  addEmployee: (emp) => set((state) => ({ employees: [...state.employees, { ...emp, id: `E00${state.employees.length + 1}`, status: 'Active', lastLogin: 'Never', avatar: 'https://i.pravatar.cc/150' }] })),
  updateEmployee: (id, updated) => set((state) => ({
    employees: state.employees.map(e => e.id === id ? { ...e, ...updated } : e)
  })),
  
  // Special action for role promotion (Additive)
  promoteEmployee: (id, newRole) => set((state) => {
    return {
      employees: state.employees.map(e => {
        if (e.id === id) {
          // If already Employee, make it "Employee + [New Role]"
          // Simplified for dummy data
          let assignedRole = newRole;
          if (e.role === 'Employee' && newRole !== 'Employee') {
             assignedRole = `Employee + ${newRole}`;
          }
          return { ...e, role: assignedRole };
        }
        return e;
      })
    }
  }),
}));
