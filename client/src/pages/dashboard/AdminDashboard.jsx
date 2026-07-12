import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, ShieldCheck, CheckCircle2, Clock, Activity, Building, Package, ArrowRight, LayoutDashboard } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from '@/services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await api.get('/api/admin/dashboard');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Placeholder chart data until API supports it
  const activityData = [
    { name: 'Mon', active: 40, pending: 24 },
    { name: 'Tue', active: 30, pending: 13 },
    { name: 'Wed', active: 20, pending: 38 },
    { name: 'Thu', active: 27, pending: 39 },
    { name: 'Fri', active: 18, pending: 48 },
    { name: 'Sat', active: 23, pending: 38 },
    { name: 'Sun', active: 34, pending: 43 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">System overview and core management statistics.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Activity className="h-4 w-4" /> System Health
        </Button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-l-4 border-l-blue-500 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div className="text-3xl font-bold">{stats?.totalEmployees || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Active users in the system</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-l-4 border-l-orange-500 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">Pending Registrations</p>
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
              <div className="text-3xl font-bold">{stats?.pendingApprovals || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting admin approval</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-l-4 border-l-green-500 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">Departments</p>
                <Building className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold">{stats?.totalDepartments || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Organizational units</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-l-4 border-l-purple-500 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">Asset Categories</p>
                <Package className="h-5 w-5 text-purple-500" />
              </div>
              <div className="text-3xl font-bold">{stats?.totalAssetCategories || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Resource classifications</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-7">
        {/* Charts Section */}
        <Card className="md:col-span-4 shadow-sm border-0 bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800">
          <CardHeader>
            <CardTitle>System Activity Trends</CardTitle>
            <CardDescription>User engagements and registrations over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="active" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorActive)" />
                  <Area type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorPending)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity List */}
        <Card className="md:col-span-3 shadow-sm border-0 bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions performed in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stats?.recentActivities?.length > 0 ? (
                stats.recentActivities.map((log, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                      <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{log.action}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{log.description}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(log.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-8 w-8 mx-auto mb-3 opacity-20" />
                  <p>No recent activities found.</p>
                </div>
              )}
            </div>
            
            <Button variant="ghost" className="w-full mt-6 gap-2 group">
              View All Logs
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
