import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileBarChart, Download, FileText, FileSpreadsheet, Users, Building, ShieldCheck, UserPlus } from 'lucide-react';
import api from '@/services/api';

export default function Reports() {
  
  const generateCSV = async (type) => {
    try {
      // In a real app, this would call specific endpoints like /api/admin/reports/employees?format=csv
      // For now, we mock the download action
      alert(`Generating ${type} Report in CSV format...`);
      
      let data = [];
      if (type === 'Employee') {
        const res = await api.get('/api/admin/employees');
        data = res.data.data;
      }
      
      if (data.length > 0) {
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(obj => Object.values(obj).join(',')).join('\n');
        const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${type}_Report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report.');
    }
  };

  const reports = [
    { title: 'Employee Report', description: 'Comprehensive list of all employees, contact details, and current statuses.', icon: Users, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { title: 'Department Report', description: 'Summary of departments, heads, and employee counts per unit.', icon: Building, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
    { title: 'Registration Report', description: 'Audit of new account requests, approval timelines, and rejections.', icon: UserPlus, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
    { title: 'Role & Permissions Report', description: 'Matrix of users mapped to their assigned roles and system access levels.', icon: ShieldCheck, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Reports</h1>
          <p className="text-muted-foreground mt-1">Generate, view, and export administrative reports.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {reports.map((report, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
            <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 h-full flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl ${report.bg} flex items-center justify-center ${report.color} shrink-0`}>
                    <report.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{report.title}</CardTitle>
                    <CardDescription className="mt-1">{report.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="mt-auto pt-6">
                <div className="grid grid-cols-3 gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <Button variant="outline" className="w-full gap-2" onClick={() => generateCSV(report.title.split(' ')[0])}>
                    <FileSpreadsheet className="h-4 w-4 text-green-600" /> <span className="hidden sm:inline">CSV</span>
                  </Button>
                  <Button variant="outline" className="w-full gap-2" onClick={() => alert('PDF Generation requires external microservice.')}>
                    <FileText className="h-4 w-4 text-red-500" /> <span className="hidden sm:inline">PDF</span>
                  </Button>
                  <Button variant="outline" className="w-full gap-2" onClick={() => alert('Excel Generation requires external microservice.')}>
                    <Download className="h-4 w-4 text-emerald-600" /> <span className="hidden sm:inline">Excel</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
