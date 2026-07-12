import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
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
  Bell, 
  User, 
  Settings, 
  LogOut,
  ChevronLeft,
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
];

export function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();

  // Extract user details to check roles
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRoles = user.roles || ['Employee'];

  const handleLogout = () => {
    alert("Signing out of AssetFlow. (Mock Action)");
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
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-accent text-muted-foreground z-30"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

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
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}
