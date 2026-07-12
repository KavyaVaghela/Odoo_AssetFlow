import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
<<<<<<< HEAD
  PackageSearch,
  PlusCircle,
  Tags,
  Briefcase,
  UserPlus,
  ArrowRightLeft,
  Undo2,
  Wrench,
  QrCode,
  ShieldCheck,
  BarChart3,
=======
  Package, 
  Calendar, 
  History, 
  Wrench, 
  MessageSquare, 
>>>>>>> eba111a9b436d9a31cb253baeb1bb36a0ab1af72
  Bell, 
  User, 
  Settings, 
  LogOut,
  ChevronLeft,
<<<<<<< HEAD
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Asset Inventory', path: '/inventory', icon: PackageSearch },
  { name: 'Register Asset', path: '/register', icon: PlusCircle },
  { name: 'Categories', path: '/categories', icon: Tags },
  { name: 'Resource Inventory', path: '/resources', icon: Briefcase },
  { name: 'Allocate Asset', path: '/allocate', icon: UserPlus },
  { name: 'Transfer Asset', path: '/transfer', icon: ArrowRightLeft },
  { name: 'Return Asset', path: '/return', icon: Undo2 },
  { name: 'Maintenance', path: '/maintenance', icon: Wrench },
  { name: 'QR Management', path: '/qr', icon: QrCode },
  { name: 'Audit', path: '/audit', icon: ShieldCheck },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
  { name: 'Notifications', path: '/notifications', icon: Bell },
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Settings', path: '/settings', icon: Settings },
=======
  ChevronRight,
  Users,
  CheckSquare,
  RefreshCw,
  FileBarChart,
  Grid,
  Shield,
  QrCode
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Static template structure for all sidebar menu divisions
const navGroupsTemplate = [
  {
    title: 'Overview',
    roles: ['Employee', 'Asset Manager', 'Department Head', 'Admin'],
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }
    ]
  },
  {
    title: 'Employee Portal',
    roles: ['Employee', 'Asset Manager', 'Department Head', 'Admin'],
    items: [
      { name: 'My Assets', path: '/assets', icon: Package },
      { name: 'Resource Booking', path: '/booking', icon: Calendar },
      { name: 'Booking History', path: '/booking-history', icon: History },
      { name: 'Maintenance Requests', path: '/maintenance', icon: Wrench },
      { name: 'My Requests', path: '/requests', icon: MessageSquare },
      { name: 'Notifications', path: '/notifications', icon: Bell },
    ]
  },
  {
    title: 'Asset Manager',
    roles: ['Asset Manager', 'Admin'],
    items: [
      { name: 'Asset Inventory', path: '/assets/inventory', icon: Package },
      { name: 'Allocate Assets', path: '/assets/allocation', icon: CheckSquare },
      { name: 'Transfers', path: '/assets/transfer', icon: RefreshCw },
      { name: 'Returns', path: '/assets/returns', icon: History },
      { name: 'QR Management', path: '/qr', icon: QrCode },
      { name: 'Reports', path: '/reports', icon: FileBarChart },
      { name: 'Audit', path: '/audit', icon: Wrench },
    ]
  },
  {
    title: 'Department Head',
    roles: ['Department Head', 'Admin'],
    items: [
      { name: 'Dept Dashboard', path: '/department/dashboard', icon: Grid },
      { name: 'Dept Employees', path: '/department/employees', icon: Users },
      { name: 'Dept Assets', path: '/department/assets', icon: Package },
      { name: 'Allocation Approvals', path: '/department/allocation-approvals', icon: CheckSquare },
      { name: 'Transfer Approvals', path: '/department/transfer-approvals', icon: RefreshCw },
      { name: 'Dept Resources', path: '/department/resources', icon: Grid },
      { name: 'Dept Calendar', path: '/department/calendar', icon: Calendar },
      { name: 'Dept Reports', path: '/department/reports', icon: FileBarChart },
    ]
  },
  {
    title: 'Admin Control',
    roles: ['Admin'],
    items: [
      { name: 'Employees', path: '/admin/employees', icon: Users },
      { name: 'Departments', path: '/admin/departments', icon: Grid },
      { name: 'Roles', path: '/admin/roles', icon: Shield },
      { name: 'Categories', path: '/admin/categories', icon: Package }
    ]
  },
  {
    title: 'Personal',
    roles: ['Employee', 'Asset Manager', 'Department Head', 'Admin'],
    items: [
      { name: 'Profile', path: '/profile', icon: User },
      { name: 'Settings', path: '/settings', icon: Settings },
    ]
  }
>>>>>>> eba111a9b436d9a31cb253baeb1bb36a0ab1af72
];

export function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();

  // Extract user details to check roles
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRoles = user.roles || ['Employee'];

  const handleLogout = () => {
<<<<<<< HEAD
    alert("Signing out of AssetFlow. (Mock Action)");
=======
    localStorage.clear();
    window.location.href = '/login';
>>>>>>> eba111a9b436d9a31cb253baeb1bb36a0ab1af72
  };

  // Filter navigation groups based on user roles
  const filteredGroups = navGroupsTemplate.filter(group => 
    group.roles.some(role => userRoles.includes(role))
  );

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      className="relative flex flex-col h-screen border-r bg-card shadow-sm z-20 transition-all duration-300"
    >
<<<<<<< HEAD
      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b">
        <div className={cn("flex items-center gap-2", collapsed && "justify-center w-full")}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20">
            AF
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-foreground">AssetFlow</span>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Asset Manager</span>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle Button */}
=======
      <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b">
        <div className={cn("flex items-center gap-2", collapsed && "justify-center w-full")}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-md">
            AF
          </div>
          {!collapsed && <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">AssetFlow</span>}
        </div>
      </div>

>>>>>>> eba111a9b436d9a31cb253baeb1bb36a0ab1af72
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-accent text-muted-foreground z-30"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

<<<<<<< HEAD
      {/* Sidebar Items */}
      <div className="flex-1 overflow-y-auto py-6 scrollbar-hide">
        <div className="px-3 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => cn(
                  "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground relative",
                  isActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground",
                  collapsed && "justify-center px-0 py-3"
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className={cn("h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110", !collapsed && "mr-3")} />
                {!collapsed && <span>{item.name}</span>}
                {isActive && !collapsed && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 h-8 w-1 rounded-r-md bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Sidebar Footer / Logout */}
      <div className="p-3 border-t">
        <button
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-all duration-200 hover:bg-destructive/10",
            collapsed && "justify-center px-0 py-3"
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className={cn("h-5 w-5 shrink-0", !collapsed && "mr-3")} />
=======
      <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        <div className="px-3 space-y-6">
          {filteredGroups.map((group, i) => (
            <div key={i}>
              {!collapsed && (
                <h4 className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 animate-fade-in">
                  {group.title}
                </h4>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      className={({ isActive }) => cn(
                        "group flex items-center rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground relative",
                        isActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground",
                        collapsed && "justify-center px-0 py-2.5"
                      )}
                      title={collapsed ? item.name : undefined}
                    >
                      <item.icon className={cn("h-4 w-4 shrink-0 transition-transform group-hover:scale-105", !collapsed && "mr-2.5", isActive && "text-primary")} />
                      {!collapsed && <span>{item.name}</span>}
                      {isActive && !collapsed && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute left-0 h-8 w-1 rounded-r-md bg-primary"
                        />
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logout Section */}
      <div className="p-3 border-t mt-auto">
        <button
          onClick={handleLogout}
          className={cn(
            "group flex w-full items-center rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 hover:bg-destructive/10 hover:text-destructive text-muted-foreground cursor-pointer",
            collapsed && "justify-center px-0 py-2.5"
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className={cn("h-4 w-4 shrink-0 transition-transform group-hover:scale-105", !collapsed && "mr-2.5")} />
>>>>>>> eba111a9b436d9a31cb253baeb1bb36a0ab1af72
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}
