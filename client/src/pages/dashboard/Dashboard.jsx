import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PackageSearch, PlusCircle, ArrowRightLeft, QrCode, ShieldCheck, 
  BarChart3, CheckCircle, Clock, Package, Briefcase, Undo2, Wrench, LayoutDashboard, UserPlus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

export default function AssetDashboard() {
  const navigate = useNavigate();
  const { profile } = useStore();
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

  // Mock Data for KPI
  const kpi = {
    totalAssets: 1245,
    allocatedAssets: 856,
    availableAssets: 214,
    underMaintenance: 42,
    returnedAssets: 15,
    disposedAssets: 118,
    totalResources: 34
  };

  const cardsData = [
    { title: "Total Assets", value: kpi.totalAssets, icon: Package, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-l-blue-500", route: "/inventory" },
    { title: "Allocated", value: kpi.allocatedAssets, icon: UserPlus, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-l-emerald-500", route: "/inventory" },
    { title: "Available", value: kpi.availableAssets, icon: CheckCircle, color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-l-indigo-500", route: "/inventory" },
    { title: "Maintenance", value: kpi.underMaintenance, icon: Wrench, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-l-amber-500", route: "/maintenance" },
    { title: "Returned", value: kpi.returnedAssets, icon: Undo2, color: "text-cyan-500", bg: "bg-cyan-500/10", border: "border-l-cyan-500", route: "/return" },
    { title: "Total Resources", value: kpi.totalResources, icon: Briefcase, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-l-purple-500", route: "/resources" },
  ];

  const quickActions = [
    { title: "Register Asset", icon: PlusCircle, route: "/register", color: "hover:bg-blue-500/10 hover:text-blue-600" },
    { title: "Allocate Asset", icon: UserPlus, route: "/allocate", color: "hover:bg-emerald-500/10 hover:text-emerald-600" },
    { title: "Transfer Asset", icon: ArrowRightLeft, route: "/transfer", color: "hover:bg-amber-500/10 hover:text-amber-600" },
    { title: "Generate QR", icon: QrCode, route: "/qr", color: "hover:bg-purple-500/10 hover:text-purple-600" },
    { title: "Schedule Audit", icon: ShieldCheck, route: "/audit", color: "hover:bg-rose-500/10 hover:text-rose-600" },
    { title: "Generate Report", icon: BarChart3, route: "/reports", color: "hover:bg-cyan-500/10 hover:text-cyan-600" },
  ];

  const allocationChartData = [
    { name: 'Jan', allocations: 40 },
    { name: 'Feb', allocations: 30 },
    { name: 'Mar', allocations: 60 },
    { name: 'Apr', allocations: 45 },
    { name: 'May', allocations: 80 },
    { name: 'Jun', allocations: 110 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 text-white shadow-xl relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Asset Manager Dashboard</h1>
            <p className="text-blue-100 mt-2 text-sm md:text-base max-w-xl">
              Oversee the entire lifecycle of enterprise assets and resources across the organization.
            </p>
          </div>
          <div className="flex flex-col items-end bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 min-w-[200px]">
            <div className="flex items-center gap-2 text-xs text-blue-200 font-semibold mb-1 uppercase tracking-wider">
              <Clock size={12} />
              {formattedDate}
            </div>
            <div className="text-xl font-bold tracking-tight text-white">{formattedTime}</div>
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
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Quick Actions */}
        <Card className="lg:col-span-4 glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
            <CardDescription>Rapidly execute asset management tasks.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, i) => (
                <motion.div key={action.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
                  <Button 
                    variant="outline" 
                    className={`w-full h-20 flex flex-col items-center justify-center gap-2 border-dashed ${action.color} transition-all`}
                    onClick={() => navigate(action.route)}
                  >
                    <action.icon size={20} />
                    <span className="text-xs font-semibold">{action.title}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Allocations Chart */}
        <Card className="lg:col-span-8 glass">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Asset Allocations Over Time</CardTitle>
            <CardDescription>Monthly trend of assets assigned to employees.</CardDescription>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={allocationChartData}>
                <defs>
                  <linearGradient id="colorAllocations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="allocations" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorAllocations)" dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
=======

        {/* State Categories Distribution Pie Chart */}
        <Card className="md:col-span-3 rounded-2xl border-border/50 glass">
          <CardHeader className="p-5 border-b">
            <CardTitle className="text-sm font-bold">Category Distribution</CardTitle>
            <CardDescription className="text-xs">Overview ratio of department asset allocation.</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px] flex items-center justify-center p-5">
            <div className="w-full h-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
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
              <div className="absolute bottom-1 flex flex-wrap justify-center gap-x-4 gap-y-1 w-full text-[10px] font-medium">
                {categoryData.map(c => (
                  <div key={c.name} className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-muted-foreground">{c.name} ({c.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Quick Notes */}
        <Card className="rounded-2xl border-border/50 glass">
          <CardHeader className="p-4 border-b">
            <CardTitle className="text-sm font-bold flex items-center gap-1.5">
              <Edit3 className="w-4 h-4 text-primary" />
              Quick Notes
            </CardTitle>
            <CardDescription className="text-[11px]">HOD quick reminders notebook (stored locally).</CardDescription>
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

        {/* Resource Availability */}
        <Card className="rounded-2xl border-border/50 glass">
          <CardHeader className="p-4 border-b">
            <CardTitle className="text-sm font-bold flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              Active Resources Status
            </CardTitle>
            <CardDescription className="text-[11px]">Real-time availability of rooms and vehicles.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-3.5">
            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Seminar & Meeting Halls</span>
                  <span className="text-emerald-500 font-bold">2 Available</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '66%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>IoT & Cisco Labs</span>
                  <span className="text-emerald-500 font-bold">3 Available</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '75%' }} />
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
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities Timeline */}
        <Card className="rounded-2xl border-border/50 glass">
          <CardHeader className="p-4 border-b">
            <CardTitle className="text-sm font-bold flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary" />
              Operations Activities Log
            </CardTitle>
            <CardDescription className="text-[11px]">Timeline logs of recent department allocations.</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex gap-3 items-start text-xs">
                <div className="mt-1 w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 shadow animate-pulse" />
                <div>
                  <p className="font-semibold text-foreground">Amit Sharma booked IoT Lab</p>
                  <p className="text-[9px] text-muted-foreground">Booking Confirmed for July 12, 10:00 AM</p>
                </div>
              </div>
              <div className="flex gap-3 items-start text-xs">
                <div className="mt-1 w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 shadow" />
                <div>
                  <p className="font-semibold text-foreground">Workstation transfer approved</p>
                  <p className="text-[9px] text-muted-foreground">Priya Patel to Vikram Singh (AST-AF-022)</p>
                </div>
              </div>
              <div className="flex gap-3 items-start text-xs">
                <div className="mt-1 w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0 shadow" />
                <div>
                  <p className="font-semibold text-foreground">New Maintenance Ticket Raised</p>
                  <p className="text-[9px] text-muted-foreground">HP LaserJet Printer M-203 resolution Pending</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating HOD AI Assistant */}
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
                    <h3 className="font-bold text-sm">AssetFlow HOD Assistant</h3>
                    <p className="text-[10px] text-blue-100">Department Management Bot</p>
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

              {/* Suggested HOD prompts */}
              <div className="px-4 py-2 bg-muted/20 border-t flex flex-wrap gap-1.5 text-[9px]">
                <button 
                  onClick={() => sendAiMessage("Show pending approvals")} 
                  className="px-2 py-1 bg-background hover:bg-accent border rounded-full text-muted-foreground font-semibold cursor-pointer"
                >
                  📝 Show Approvals
                </button>
                <button 
                  onClick={() => sendAiMessage("Show department assets")} 
                  className="px-2 py-1 bg-background hover:bg-accent border rounded-full text-muted-foreground font-semibold cursor-pointer"
                >
                  💻 Show Assets
                </button>
                <button 
                  onClick={() => sendAiMessage("Which employee has Laptop AF-021?")} 
                  className="px-2 py-1 bg-background hover:bg-accent border rounded-full text-muted-foreground font-semibold cursor-pointer"
                >
                  🔍 Who has Laptop AF-021?
                </button>
                <button 
                  onClick={() => sendAiMessage("Generate department report")} 
                  className="px-2 py-1 bg-background hover:bg-accent border rounded-full text-muted-foreground font-semibold cursor-pointer"
                >
                  📊 Show Reports
                </button>
              </div>

              {/* Input field */}
              <form 
                onSubmit={(e) => { e.preventDefault(); sendAiMessage(aiInput); setAiInput(''); }} 
                className="p-3 border-t bg-muted/40 flex gap-2"
              >
                <Input
                  placeholder="Ask about approvals, asset holders..."
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

        {/* Floating action button */}
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
