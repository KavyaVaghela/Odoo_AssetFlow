import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Grid, ShieldAlert, Cpu, Laptop, Users, Building, Activity, FileBarChart, CheckSquare, CalendarClock } from 'lucide-react';

export default function DepartmentDashboard() {
  const navigate = useNavigate();
  const { kpi, charts, departmentAssets, allocationApprovals } = useStore();

  const assetDistribution = [
    { name: 'Computers', value: 65, color: '#2563EB' },
    { name: 'Lab Equipment', value: 35, color: '#10B981' },
    { name: 'Software Licenses', value: 15, color: '#F59E0B' },
    { name: 'Office Furniture', value: 5, color: '#EF4444' },
  ];

  const utilizationData = [
    { name: 'Week 1', rate: 70 },
    { name: 'Week 2', rate: 74 },
    { name: 'Week 3', rate: 78 },
    { name: 'Week 4', rate: 82 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Department Dashboard</h1>
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
            <p className="text-[10px] text-muted-foreground mt-1">+2.4% from last month</p>
          </CardContent>
        </Card>

        <Card className="glass rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Pending Approvals</CardTitle>
            <CheckSquare className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allocationApprovals.length}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Requires immediate HOD sign-off</p>
          </CardContent>
        </Card>

        <Card className="glass rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Active Asset Count</CardTitle>
            <Laptop className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departmentAssets.length} Units</div>
            <p className="text-[10px] text-muted-foreground mt-1">115 registered in system</p>
          </CardContent>
        </Card>

        <Card className="glass rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Assigned Staff</CardTitle>
            <Users className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25 Members</div>
            <p className="text-[10px] text-muted-foreground mt-1">Computer Engineering HOD node</p>
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
            <CardTitle className="text-sm font-bold">Category Distribution</CardTitle>
            <CardDescription className="text-xs">Breakdown of department assets.</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px] flex items-center justify-center relative">
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
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Action Quick Links Card */}
        <Card className="rounded-2xl border-border/50 glass">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Action Alerts Ledger</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {allocationApprovals.length > 0 ? (
              allocationApprovals.map(app => (
                <div key={app.id} className="flex justify-between items-center p-3 border rounded-xl text-xs bg-card">
                  <div>
                    <span className="font-bold text-foreground">{app.employeeName}</span>
                    <span className="text-muted-foreground"> requested </span>
                    <span className="font-semibold text-primary">{app.requestedAsset}</span>
                  </div>
                  <Button size="sm" onClick={() => navigate('/department/allocation-approvals')} className="rounded-lg h-7 text-[10px] font-semibold bg-primary hover:bg-blue-700 text-white cursor-pointer">
                    Review Request
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4">All allocation approvals checkouts are complete.</p>
            )}
          </CardContent>
        </Card>

        {/* Audit Verification status widget */}
        <Card className="rounded-2xl border-border/50 glass">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-1">
              <CalendarClock className="w-4 h-4 text-primary" />
              Next Scheduled Verification Audit
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
              <p className="font-bold text-foreground">Annual Physical Verification Cycle</p>
              <p className="text-muted-foreground mt-1">Starts next Monday, July 20th. Ensure all employees bring their assigned hardware for code catalog scanning.</p>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-[10px] font-bold text-primary">STATUS: PLANNED</span>
                <span className="text-[10px] text-muted-foreground">Coordinator: David Kim</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
