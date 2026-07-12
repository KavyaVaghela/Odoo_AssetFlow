import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  Calendar, 
  History, 
  Wrench, 
  MessageSquare, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navGroups = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }
    ]
  },
  {
    title: 'Operations',
    items: [
      { name: 'My Assets', path: '/assets', icon: Package },
      { name: 'Resource Booking', path: '/booking', icon: Calendar },
      { name: 'Booking History', path: '/booking-history', icon: History },
      { name: 'Maintenance Requests', path: '/maintenance', icon: Wrench },
      { name: 'My Requests', path: '/requests', icon: MessageSquare },
    ]
  },
  {
    title: 'Personal',
    items: [
      { name: 'Notifications', path: '/notifications', icon: Bell },
      { name: 'Profile', path: '/profile', icon: User },
      { name: 'Settings', path: '/settings', icon: Settings },
    ]
  }
];

export function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      className="relative flex flex-col h-screen border-r bg-card shadow-sm z-20 transition-all duration-300"
    >
      <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b">
        <div className={cn("flex items-center gap-2", collapsed && "justify-center w-full")}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-md">
            AF
          </div>
          {!collapsed && <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">AssetFlow</span>}
        </div>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-accent text-muted-foreground z-30"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        <div className="px-3 space-y-6">
          {navGroups.map((group, i) => (
            <div key={i}>
              {!collapsed && (
                <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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
                        "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground relative",
                        isActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground",
                        collapsed && "justify-center px-0 py-2.5"
                      )}
                      title={collapsed ? item.name : undefined}
                    >
                      <item.icon className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-105", !collapsed && "mr-3", isActive && "text-primary")} />
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
            "group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-destructive/10 hover:text-destructive text-muted-foreground",
            collapsed && "justify-center px-0 py-2.5"
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-105", !collapsed && "mr-3")} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}
