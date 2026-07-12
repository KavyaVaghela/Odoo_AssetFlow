import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { FileBarChart, Download, Calendar, Activity, Wrench, ShieldCheck } from 'lucide-react';

export default function DepartmentReports() {
  
  // 1. Dept Asset Distribution
  const assetDistribution = [
    { name: 'MacBooks', value: 35, color: '#2563EB' },
    { name: 'Workstations', value: 45, color: '#3B82F6' },
    { name: 'Monitors', value: 25, color: '#10B981' },
    { name: 'Lab Kits', value: 15, color: '#F59E0B' },
  ];

  // 2. Employee Asset Usage (Top Staff by Asset Counts)
  const employeeUsage = [
    { name: 'Priya Patel', count: 5 },
    { name: 'Anjali Desai', count: 4 },
    { name: 'Amit Sharma', count: 3 },
    { name: 'Rohan Mehta', count: 2 },
    { name: 'Vikram Singh', count: 2 },
  ];

  // 3. Booking Analytics (Monthly booking trends)
  const bookingAnalytics = [
    { month: 'Jan', rooms: 15, vehicles: 5 },
    { month: 'Feb', rooms: 18, vehicles: 8 },
    { month: 'Mar', rooms: 22, vehicles: 10 },
    { month: 'Apr', rooms: 28, vehicles: 12 },
    { month: 'May', rooms: 20, vehicles: 6 },
    { month: 'Jun', rooms: 32, vehicles: 15 },
    { month: 'Jul', rooms: 40, vehicles: 18 },
  ];

  // 4. Maintenance Analytics (Resolved vs Pending)
  const maintenanceAnalytics = [
    { month: 'Apr', raised: 5, resolved: 4 },
    { month: 'May', raised: 8, resolved: 6 },
    { month: 'Jun', raised: 12, resolved: 10 },
    { month: 'Jul', raised: 6, resolved: 5 },
  ];

  // 5. Weekly Asset Utilization Rates
  const utilizationTrends = [
    { week: 'Wk 1', rate: 76 },
    { week: 'Wk 2', weekRate: 78 },
    { week: 'Wk 3', rate: 80 },
    { week: 'Wk 4', rate: 82 },
  ];

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Department Reports</h1>
          <p className="text-muted-foreground">Comprehensive analytics reports on resource utilization and asset lifecycles.</p>
        </div>
        <Button 
          onClick={handleExportPDF}
          className="bg-primary hover:bg-blue-700 text-white rounded-xl gap-1.5 shadow-md cursor-pointer text-xs h-10 px-4"
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
              Department Asset Distribution
            </CardTitle>
            <CardDescription className="text-[11px]">Breakdown of registered computer and electronics models.</CardDescription>
          </CardHeader>
          <CardContent className="h-[260px] p-5 flex items-center justify-center relative">
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
            <div className="absolute bottom-2 flex justify-center gap-4 w-full text-[10px]">
              {assetDistribution.map(entry => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chart 2: Employee Asset Usage */}
        <Card className="rounded-2xl border-border/50 glass">
          <CardHeader className="p-4 border-b">
            <CardTitle className="text-sm font-bold flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-primary" />
              Employee Resource Allocation Counts
            </CardTitle>
            <CardDescription className="text-[11px]">Top faculty members by number of active assigned assets.</CardDescription>
          </CardHeader>
          <CardContent className="h-[260px] p-5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={employeeUsage}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" fontSize={10} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis fontSize={10} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 3: Booking Analytics */}
        <Card className="rounded-2xl border-border/50 glass">
          <CardHeader className="p-4 border-b">
            <CardTitle className="text-sm font-bold flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              Resource Booking Analytics
            </CardTitle>
            <CardDescription className="text-[11px]">Reservation rates of rooms and vehicles over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px] p-5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bookingAnalytics}>
                <defs>
                  <linearGradient id="colorRooms" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorVehicles" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" fontSize={10} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis fontSize={10} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="rooms" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorRooms)" name="Rooms / Labs" />
                <Area type="monotone" dataKey="vehicles" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorVehicles)" name="Vehicles" />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 4: Maintenance Analytics */}
        <Card className="rounded-2xl border-border/50 glass">
          <CardHeader className="p-4 border-b">
            <CardTitle className="text-sm font-bold flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-primary" />
              Maintenance Ticket Resolution Trends
            </CardTitle>
            <CardDescription className="text-[11px]">Audit ratio of submitted tickets vs completed repairs.</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px] p-5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={maintenanceAnalytics}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" fontSize={10} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis fontSize={10} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }} />
                <Bar dataKey="raised" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Raised Tickets" />
                <Bar dataKey="resolved" fill="#10B981" radius={[4, 4, 0, 0]} name="Resolved Tickets" />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
