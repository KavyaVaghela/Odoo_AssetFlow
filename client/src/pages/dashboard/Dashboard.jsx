import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, Calendar, Wrench, FileText, Bell, CalendarDays, 
  ArrowRight, ShieldAlert, CheckCircle, Clock, CalendarCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile, kpi, charts, activities } = useStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = time.toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });
  const formattedTime = time.toLocaleTimeString('en-US', { 
    hour: '2-digit', minute: '2-digit', second: '2-digit' 
  });

  const cardsData = [
    { title: "Assigned Assets", value: kpi.assignedAssets, description: "Active devices & items", icon: Package, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-l-blue-500", route: "/my-assets" },
    { title: "Upcoming Bookings", value: kpi.upcomingBookings, description: "Approved resource reservations", icon: Calendar, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-l-emerald-500", route: "/booking-history" },
    { title: "Pending Maintenance", value: kpi.pendingMaintenance, description: "Devices in repair", icon: Wrench, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-l-amber-500", route: "/maintenance" },
    { title: "Open Requests", value: kpi.openRequests, description: "Asset requests awaiting approval", icon: FileText, color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-l-indigo-500", route: "/my-requests" },
    { title: "Unread Notifications", value: kpi.unreadNotifications, description: "New system messages", icon: Bell, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-l-rose-500", route: "/notifications" },
    { title: "Upcoming Returns", value: kpi.upcomingReturns, description: "Asset returns in 90 days", icon: ShieldAlert, color: "text-cyan-500", bg: "bg-cyan-500/10", border: "border-l-cyan-500", route: "/my-assets" },
  ];

  const tasksData = [
    { title: "Return Mouse next month", desc: "Logitech MX Master 3S return due on Sep 16, 2026", priority: "Medium", date: "Sep 16, 2026", color: "warning" },
    { title: "Meeting Room Alpha reservation", desc: "Sprint Planning sync scheduled for tomorrow", priority: "High", date: "Tomorrow 10:00 AM", color: "danger" },
    { title: "Laptop Battery Inspection", desc: "Diagnostics request M-101 in progress by Dell", priority: "Medium", date: "Ongoing", color: "warning" },
    { title: "Self-Verification Audit", desc: "Verify assets assigned to your account", priority: "Low", date: "Due Jul 31", color: "success" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white shadow-xl relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Welcome Back, {profile.name} 👋</h1>
            <p className="text-blue-100 mt-2 text-sm md:text-base max-w-xl">
              Manage your assigned corporate assets, request new workspace equipment, or secure slots in our conference rooms.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-xs font-semibold text-blue-200">
              <div>Employee ID: <span className="text-white font-mono">{profile.employeeId}</span></div>
              <div>Department: <span className="text-white">{profile.department}</span></div>
              <div>Role: <span className="text-white">{profile.designation}</span></div>
            </div>
          </div>
          <div className="flex flex-col items-end bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 min-w-[200px]">
            <div className="flex items-center gap-2 text-xs text-blue-200 font-semibold mb-1 uppercase tracking-wider">
              <Clock size={12} />
              Current Session
            </div>
            <div className="text-xl font-bold tracking-tight text-white">{formattedTime}</div>
            <div className="text-xs text-blue-100 mt-1 font-medium">{formattedDate}</div>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cardsData.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card 
              onClick={() => navigate(card.route)}
              className={`glass hover:shadow-lg transition-all duration-300 border-l-4 ${card.border} cursor-pointer group hover:-translate-y-1`}
            >
              <CardContent className="p-4 flex flex-col justify-between h-28">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide truncate pr-2">{card.title}</span>
                  <div className={`p-2 rounded-lg ${card.bg} ${card.color} group-hover:scale-110 transition-transform duration-200`}>
                    <card.icon size={16} />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black tracking-tight">{card.value}</div>
                  <div className="text-[10px] text-muted-foreground truncate mt-0.5">{card.description}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Layout Split: Left: Tasks/Reminders, Right: Analytics */}
      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* Today's Tasks */}
        <Card className="lg:col-span-5 glass">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-lg font-bold">Priority Tasks & Reminders</CardTitle>
              <CardDescription>Important notifications requiring your action.</CardDescription>
            </div>
            <CalendarDays size={20} className="text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            {tasksData.map((task, i) => (
              <motion.div
                key={task.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 p-3.5 rounded-xl border bg-card/50 hover:bg-card transition-colors shadow-sm"
              >
                <div className="mt-1">
                  {task.color === "danger" && <ShieldAlert size={16} className="text-destructive" />}
                  {task.color === "warning" && <Clock size={16} className="text-amber-500" />}
                  {task.color === "success" && <CheckCircle size={16} className="text-emerald-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-semibold text-sm text-foreground truncate">{task.title}</span>
                    <Badge variant={task.color === "danger" ? "destructive" : task.color === "warning" ? "secondary" : "outline"} className="text-[9px] px-1.5 py-0">
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{task.desc}</p>
                  <span className="text-[10px] font-semibold text-primary/80 mt-2 block">{task.date}</span>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Recharts Analytics */}
        <Card className="lg:col-span-7 glass">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Monthly Resource Bookings</CardTitle>
            <CardDescription>Tracking your total booking count across rooms and vehicles.</CardDescription>
          </CardHeader>
          <CardContent className="h-[310px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.monthlyBookings}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="bookings" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorBookings)" dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>

      {/* Split 2: Timeline & Booking breakdown */}
      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* Recent Personal Activities */}
        <Card className="lg:col-span-7 glass">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Recent Operations Log</CardTitle>
            <CardDescription>Your personal trail of asset actions and requests.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
              {activities.map((activity, i) => (
                <div key={activity.id} className="relative flex gap-4 items-start">
                  <div className="absolute -left-[20px] mt-1.5 w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">
                      {activity.action} <span className="text-primary font-semibold">{activity.target}</span>
                    </p>
                    <div className="flex gap-2 items-center text-xs text-muted-foreground mt-1">
                      <span>{activity.time}</span>
                      <span>•</span>
                      <Badge variant="outline" className="text-[9px] px-1 py-0">{activity.module}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-xs font-semibold" onClick={() => navigate('/booking-history')}>
              View All History <ArrowRight size={12} className="ml-1" />
            </Button>
          </CardContent>
        </Card>

        {/* Booking breakdown Pie Chart */}
        <Card className="lg:col-span-5 glass">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Booking Status Breakdown</CardTitle>
            <CardDescription>Current status of all submitted reservations.</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.bookingStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {charts.bookingStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="absolute bottom-2 flex justify-center gap-4 text-xs font-medium">
              {charts.bookingStatus.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-muted-foreground">{entry.name}: {entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>

    </div>
  );
}
