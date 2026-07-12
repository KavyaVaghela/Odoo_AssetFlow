import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Tags, 
  ShieldCheck, 
  Package, 
  BarChart3, 
  FileCheck2, 
  Bell, 
  Activity, 
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown
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
    title: 'Organization',
    items: [
      { name: 'Departments', path: '/departments', icon: Building2 },
      { name: 'Employees', path: '/employees', icon: Users },
      { name: 'Categories', path: '/categories', icon: Tags },
      { name: 'Role Management', path: '/roles', icon: ShieldCheck },
    ]
  },
  {
    title: 'Operations',
    items: [
      { name: 'Assets', path: '/assets', icon: Package },
      { name: 'Reports', path: '/reports', icon: BarChart3 },
      { name: 'Audit', path: '/audit', icon: FileCheck2 },
    ]
  },
  {
    title: 'System',
    items: [
      { name: 'Notifications', path: '/notifications', icon: Bell },
      { name: 'Activity Logs', path: '/activity-logs', icon: Activity },
      { name: 'Settings', path: '/settings', icon: Settings },
    ]
  }
];

export function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      className="relative flex flex-col h-screen border-r bg-card shadow-sm z-20 transition-all duration-300"
    >
      <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b">
        <div className={cn("flex items-center gap-2", collapsed && "justify-center w-full")}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            A
          </div>
          {!collapsed && <span className="font-semibold text-lg tracking-tight">AssetFlow</span>}
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
                  const isActive = location.pathname.startsWith(item.path);
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      className={({ isActive }) => cn(
                        "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                        isActive ? "bg-primary/10 text-primary" : "text-muted-foreground",
                        collapsed && "justify-center px-0 py-2.5"
                      )}
                      title={collapsed ? item.name : undefined}
                    >
                      <item.icon className={cn("h-5 w-5 shrink-0", !collapsed && "mr-3")} />
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
    </motion.aside>
  );
}
