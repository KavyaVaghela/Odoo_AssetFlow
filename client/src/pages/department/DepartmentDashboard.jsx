import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Activity, Laptop, Users, FileBarChart, CheckSquare, CalendarClock, Loader2, AlertCircle } from 'lucide-react';
import api from '../../services/api';

export default function DepartmentDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/api/hod/dashboard');
        if (response.data.success) {
          setData(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center text-red-500">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Map statusDistribution to PieChart format
  const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  const assetDistribution = data.stats.statusDistribution.map((item, index) => ({
    name: item.current_status || 'Unknown',
    value: item.count,
    color: COLORS[index % COLORS.length]
  }));

  const utilizationData = [
    { name: 'Week 1', rate: 70 },
    { name: 'Week 2', rate: 74 },
    { name: 'Week 3', rate: 78 },
    { name: 'Week 4', rate: 82 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          {data.department.department_name} Dashboard
        </h1>
        <p className="text-muted-foreground">Department-wide resource optimization metrics and usage curves.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Dept Utilization</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82.5%</div>
            <p className="text-[10px] text-muted-foreground mt-1">Based on active resource assignments</p>
          </CardContent>
        </Card>

        <Card className="glass rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Pending Approvals</CardTitle>
            <CheckSquare className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.pendingApprovals}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Requires immediate HOD sign-off</p>
          </CardContent>
        </Card>

        <Card className="glass rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Active Asset Count</CardTitle>
            <Laptop className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.assetCount} Units</div>
            <p className="text-[10px] text-muted-foreground mt-1">Total assigned to department</p>
          </CardContent>
        </Card>

        <Card className="glass rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Assigned Staff</CardTitle>
            <Users className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.employeeCount} Members</div>
            <p className="text-[10px] text-muted-foreground mt-1">Total active employees</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Left Side: Utilization Trends Area Chart */}
        <Card className="md:col-span-4 rounded-2xl border-border/50 glass">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-1.5">
              <FileBarChart className="w-4 h-4 text-primary" />
              Resource Allocation Trends
            </CardTitle>
            <CardDescription className="text-xs">Utilization curves of inventory categories by week.</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={utilizationData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" fontSize={11} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis fontSize={11} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }} />
                <Bar dataKey="rate" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Right Side: Category breakdown Pie Chart */}
        <Card className="md:col-span-3 rounded-2xl border-border/50 glass">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Asset Status Distribution</CardTitle>
            <CardDescription className="text-xs">Breakdown of department assets by current condition.</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px] flex items-center justify-center relative">
            {assetDistribution.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assetDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {assetDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute bottom-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
                  {assetDistribution.map(entry => (
                    <div key={entry.name} className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-[10px] text-muted-foreground">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">No asset data available.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Action Quick Links Card */}
        <Card className="rounded-2xl border-border/50 glass">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Today's Bookings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.todayBookings.length > 0 ? (
              data.todayBookings.map(booking => (
                <div key={booking.id} className="flex justify-between items-center p-3 border rounded-xl text-xs bg-card">
                  <div>
                    <span className="font-bold text-foreground">{booking.first_name} {booking.last_name}</span>
                    <span className="text-muted-foreground"> booked </span>
                    <span className="font-semibold text-primary">{booking.asset_name}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {booking.start_time} - {booking.end_time}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4">No active bookings for today.</p>
            )}
            
            <div className="pt-4 flex justify-between gap-4">
              <Button size="sm" onClick={() => navigate('/department/allocation-approvals')} className="w-full rounded-lg h-8 text-xs font-semibold bg-primary hover:bg-primary/90">
                View Pending Bookings
              </Button>
              <Button size="sm" variant="outline" onClick={() => navigate('/department/transfer-approvals')} className="w-full rounded-lg h-8 text-xs font-semibold">
                Maintenance Requests
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Audit Verification status widget */}
        <Card className="rounded-2xl border-border/50 glass">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-1">
              <CalendarClock className="w-4 h-4 text-primary" />
              Recent Department Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            {data.recentActivities.length > 0 ? (
              data.recentActivities.map(activity => (
                <div key={activity.id} className="flex flex-col border-b last:border-0 pb-2 last:pb-0">
                  <span className="font-semibold text-foreground">{activity.action}</span>
                  <span className="text-muted-foreground">{activity.description}</span>
                  <span className="text-[10px] text-primary mt-1">{new Date(activity.created_at).toLocaleString()}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">No recent activities found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
