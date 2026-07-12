import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { 
  Package, Calendar, MessageSquare, Wrench, Bell, CheckCircle2, 
  PlusCircle, Sparkles, Clock, CalendarDays, Edit3, Send, X, ArrowRight, UserCheck, AlertTriangle, HelpCircle
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile, employeeAssets, bookings, maintenanceRequests, myRequests, notificationsList } = useStore();
  
  // Real-time Clock State
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Quick Notes State
  const [note, setNote] = useState(localStorage.getItem('dashboard_note') || '💡 Prepare for Q3 physical asset audit checklist.');
  const handleSaveNote = (e) => {
    setNote(e.target.value);
    localStorage.setItem('dashboard_note', e.target.value);
  };

  // AI Assistant States
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { sender: 'ai', text: `Hello John Smith! I am your AssetFlow AI Assistant. How can I help you manage your resources today?` }
  ]);
  const [aiInput, setAiInput] = useState('');

  const sendAiMessage = (text) => {
    if (!text.trim()) return;
    
    const userMsg = { sender: 'user', text };
    setAiMessages(prev => [...prev, userMsg]);
    
    // Generate AI response
    let responseText = '';
    const cleanText = text.toLowerCase();
    
    if (cleanText.includes('return') && cleanText.includes('laptop')) {
      const laptop = employeeAssets.find(a => a.name.toLowerCase().includes('laptop'));
      responseText = laptop 
        ? `Your assigned ${laptop.name} (Code: ${laptop.code}) is scheduled for return on ${laptop.returnDate} (Tomorrow).`
        : `I could not locate an assigned laptop in your records. Please check the 'My Assets' section.`;
    } else if (cleanText.includes('assets') || cleanText.includes('show my asset')) {
      const names = employeeAssets.map(a => `${a.name} (${a.code})`).join(', ');
      responseText = `You currently have ${employeeAssets.length} assets assigned to you: ${names}.`;
    } else if (cleanText.includes('book') && cleanText.includes('room')) {
      responseText = `Redirecting you to the Resource Booking portal...`;
      setTimeout(() => navigate('/booking'), 1500);
    } else if (cleanText.includes('maintenance')) {
      responseText = `Opening the Maintenance ticketing portal...`;
      setTimeout(() => navigate('/maintenance'), 1500);
    } else if (cleanText.includes('history')) {
      responseText = `Opening your Booking History log...`;
      setTimeout(() => navigate('/booking-history'), 1500);
    } else if (cleanText.includes('request') && cleanText.includes('asset')) {
      responseText = `Opening the new resource request forms...`;
      setTimeout(() => navigate('/requests'), 1500);
    } else {
      responseText = `I understand you want: "${text}". As an asset assistant, I can check your return dues, list assets, or redirect you to booking, requests, and maintenance forms. What would you like to verify?`;
    }

    setTimeout(() => {
      setAiMessages(prev => [...prev, { sender: 'ai', text: responseText }]);
    }, 800);
  };

  // Recharts custom charts
  const categoryData = [
    { name: 'Allocated', value: employeeAssets.length, color: '#2563EB' },
    { name: 'Bookings', value: bookings.length, color: '#10B981' },
    { name: 'Maintenance', value: maintenanceRequests.length, color: '#F59E0B' },
  ];

  const requestTimelineData = [
    { name: 'Mon', requests: 1, resolved: 1 },
    { name: 'Tue', requests: 2, resolved: 1 },
    { name: 'Wed', requests: 0, resolved: 0 },
    { name: 'Thu', requests: 4, resolved: 2 },
    { name: 'Fri', requests: 2, resolved: 3 },
  ];

  return (
    <div className="space-y-6 pb-12 relative">
      
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 p-6 md:p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div className="absolute top-[-50%] left-[-20%] w-[50%] h-[150%] rounded-full bg-blue-600/20 blur-[80px]" />
        <div className="absolute bottom-[-50%] right-[-20%] w-[50%] h-[150%] rounded-full bg-indigo-500/20 blur-[80px]" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-white/20 shadow-md shrink-0">
            <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-bold">Welcome Back, {profile.name} 👋</span>
              <Badge className="bg-white/25 border-none hover:bg-white/25 text-[10px] py-0.5 rounded-full uppercase tracking-wider font-semibold">
                {profile.role}
              </Badge>
            </div>
            <p className="text-sm text-blue-100/90 font-medium mt-1">
              {profile.designation} • {profile.department} • ID: <span className="font-mono text-xs">{profile.id}</span>
            </p>
          </div>
        </div>

        {/* Live Clock Widget */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 min-w-[200px] border border-white/10 text-right relative z-10 self-stretch md:self-auto flex flex-col justify-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-200 flex items-center gap-1.5 justify-end">
            <Clock className="w-3.5 h-3.5" />
            Current Time
          </span>
          <span className="text-2xl font-bold font-mono tracking-tight mt-1">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <span className="text-xs text-blue-100/80 mt-0.5">
            {currentTime.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <Card className="glass border-l-4 border-l-blue-600 rounded-2xl hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">My Assets</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold">{employeeAssets.length}</div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Assigned to you</p>
          </CardContent>
        </Card>

        <Card className="glass border-l-4 border-l-emerald-500 rounded-2xl hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold">{bookings.length}</div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Reservations active</p>
          </CardContent>
        </Card>

        <Card className="glass border-l-4 border-l-orange-500 rounded-2xl hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold">{maintenanceRequests.filter(r => r.status === 'Pending').length}</div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Pending tickets</p>
          </CardContent>
        </Card>

        <Card className="glass border-l-4 border-l-indigo-500 rounded-2xl hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Asset Requests</CardTitle>
            <MessageSquare className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold">{myRequests.length}</div>
            <p className="text-[10px] text-muted-foreground mt-0.5">In ledger list</p>
          </CardContent>
        </Card>

        <Card className="glass border-l-4 border-l-purple-500 rounded-2xl hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Alerts</CardTitle>
            <Bell className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold">{notificationsList.filter(n => !n.read).length}</div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Unread messages</p>
          </CardContent>
        </Card>

        <Card className="glass border-l-4 border-l-slate-400 rounded-2xl hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Resources</CardTitle>
            <Sparkles className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold">18</div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Catalog units</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Command Center */}
      <Card className="rounded-2xl border-border/50 glass">
        <CardHeader className="p-5 border-b">
          <CardTitle className="text-sm font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            Today's Command Center
          </CardTitle>
          <CardDescription className="text-xs">Urgent items requiring verification or attention.</CardDescription>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {/* Action Card 1 */}
            <div className="p-4 rounded-xl border bg-card flex flex-col justify-between h-36">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Badge className="bg-red-500/10 text-red-600 border border-red-500/20 text-[8px] px-1.5 rounded-full font-bold uppercase">CRITICAL</Badge>
                  <Clock className="w-3.5 h-3.5 text-red-500" />
                </div>
                <h4 className="font-bold text-xs">Return Laptop</h4>
                <p className="text-[10px] text-muted-foreground mt-1">Dell Latitude 5440 due.</p>
              </div>
              <Button size="sm" variant="link" className="p-0 h-auto text-[10px] text-primary font-bold self-start mt-2" onClick={() => navigate('/assets')}>
                View Asset <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
              </Button>
            </div>

            {/* Action Card 2 */}
            <div className="p-4 rounded-xl border bg-card flex flex-col justify-between h-36">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Badge className="bg-blue-500/10 text-blue-600 border border-blue-500/20 text-[8px] px-1.5 rounded-full font-bold uppercase">SCHEDULED</Badge>
                  <CalendarDays className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <h4 className="font-bold text-xs">Meeting Room A</h4>
                <p className="text-[10px] text-muted-foreground mt-1">Sync starts at 2:00 PM.</p>
              </div>
              <Button size="sm" variant="link" className="p-0 h-auto text-[10px] text-primary font-bold self-start mt-2" onClick={() => navigate('/booking-history')}>
                View Booking <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
              </Button>
            </div>

            {/* Action Card 3 */}
            <div className="p-4 rounded-xl border bg-card flex flex-col justify-between h-36">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[8px] px-1.5 rounded-full font-bold uppercase">PENDING</Badge>
                  <Wrench className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <h4 className="font-bold text-xs">Maintenance Check</h4>
                <p className="text-[10px] text-muted-foreground mt-1">Pending support approval.</p>
              </div>
              <Button size="sm" variant="link" className="p-0 h-auto text-[10px] text-primary font-bold self-start mt-2" onClick={() => navigate('/maintenance')}>
                Check Status <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
              </Button>
            </div>

            {/* Action Card 4 */}
            <div className="p-4 rounded-xl border bg-card flex flex-col justify-between h-36">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Badge className="bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 text-[8px] px-1.5 rounded-full font-bold uppercase">VERIFICATION</Badge>
                  <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                </div>
                <h4 className="font-bold text-xs">Physical Audit</h4>
                <p className="text-[10px] text-muted-foreground mt-1">Verification starting Monday.</p>
              </div>
              <Button size="sm" variant="link" className="p-0 h-auto text-[10px] text-primary font-bold self-start mt-2" onClick={() => navigate('/notifications')}>
                Read Details <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
              </Button>
            </div>

            {/* Action Card 5 */}
            <div className="p-4 rounded-xl border bg-card flex flex-col justify-between h-36">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Badge className="bg-purple-500/10 text-purple-600 border border-purple-500/20 text-[8px] px-1.5 rounded-full font-bold uppercase">ANNOUNCEMENT</Badge>
                  <Bell className="w-3.5 h-3.5 text-purple-500" />
                </div>
                <h4 className="font-bold text-xs">New Dept Structure</h4>
                <p className="text-[10px] text-muted-foreground mt-1">Announced by HR today.</p>
              </div>
              <Button size="sm" variant="link" className="p-0 h-auto text-[10px] text-primary font-bold self-start mt-2" onClick={() => navigate('/notifications')}>
                Read Notice <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-7">
        
        {/* Resource Allocation Breakdown Chart */}
        <Card className="md:col-span-4 rounded-2xl border-border/50 glass">
          <CardHeader className="p-5 border-b">
            <CardTitle className="text-sm font-bold flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              Corporate Resource Allocation Breakdown
            </CardTitle>
            <CardDescription className="text-xs font-medium">Utilization records of software, hardware, and physical meeting rooms.</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px] p-5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={requestTimelineData}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" fontSize={11} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis fontSize={11} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="requests" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRequests)" />
                <Area type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorResolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Categories Distribution */}
        <Card className="md:col-span-3 rounded-2xl border-border/50 glass">
          <CardHeader className="p-5 border-b">
            <CardTitle className="text-sm font-bold">State Distribution Chart</CardTitle>
            <CardDescription className="text-xs">Summary ratio of your items on dashboard state.</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px] flex items-center justify-center p-5">
            <div className="w-full h-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={6}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute bottom-2 flex justify-center gap-4 w-full text-xs">
                {categoryData.map(c => (
                  <div key={c.name} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="font-medium text-muted-foreground">{c.name} ({c.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Quick Notes Widget */}
        <Card className="rounded-2xl border-border/50 glass">
          <CardHeader className="p-4 border-b">
            <CardTitle className="text-sm font-bold flex items-center gap-1.5">
              <Edit3 className="w-4 h-4 text-primary" />
              Quick Notes
            </CardTitle>
            <CardDescription className="text-[11px]">Save quick drafts (stored locally in browser cache).</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <textarea
              className="w-full h-32 text-xs bg-muted/30 border border-border/40 outline-none rounded-xl p-3 focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none font-sans"
              placeholder="Jot down quick asset codes, booking dates, or list codes..."
              value={note}
              onChange={handleSaveNote}
            />
          </CardContent>
        </Card>

        {/* Resource Availability Status */}
        <Card className="rounded-2xl border-border/50 glass">
          <CardHeader className="p-4 border-b">
            <CardTitle className="text-sm font-bold flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              Resource Occupancy
            </CardTitle>
            <CardDescription className="text-[11px]">Availability levels of primary rooms and vehicles.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Meeting Rooms</span>
                  <span className="text-emerald-500 font-bold">4 Available</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '80%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Pool Vehicles</span>
                  <span className="text-orange-500 font-bold">1 Available</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: '33%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Equipment Projectors</span>
                  <span className="text-emerald-500 font-bold">8 Available</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '90%' }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities Timeline */}
        <Card className="rounded-2xl border-border/50 glass">
          <CardHeader className="p-4 border-b">
            <CardTitle className="text-sm font-bold flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary" />
              Recent Operations Log
            </CardTitle>
            <CardDescription className="text-[11px]">Latest ledger entries regarding your assignments.</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex gap-3 items-start text-xs">
                <div className="mt-1 w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 shadow" />
                <div>
                  <p className="font-semibold text-foreground">Laptop Return scheduled</p>
                  <p className="text-[10px] text-muted-foreground">Dell Latitude 5440 due on 2026-07-13</p>
                </div>
              </div>
              <div className="flex gap-3 items-start text-xs">
                <div className="mt-1 w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 shadow" />
                <div>
                  <p className="font-semibold text-foreground">Meeting Room A Booked</p>
                  <p className="text-[10px] text-muted-foreground">Reserved today at 2:00 PM for team sync</p>
                </div>
              </div>
              <div className="flex gap-3 items-start text-xs">
                <div className="mt-1 w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0 shadow" />
                <div>
                  <p className="font-semibold text-foreground">Maintenance ticket raised</p>
                  <p className="text-[10px] text-muted-foreground">Laptop battery drain ticket is Pending support approval</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating AI Assistant */}
      <div className="fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {isAiOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className="mb-4 w-80 md:w-96 h-[450px] bg-card border rounded-2xl shadow-2xl flex flex-col overflow-hidden glass"
            >
              {/* Header */}
              <div className="p-4 border-b bg-primary text-primary-foreground flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                  <div>
                    <h3 className="font-bold text-sm">AssetFlow AI Assistant</h3>
                    <p className="text-[10px] text-blue-100">Workspace Support Bot</p>
                  </div>
                </div>
                <button onClick={() => setIsAiOpen(false)} className="hover:text-blue-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide text-xs">
                {aiMessages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-2xl max-w-[80%] ${
                      msg.sender === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                        : 'bg-muted/70 text-foreground rounded-tl-none border'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggested prompts list */}
              <div className="px-4 py-2 bg-muted/20 border-t flex flex-wrap gap-1.5 text-[10px]">
                <button 
                  onClick={() => sendAiMessage("When should I return my laptop?")} 
                  className="px-2 py-1 bg-background hover:bg-accent border rounded-full text-muted-foreground font-semibold cursor-pointer"
                >
                  ⏳ Return Laptop Due?
                </button>
                <button 
                  onClick={() => sendAiMessage("Show My Assets")} 
                  className="px-2 py-1 bg-background hover:bg-accent border rounded-full text-muted-foreground font-semibold cursor-pointer"
                >
                  💻 Show Assets
                </button>
                <button 
                  onClick={() => sendAiMessage("Book Meeting Room")} 
                  className="px-2 py-1 bg-background hover:bg-accent border rounded-full text-muted-foreground font-semibold cursor-pointer"
                >
                  📅 Book Room
                </button>
                <button 
                  onClick={() => sendAiMessage("Raise Maintenance")} 
                  className="px-2 py-1 bg-background hover:bg-accent border rounded-full text-muted-foreground font-semibold cursor-pointer"
                >
                  🔧 Raise Maintenance
                </button>
              </div>

              {/* Input field */}
              <form 
                onSubmit={(e) => { e.preventDefault(); sendAiMessage(aiInput); setAiInput(''); }} 
                className="p-3 border-t bg-muted/40 flex gap-2"
              >
                <Input
                  placeholder="Ask a question about your assets..."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  className="h-9 rounded-xl text-xs bg-background"
                />
                <Button type="submit" size="icon" className="h-9 w-9 rounded-xl cursor-pointer">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating action button button toggler */}
        <motion.button
          onClick={() => setIsAiOpen(!isAiOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary hover:bg-blue-700 text-white shadow-lg cursor-pointer border border-primary-foreground/10"
        >
          <Sparkles className="h-6 w-6 animate-pulse" />
        </motion.button>
      </div>

    </div>
  );
}
