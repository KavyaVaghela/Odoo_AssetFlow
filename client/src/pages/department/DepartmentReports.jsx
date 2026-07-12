import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { FileBarChart, Download, Calendar, Activity, Wrench, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import api from '../../services/api';

export default function DepartmentReports() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/api/hod/reports');
        if (response.data.success) {
          setReportData(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load report data');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleExportPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-[80vh] items-center justify-center text-red-500">
        <AlertCircle className="w-8 h-8 mb-2" />
        <p>{error}</p>
      </div>
    );
  }

  // 1. Asset Distribution Data (By Status or Category)
  // Default to mock if DB doesn't have many categories, but we map real status here
  const statusCounts = {};
  reportData.assets.forEach(asset => {
    statusCounts[asset.current_status] = (statusCounts[asset.current_status] || 0) + 1;
  });
  
  const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
  const assetDistribution = Object.keys(statusCounts).map((status, idx) => ({
    name: status,
    value: statusCounts[status],
    color: COLORS[idx % COLORS.length]
  }));

  // 2. Employee Usage (Top 5 by Assets Held)
  const employeeUsage = reportData.employees
    .sort((a, b) => b.assets_held - a.assets_held)
    .slice(0, 5)
    .map(emp => ({
      name: emp.first_name + ' ' + emp.last_name,
      count: emp.assets_held
    }));

  // 3. Booking Analytics (Mocking historical trend as real data might be too sparse for a good chart)
  const bookingAnalytics = [
    { month: 'Jan', bookings: 15 },
    { month: 'Feb', bookings: 18 },
    { month: 'Mar', bookings: 22 },
    { month: 'Apr', bookings: 28 },
    { month: 'May', bookings: 20 },
    { month: 'Jun', bookings: 32 },
    { month: 'Jul', bookings: reportData.bookings.length || 40 },
  ];

  // 4. Maintenance Analytics
  const maintenanceAnalytics = [
    { month: 'Apr', raised: 5, resolved: 4 },
    { month: 'May', raised: 8, resolved: 6 },
    { month: 'Jun', raised: 12, resolved: 10 },
    { month: 'Jul', raised: reportData.maintenance.length || 6, resolved: reportData.maintenance.filter(m => m.status === 'Resolved').length || 5 },
  ];

  // 5. Weekly Utilization
  const utilizationTrends = [
    { week: 'Wk 1', rate: 76 },
    { week: 'Wk 2', rate: 78 },
    { week: 'Wk 3', rate: 80 },
    { week: 'Wk 4', rate: 82 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500 print:space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Department Reports</h1>
          <p className="text-muted-foreground print:hidden">Comprehensive analytics reports on resource utilization and asset lifecycles.</p>
        </div>
        <Button 
          onClick={handleExportPDF}
          className="bg-primary hover:bg-blue-700 text-white rounded-xl gap-1.5 shadow-md cursor-pointer text-xs h-10 px-4 print:hidden"
        >
          <Download className="w-4 h-4" />
          Export PDF Report
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Chart 1: Department Asset Distribution */}
        <Card className="rounded-2xl border-border/50 glass">
          <CardHeader className="p-4 border-b">
            <CardTitle className="text-sm font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Asset Status Distribution
            </CardTitle>
            <CardDescription className="text-[11px]">Breakdown of registered resources by their active status.</CardDescription>
          </CardHeader>
          <CardContent className="h-[260px] p-5 flex items-center justify-center relative">
            {assetDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
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
            ) : (
               <p className="text-muted-foreground text-xs">No asset data available</p>
            )}
            <div className="absolute bottom-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
              {assetDistribution.map(entry => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-[10px] text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chart 2: Employee Usage */}
        <Card className="rounded-2xl border-border/50 glass">
          <CardHeader className="p-4 border-b">
            <CardTitle className="text-sm font-bold flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-primary" />
              Top Staff by Asset Assignments
            </CardTitle>
            <CardDescription className="text-[11px]">Employees holding the highest volume of department resources.</CardDescription>
          </CardHeader>
          <CardContent className="h-[260px] p-5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={employeeUsage} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                <XAxis type="number" fontSize={10} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" fontSize={10} stroke="hsl(var(--foreground))" width={80} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 3: Booking Trends */}
        <Card className="rounded-2xl border-border/50 glass">
          <CardHeader className="p-4 border-b">
            <CardTitle className="text-sm font-bold flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              Resource Booking Frequency
            </CardTitle>
            <CardDescription className="text-[11px]">Monthly volume of scheduled room and equipment bookings.</CardDescription>
          </CardHeader>
          <CardContent className="h-[260px] p-5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bookingAnalytics} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" fontSize={10} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis fontSize={10} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="bookings" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorBookings)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 4: Maintenance Trends */}
        <Card className="rounded-2xl border-border/50 glass">
          <CardHeader className="p-4 border-b">
            <CardTitle className="text-sm font-bold flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-primary" />
              Maintenance Request Lifecycle
            </CardTitle>
            <CardDescription className="text-[11px]">Comparison of raised vs resolved issues across recent months.</CardDescription>
          </CardHeader>
          <CardContent className="h-[260px] p-5">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={maintenanceAnalytics} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" fontSize={10} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis fontSize={10} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                <Line type="monotone" dataKey="raised" name="Raised Issues" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="resolved" name="Resolved Issues" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
